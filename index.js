const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const request = require("request-promise");

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mysql
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "dbTestNodeJs",
  charset: "utf8_general_ci",
});

conn.connect((err) => {
  if (err) {
    console.log("Connect to db fail!!!");
  }

  console.log("Connect to db success");
});

app.post("/create", (req, res) => {
  const { id, title } = req.body;
  const sql = `INSERT INTO posts(id, title) VALUES(${id}, '${title}')`;

  conn.query(sql, (err, data) => {
    if (err) {
      console.log("err intert", err);
    }

    console.log("1 record inserted");
  });
});

app.get("/", (req, res) => {
  const sql = "SELECT * from posts";

  conn.query(sql, (err, data) => {
    if (err) {
      throw err;
    }

    res.send(data);
  });
});

app.get("/detail", (req, res) => {
  const { id } = req.query;

  const sql = `SELECT * from posts WHERE id = ${id}`;

  conn.query(sql, (err, data) => {
    if (err) {
      throw err;
    }
    res.send(data);
  });
});

app.post("/edit", (req, res) => {
  const { id, title } = req.body;

  const sql = `update posts set title = '${title}' where id = ${id}`;

  conn.query(sql, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(`record ${id} updated`);
  });
});

app.get("/delete", (req, res) => {
  const { id } = req.query;

  const sql = `delete from posts where id = ${Number(id)}`;

  conn.query(sql, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(`record ${id} deleted`);
  });
});

// request
const options = {
  method: "GET",
  uri: "https://risingstack.com",
};

app.get("/request", (req, res) => {
  request(options)
    .then(function (response) {
      res.send(response);
      // Request was successful, use the response object at will
    })
    .catch(function (err) {
      console.log("err", err);
      // Something bad happened, handle the error
    });
});

app.listen(port, (err) => {
  if (err) {
    console.log("Something went wrong");
  }

  console.log("Server is running at " + port);
});
