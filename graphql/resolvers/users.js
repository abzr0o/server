const User = require("../../models/UserSchema");
const byc = require("bcrypt");
const jwt = require("jsonwebtoken");

const { UserInputError } = require("apollo-server");

const {
	validateRegisterInput,
	validateLoginInput,
} = require("../../util/vald");
const { serct } = require("../../jscongif");

function genToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		serct,
		{ expiresIn: "1h" }
	);
}

module.exports = {
	Mutation: {
		async login(_, { username, password }) {
			const { valid, err } = validateLoginInput(username, password);
			const user = await User.findOne({ username });
			if (!valid) {
				throw new UserInputError("errors", { err });
			}
			if (!user) {
				err.generil = "user not found";
				throw new UserInputError("user not found", { err });
			}
			const match = await byc.compare(password, user.password);
			if (!match) {
				err.generil = "wrong credetials";
				throw new UserInputError("wrong credetials", { err });
			}
			const token = genToken(user);
			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
		async register(
			_,
			{ registerInput: { username, password, conformPassword, email } }
		) {
			const { valid, err } = validateRegisterInput(
				username,
				email,
				password,
				conformPassword
			);
			if (!valid) {
				throw new UserInputError("errors", { err });
			}
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError("user name is taken", {
					errors: { username: "this user is taken" },
				});
			}
			password = await byc.hash(password, 12);
			const newUser = new User({
				email,
				username,
				password,
				createAt: new Date().toISOString(),
			});

			const res = await newUser.save();

			const token = genToken(res);

			return {
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
};
