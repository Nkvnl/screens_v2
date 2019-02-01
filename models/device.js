var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    title: String,
    viewport: String,
    popularity: Number,
    img: String,
    date: String
});

module.exports = mongoose.model('Devices', schema);