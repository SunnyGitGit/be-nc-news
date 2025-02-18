const express = require("express");
const cors = require("cors");
const app = express();
const endpointJson  = require("./endpoints.json");

const { getTopics, 
        getArticleById, 
        getArticles, 
        getArticleComments, 
        postArticleComment,
        patchArticleById,
        deleteCommentById,
        getUsers, 
      } = require("./controllers/topics-controllers")
const { handlePSQLErrors, 
        handleCustomErrors, 
        handleServerErrors, 
      } = require("./errors/errors")

app.use(cors());

app.use(express.json());

app.get("/api", (req, res, next) => {
    res.status(200).send({ endpoints: endpointJson });
  });

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postArticleComment);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers);

app.all('*', (req, res) => {
    res.status(404).send({ msg: "Not Found" });
  });

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;

