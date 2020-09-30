const { json } = require('express');
// CONSTANTS

const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.port || 3000
const database = require('./database')
const bodyParser = require('body-parser')
const moment = require('moment');
const { deleteLog } = require('./database');

moment.locale("en-US")
app.use(bodyParser())
app.use(cors())

app.post('/api/log', async (req, res) => {
    let jsonreturn;
    // timestamp <date> - user's email -> please see readme on instructions 
    let timestamp = req.body.timestamp
    let log_type = req.body.log_type
    await database.log(log_type)
        .then(result => {
            jsonreturn = JSON.parse(JSON.stringify({"success": true, "message": "created"}))
        })
        .catch(error => {
            jsonreturn = JSON.parse(JSON.stringify({"success": false, "message": "failed"}))
        })
    res.json(jsonreturn)
});

app.get('/api/logs', async (req, res) => {
    let jsonreturns;
    await database.all()
        .then(results => {
            jsonreturns = JSON.parse(JSON.stringify(results))
        })
        .catch(error => {
            jsonreturn = JSON.parse(JSON.stringify(error))
        })
    for (let ctr in jsonreturns) {
        jsonreturns[ctr].timestamp = moment(jsonreturns[ctr].timestamp, "x").format('YYYY-MM-DD HH:mm:ss')
    }
    res.json(jsonreturns)
});

app.delete('/api/logs/:id', async (req, res) => {
    let returnjson;
    await database.deleteLog(req.params.id)
        .then(result => {
            jsonreturn = JSON.parse(JSON.stringify({"success": true, "message": "deleted"}))
        })
        .catch(error => {
            jsonreturn = JSON.parse(JSON.stringify({"success": false, "message": "failed"}))
        })
    res.json(jsonreturn)
})

app.listen(port, () => console.log('Countdown is now actively listening at port '+port))
