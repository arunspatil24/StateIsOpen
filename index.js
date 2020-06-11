const express = require("express");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

var cors = require("cors");
const { Pool } = require("pg");
const { json } = require("body-parser");
const connectionString = "postgres://masteradmin:D2jjY6tQT2XfNzrhH4Ko@dev-aurora-db-cluster.cluster-clhbqhjqo4mz.us-east-1.rds.amazonaws.com:5432/kybusinessdata";
const pool = new Pool({
  connectionString: connectionString,
});
pool.connect();
app.use(cors());

function getBusinessByName(req, res, name, page, size) {
  const query = {
    text:
      'Select * From public."StateBusinesses" Where Lower("StateBusinesses"."name") Like Lower($1) LIMIT $2 OFFSET $3',
    values: [name + "%", size, page * size],
  };
  return pool.query(query, function (err, result) {
    if (err) {
     // console.log(err);
      res.status(400).send(err);
    }
    var results = Array();
    result.rows.forEach((element) => {
      results.push({ _source: element });
    });
    res.send(results);
  });
}

function getBusinessByIndustry(req, res, industry, page, size) {
  const query = {
    text: 'Select * From public."StateBusinesses" Where Lower("StateBusinesses"."industry") LIKE Lower($1) LIMIT $2 OFFSET $3',
    values: ["%" + industry + "%", size, page * size],
  };
  return pool.query(query, function (err, result) {
    if (err) {
     // console.log(err);
      res.status(400).send(err);
    }
    var results = Array();
    result.rows.forEach((element) => {
      results.push({ _source: element });
    });
    res.send(results);
  });
}

function getBusinessByFiteredSearch(req, res, filteredSearch, page, size) {
  const industry = filteredSearch.industry;
  const county = filteredSearch.county;
  const zip = filteredSearch.zip;
  let query = {
    text: 'Select * From public."StateBusinesses" Where Lower("StateBusinesses"."industry") LIKE Lower($1) LIMIT $2 OFFSET $3',
    values: ["%" + industry + "%", size, page * size],
  };

  if (county != undefined && county != null && county != "") {
   // console.log("Search by county: "+county);
    query = {
      text: 'Select * From public."StateBusinesses" Where Lower("StateBusinesses"."industry") LIKE Lower($1) and Lower("StateBusinesses"."county") = Lower($2) LIMIT $3 OFFSET $4',
      values: ["%" + industry + "%", county, size, page * size],
    };
  }else if (zip != undefined && zip != null && zip != "") {
  //  console.log("Search by zip: "+zip);
    query = {
      text: 'Select * From public."StateBusinesses" Where Lower("StateBusinesses"."industry") LIKE Lower($1) and "StateBusinesses"."postalcode" = $2 LIMIT $3 OFFSET $4',
      values: ["%" + industry + "%", zip, size, page * size],
    };
  }

  return pool.query(query, function (err, result) {
    if (err) {
   //   console.log(err);
      res.status(400).send(err);
    }
    var results = Array();
    result.rows.forEach((element) => {
      results.push({ _source: element });
    });
    res.send(results);
  });
}

app.post("/open/search", (req, res) => {
  const name = req.body.name;
  const industry = req.body.industry;
  const filteredSearch = req.body.filteredSearch;
  const page = (req.query.page < 0 ? 0 : req.query.page) || 0;
  const size = (req.query.size < 1 ? 20 : req.query.size) || 20;

  if (name != undefined && name != null) {
    return getBusinessByName(req, res, name, page, size);
  } else if (industry != undefined && industry != null) {
    return getBusinessByIndustry(req, res, industry, page, size);
  } else if (filteredSearch != undefined && filteredSearch != null) {
  //  console.log("calling filtered");
  //  console.log(filteredSearch);
    return getBusinessByFiteredSearch(req, res, filteredSearch, page, size);
  }
  res.send([]);
});

app.post("/open/businesstype", (req, res) => {
//  console.log(req.body);
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
      //  console.log(err);
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



function UpdateBusinessById(req, res, payload){
  const query = {
    text: 'UPDATE public."StateBusinesses" Set formdata = $1 where "StateBusinesses"."id" = $2',
    values: [JSON.stringify(payload), payload.id],
  };
  return pool.query(query, function (err, result) {
    if (err) {
    //  console.log(err);
      res.status(400).send(err);
    }
    res.status(200).send(result);
    return;
  });

}

function InsertNewBusiness(req, res, payload){
 // console.log("This is from Add");
 // console.log(payload);
  var InsertQuery ='INSERT INTO public."StateBusinesses"'
+'('
+'id, county, name, address, city, postalcode, altphone, website, sales, employees, siccode, industry, emaildomain, formdata'+
')'
+'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)'
  const query = {
    text: InsertQuery,
    values: [payload.id,payload.county,payload.name,payload.address,payload.city,payload.postalcode, payload.phone, payload.website, payload.sales||null, payload.employees||null, payload.siccode||null, payload.industry, payload.email,JSON.stringify(payload)],
  };
  return pool.query(query, function (err, result) {
    if (err) {
    //  console.log(err);
      res.status(400).send(err);
    }
    res.sendStatus(200);
    return;
  });

}
app.post("/open", (req, res) => {
  const payload = req.body;
  //console.log(req.body.doc);
  if (payload.doc) {
    return UpdateBusinessById(req, res, payload.doc);
    
  }
  else{
   
    return InsertNewBusiness(req, res, payload);
  }
});

app.listen(4000);
