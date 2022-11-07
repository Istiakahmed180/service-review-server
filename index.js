const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware code
app.use(cors());
app.use(express.json());

// testing server
app.get("/", (req, res) => {
  res.send("Assignment Project Running");
});

// listen server
app.listen(port, () => {
  console.log(`Assignment Project Running On Port:${port}`);
});
