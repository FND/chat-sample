let express = require("express");
let mustacheExpress = require("mustache-express");
let bodyParser = require("body-parser");
let path = require("path");

exports.makeApp = () => {
	let app = express();
	app.use(bodyParser.urlencoded({ extended: false }));

	app.engine("mustache", mustacheExpress());
	app.set("view engine", "mustache");
	app.set("views", path.resolve(__dirname, "views"));
	if(app.get("env") === "development") {
		app.disable("view cache");
	}

	return app;
};

exports.startApp = (app, host, port) => {
	let server = app.listen(port, host, () => {
		let addr = server.address();
		// eslint-disable-next-line no-console
		console.log("→ http://%s:%s", addr.address, addr.port);
	});
	return server;
};
