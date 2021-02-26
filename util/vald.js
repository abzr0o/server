module.exports.validateRegisterInput = (
	username,
	email,
	password,
	confirmpassword
) => {
	const err = {};
	if (username.trim() === "") {
		err.username = "username must not be empty";
	}
	if (email.trim() === "") {
		err.email = "email must not be empty";
	} else {
		const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
		if (!email.match(regEx)) {
			err.email = "email must be valid";
		}
	}
	if (password === "") {
		err.password = "password must not be empty";
	} else if (password !== confirmpassword) {
		err.confirmpassword = "password should match";
	}
	return {
		err,
		valid: Object.keys(err).length < 1,
	};
};

module.exports.validateLoginInput = (username, password) => {
	const err = {};
	if (username.trim() === "") {
		err.username = "username must not be empty";
	}
	if (password === "") {
		err.password = "password must not be empty";
	}
	return {
		err,
		valid: Object.keys(err).length < 1,
	};
};
