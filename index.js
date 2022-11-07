const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const services = require("./services.json");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware code
app.use(cors());
app.use(express.json());

// mongodb client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwqsejd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
  } finally {
  }
}
run().catch((error) => console.error(error));

// testing server
app.get("/", (req, res) => {
  res.send("Assignment Project Running");
});

// listen server
app.listen(port, () => {
  client.connect((err) => {
    if (err) {
      console.log(err.message);
    }
  });
  console.log(`Assignment Project Running On Port:${port}`);
});
