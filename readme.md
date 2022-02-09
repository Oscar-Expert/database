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
    - Check that the data looks fine before moving into _PROD
- Delete _PROD data and duplicate _PROD_LOCK data into _PROD
    - In AirTable, delete all entries in _PROD
    - Run [AT_DUPLICATE_LOCK_INTO_PROD]
    - Rationale: _PROD should initially be the exact same as _PROD_LOCK. That is the point of PROD. If something is inserted wrong here, it's okay. If something is inserted wrong into _PROD_LOCK, that would be an issue. Always delete _PROD and replenish with exact copy of _PROD_LOCK before adding new data to _PROD
- Insert _STAGING data into _PROD
    - Run [AT_INSERT_PROD] to duplicate _STAGING into _PROD
    - Give it a minute to run through everything
- Validate _PROD data
    - Run [AT_VALIDATE_PROD] to make sure the unique values and names are always 1:1, and if they're not, you'll see a console.log
    - Make corrections directly in _PROD_LOCK
- Insert validated, FINAL data into _PROD_LOCK
    - Note: you could do this step, or you could do the ALT step below instead
    - Before, manually delete all data in _PROD_LOCK. This is why _PROD must be 100% good
    - Run [AT_INSERT_PROD_LOCK] to duplicate _PROD into _PROD_LOCK
    - Should never change the data in _PROD_LOCK directly
- ALT / better way to do this is to think of _PROD as a validator for _STAGING the way it is now. But once the staging data is good and validated with the _PROD_LOCK data, we can just insert the _STAGING directly into _PROD_LOCK so it doesn't take forever
    - Run [AT_INSERT_STAGING_INTO_PROD_LOCK]
- At this point, feel free to delete whatever data is in _STAGING
    - IF you never altered _PROD_LOCK, you should be able to keep _PROD the same as well, since it has the same data as _PROD_LOCK
#### Insert Into Databse
- First, delete all entries from database
    - Run [DB_DELETE_ALL]
- If running a migration is necessary, run [DB_RESET]
- Insert the data
    - Run [DB_INSERT]

**Tip:** to use the data in Excel or similar spreadsheet applications paste the result from your clipboard into the first cell of your spreadsheet (or open the downloaded file). Set the delimiter character to "comma".

## License
[MIT](https://github.com/gambolputty/wikitable2csv/blob/master/LICENSE) © Gregor Weichbrodt
