const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

//config
dotenv.config({path: "Backend/config/config.env"})

//connecting to database
connectDatabase();


app.listen(process.env.PORT, async () => {

	console.log(`Server is listening on http://localhost:${process.env.PORT}`)
})