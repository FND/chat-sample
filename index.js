"use strict";

let express = require("express");
let path = require("path");
let server = require("./server");

const HOST = "0.0.0.0";
const PORT = 3000;

const URIS = {
	index: "/"
};

const STORE = [];

let app = server.makeApp();

app.use(express.static(path.resolve(__dirname, "assets")));
// XXX: special-casing for Custom Elements polyfill
app.use(express.static(path.resolve(__dirname,
		"node_modules/document-register-element/build")));

app.get(URIS.index, (req, res) => {
	res.render("index", {
		title: "Chat",
		formURI: URIS.index,
		messages: STORE,
		timestamp: (new Date()).toISOString()
	});
});

app.post(URIS.index, (req, res) => {
	let msg = req.body.message
	if(msg) {
		STORE.push(msg);
	}

	simulateLatency(1000)
		.then(() => {
			res.redirect(URIS.index);
		});
});

server.startApp(app, HOST, PORT);

function simulateLatency(delay) {
	return new Promise(resolve => {
		setTimeout(resolve, delay);
	});
}
