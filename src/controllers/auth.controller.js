import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
	// Validate incoming request
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			status: "fail",
			errors: errors.array(),
		});
	}

	const { fullName, email, phone, password } = req.body;

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ email, phone });
		if (existingUser) {
			return res.status(409).json({
				status: "fail",
				message: "User already exists.",
			});
		}

		// Hash the password
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create a new user
		const newUser = await User.create({
			fullName,
			email,
			phone,
			password: hashedPassword,
		});

		// Generate a token for the new user
		const token = generateToken(newUser._id, res);

		return res.status(201).json({
			status: "success",
			message: "User created successfully.",
			user: {
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				phone: newUser.phone,
			},
			token,
		});
	} catch (error) {
		console.error("Signup error:", error.message);

		// Handle specific MongoDB errors (e.g., validation errors)
		if (error.name === "ValidationError") {
			return res.status(400).json({
				status: "fail",
				message: "Invalid input data.",
				error: error.errors,
			});
		}

		// Handle generic server errors
		return res.status(500).json({
			status: "error",
			message: "Internal server error. Please try again later.",
		});
	}
};

export const login = (req, res) => {
	res.send("Login route");
};

export const logout = (req, res) => {
	res.send("Logout route");
};
