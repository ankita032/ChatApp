'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretFile');


passport.serializeUser((user,done) =>{
	done(null,user.id);
});

passport.deserializeUser((id,done) =>{
	User.findById(id,(err,user) => {
		done(err,user);
	});
});

passport.use(new GoogleStrategy({
	clientID: secret.google.clientID,
	clientSecret: secret.google.clientSecret,
	callbackURL: 'http://localhost:3000/auth/google/callback',
	passReqtoCallback: true

}, (req,accessToken,refreshToken,profile,done) => {
	User.findOne({googleId:profile.id}, (err,user) =>{
		if(err){
			return done(err);
		}

		if(user){
			return done(null,user);
		}else{
			const newUser = new User();
			//console.log(profile);
			newUser.google = profile.id;
			newUser.fullname = profile.displayName;
			newUser.username = profile.displayName;
			newUser.email = profile.emails[0].value;
			//console.log(newUser);
			newUser.userImage = profile._json.image.url;

			newUser.save((err) =>{
				return done(null,user);
				
			})
		}
	});
}));

