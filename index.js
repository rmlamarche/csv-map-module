'use strict';
const path = require('path');
const fs = require('fs');
const csvParse = require('csv-parse');
const csvStringify = require('csv-stringify');
const importPath = process.argv[2] || undefined;
const exportPath = process.argv[3] || undefined;

let importFromCSV = () => {
  // async read file in from specified path, then run callback
  console.log('attempting to read in data from ' + importPath + '...');
  fs.readFile(path.join(__dirname + '/' + importPath), (err, data) => {
    if (err) {
      console.error(err);
      return process.exit(-1);
    }
    // csv-parser module to parse the data, then run callback
    console.log('attempting to parse input data...');
    csvParse(data, {
      columns: header => header.map(h => h.trim())
    },
    (err, inputData) => {
      console.log('parsed input data:');
      console.log(inputData);
      let result = [];
      // for each row as 'o'
      inputData.forEach(d => {
        /*
          Here you have the entire row 'o' indexed by column name.
          For example, if your CSV contained customers with the fields
            Name | Email Address | Age
          You can access each cell in the CSV with
            o['Name']
            o['Email Address']
            o['Age']
          Map these to the output object
        */
        result.push({
            'New Field 1': d['Name'],
            'New Field 2': d['Age'],
            'New Field 3': d['Email Address']
        });
        /*
          You can also do all sorts of fun stuff here.
          Say you had 2 fields in your input file (First Name & Last Name),
          but you wanted one field in your output CSV (Full Name).
          The entire world of javascript is at your fingertips!
            'Full Name': d['First Name'] + ' ' + d['Last Name']
          You get the point.
        */
      });
      console.log('finished mapping data fields:');
      console.log(result);
      console.log('attempting to tranform result into CSV...');
      csvStringify(result, {
        header: true
      }, (err, ouputData) => {
        if (err) {
          console.error(err);
          return process.exit(-1);
        }
        console.log('attempting to write file to ' + exportPath + '...');
        fs.writeFile(exportPath, ouputData, (err, data) => {
          if (err) {
            console.error(err);
            return process.exit(-1);
          }
          console.log('done');
        });
      });
    });
  });
}

if (importPath && exportPath) {
  importFromCSV();
}
