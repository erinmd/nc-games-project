# Northcoders House of Games API

## Hosted version

You can access the [hosted version here](https://nc-games-project-2obg.onrender.com/api/)

***
## Project summary

An API used for accessing application data for board games programmatically. 

***
##  Instructions to use
### Initial setup
1. Clone the repo
2. Create a new GitHub repo, do not initialise the project with a readme, .gitignore or license.
3. From your cloned local version of this project you'll want to push your code to your new repo using the following commands:
```
git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main
```
### Install dependencies
Use npm install to install all the dependencies

### Setup your .env files
You will need to create two.env files: `.env.test` and `.env.development`.

For each file add `PGDATABASE=<database_name_here>` with the correct database name for that environment (see `/db/setup.sql` for the database names)

### Seed the database
To initiate the database and seed, run the commands:
```
npm run setup-dbs
npm run seed
```
***
## Run tests
To run the tests use the command:
```
npm test <filename>
```
Or omit the filename to run all. The tests can be found in the `__tests__` directory
***
## Minimum requirements
Node v16

Postgres v14.6