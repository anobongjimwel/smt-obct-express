// CONSTANTS
const mdb = require('mongodb')
const mongo = require('mongodb').MongoClient
var mongourl = "mongodb://localhost:27017"
var mongoopts = { useUnifiedTopology: true }

module.exports = {
    log: log,
    all: all,
    deleteLog: deleteLog
}

async function log(status) {
    return new Promise((resolve, reject) => {
        mongo.connect(mongourl, mongoopts, (err, con) => {
            if (err) {
                reject(err);
            }
            db = con.db('smt-obct-db')
            var logData = {
                timestamp: Date.now(),
                log_type: status
            }
            db.collection('logs').insertOne(logData, (err, result) => {
                if (err !== null) {
                    return reject(JSON.stringify({}))
                } else {
                    db.collection('logs').find({}, {projection: {_id:0}}).sort({timestamp: -1}).limit(1).toArray(function(err, result) {
                        if (err !== null) {
                            return reject(false)
                        } else {
                            return resolve(true)
                        }
                    })
                }
            })
        })
    });
}

async function all() {
    return new Promise((resolve, reject) => {
        mongo.connect(mongourl, mongoopts, (err, con) => {
            if (err) {
                reject(err);
            }
            db = con.db('smt-obct-db')
            db.collection('logs').find({}).sort({timestamp: -1}).toArray(function(err, result) {
                if (err !== null) {
                    return reject({})
                } else {
                    return resolve(result)
                }
            })
        })
    })
}

function deleteLog(id) {
    return new Promise((resolve, reject) => {
        mongo.connect(mongourl, mongoopts, (err, con) => {
            if (err) {
                reject(err);
            }
            db = con.db('smt-obct-db')
            var query = {"_id": mdb.ObjectId(id) }
            db.collection('logs').deleteOne(query, function(err, result){
                if (err) reject(false)
                return result.result.n === 1 ? resolve(true) : reject(false)
            })
        })
    })
}
