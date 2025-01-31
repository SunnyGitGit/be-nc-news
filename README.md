# Northcoidrs News
## Project Overview
This project is a RESTful API designed to manage articles, topics, users, and comments. It provides endpoints for CRUD(Create, Read, Update, Delete) operations and various query parameters.

## Hosted Version
To access the hosted version: link to the hosted version

## Getting Started
### Clonging the Repository
To start working with this project, clone the repository using the following command: 
    git clone https://github.com/SunnyGitGit/be-nc-news

### Installing Dependencies
To install the dependencies, use the following command:
    npm install

### Setting Up Environment Variables
To set up the environment variables, create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

### Seeding the Local Database
To seed local database, run the following command:
    npm run seed

### Running Tests
To run the tests, use the following command:
    npm test


## Minimun Requirements
- Node.js: requires Node.js version 14.x or higher
- PostgreSQL: recommands PostgreSQL version 12.x or higher


## API Endpoints
### GET /api 
- be available on /api
- make all other endpoints available


### GET /api/topics
- returns a list of all topics
- error handling to catch any server errors (500)


### GET /api/articles
- returns a list of all articles
- supports query parameters for sorting and filtering by topic
- error handling for cases involving invalid/not-exists order/sort_by/topic (400, 404)


### GET /api/users
- returns a list of all users
- error handling to catch any server errors (500)


### GET /api/articles/:article_id
- returns an article by its ID
- returns an article including the comment-count
- error handling for cases involving invalid/not-exists aritlcle IDs (400, 404)


### GET /api/articles/:article_id/comments
- returns comments for a specific article by its ID
- returns an empty array if no comments are associated with the specified article
- error handling for cases involving invalid/not-exists article ID (400, 404)


### POST /api/articles/:article_id/comments
- addes a new comment to a specific article by its ID
- error handling for cases involving invalid/not-exists aritlcle IDs (400, 404)


### PATCH /api/articles/:article_id
- updates a specific article by its ID
- error handling for cases involving invalid/not-exists aritlcle IDs (400, 404)


### DELETE /api/comments/:comment_id
- removes a comment by its ID
- error handling for cases involving invalid/not-exists comment IDs (400, 404)

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
