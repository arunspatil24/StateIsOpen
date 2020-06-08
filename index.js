const express = require("express");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

var cors = require("cors");
const { Pool } = require("pg");
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

  'SELECT' +
  '"StateBusinesses"."Id",'+
  '"StateBusinesses"."County",'+
  '"StateBusinesses"."Name", '+
  '"StateBusinesses"."Address",'+
  '"StateBusinesses"."City",'+
  '"StateBusinesses"."PostalCode",'+
  '"StateBusinesses"."AltPhone",'+
  '"StateBusinesses"."Website",'+
  '"StateBusinesses"."Sales",'+
  '"StateBusinesses"."Employees",'+
  '"StateBusinesses"."SicCode",'+
  '"StateBusinesses"."Industry",'+
  '"StateBusinesses"."EmailDomain",'+
  'json_agg(' +
      'json_build_object(' +
          '\'Id\', "Contacts"."Id",'+
          '\'Name\', "Contacts"."Name",'+
          '\'Title\', "Contacts"."Title",'+
          '\'Phone\', "Contacts"."Phone",'+
          '\'Email\', "Contacts"."Email" '+
      ')' +
  ')' +
  'as "Contacts"' +
  'FROM public."StateBusinesses" Inner Join "Contacts" On public."StateBusinesses"."Id" = "Contacts"."StateBusinessId"' +
  'Where "StateBusinesses"."Name" Like $1 Group By "StateBusinesses"."Id"';

  if (name != undefined && name != null) {
    const query = {
      text: queryString +' LIMIT $2 OFFSET $3',
      values: [
          name + '%',
          size,
          page * size
      ]
    };
    return pool.query(query, function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.send(result.rows);
    });
  }
});
app.listen(4000, () => console.log("listening on port 4000"));
