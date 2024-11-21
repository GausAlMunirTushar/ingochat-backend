import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		phone: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		profileImage: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
