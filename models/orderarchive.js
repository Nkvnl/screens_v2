var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Object, ref: 'user'},
    cart: {type: Object, required: true},
    paymentId:{ type:String, required: true},
    time:{ type:String, required: true},
});

module.exports = mongoose.model('orderArchive', schema);
