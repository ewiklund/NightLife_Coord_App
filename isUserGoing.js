const express = require("express");
const router = express.Router();
const User = require("../models/user");

// returns whether the current logged in user is going to the bar with given id
router.use("/id", (req, res) => {
	let id = req.url.substring(1, req.url.length);

	if (!req.user) {
		res.end("not going");
	}
	else {
		User.getUserByUsername(req.user.username, (err, user) => {
			if (err) throw err;

			let response = false;
			if (user != null) {
				let going = user.going;

				for (let i in going) {
					if (going[i]["res_id"] == id) {
						response = true;	
						break;					
					}
				}
			}
			if (response == true) {
				res.end("going");
			}
			else {
				res.end("not going");
			}
		});	
	}

	
});

module.exports = router;