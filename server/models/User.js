const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = Schema(
	{
		username: {
			type: String,
			required: true
		},

		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			unique: true,
			validate: [
				(val) => {
					// // Regular expression to validate email format
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
				},
			]
		},

		first_name: {
			type: String,
			required: true
		},

		last_name: {
			type: String,
			required: true
		},

		password: {
			type: String,
			required: true,
			min: 6 // Minimum length of characters
		},

		refresh_token: String
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

UserSchema.virtual('full_name').get(function () {
	return this.first_name + ' ' + this.last_name;
});

UserSchema.virtual('id').get(function () {
	return this._id;
});

module.exports = mongoose.model('User', UserSchema);
