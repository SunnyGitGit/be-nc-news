const db = require("../db/connection");

exports.fetchTopics = () => {
    return db
    .query(
        `SELECT * FROM topics;`
    )
    .then((result) => {
        return result.rows;
    });
};

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0 ) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
            return rows[0];
        };
    });
};

exports.fetchArticles = (queries) => {
    const sort_by = queries.sort_by || "created_at";
    const order = queries.order || "desc";
  
    const greenlist = ["created_at", "title", "author", "topic", "votes"];
    const validOrders = ["asc", "desc"];

    if (!greenlist.includes(sort_by) || !validOrders.includes(order)) { 
        return Promise.reject({ status: 400, msg: "Bad Request"});
    }; 

    return db
    .query(`
        SELECT 
            articles.article_id,
            articles.title,
            articles.topic,
            articles.author,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order}; 
    `)
    .then((result) => {
        return result.rows;
    });
};

exports.fetchArticleComments = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0 ) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
            return db
            .query(`
                SELECT 
                    comments.comment_id,
                    comments.votes,
                    comments.created_at,
                    comments.author,
                    comments.body,
                    comments.article_id
                FROM comments
                WHERE article_id = $1
                ORDER BY created_at DESC
            `, [article_id])
            .then((result) => {
                return result.rows;
            })
        };
    });
};

exports.insertArticleComment = (article_id, username, body) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0 ) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        } 
        return db
        .query(`SELECT * FROM users WHERE username=$1`, [username]);
    })
    .then(({ rows }) => {
        if (rows.length === 0 ) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        } 
        return db
        .query(`
            INSERT INTO comments
            (article_id, author, body)
            VALUES
            ($1, $2, $3)
            RETURNING *
        `, [article_id, username, body])
        .then((result) => {
            return result.rows[0];
        })
    });
};
