
var parser = {};

const MOVIE_COLUMN = 5; // likely 1 or 3

function parseCell (cellItem) {

  // first: remove invisible elements in cells
  var every_el = cellItem.querySelectorAll('*');
  for (var i = 0; i < every_el.length; i++) {
    var el = every_el[i];
    if (el.style.display == 'none' || getComputedStyle(el, 'display') == 'none') {
      el.parentNode.removeChild(el);
    }
  }

  var line = cellItem.textContent || cellItem.innerText;
  if (this.options.trim === true) {
    line = line.trim();
  }
  if (this.options.remove_n === true) {
    line = line.replace(/\r?\n|\r/g, ' ');
  }

  // escape double quotes in line
  if (/\"/.test(line)) {
    line = line.replace(/\"/g, '""');
  }

  // put line in double quotes
  // if line break, comma or quote found in line
  if (/\r|\n|\"|,/.test(line)) {
    line = '"' + line + '"';
  }

  return line;
}

/*
  Return maximum number of columns
 */
function getMaxColumns (rows) {  
  var result = 0
  for (var i = 0, l = rows.length; i < l; i++) {
    let count = rows[i].children.length;
    if (count > result) {
      result = count
    }
  }
  return result
}

parser.parseTable = function (element) {
  var result = '';
  var rows = element.querySelectorAll('tr');
  // get maximum number of cols
  var colsCount = getMaxColumns(rows);
  var rowsLen = rows.length;
  var allSpans = {};


  // loop tr
  for (var rowsIdx = 0; rowsIdx < rowsLen; rowsIdx++) {
    var row = rows[rowsIdx];
    var csvLine = [];
    // var csvLines = [];
    var cells = row.querySelectorAll('th, td');
    var spanIdx = 0;
    var color = row.getAttribute('style');
    var winner = false;

    if (![null, 'background:#eee;'].includes(color)) {
        winner = true;
    }

    // loop cells
    for (var cellIdx = 0; cellIdx < colsCount; cellIdx++) {
      var cell = cells[cellIdx];
      var colSpan = 1;
      var rowSpan = 1;

      if (typeof cell !== 'undefined') {
        // If colored, set winner to true
        color = cell.getAttribute('style');
        if (![null, 'background:#eee;'].includes(color)) {
          winner = true;
        }

        // get rowSpan & colSpan attr
        var attr1 = cell.getAttribute('rowSpan')
        if (attr1) {
          rowSpan = parseInt(attr1);
        }
        var attr2 = cell.getAttribute('colSpan')
        if (attr2) {
          colSpan = parseInt(attr2);
        } 
    }

      // loop colSpan, set rowSpan value
      for (var j = 0; j < colSpan; j++) {
        // let yearRow = false;
        // check if there is a cell value for this index (set earlier by rowspan)
        while (allSpans.hasOwnProperty(spanIdx.toString())) {
          // spanIdx.toString is always zero?
          var val = allSpans[spanIdx.toString()][1];
        //   console.log('val',val.slice(0, 4)) // thihs coomes out normal . it's being pushed elsewhere
          // val is the values in first column (2011(84th))
          // But it's logging it a number of times so I think it's keeping track of how many cells that left column covers
          if (val[0] !== '[') {
            csvLine.push(val.slice(0, 4)); // pushing the YEAR
            // yearRow = true;
          }
          // decrease by 1 and remove if all rows are covered
          allSpans[spanIdx.toString()][0] -= 1;
          if (allSpans[spanIdx.toString()][0] == 0) {
            delete allSpans[spanIdx.toString()];
          }
          spanIdx += 1;
        }
        
        // parse cell text
        // don't append if cell is undefined at current index
        if (typeof cell !== 'undefined') {
          // This operation does this.cell
          var cellText = parseCell.call(this, cell);
        //   console.log('cellText',cellText)
          // Doesn't make cell from lines that start with [ or #, and trims year rows that say (34th)
          if (cellText[0] === '['  || cellText[0] === '#') {
             break; // do nothing
          } else if ((cellText[4] === '(' && cellText[9] === ')') || (cellText[5] === '(' && cellText[10] === ')')) {
              // if a year row, don't push the href for the year, and truncate it
             csvLine.push(cellText.slice(0, 4));
             break;
          } 
          var links = cell.querySelectorAll('a'); // gives you a noded list
        //   console.log('links',links)
          
        // a is a list of the different entries in a cell.
        // if it's a movie column we don't want it to parse that for commas or "and"
        console.log('cellText',cellText)
        console.log('csvLine.length',csvLine.length)
          const a = csvLine.length === MOVIE_COLUMN
            ? cellText
                .replace(/\\/g, '').replace(/"/g,"")
                .split('????')
                .reduce((acc, cur) => {
                const trimmed = cur.trim();
                if (trimmed.length > 0) {
                    acc.push(trimmed);
                }
                return acc;
                }, [])
            : cellText
              .replace(/\\/g, '').replace(/"/g,"")
              .split(/(?:,| and |&)+/)
              .reduce((acc, cur) => {
                const trimmed = cur.trim();
                if (trimmed.length > 0) {
                    acc.push(trimmed);
                }
              return acc;
          }, [])
        //   console.log('a',a)
          // console.log('cellText',cellText) // just everything

          // an hrefs object where the keys are the names
          var hrefs = {} // { 'Chloe Zhao': '/wiki/Chloe_Zhao' }
          // create the hrefs object keys
          a.forEach((text) => {
            // console.log('text',text)
            if (typeof text === 'string') text.trim();
            hrefs[text] = 'EMPTY'
          })
        //   console.log('hrefs prior',hrefs)
          // create the hrefs object values
          for (let i=0; i<links.length; i++) {
            if (links[i]) {
                // console.debug('links',links[i].getAttribute('href')) // Gives HREF
                let href = links[i].getAttribute('href')
                let innerText = links[i].innerHTML;
                if (typeof innerText === 'string') innerText.trim();
                let possibleInnerText = links[i].getAttribute('title')
                if (typeof possibleInnerText === 'string') possibleInnerText.trim();
                if (innerText in hrefs) {
                    hrefs[innerText] = href
                } else if (possibleInnerText in hrefs) {
                    hrefs[possibleInnerText] = href
                }
            }
          }

          let keyString = ''; // names
          let valueString = ''; // hrefs

          Object.keys(hrefs).forEach((key) => {
            // console.log('keyString',keyString)
            // console.log('key',key)
              if (keyString === '') {
                keyString += key;
              } else {
                keyString += ' & ' + key;
              }
          })
          Object.values(hrefs).forEach((value) => {
            if (valueString === '') {
                valueString += value;
            } else {
                valueString += ' & ' + value;
            }
          })
        //   console.log('keyString',keyString)
        //   console.log('valueString',valueString)
          // gets rid of cells like /wiki/79th_Golden_Globe_Awards
          const firstNumber = parseInt(valueString[6])
          const slice1 = valueString.slice(8,11)
          const slice2 = valueString.slice(7,10)
          const suffixes = ['rd_', 'th_', 'st_', 'nd_']
          if (
                !isNaN(firstNumber) && 
                suffixes.includes(slice1) || suffixes.includes(slice2)
            ) { 
                csvLine.push(keyString.trim());
          } else {
            csvLine.push(keyString.trim());
            csvLine.push(valueString.trim());
          }
          //LEGACY: This is now being dnoe before we pparse the hrefs. Keeping commented out in case we need any former logic
        //   // Doesn't make cell from lines that start with [ or #, and trims year rows that say (34th)
        //   if (cellText[0] === '['  || cellText[0] === '#') {
        //     // do nothing
        //   } else if ((cellText[4] === '(' && cellText[9] === ')') || (cellText[5] === '(' && cellText[10] === ')')) {
        //       // if a year row, don't push the href for the year, and truncate it
        //     csvLine.push(cellText.slice(0, 4));
        //   } else {
        //       // This check is only for song
        //     // if (cellText[0] !== '"') {
        //         // const text = cellText.replace('(music)', '&').replace('(music & lyrics)', '').replace('(lyrics)','').replace(';','')
        //         csvLine.push(cellText);
        //         csvLine.push(hrefs);
        //     // }
        //     // FOR PRODUCTION DESIGN ONLY -- ELSE DO ONLY THE "ELSE"
        //     // if (csvLine.length >= 5) {
        //     //     csvLine[3] = csvLine[3] += (' & ' + cellText)
        //     //     csvLine[4] = csvLine[4] += (' & ' + hrefs)
        //     // } else {
        //     //     csvLine.push(cellText);
        //     //     csvLine.push(hrefs);
        //     // }
        //   }
        //   console.log('csvLine',csvLine)
        }
        if (rowSpan > 1) {
          allSpans[spanIdx.toString()] = [rowSpan - 1, cellText];
        }
        spanIdx += 1;

      }
    }
    csvLine.push(winner);
    result += csvLine.join("\t") + '\n'; // normally for a csv (comma separated values) you parse commas but I'm creating a tsv separated by tabs
  }
  return result
}

export default parser;