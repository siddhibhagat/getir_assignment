const mongoose = require('mongoose');
const routes = require('./routes/records');
const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const app = express();

const port = process.env.PORT ||3000;

mongoose.connect('mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true')
  .then(() => console.log('Connected to DB..'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use('/', routes)

const server = app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});

module.exports = server;