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
  "date": "2021/10/09",
  "time": "12:00",
  "site": "SXB",
  "truck": "BF-123-FF",
  "customerId": "100235",
  "customerPhoneNumber": "+33 1 23 45 67 89",
  "customerFaxNumber": "N/A",
  "customerCity": "STRASBOURG CITY",
  "deliveryNoteId": "20012345",
  "shippingAddressLines": [
    "NAGARRO ES FRANCE",
    "8A RUE ICARE",
    "67960 ENTZHEIM"
  ],   
  "billingAddressLines": [
    "SAP",
    "35 RUE D ALSACE",
    "BP 1234",
    "92300 LEVALLOIS-PERRET",
  ],
  "rows":[
    {
      "code": '52001003',
      "designation": ["pencil box NFR", "Big box with 15 pencils - Nagarro ES Branding"],
      "isCE": true,
      "weight": "25.80",
      "tare": "13.66",
      "quantity": "12,14KG",
    },
    {
      "code": 'SHP',
      "designation": "Shipping cost",
      "quantity": "1",
      "isCE": false,
      "grossPrice": "1.709€",
      "discount": "15%",
      "netPrice": "1.743,18€",
      "grossTotal": "1.452,65€",
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