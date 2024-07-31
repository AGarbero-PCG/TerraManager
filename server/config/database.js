const mongoose = require('mongoose'); // Import the mongoose library to interact with MongoDB

// Define an asynchronous function to connect to the MongoDB database
async function connect() {
	try {
		// Attempt to connect to the database using the connection string from environment variables
		await mongoose.connect(process.env.DATABASE_URI, {
			useUnifiedTopology: true, // Use the new unified topology engine for handling MongoDB connections
			useNewUrlParser: true // Use the new URL string parser to handle connection strings
		});
	} catch (error) {
		console.log(error)
	}
}

// Export the connect function so it can be used in other parts of the application
module.exports = connect
