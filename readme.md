# wikitable2csv
A web tool to extract tables from Wiki pages and convert them to CSV. Use it online [here](https://wikitable2csv.ggor.de/).

## How to use
- Run the dev server
- Enter the URL of the Wikipedia page containing the table(s).
- Press "Convert".
- Copy the results to your clipboard or download it as CSV file.
- Put the CSV results into the google sheets spreadsheet (https://docs.google.com/spreadsheets/d/1hWU-xIQHR5fSL-WhjhpZ03f9Z-rLOzx8tqjktpyRVVE/edit#gid=1852788929)
- Import that spreadsheet into Airtable (have to do sheets -> airtable unless you want to pay money)
- Run the scripts in /scripts to populate the database with the airtable data

**Tip:** to use the data in Excel or similar spreadsheet applications paste the result from your clipboard into the first cell of your spreadsheet (or open the downloaded file). Set the delimiter character to "comma".

## License
[MIT](https://github.com/gambolputty/wikitable2csv/blob/master/LICENSE) © Gregor Weichbrodt
