const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const services = require("./services.json");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;

// middleware code
app.use(cors());
app.use(express.json());

// mongodb client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwqsejd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    // service collection for mongodb database
    const serviceCollection = client.db("serviceDB").collection("services");
    // review collection
    const reviewCollection = client.db("serviceDB").collection("reviews");

    // jwt api code
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

    // read service data
    app.get("/services", async (req, res) => {
      const query = {};
      //   all service data
      const allService = serviceCollection.find(query);
      //   three service data
      const cursor = serviceCollection.find(query).limit(3);
      const service = await cursor.toArray();
      const services = await allService.toArray();
      res.send({ services, service });
    });

    // service:id find just one service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // review api
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // reviews all data get
    app.get("/reviews", verifyJWT, async (req, res) => {
      const decoded = req.decoded;
      console.log(decoded);
      if (decoded.email !== req.query.email) {
        res.status(403).send({ message: "Unauthorized Access" });
      }
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    // delete one id data
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
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
