const express = require('express');
const bodyParser = require('body-parser');
const {Client} = require('pg')
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect();

app.use(cors({
    origin:'*'
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.post('/user/result', (req, res, next) => {
    console.log('Received request to store user results');
    console.log('Received Data' + JSON.stringify(req.body));

    for (let i=0;i<req.body.length;i++) {
        console.log('Attempting to add');
        add(client, req.body[i]);
    }

    res.sendStatus(201);
});

app.get('/', (req, res, next) => {
    res.sendStatus(200);
})

const add = (client, data) => {
    const query = `INSERT INTO result (player_id,story_id,answer,status) VALUES (${data["playerId"]},${data["storyId"]},${data["answer"]},${data["status"]})`
    console.log(`Query ${query}`);
    client.query(query, (err, res) => {
        if (err) {
            console.log(`Error while inserting values: ${err}`);
        } else {
            console.log(`Data ${JSON.stringify(data)} inserted successfully`);
        }
    })
}

app.listen(port, () => console.log('Application running on port ' + port));