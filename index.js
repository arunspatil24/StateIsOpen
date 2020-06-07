const express = require('express');
const app = express();
const { Client } = require('pg');
const connectionString = 'postgres://postgres:88929%40run@localhost:5432/KYIsOpen';
const client = new Client({
    connectionString: connectionString
});
client.connect();
app.get('/getid', (req, res) => { 
    console.log(req.query.id)
//   client.query('SELECT * FROM public."Contacts"', function (err, result) {
//     if (err) {
//         console.log(err);
//         res.status(400).send(err);
//     }
//     res.status(200).send(result.rows);
//     });
res.status(200).send("Hello")
});

app.get('/getIndustry', (req, res) => { 
    client.query('SELECT * FROM public."Contacts"', function (err, result) {
      if (err) {
          console.log(err);
          res.status(400).send(err);
      }
      res.status(200).send(result.rows);
      });
  });

app.listen(4000, () => console.log('listening on port 4000'));