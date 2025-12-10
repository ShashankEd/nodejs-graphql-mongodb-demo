const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 8000;
const { graphqlHTTP } = require("express-graphql");
const  ruruHTML = require('ruru/server');

const schema = require("./Schemas");

mongoose
  .connect("mongodb+srv://admin:admin1234@groceryapp.z5rbs.mongodb.net/?appName=groceryapp")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML.ruruHTML({ endpoint: '/graphql' }));
});

app.listen(PORT, () => {
  console.log("Server running");
});
