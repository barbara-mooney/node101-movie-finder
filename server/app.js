require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const APIKEY = process.env.APIKEY;
const cron = require('node-cron');

const app = express();
let cache = {};

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Schedules a task to erase de cache every 24 hours.
cron.schedule('59 23 * * *', () => {
    console.log('Erasing cache');
    cache = {};
});


app.get('/', (req, res) => {
    console.log(req);
    //check if the query has an 'i'
    if (req.query.i) {
        //if it's an i, checks if it's in the cache to send the data.
        if (req.query.i in cache) {
            res.send(cache[req.query.i]);
        } else {
            //it's not in the cache so it makes the API call with Axios.
            axios.get(`http://omdbapi.com/?i=${req.query.i}&apikey=${APIKEY}`)
            .then((response) => {
                //saves data on cache and send response back to client.
                cache[req.query.i] = response.data;
                res.status(200).send(response.data);
            })
            .catch((err) => console.log(err));
        } 
    //same process as a above but for t (title) 
    } else if (req.query.t) {
        let t = encodeURIComponent(req.query.t);
        if (t in cache) {
            res.status(200).send(cache[t]);
        } else {
            axios.get(`http://www.omdbapi.com/?apikey=${APIKEY}&t=${t}`)
            .then((response) => {
                cache[t] = response.data;
                res.status(200).send(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        }
    }
);

module.exports = app;