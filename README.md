# Library Management System API

## Overview
This is the backend API for a library management application designed to manage users and book borrowing. The application allows users to borrow and return books, view book information, and rate books. It also includes functionality to manage user profiles, including borrowing history and current book borrowings.

For further details, 
- Refer to the [case description](https://github.com/yusufbayrakdar/library-management-api/blob/master/Invent_Analytics_Backend_Developer_Case.pdf)
- Once the API is running, access the Swagger documentation at http://localhost:3000/api-docs for Swagger

## Environment Variables
```
SERVICE_ENV=dev
SERVICE_PORT=3000
API_DB_URL=postgresql://postgres:<password>@localhost:5432/library-management-db
```

## Setup and Installation
### Install Dependencies
```
npm install
```
### Run Database Migrations
```
npm run migration:run
```

## Start in Development
```
npm run dev
```

## Run Tests
This project includes a comprehensive testing process to ensure the reliability and robustness of the API. The tests cover various scenarios and functionalities including Sunny Day Scenarios and Rainy Day Scenarios.
```
npm run test
```
