const Post = require("../../models/PostSchema");
const cheachauth = require("../../util/cheackauth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getPost(_, { postId }) {
			try {
				const post = await Post.findById(postId);
				if (post) {
					return post;
				} else {
					throw new Error("post not found");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async createPost(_, { body }, context) {
			const user = cheachauth(context);

			if (body.trim() === "") {
				throw new Error("post must not be empty");
			}

			const newPost = new Post({
				body,
				user: user.id,
				username: user.username,
				createdAt: new Date().toISOString(),
			});
			const post = await newPost.save();
			context.pubsub.publish("newsPost", {
				newPost: post,
			});

			return post;
		},
		async deletePost(_, { postId }, context) {
			const user = cheachauth(context);
			try {
				const post = await Post.findById(postId);

				if (post.username === user.username) {
					await post.delete();
					return "post deleted";
				} else {
					throw new AuthenticationError("action is not allowed");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Subscription: {
		newsPost: {
			subscribe: (_, __, { req, pubsub }) => {
				pubsub.asyncIterator("newsPost");
			},
		},
	},
};
