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
      let obj = {};
      // for each row as 'o'
      inputData.forEach(d => {
        let handle = 'prom-dress-style-' + d['Style'].split('/')[0].trim();
        let maxSize = d['Sizes'].split('/')[0].trim().split('-')[1].trim();
        let colors = d['Colors'].split(',');
        let price = d['Price'].split('/')[0].trim().split('$')[1].trim();
        if (!obj[handle]) {
          obj[handle] = {
            'title': 'Prom Dress Style ' + d['Style'].trim(),
            'vendor': 'Faviana',
            'type': 'Prom',
            'variants': []
          }
        }
        for (let color of colors) {
          obj[handle]['variants'].push({
            'size': '00',
            'color': color,
            'price': parseInt(price) * 2,
            'SKU': d['Style'].split('/')[0].trim()
          });
        }
        for (let size = 0; size <= maxSize; size += 2) {
          for (let color of colors) {
            obj[handle]['variants'].push({
              'size': size,
              'color': color,
              'price': parseInt(price) * 2,
              'SKU': d['Style'].split('/')[0].trim()
            });
          }
        }
      });
      Object.keys(obj).forEach(key => {
        for (let i = 0; i < obj[key].variants.length; i++) {
          if (i == 0) {
            result.push({
              'Handle': key,
              'Title': obj[key]['title'],
              'Body (HTML)': `<div class="productView">
                                <article class="productView-description" itemprop="description">
                                  <div class="tabs-contents">
                                    <div class="tab-content is-active" id="tab-description">
                                      DESCRIPTION
                                    </div>
                                  </div>
                                </article>
                              </div>`,
              'Vendor': obj[key]['vendor'],
              'Type': obj[key]['type'],
              'Tags': '',
              'Published': 'TRUE',
              'Option1 Name': 'Size',
              'Option1 Value': obj[key]['variants'][i]['size'],
              'Option2 Name': 'Color',
              'Option2 Value': obj[key]['variants'][i]['color'].trim(),
              'Option3 Name': '',
              'Option3 Value': '',
              'Variant SKU': obj[key]['variants'][i]['SKU'],
              'Variant Grams': '1814',
              'Variant Inventory Tracker': '',
              'Variant Inventory Qty': '0',
              'Variant Inventory Policy': 'continue',
              'Variant Fulfillment Service': 'manual',
              'Variant Price': obj[key]['variants'][i]['price'],
              'Variant Compare At Price': '',
              'Variant Requires Shipping': 'TRUE',
              'Variant Taxable': 'TRUE',
              'Variant Barcode': '',
              'Image Src': '',
              'Image Position': '',
              'Image Alt Text': '',
              'Gift Card': '',
              'SEO Title': '',
              'SEO Description': '',
              'Google Shopping / Google Product Category': '',
              'Google Shopping / Gender': '',
              'Google Shopping / Age Group': '',
              'Google Shopping / MPN': '',
              'Google Shopping / AdWords Grouping': '',
              'Google Shopping / AdWords Labels': '',
              'Google Shopping / Condition': '',
              'Google Shopping / Custom Product': '',
              'Google Shopping / Custom Label 0': '',
              'Google Shopping / Custom Label 1': '',
              'Google Shopping / Custom Label 2': '',
              'Google Shopping / Custom Label 3': '',
              'Google Shopping / Custom Label 4': '',
              'Variant Image': '',
              'Variant Weight Unit': 'lb',
              'Variant Tax Code': '',
              'Cost per item': ''
            });
          } else {
              result.push({
                'Handle': key,
                'Title': '',
                'Body (HTML)':'',
                'Vendor': '',
                'Type': '',
                'Tags': '',
                'Published': '',
                'Option1 Name': '',
                'Option1 Value': obj[key]['variants'][i]['size'],
                'Option2 Name': '',
                'Option2 Value': obj[key]['variants'][i]['color'].trim(),
                'Option3 Name': '',
                'Option3 Value': '',
                'Variant SKU': obj[key]['variants'][i]['SKU'],
                'Variant Grams': '1814',
                'Variant Inventory Tracker': '',
                'Variant Inventory Qty': '0',
                'Variant Inventory Policy': 'continue',
                'Variant Fulfillment Service': 'manual',
                'Variant Price': obj[key]['variants'][i]['price'],
                'Variant Compare At Price': '',
                'Variant Requires Shipping': 'TRUE',
                'Variant Taxable': 'TRUE',
                'Variant Barcode': '',
                'Image Src': '',
                'Image Position': '',
                'Image Alt Text': '',
                'Gift Card': '',
                'SEO Title': '',
                'SEO Description': '',
                'Google Shopping / Google Product Category': '',
                'Google Shopping / Gender': '',
                'Google Shopping / Age Group': '',
                'Google Shopping / MPN': '',
                'Google Shopping / AdWords Grouping': '',
                'Google Shopping / AdWords Labels': '',
                'Google Shopping / Condition': '',
                'Google Shopping / Custom Product': '',
                'Google Shopping / Custom Label 0': '',
                'Google Shopping / Custom Label 1': '',
                'Google Shopping / Custom Label 2': '',
                'Google Shopping / Custom Label 3': '',
                'Google Shopping / Custom Label 4': '',
                'Variant Image': '',
                'Variant Weight Unit': 'lb',
                'Variant Tax Code': '',
                'Cost per item': ''
              });
          }
        }
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
