const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

//Handling Uncought Exeptions (eg.Using undeclared variables)
process.on('uncaughtException', (err) => {
	console.log(`Error: ${err.message}`);
	console.log(`Shutting down the server due to Uncaught Exception`);

	process.exit(1);
})

//config
dotenv.config({path: "Backend/config/config.env"})

//connecting to database
connectDatabase();


const server = app.listen(process.env.PORT, async () => {

	console.log(`Server is listening on http://localhost:${process.env.PORT}`)
})

//Unhandled promise rejection (those types of promises error which break whole server)
process.on("unhandledRejection", err => {
	console.log(`Error: ${err.message}`);
	console.error(`Shutting down server due to Unhadled Promise Rejection`);

	//Shutting down the server
	server.close(() => process.exit(1))
})
