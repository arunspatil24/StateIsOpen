const express = require('express');
const app = express();
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

var cors = require('cors')
const { Client } = require('pg');
const connectionString = 'postgres://postgres:88929%40run@localhost:5432/KYIsOpen';
const client = new Client({
    connectionString: connectionString
});
client.connect();
app.use(cors())
app.get('/getid', (req, res) => { 
    console.log(req.query.id)
  client.query('SELECT * FROM public."Contacts"', function (err, result) {
    if (err) {
        console.log(err);
        res.status(400).send(err);
    }
    res.status(200).send(result.rows);
    });
// res.status(200).send("Hello")
});


app.post('/open/search', (req, res) => { 
    console.log(req.body);
    // const name=req.body.name;
    // if(req.body.name != undefined || req.body.name != null){
    //     const query={text:'SELECT * FROM public."StateBusinesses" where "Name" like $1 Limit 20',values:["%"+name]}
    //     client.query(query, function (err, result) {
    //       if (err) {
    //           console.log(err);
    //           res.status(400).send(err);
    //       }
    //     //   res.rows.forEach(element => {
    //     //       element["name"] = element.Name;
    //     //   });
    //       res.status(200).send(result.rows);
    // }); 
    // }
    res.status(200).send({name:""});
}); 
app.post('/open/businesstype', (req, res) => { 
    console.log(req.body);
    // const name=req.body.name;
    // if(req.body.name != undefined || req.body.name != null){
    //     const query={text:'SELECT * FROM public."StateBusinesses" where "Name" like $1 Limit 20',values:["%"+name]}
    //     client.query(query, function (err, result) {
    //       if (err) {
    //           console.log(err);
    //           res.status(400).send(err);
    //       }
    //     //   res.rows.forEach(element => {
    //     //       element["name"] = element.Name;
    //     //   });
    //       res.status(200).send(result.rows);
    // }); 
    // }
    res.status(200).send({name:""});
}); 


app.post('/open/state', (req, res) => { 
    console.log(req.body);
    // const name=req.body.name;
    // if(req.body.name != undefined || req.body.name != null){
    //     const query={text:'SELECT * FROM public."StateBusinesses" where "Name" like $1 Limit 20',values:["%"+name]}
    //     client.query(query, function (err, result) {
    //       if (err) {
    //           console.log(err);
    //           res.status(400).send(err);
    //       }
    //     //   res.rows.forEach(element => {
    //     //       element["name"] = element.Name;
    //     //   });
    //       res.status(200).send(result.rows);
    // }); 
    // }
    res.status(200).send({name:""});
}); 


app.post('/getid', (req, res) => { 
    console.log(req.body);
    // const name=req.body.name;
    // if(req.body.name != undefined || req.body.name != null){
    //     const query={text:'SELECT * FROM public."StateBusinesses" where "Name" like $1 Limit 20',values:["%"+name]}
    //     client.query(query, function (err, result) {
    //       if (err) {
    //           console.log(err);
    //           res.status(400).send(err);
    //       }
    //     //   res.rows.forEach(element => {
    //     //       element["name"] = element.Name;
    //     //   });
    //       res.status(200).send(result.rows);
    // }); 
    // }
    res.status(200).send({name:""});
}); 

app.post('/open', (req, res) => { 
    console.log(req.body);
    // const name=req.body.name;
    // if(req.body.name != undefined || req.body.name != null){
    //     const query={text:'SELECT * FROM public."StateBusinesses" where "Name" like $1 Limit 20',values:["%"+name]}
    //     client.query(query, function (err, result) {
    //       if (err) {
    //           console.log(err);
    //           res.status(400).send(err);
    //       }
    //     //   res.rows.forEach(element => {
    //     //       element["name"] = element.Name;
    //     //   });
    //       res.status(200).send(result.rows);
    // }); 
    // }
    res.status(200).send({name:""});
}); 
app.get('/open', (req, res) => { 
    console.log(req.body);
    // const name=req.body.name;
    // if(req.body.name != undefined || req.body.name != null){
    //     const query={text:'SELECT * FROM public."StateBusinesses" where "Name" like $1 Limit 20',values:["%"+name]}
    //     client.query(query, function (err, result) {
    //       if (err) {
    //           console.log(err);
    //           res.status(400).send(err);
    //       }
    //     //   res.rows.forEach(element => {
    //     //       element["name"] = element.Name;
    //     //   });
    //       res.status(200).send(result.rows);
    // }); 
    // }
    res.status(200).send({name:""});
}); 
app.get('/open/activate', (req, res) => { 
    console.log(req.body);
    // const name=req.body.name;
    // if(req.body.name != undefined || req.body.name != null){
    //     const query={text:'SELECT * FROM public."StateBusinesses" where "Name" like $1 Limit 20',values:["%"+name]}
    //     client.query(query, function (err, result) {
    //       if (err) {
    //           console.log(err);
    //           res.status(400).send(err);
    //       }
    //     //   res.rows.forEach(element => {
    //     //       element["name"] = element.Name;
    //     //   });
    //       res.status(200).send(result.rows);
    // }); 
    // }
    res.status(200).send({name:""});
}); 
// app.post('/open/businesstype', (req, res) => { 
//     client.query('SELECT * FROM public."Contacts"', function (err, result) {
//       if (err) {
//           console.log(err);
//           res.status(400).send(err);
//       }
//       res.status(200).send(result.rows);
//       });
//   });
app.listen(4000, () => console.log('listening on port 4000'));