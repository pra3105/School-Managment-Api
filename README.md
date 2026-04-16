# 🏫 School Management API

## 📌 Overview

This project is a Node.js + Express + MySQL API that allows:

* Adding new schools
* Listing schools sorted by proximity

## 🚀 Tech Stack

* Node.js
* Express.js
* MySQL
* dotenv

## 📡 API Endpoints

### ➤ Add School

* **POST** `/addSchool`
* Payload:

```json
{
  "name": "ABC School",
  "address": "Ahmedabad",
  "latitude": 23.0225,
  "longitude": 72.5714
}
```

### ➤ List Schools

* **GET** `/listSchools?latitude=23.02&longitude=72.57`

## ⚙️ Setup

```bash
npm install
node src/config/initDb.js
node src/app.js
```

## 🌐 Status

Project ready for deployment on AWS (EC2 + RDS)
