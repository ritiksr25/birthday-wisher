const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");
const { notFound, sendErrors } = require("./config/errorHandler");
const app = express();

const cors = require("cors");
require("dotenv").config();
require("./config/dbconnection");
require("./config/cron-wisher");

app.use(compression());
app.use(morgan("dev"));
app.use(cors({ exposedHeaders: "x-auth-token" }));
app.use(
	bodyParser.urlencoded({
		limit: "50mb",
		extended: true,
		parameterLimit: 1000000
	})
);
app.use(
	bodyParser.json({
		limit: "50mb",
		extended: true,
		parameterLimit: 1000000
	})
);

//load Schemas
const User = require("./models/User");

//Routes
app.use("/api/v1", require("./routes/api/v1/index"));

app.use("*", notFound);

//Error Handlers
app.use(sendErrors);

const { ENV, PORT } = require("./config/index");
//Setting up server
startServer = async () => {
	try {
		await app.listen(PORT);
		console.log(
			`ENV: ${
				ENV == "dev" ? "Development" : "Production"
			}\nServer is up and running on Port ${PORT}`
		);
	} catch (err) {
		console.log("Error in running server.");
	}
};
startServer();