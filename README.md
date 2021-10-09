# PDF Generator

Générer un PDF à partir d'une requête POST d'un template créé grâce à pdfkit et NodeJS

## Getting started

Download NodeJS with npm.
To install all modules and dependencies, run in a terminal at the root of the project:
```
npm install
```

To start the server, run:
```
npm start
```

For Docker, to build and run the image:
```
docker build . -t <username>/pdf-generator
docker run -p 1334:1334 -d <username>/pdf-generator
```

To upload to Cloud Foundry, run:
```
cf login
cf push
```

## API

### Delivery note

The root is /api/v1/deliveryNote.
A GET request will return a PDF filled with a template delivery note.
A POST request will populate the file with the object. Example of body:
```
{
  "date": "17/06/2020",
  "time": "10:28",
  "site": "Site code",
  "truck": "AA-123-BB",
  "customerId": "100235",
  "customerPhoneNumber": "01 23 45 67 89",
  "customerFaxNumber": "01 23 45 67 90",
  "customerCity": "STRASBOURG CITY",
  "deliveryNoteId": "20012345",
  "shippingAddressLines": [
    "COMPANY NAME",
    "street 1",
    "street 2",
    "Postal code - City"
  ],   
  "billingAddressLines": [
    "COMPANY NAME",
    "street 1",
    "street 2",
    "Postal code - City"
  ],
  "rows":[
    {
      "code": 'MATERIAL ID',
      "designation": ["DES 1", "DES 2"],
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
      "netPrice": "2 154,75€",
      "grossTotal": "26 158,67€",
      "VAT": "20%"
    }
  ]
}
```


