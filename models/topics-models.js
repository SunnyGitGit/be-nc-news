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
    .query(`
        SELECT 
            articles.article_id,
            articles.title,
            articles.topic,
            articles.author,
            articles.body,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [article_id])
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
    const topic = queries.topic;
  
    const greenlist = ["created_at", "title", "author", "topic", "votes"];
    const validOrders = ["asc", "desc"];

    if (!greenlist.includes(sort_by) || !validOrders.includes(order)) { 
        return Promise.reject({ status: 400, msg: "Bad Request"});
    }; 

    let queryStr = `
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
    ON articles.article_id = comments.article_id`
 
    const queryArgs = [];

    if (topic) {
        queryStr += ` WHERE articles.topic = $1`;
        queryArgs.push(topic);
    }  
    
    queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`

    return db
    .query(queryStr, queryArgs)
    .then((result) => {
        if (result.rows.length === 0 && topic) {
            return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
              .then((topicResult) => {
                  if (topicResult.rows.length === 0) {
                      return Promise.reject({ status: 404, msg: "Not Found" });
                  } else {
                      return [];
                  }
              });
        }
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

exports.updateArticleById = (article_id, inc_votes) => {
    return db
    .query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`, [inc_votes, article_id])
    .then(( result ) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
        return result.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
    return db
    .query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`, [comment_id])
    .then(( result ) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" });
        }
    });
};

exports.fetchUsers = () => {
    return db
    .query(
        `SELECT * FROM users;`
    )
    .then((result) => {
        return result.rows;
    });
};



  
  
  