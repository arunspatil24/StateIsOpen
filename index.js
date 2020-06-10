const express = require("express");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

var cors = require("cors");
const { Pool } = require("pg");
const { json } = require("body-parser");
const connectionString = "postgres://postgres:srr123@localhost:5432/ky_is_open";
const pool = new Pool({
  connectionString: connectionString,
});
pool.connect();
app.use(cors());

app.post("/open/search", (req, res) => {
  const name = req.body.name;
  const page = (req.query.page < 0 ? 0 : req.query.page) || 0;
  const size = (req.query.size < 1 ? 20 : req.query.size) || 20;
  const queryString =
    "SELECT" +
    '"StateBusinesses"."Id",' +
    '"StateBusinesses"."County",' +
    '"StateBusinesses"."Name", ' +
    '"StateBusinesses"."Address",' +
    '"StateBusinesses"."City",' +
    '"StateBusinesses"."PostalCode",' +
    '"StateBusinesses"."AltPhone",' +
    '"StateBusinesses"."Website",' +
    '"StateBusinesses"."Sales",' +
    '"StateBusinesses"."Employees",' +
    '"StateBusinesses"."SicCode",' +
    '"StateBusinesses"."Industry",' +
    '"StateBusinesses"."EmailDomain",' +
    "json_agg(" +
    "json_build_object(" +
    '\'Id\', "Contacts"."Id",' +
    '\'Name\', "Contacts"."Name",' +
    '\'Title\', "Contacts"."Title",' +
    '\'Phone\', "Contacts"."Phone",' +
    '\'Email\', "Contacts"."Email" ' +
    ")" +
    ")" +
    'as "Contacts"' +
    'FROM public."StateBusinesses" Inner Join "Contacts" On public."StateBusinesses"."Id" = "Contacts"."StateBusinessId"' +
    'Where "StateBusinesses"."Name" Like $1 Group By "StateBusinesses"."Id"';

  if (name != undefined && name != null) {
    const query = {
      text:
        'Select * From public."StateBusinesses" Where Lower("StateBusinesses"."name") Like Lower($1) LIMIT $2 OFFSET $3',
      values: [name + "%", size, page * size],
    };
    return pool.query(query, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      var results = Array();
      result.rows.forEach((element) => {
        results.push({ _source: element });
      });
      res.send(results);
    });
  }
  res.send([]);
});

app.post("/open/businesstype", (req, res) => {
  console.log(req.body);
  const type = req.body.industry;
  const page = (req.query.page < 0 ? 0 : req.query.page) || 0;
  const size = (req.query.size < 1 ? 20 : req.query.size) || 20;
  if (type != undefined && type != null) {
    const query = {
      text: 'Select * From public."SICCodes" Where Lower("SICCodes"."industry") Like Lower($1) LIMIT $2 OFFSET $3',
      values: ["%" + type + "%", size, page * size],
    };
    return pool.query(query, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      var results = Array();
      result.rows.forEach((element) => {
        results.push({ _source: element });
      });
      res.send(results);
    });
  }
  res.send([]);
});

app.post("/open", (req, res) => {
  const payload = req.body.doc;
  //console.log(req.body.doc);
  const query = {
    text: 'UPDATE public."StateBusinesses" Set formdata = $1 where "StateBusinesses"."id" = $2',
    values: [JSON.stringify(payload), payload.id],
  };
  return pool.query(query, function (err, result) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(200).send(result);
    return;
  });
});

app.listen(4000, () => console.log("listening on port 4000"));
