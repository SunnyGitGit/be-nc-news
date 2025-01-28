const { fetchTopics,
        fetchArticleById ,
        fetchArticles,
        fetchArticleComments
    } = require("../models/topics-models");

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticles = (req, res, next) => {
    const queries = req.query;

    fetchArticles(queries)
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleComments(article_id)
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch((err) => {
        next(err);
    });
};