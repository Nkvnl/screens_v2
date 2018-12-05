var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    imagePath1: {type: String, required: true},
    imagePath2: {type: String, required: true},
    imagePath3: {type: String, required: true},
    imagePath4: {type: String, required: true},
    title: {type: String, required: true},
    descriptionShort: {type: String, required: true},
    descriptionFull: {type: String, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model('Productpreview', schema);