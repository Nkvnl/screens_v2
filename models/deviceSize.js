var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    brand: String,
    type: String,
    viewport: String,
    popularity: String,
    logo: String,
    img: String
});

module.exports = mongoose.model('DevicesSize', schema);