var mongoose = require('mongoose');

module.exports = mongoose.model('Task', {
    title : {type : String, default: ''},
	description : {type : String, default: ''},
	createdOn : {type : String, default: new Date().toString()},
	active : {type : Boolean, default: true},
	complete : {type : Boolean, default: false},
	deleted : {type : Boolean, default: false}
});