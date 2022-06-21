const PgPromise = require("pg-promise")
const express = require('express');
const axios = require('axios');
var cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const pg = require('pg')
const Pool = pg.Pool;

const API = require('./api');
const app = express();

app.use(cors({credentials:true, origin: ['http://localhost:3010/', 'https://kimfrans.github.io']}))
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const config = {
// 	connectionString : process.env.DATABASE_URL || 'postgres://kimfr:kf0204@localhost:5432/heart_app',
// 	ssl: {rejectUnauthorized : false}

// }

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://kimfr:kf0204@localhost:5432/heart_app'
const pgp = PgPromise({});
// const db = pgp(DATABASE_URL);
// const db = pgp(config);
const db = pgp({connectionString: DATABASE_URL, 
			max:30,
		ssl: {rejectUnauthorized : false}
});

const PORT = process.env.PORT || 3010;

API(app, db);


app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});