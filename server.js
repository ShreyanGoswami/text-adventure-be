const express = require('express');
const bodyParser = require('body-parser');
const {Client} = require('pg')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

console.log(`Attempting to connect to database ${process.env.DATABASE_URL}`);
// client.connect();
console.log('Connected to database');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use((req,res,next) => {
    const origin = req.get('origin');
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

app.post('/user/result', (req, res, next) => {
    console.log('Received request to store user results');
    console.log('Received Data' + JSON.stringify(req.body));

    // for (let i=0;i<req.body.length;i++) {
    //     console.log('Attempting to add');
    //     // add(client, req.body[i]);
    // }

    res.sendStatus(201);
});

app.get('/', (req, res, next) => {
    res.sendStatus(200);
})

const add = (client, data) => {
    client.query(`INSERT INTO result VALUES (${data["playerId"]},${data["storyId"]},${data["answer"]},${data["status"]})`, (err, res) => {
        if (err) {
            console.log('Error while inserting values: ' + e);
        } else {
            console.log(`Data ${data} inserted successfully`);
        }
    })
}

app.listen(port, () => console.log('Application running on port ' + port));