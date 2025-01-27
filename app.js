const express = require("express");
const app = express();
const endpointJson  = require("./endpoints.json");
const { handlePSQLErrors, handleCustomErrors, handleServerErrors, handleReferenceErrors } = require("./errors/errors")

app.get("/api", (req, res, next) => {
    res.status(200).send({ endpoints: endpointJson });
  });

app.use(handlePSQLErrors);
app.use(handleReferenceErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;