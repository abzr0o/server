const express = require("express");
const dotenv = require("dotenv");
const { ApolloServer } = require("apollo-server-express");
const bodyparser = require("body-parser");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { makeExecutableSchema, PubSub } = require("apollo-server");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const mong = require("./mongoconnec");

dotenv.config();

const PORT = process.env.PORT || 4000;
const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});
const pubsub = new PubSub();
const startServer = async () => {
	const app = express();
	const apollo = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req }) => ({ req, pubsub }),
	});
	const server = createServer(app);

	app.disable("x-powered-by");

	app.use(bodyparser({ extended: true }));
	mong.connectToServer();

	apollo.applyMiddleware({ app });

	server.listen(PORT, () => {
		new SubscriptionServer(
			{ execute, subscribe, schema: schema },
			{ server: server }
		);
	});
	const s = SubscriptionServer.create(
		{ execute },
		{ path: "/graphql", server: app }
	);
};
startServer();
