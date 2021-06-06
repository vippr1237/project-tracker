const loadExpress = require('./config/express');
require('dotenv').config();
const mongoose = require('mongoose');
const server = loadExpress();

mongoose.connect(process.env.MONGODB_URI, 
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, function(err) {
    if (err) {
        console.log(err);
    }
    console.log("Connected to MongoDB")
});

server.listen(process.env.PORT || 6969, () => {
    console.log("Listening on port 6969")
})