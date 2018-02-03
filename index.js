const cors = require("cors");
const expressMongoDb = require("express-mongo-db");
const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const PORT = parseInt(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todos';
const app = express();

async function main() {
  app.use(cors());
  app.use(bodyParser.json());

  // setup api routes
  app.use(expressMongoDb(MONGODB_URI));

  app.get('/todos/', async (req, res) => {
    const todos = req.db.collection("todos");
    const todoList = await todos.find().toArray();
    res.send(todoList);
  });

  app.post('/todos/', async (req, res) => {
    const todos = req.db.collection("todos");
    const title = req.body.title;
    const result = await todos.insertOne({ title });
    if (result) {
      res.send(result.ops[0]);
    } else {
      res.send(false);
    }
  });

  app.delete('/todos/:id', async (req, res) => {
    const db = req.db.collection("todos");
    const _id = new ObjectId(req.params.id);
    const todo = await db.findOne({ _id });
    if (todo) {
      const result = await db.deleteOne({ _id });
      if (result) { res.send(true); }
      else { res.send(false); }
    } else {
      res.send(false);
    }
  });

  // start server
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT} port...`);
  });
}

main();