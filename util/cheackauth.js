const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const { serct } = require("../jscongif");

module.exports = (context) => {
	const authHead = context.req.headers.authorization;
	if (authHead) {
		const token = authHead.split("bearer ")[1];
		if (token) {
			try {
				const user = jwt.verify(token, serct);

				return user;
			} catch (err) {
				throw new AuthenticationError("invalid/expired token");
			}
		}
		throw new Error("authentication token must be 'bearer [token]'");
	}
	throw new Error("authorization header must be provided");
};
