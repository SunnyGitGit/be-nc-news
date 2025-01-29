const express = require("express");
const app = express();
const endpointJson  = require("./endpoints.json");
const { getTopics, getArticleById, getArticles, getArticleComments } = require("./controllers/topics-controllers")
const { handlePSQLErrors, handleCustomErrors, handleServerErrors, handleNotFoundErrors } = require("./errors/errors")

app.use(express.json());

app.get("/api", (req, res, next) => {
    res.status(200).send({ endpoints: endpointJson });
  });

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.all('*', (req, res) => {
    res.status(404).send({ msg: "Not Found" });
  });

app.use(handlePSQLErrors);
app.use(handleNotFoundErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;

