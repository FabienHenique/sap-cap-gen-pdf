const fs = require("fs");
const PDFDocument = require("pdfkit");

const columns = new Map([
  ["code", { "header": "Code", "width": 45 }],
  ["designation", { "header": "Désignation", "width": 170, "textWidth": 156 }],
  ["isCE", { "header": "", "width": 0, "textWidth": 14 }],
  ["weight", { "header": "Poids", "width": 40 }],
  ["tare", { "header": "Tare", "width": 40 }],
  ["quantity", { "header": "Quantité", "width": 45 }],
  ["grossPrice", { "header": "Prix brut", "width": 55 }],
  ["discount", { "header": "R.", "width": 20 }],
  ["netPrice", { "header": "Prix net", "width": 55 }],
  ["grossTotal", { "header": "Montant HT", "width": 60 }],
  ["VAT", { "header": "TVA", "width": 20 }],
]);

// Fill textWidth property when not explicitly set
// Set x as the relative coordinate of the column
var x = 0;
for (const column of columns.values()) {
  column.x = x;
  if (!column.hasOwnProperty('textWidth')) {
    column.textWidth = column.width;
  }
  x += column.textWidth;
};

function generateHeaderBox(doc, deliveryNote, x, y) {

  var width = 260;
  var bottomVerticalSeparatorX = 55;

  // Draw figure
  doc
    .roundedRect(x, y, width, 150, 5)
    .stroke();

  // Draw the bottom table

  // Horizontal lines
  var bottomTableY = 60;
  var tableRowHeight = 18;

  for (i=0; i < 5; i++) {
    doc
      .moveTo(x, y + bottomTableY + tableRowHeight * i)
      .lineTo(x + width, y + bottomTableY + tableRowHeight * i)
      .stroke();
  }

  // Vertical separator of the bottom part
  doc
    .moveTo(x + bottomVerticalSeparatorX, y + 60)
    .lineTo(x + bottomVerticalSeparatorX, y + 150)
    .stroke();

  // Fill the top section

  var companyName = "Sablières  J. LEONHART";
  var companyInfoLines = [
    "ROUTE DE STRASBOURG - B.P. 70005 - 67601 SELESTAT CEDEX",
    "Tél. 03 88 58 80 30 - Fax. 03 88 82 88 74",
    "R.C. COLMAR 60 B 17 - N° Siret : 916 020 175",
    "Ape : 2363Z - N° Intracommunautaire TVA / CCE : FR00916020175"
  ];

  doc
    .font('Courier-Bold')
    .fontSize(18)
    .text(companyName, x + 2, y + 2, { width: width, align: "center" })
    .fontSize(6)
    .text("SAS au capital de 5 000 000€", x + 2, y + 17, { width: width, align: "center" })
    .font('Courier')

  doc.text("", x + 2, y + 30);
  companyInfoLines.forEach(companyInfoLine => {
    doc
      .fontSize(7)
      .text(companyInfoLine, { width: width, align: "left" })
      .moveDown(0);
  });
    
  // Fill the bottom table, line by line
  // first the left part that is fixed, the right part which is variable.

  // font size and style for the right part of the bottom table
  var xPadding = 5;
  var rightX = x + bottomVerticalSeparatorX + xPadding;

  var leftFontSize = 8;
  var rightFontSize = 9;

  var leftStyle = {
    width: bottomVerticalSeparatorX - 2,
    height: leftFontSize,
    align: "center"
  }
  var rightStyle = {
    width: width - bottomVerticalSeparatorX - (xPadding * 2),
    height: rightFontSize,
    align: "left"
  };

  var offsetY = y + bottomTableY + 6;
  // Date
  doc
    .fontSize(leftFontSize)
    .text("Date", x, offsetY, leftStyle);

  var dateText = deliveryNote.date + " à " + deliveryNote.time + ", Site : " + deliveryNote.site
  doc
    .fontSize(rightFontSize)
    .text(dateText, rightX, offsetY, rightStyle); 

  offsetY += tableRowHeight;

  // Camion 
  doc
    .fontSize(leftFontSize)
    .text("Camion", x, offsetY, leftStyle);
  doc
    .fontSize(rightFontSize)
    .text(deliveryNote.truck, rightX, offsetY, rightStyle);

  offsetY += tableRowHeight;

  // Client
  doc
    .fontSize(leftFontSize)
    .text("N° client", x, offsetY, leftStyle);
  doc
    .fontSize(rightFontSize)
    .text(deliveryNote.customerId, rightX, offsetY, rightStyle);

  offsetY += tableRowHeight;

  // Contact
  doc
    .fontSize(leftFontSize)
    .text("Contact", x, offsetY, leftStyle);

  offsetY += tableRowHeight;

  // Manage contact text concatenation depending on the available info
  if (deliveryNote.customerPhoneNumber) {
    // remove all spaces from phone number because white-spacing is too
    // big with the Courier font. It overflows the table cell.
    var tel = "Tél: " + deliveryNote.customerPhoneNumber.replace(/ /g,"");
  } else {
    var tel = "";
  }

  if (deliveryNote.customerFaxNumber) {
    // remove all spaces from fax number because white-spacing is too
    // big with the Courier font. It overflows the table cell.
    var fax = "Fax: " + deliveryNote.customerFaxNumber.replace(/ /g,"");
  } else {
    var fax = "";
  }

  if (deliveryNote.customerPhoneNumber && deliveryNote.customerFaxNumber) {
    var separator = " - ";
  } else {
    var separator = "";
  }

  doc
    .fontSize(rightFontSize)
    .text(tel + separator + fax, rightX, y + 120, rightStyle);

  offsetY += tableRowHeight;

  // Commune
  doc
    .fontSize(leftFontSize)
    .text("Commune", x, y + 139, leftStyle);
  doc
    .fontSize(rightFontSize)
    .text(deliveryNote.customerCity, rightX, y + 138, rightStyle);

}

function generateDeliveryNoteText(doc, deliveryNoteId, x, y) {
  doc
    .font('Courier-Bold')
    .fontSize(15)
    .text("BULLETIN LIVRAISON N°" + deliveryNoteId, x, y, { width: 270 })
    .font('Courier');
}

function generateAddressesBox(doc, deliveryNote, x, y) {

  var width = 260;
  var height = 130;
  
  // Draw complete lines
  doc
    .moveTo(x, y)
    .lineTo(x, y + height)
    .lineTo(x + width, y + height)
    .lineTo(x + width, y)
    .moveTo(x, y)
    .stroke();

  // Draw broken line for shipping address 
  var centralGap = 120;
  doc
    .moveTo(x, y)
    .lineTo(x + width / 2 - centralGap / 2, y)
    .moveTo(x + width / 2 + centralGap / 2, y)
    .lineTo(x + width, y)
    .stroke();
  doc
    .fontSize(8)
    .text("Adresse de Livraison", x, y - 2 , { width: width, align: "center" })

  // Draw broken line for delivery address 
  doc
    .moveTo(x, y + height / 2)
    .lineTo(x + width / 2 - centralGap / 2, y + height / 2)
    .moveTo(x + width / 2 + centralGap / 2, y + height / 2)
    .lineTo(x + width, y + height / 2)
    .stroke();
  doc
    .fontSize(8)
    .text("Adresse de Facturation", x, y + height / 2 - 2, { width: width, align: "center" })


  // Hack as moveTo doesn't work as expected, see issue #1092 on Github
  doc.text("", x + 10, y + 8);
  deliveryNote.shippingAddressLines.forEach(line => {
    doc
      .fontSize(10)
      .text(line, { width: width - 10, height: 10, align: "left" })
      .moveDown(0);
  });

  // Hack as moveTo doesn't work as expected, see issue #1092 on Github
  doc.text("", x + 10, y + height / 2 + 8);
  deliveryNote.billingAddressLines.forEach(line => {
    doc
      .fontSize(10)
      .text(line, { width: width - 10, height: 10, align: "left" })
      .moveDown(0);
  });

}

function createTable(doc, footNote, x, y, height) {

  var textPadding = 3;
  var cumulX = x;
  var tableWidth = 0;

  // Create a rectangle for each visible column
  // Add a header
  for (const column of columns.values()) {
    tableWidth += column.width;
    if (column.width > 0) {
      createColumn(doc, column.header, textPadding, x + column.x, y, column.width, height);
    };
    cumulX += column.textWidth;
  };

  // Draw line under header
  doc
    .moveTo(x, y + 10)
    .lineTo(x + tableWidth, y + 10)
    .stroke();

  // Foot note 
  doc
    .fontSize(8)
    .fillColor("red")
    .text(footNote, 20, y + height + 2);

  doc.fillColor("black");
}

function createColumn(doc, header, textPadding, x, y, width, height) {

  // Draw the rectangle
  doc
    .rect(x, y, width, height)
    .stroke();

  // Write the header of the column
  doc
    .fontSize(6)
    .text(header, x, y + textPadding, { width: width, align: "center" });
};

function fillRows(doc, rows, x, y) {
  var textPadding = 2;
  var fontSize = 8;

  var lineHeightIncrement = fontSize + textPadding;

  // loop on the line of the delivery note
  rows.forEach(row => {

    rowHeight = lineHeightIncrement;

    // loop on the keys of the object to fill the corresponding column
    Object.keys(row).forEach(function(key) {
      column = columns.get(key);
      maxTextWidth = column.textWidth - textPadding;

      // deal with the isCE logo which generates an image and not a text
      if (key === "isCE") {
        if (row['isCE']) {
          style = {
            width: maxTextWidth,
            height: fontSize,
            align: "center"
          };
          doc.image("CE_logo.png", x + column.x, y + textPadding, style);
        }
      } else {

        // fix the width of the text to avoid overflow
        style = {
          width: maxTextWidth,
          height: lineHeightIncrement,
          align: "left"
        };

        // transform all text values to arrays to loop on them
        if (!Array.isArray(row[key])) {
          textLines = [row[key]];
        } else {
          textLines = row[key];
        };

        // the total height of the row increases if there are more text lines than before
        rowHeight = Math.max(rowHeight, lineHeightIncrement * textLines.length);

        // display the text lines
        // offset the height of the text by the number of lines preceeding in the list
        textLines.forEach((textLine, i) => {
          doc
            .fontSize(fontSize)
            .text(textLine, x + column.x + textPadding, y + i * lineHeightIncrement + textPadding,  style);
        });
      }
    });

    // increment the next row height
    y += rowHeight;
  });

}

function generateFooter(doc, y) {
  var legalTextLines = [
    "Tout paiement différé est passible des intérêts de retard dont le taux est égal à 1,5 fois le taux d’escompte de la Banque de France.",
    "Toute contestation qui pourrait survenir à l’occasion de l’interprétation et de l’exécution des présentes conventions sont nonobstant toute clause contraire à l’acheteur, de la compétence exclusive du Tribunal du lieu de notre siège social, c’est-à-dire du ressort de la Cour d’Appel de Colmar. Les réclamations ne sont admises que dans un délai de 48h.",
    "Toutes déductions entraînent une diminution proportionnelle du montant de la TVA déductible.",
    "Les caractéristiques de nos produits sous marquage CE sont renseignés dans la Déclaration des Performances N° 499-2000-2-03 et ses annexes. Ces documents sont consultables sur demande.",
    "Organisme certificateur n° 0788 - Date de première application du marquage CE : 2011."
  ];

  // Hack as moveTo doesn't work as expected, see issue #1092 on Github
  doc.text("", 20, y)
  legalTextLines.forEach(line => {
    doc
      .fontSize(5.5)
      .text(line, { width: 400, align: "left" })
      .moveDown(0);
  });

  // Signature box
  var boxX = 425;

  // keep a right margin of 20 points
  var boxWidth = doc.page.width - 20 - boxX;
  doc
    .rect(boxX, y, boxWidth, 50)
    .stroke();

  doc
    .fontSize(8)
    .text("Livraison réceptionnée", boxX,  y + 5, { width: boxWidth, align: "center" })
    .moveDown(0.2)
    .text(" Signature :");
}


function createDeliveryNote(deliveryNote) {

  let doc = new PDFDocument({
    size: "A4",
    margin: 0,
    font: "Courier"
  });
  doc.lineWidth(0.5);

  // repeat the document twice with only small variations
  const duplicate_doc = [
    {
      topY: 0,
      headerNumber: "1",
      tableFootNote: "Exemplaire client",      
    },
    {
      topY: doc.page.height / 2 - 10,
      headerNumber: "2",
      tableFootNote: "Copie",
    }
  ];

  duplicate_doc.forEach(duplicata => {

    // top-left box
    generateHeaderBox(doc, deliveryNote, 20, duplicata.topY + 20);

    // top-right title
    generateDeliveryNoteText(doc, deliveryNote.deliveryNoteId, 300, duplicata.topY + 20);

    // top-right box
    generateAddressesBox(doc, deliveryNote, 310, duplicata.topY + 40);

    // index of page between headers
    doc
      .fontSize(10)
      .text(duplicata.headerNumber, 292, duplicata.topY + 160);

    // create the table column by column, with headers and the foot note
    createTable(doc, duplicata.tableFootNote, 20, duplicata.topY + 175, 170);

    // fill the table with the info from the deliveryNote
    fillRows(doc, deliveryNote.rows, 20, duplicata.topY + 185);

    // legal footer with signature box
    generateFooter(doc, duplicata.topY + 360); 

  })

  doc.end();
  return doc
}

module.exports = {
  createDeliveryNote
};
