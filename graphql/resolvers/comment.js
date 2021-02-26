const Post = require("../../models/PostSchema");
const { UserInputError, AuthenticationError } = require("apollo-server");
const cheacAuth = require("../../util/cheackauth");

module.exports = {
	Mutation: {
		async createcomment(_, { postId, body }, context) {
			const user = cheacAuth(context);
			if (body.trim() === "") {
				throw new UserInputError("empty comment", {
					errors: {
						body: "comment body must not be empty",
					},
				});
			}
			const post = await Post.findById(postId);

			if (post) {
				post.comments.unshift({
					body,
					username: user.username,
					CreatedAt: new Date().toISOString(),
				});
				await post.save();
				return post;
			} else throw new UserInputError("Post not found");
		},
		async deletecomment(_, { postId, commentId }, context) {
			const { username } = cheacAuth(context);
			const post = await Post.findById(postId);

			if (post) {
				const commentIndex = post.comments.findIndex((c) => c.id === commentId);

				if (post.comments[commentIndex].username === username) {
					post.comments.splice(commentIndex, 1);
					await post.save();
					return post;
				} else {
					throw new AuthenticationError("action not allowed");
				}
			} else {
				throw new UserInputError("post not found");
			}
		},
		async likePost(_, { postId }, context) {
			const { username } = cheacAuth(context);
			const post = await Post.findById(postId);
			if (post) {
				if (post.likes.find((like) => like.username === username)) {
					post.likes = post.likes.filter((like) => like.username !== username);
				} else {
					post.likes.push({
						username,
						CreatedAt: new Date().toISOString(),
					});
				}
				await post.save();
				return post;
			} else {
				throw new UserInputError("post not found");
			}
		},
	},
};
