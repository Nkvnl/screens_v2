var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
        mainImage: {type: String, required: true},
        mainTitle: {type: String, required: true},
        mainParagraph: {type: String, required: true},
        gradient:{type:String},
        link:{type: String}
});

module.exports = mongoose.model('Title', schema);