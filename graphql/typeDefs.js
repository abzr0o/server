const { gql } = require("apollo-server");

module.exports = gql`
	type Post {
		id: ID!
		username: String!
		body: String!
		createdAt: String!
		comments: [Comment]!
		likes: [Like]!
		likesC: Int!
		comC: Int!
	}
	type Comment {
		id: ID!
		body: String!
		username: String!
		CreatedAt: String!
	}
	type Like {
		id: ID!
		username: String!
		CreatedAt: String!
	}
	type User {
		id: ID!
		username: String!
		token: String
		email: String!
		createAt: String
	}
	input RegisterInput {
		username: String!
		password: String!
		conformPassword: String!
		email: String!
	}
	type Query {
		getPosts: [Post!]
		getPost(postId: ID!): Post!
	}
	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		createPost(body: String!): Post!
		deletePost(postId: ID!): String
		createcomment(postId: ID!, body: String!): Post!
		deletecomment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post!
	}
	type Subscription {
		newsPost: Post!
	}
`;
