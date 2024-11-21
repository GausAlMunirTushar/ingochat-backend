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

export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Validate input fields
		if (!email || !password) {
			return res.status(400).json({
				status: "fail",
				message: "Email and password are required.",
			});
		}

		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				status: "fail",
				message: "Invalid email or password.",
			});
		}

		// Verify the password
		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(401).json({
				status: "fail",
				message: "Invalid email or password.",
			});
		}

		// Generate a token for the user
		const token = generateToken(user._id, res);

		// Respond with user details and token
		return res.status(200).json({
			status: "success",
			message: "Login successful.",
			user: {
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				phone: user.phone,
			},
			token,
		});
	} catch (error) {
		console.error("Login error:", error.message);

		// Handle generic server errors
		return res.status(500).json({
			status: "error",
			message: "Internal server error. Please try again later.",
		});
	}
};

export const logout = (req, res) => {
	try {
		// Clear the token cookie
		res.clearCookie("jwt", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Secure in production
			sameSite: "strict",
		});

		// Send a response indicating successful logout
		return res.status(200).json({
			status: "success",
			message: "Logout successful.",
		});
	} catch (error) {
		console.error("Logout error:", error.message);

		// Handle generic server errors
		return res.status(500).json({
			status: "error",
			message: "Internal server error. Please try again later.",
		});
	}
};
