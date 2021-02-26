const userResolvers = require("./users");
const PostResolvers = require("./post");
const commentResolvers = require("./comment");

module.exports = {
	Post: {
		likesC: (parent) => parent.likes.length,

		comC: (parent) => parent.comments.length,
	},
	Query: {
		...PostResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...PostResolvers.Mutation,
		...commentResolvers.Mutation,
	},
	Subscription: {
		...PostResolvers.Subscription,
	},
};
