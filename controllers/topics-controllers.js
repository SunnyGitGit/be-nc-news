const { fetchTopics,
        fetchArticleById ,
        fetchArticles,
        fetchArticleComments,
        insertArticleComment,
        updateArticleById,
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
    if (!body) {
        return res.status(400).send({ msg: "Bad Request" });
    }

    insertArticleComment(article_id, username, body)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (typeof inc_votes !== 'number') {
        return next({ status: 400, msg: "Bad Request" });
    };

    updateArticleById(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch(next);
};