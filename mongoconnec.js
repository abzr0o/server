const mongo = require("mongoose");

module.exports = {
	connectToServer: () => {
		mongo.connect(
			process.env.Mongo_db,
			{ useUnifiedTopology: true, useNewUrlParser: true },
			() => {
				console.log("we are connected to db");
			}
		);
	},
};
