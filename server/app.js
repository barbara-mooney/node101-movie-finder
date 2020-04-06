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
    //check if the query has an 'i'
    if (req.query.i) {
        //if it's an i, checks if it's in the cache to send the data.
        if (req.query.i in cache) {
            res.send(cache[req.query.i]);
        } else {
            //it's not in the cache so it makes the API call with Axios.
            axios({
                url: `http://omdbapi.com/?i=${req.query.i}&apikey=${APIKEY}`,
                method: 'get'
            })
            .then((response) => {
                //saves data on cache and send response back to client.
                cache[req.query.id] = response.data;
                res.send(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
        } 
    //same process as a above but for t (title) 
    } else if (req.query.t) {
        if (req.query.t in cache) {
            res.send(cache[req.query.t]);
        } else {
            axios({
                url: `http://www.omdbapi.com/?apikey=${APIKEY}&t=${req.query.t}`,
                method: 'get'
            })
            .then((response) => {
                cache[t] = response.data;
                res.send(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        }
    }
);

module.exports = app;