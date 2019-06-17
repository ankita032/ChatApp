
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const userSchema = new Schema({
	username: {type: String, unique: true},
	fullname: {type:String, default: ''},
	email: {type: String, unique: true},
	password: {type: String, default: ''},
	userImage: {type:String, default: 'default.png'},
	facebook: {type:String, default: ''},
	fbTokens: Array,
	google: {type:String, default:''},
	sentRequest: [{
		userName: {type:String, default:''}
	}],
	request: [{
		userID :{type: mongoose.Schema.Types.ObjectId, ref:'User'},
		username: {type: String, default:''}
	}],
	friendList: [{
		friendId: {type: mongoose.Schema.Types.ObjectId, ref:'User' },
		friendName: {type: String, default: ''}
	}],
	totalRequest: {type: Number, default: 0}
});


userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
};

userSchema.methods.validUserPassword = function(password) {
	return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User', userSchema);