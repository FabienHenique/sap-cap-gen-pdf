const express = require("express");
const path = require("path");
const fs = require("fs");
const { createDeliveryNote } = require("./createDeliveryNote.js");
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

const srcDir = path.resolve(__dirname);
var file;

const templateDeliveryNote  = {
  "date": "17/06/2020",
  "time": "10h28",
  "site": "LTr",
  "truck": "AA-123-BB",
  "customerId": "100235",
  "customerPhoneNumber": "01 23 45 67 89",
  "customerFaxNumber": "01 23 45 67 90",
  "customerCity": "STRASBOURG CITY",
  "deliveryNoteId": "20012345",
  "shippingAddressLines": [
    "SOCIETE ANONYME D'ALSACE",
    "1 RUE DES BONNES GENS",
    "80307",
    "67960 ENTZHEIM"
  ],   
  "billingAddressLines": [
    "S.A.S GESTION D'ENTREPRISES",
    "5 AVENUE FOCH",
    "BP 80701",
    "67112 STRASBOURG CEDEX",
  ],
  "rows":[
    {
      "code": '52001003',
      "designation": ["SABLE_TEST", "LAC03 - RCUG70 RA30- EN13242"],
      "isCE": true,
      "weight": "25.80",
      "tare": "13.66",
      "quantity": "12,14T",
    },
    {
      "code": '52001021',
      "designation": "FIRST LINE DESCRIPTION",
      "isCE": false,
      "weight": "14,69",
      "tare": "7,2",
      "quantity": "12,14T",
      "grossPrice": "2 535€",
      "discount": "15%",
      "netPrice": "2 154,75€",
      "grossTotal": "26 158,67€",
      "VAT": "20%"
    }
  ]
};


app.post("/api/v1/deliveryNote", function (req, res) {
  var doc = createDeliveryNote(req.body);
  doc.pipe(res);
});

app.get("/api/v1/deliveryNote", function(req, res) {
  var doc = createDeliveryNote(templateDeliveryNote);
  doc.pipe(res); 
});

// ---------------------------------------------------------------
// Start the server
// ---------------------------------------------------------------
var server = app.listen(process.env.PORT || 1334, function() {
    process.stdout.write(
      "Started server on http://localhost:" + server.address().port + "\n"
    );
  });