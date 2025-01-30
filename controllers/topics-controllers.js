const { fetchTopics,
        fetchArticleById ,
        fetchArticles,
        fetchArticleComments,
        insertArticleComment,
        updateArticleById,
        removeCommentById,
        fetchUsers,
    } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
    const queries = req.query;

    fetchArticles(queries)
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleComments(article_id)
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postArticleComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    insertArticleComment(article_id, username, body)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleById(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    removeCommentById(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
};
