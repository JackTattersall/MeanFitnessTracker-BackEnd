const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./api/models/users');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Mongo environments set-up -------------------------------------------------------------------------------------------
mongoose.Promise = global.Promise;
const password = process.env.MONGO_PASSWORD;
console.log(password);

if(process.env.NODE_ENV === 'test') {
    mongoose.connect(`mongodb://fitness_tracker_mongo:${password}@fitnesstrackertest-shard-00-00-qu60p.mongodb.net:27017,fitnesstrackertest-shard-00-01-qu60p.mongodb.net:27017,fitnesstrackertest-shard-00-02-qu60p.mongodb.net:27017/fitness_tracker?ssl=true&replicaSet=FitnessTrackerTest-shard-0&authSource=admin`)
}

if(process.env.NODE_ENV === 'production') {
    mongoose.connect(`mongodb://fitness_tracker_mongo:${password}@ds159963.mlab.com:59963/fitness_tracker`);
}

//----------------------------------------------------------------------------------------------------------------------

const routes = require('./api/routes/routes');
routes(app);

app.listen(process.env.PORT || 8080, () => {
    console.log('App now running on port 8080');
});

module.exports = app;
