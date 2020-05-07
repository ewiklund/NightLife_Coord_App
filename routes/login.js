const express = require("express");
const router = express.Router();
const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const User = require("../models/user");

passport.use(new TwitterStrategy({
	consumerKey: "tnCGpFRXKgPVc6iTzY8itt6UC",
	consumerSecret: "r7MwyM8I25h1YB8pwf4ewP8dhiaP8Tzy7sQLfHcsq0h8KSyeA8",
	callbackURL: "/login/authenticate"
}, (token, tokenSecret, profile, callback) => {
	
	let id = profile.id;
	let username = profile.username;
	let name = profile["displayName"];

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;

		// if user not already present, register user
		if (!user) {
			let newUser = new User({
				id: id,
				username: username,
				name: name
			});
			
			User.registerUser(newUser, (err, user) => {
				if (err) throw err;
				console.log("REGISTERED");
				console.log(user);
			});
			return callback(null, newUser);
		}
		else {
			return callback(null, user);
		}

	});
}));

passport.serializeUser((user, callback) => {
	callback(null, user);
});

passport.deserializeUser((obj, callback) => {
	callback(null, obj);
});

router.get("/", passport.authenticate("twitter"));

router.get("/authenticate", passport.authenticate("twitter", {
	failureRedirect: "/"
}), (req, res) => {
	console.log("USER ", req.user);
	res.redirect("/");
});

module.exports = router;