# wikitable2csv
A web tool to extract tables from Wiki pages and convert them to CSV. Use it online [here](https://wikitable2csv.ggor.de/).

## How to use

#### Scraping Data
- Run the dev server
- Enter the URL of the Wikipedia page containing the table(s).
- Press "Convert".
- Copy the results to your clipboard or download it as CSV file.
- Put the CSV results into the google sheets spreadsheet and edit errors
    - https://docs.google.com/spreadsheets/d/1hWU-xIQHR5fSL-WhjhpZ03f9Z-rLOzx8tqjktpyRVVE/edit#gid=1852788929
#### Airtable
- Import Google spreadsheet into Airtable CATEGORY table
            xxx - Insert data from spreadsheet into database from Airtable
                xxx - Run the DB_INSERT_TABLE script and manually set the CATEGORY and AWARDS_BODY
                    xxx - Also validates your entry. If invalid, make sure to run DB_DELETE_ALL before correcting and running DB_INSERT_TABLE again
- Validate CATEGORY data
    - Run [AT_VALIDATE_CATEGORY] to make sure it contains a unique id for every nominee
- Insert validated CATEGORY data into _STAGING
    - Run [AT_INSERT_STAGING] to restructure data
    - Check that the data looks fine before moving into _PROD_LOCK
- Insert validated, structured data into _PROD
    - Run [AT_INSERT_PROD] to duplicate _STAGING into _PROD_LOCK
    - NOTE: _PROD should initially be the exact same as _PROD_LOCK. That is the point of PROD. If something is inserted wrong here, it's okay. If something is inserted wrong into _PROD_LOCK, that would be an issue
- Validate _PROD data
    - Run [AT_VALIDATE_PROD] to make sure the unique values and names are always 1:1, and if they're not, you'll see a console.log
    - Make corrections directly in _PROD_LOCK
- Insert validated, FINAL data into _PROD_LOCK
    - Before, manually delete all data in _PROD_LOCK
    - Run [AT_INSERT_PROD_LOCK] to duplicate _PROD into _PROD_LOCK
    - Should never cange the data in _PROD_LOCK directly
- At this point, feel free to delete whatever data is in _STAGING
#### Insert Into Databse
- First, delete all entries from database
    - Run [DB_DELETE_ALL]
- If running a migration is necessary, run [DB_RESET]
- Insert the data
    - Run [DB_INSERT]

**Tip:** to use the data in Excel or similar spreadsheet applications paste the result from your clipboard into the first cell of your spreadsheet (or open the downloaded file). Set the delimiter character to "comma".

## License
[MIT](https://github.com/gambolputty/wikitable2csv/blob/master/LICENSE) © Gregor Weichbrodt
