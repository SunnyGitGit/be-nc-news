const express = require("express");
const app = express();
const endpointJson  = require("./endpoints.json");
const { getTopics } = require("./controllers/topics-controllers")

app.use(express.json());

app.get("/api", (req, res, next) => {
    res.status(200).send({ endpoints: endpointJson });
  });

app.get("/api/topics", getTopics);


app.all('*', (req, res) => {
    res.status(404).send({ msg: "Not Found" });
  });

module.exports = app;

