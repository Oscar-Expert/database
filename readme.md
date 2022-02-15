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
- It's okay to leave entries that say "EMPTY" for now. Fixed with first step in Airtable
#### Airtable
- Before anything, make sure you're aware whether you're inserting into LOCAL (development) or REMOTE (production) databases
- Import Google spreadsheet into Airtable CATEGORY table
- Complete CATEGORY data
    - Run [AT_COMPLETE_CATEGORY] to make sure it contains a unique id for every nominee
    - Helps you find nominee data for nominees that already exist
    - Then edit the data in the table manually until no EMPTY entries exist
- Validate CATEGORY data
    - Run [AT_VALIDATE_CATEGORY] to make sure it contains a unique id for every nominee
- Insert complete & validated CATEGORY data into _STAGING
    - Run [AT_INSERT_STAGING] to restructure data
    - Check that the data looks fine before moving into _PROD
- ONLY IF not already the same (check record length): Dplicate _PROD_LOCK data into _PROD
    - First, in AirTable, delete all entries in _PROD
    - Run [AT_DUPLICATE_LOCK_INTO_PROD]
    - Rationale: _PROD should initially be the exact same as _PROD_LOCK. That is the point of PROD. If something is inserted wrong here, it's okay. If something is inserted wrong into _PROD_LOCK, that would be an issue. Always delete _PROD and replenish with exact copy of _PROD_LOCK before adding new data to _PROD
- Insert _STAGING data into _PROD
    - Run [AT_INSERT_PROD] to duplicate _STAGING into _PROD
    - Give it a minute to run through everything
- Validate _PROD data
    - Run [AT_VALIDATE_PROD_1] AND ALL 4 VALIDATE SCRIPTS to make sure the unique values and names for films and nominees are always the same. If they're not, you'll see a console.log
    - Make corrections directly in _PROD_LOCK
2 options: 
- 1) Insert validated, FINAL data into _PROD_LOCK
    - Note: you could do this step, or you could do the ALT step below instead
    - Before, manually delete all data in _PROD_LOCK. This is why _PROD must be 100% good
    - Run [AT_INSERT_PROD_LOCK] to duplicate _PROD into _PROD_LOCK
    - Should never change the data in _PROD_LOCK directly
- 2) More efficient way to do this is to think of _PROD as a validator for _STAGING the way it is now. Once the staging data is good and validated with the _PROD data, we can just insert the _STAGING directly into _PROD_LOCK so it doesn't take forever
    - Run [AT_INSERT_STAGING_INTO_PROD_LOCK]
- Note: IF you never altered _PROD_LOCK, you should be able to keep _PROD the same as well, since it has the same data as _PROD_LOCK
#### Insert Into Databse
1) Option to erase ALL data in production and replace it with _PROD_LOCK
- First, delete all entries from database
    - Run [DB_DELETE_ALL]
- If running a migration is necessary, run [DB_RESET]
- Insert the data
    - Run [DB_INSERT]
2) Option to insert only the _STAGING data IF YOU ARE CERTAIN IT HAS BEEN VALIDATED IN _PROD
- Run [DB_STAGING_INSERT]
- Note: if you fuck up here, you'll have to do the first option and delete everything

**Tip:** to use the data in Excel or similar spreadsheet applications paste the result from your clipboard into the first cell of your spreadsheet (or open the downloaded file). Set the delimiter character to "comma".

## License
[MIT](https://github.com/gambolputty/wikitable2csv/blob/master/LICENSE) © Gregor Weichbrodt
