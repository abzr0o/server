const { model, Schema } = require("mongoose");

const PostSchema = new Schema({
	body: String,
	username: String,
	createdAt: String,
	comments: [
		{
			body: String,
			username: String,
			CreatedAt: String,
		},
	],
	likes: [
		{
			username: String,
			CreatedAt: String,
		},
	],
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
	},
});

module.exports = model("Posts", PostSchema);
