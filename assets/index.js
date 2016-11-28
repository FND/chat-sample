/* eslint-env browser */
/* eslint-disable no-var */

class AJAXForm extends HTMLFormElement {
	get method() {
		let method = this.getAttribute("method");
		return method ? method.toUpperCase() : "GET";
	}

	get action() {
		return this.getAttribute("action") || "";
	}

	serialize() {
		let data = this.data();
		return Object.keys(data).reduce((memo, name) => {
			let key = encodeURIComponent(name);
			data[name].forEach(value => {
				value = encodeURIComponent(value);
				memo.push(`${key}=${value}`);
			});
			return memo;
		}, []).join("&");
	}

	// associates fields with their corresponding values
	data() { // TODO: rename
		var selector = "input[name], textarea[name], select[name], button[name]";
		var fields = this.querySelectorAll(selector);
		var data = new FormData(this);
		return [].reduce.call(fields, function(memo, field) {
			var name = field.getAttribute("name");
			memo[name] = data.getAll(name); // NB: `FormData` retains order
			return memo;
		}, {});
	}
}

class MessageForm extends AJAXForm {
	constructor() {
		super();
		this.onSubmit = this.onSubmit.bind(this);
	}

	connectedCallback() {
		this.addEventListener("submit", this.onSubmit);
	}

	onSubmit(ev) {
		ev.preventDefault();

		let loadingIndicator = document.createElement("p");
		loadingIndicator.textContent = "loading…";
		this.appendChild(loadingIndicator);

		fetch(this.action, {
			method: this.method,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Accept": "text/html"
			},
			body: this.serialize()
		}).then(response => {
			console.log(response.headers.get("Date")); // eslint-disable-line no-console

			return response.text();
		}).then(html => {
			loadingIndicator.parentNode.removeChild(loadingIndicator);

			let fragment = document.createElement("div");
			fragment.innerHTML = html;
			let messages = fragment.querySelector("#messages");

			let previous = document.body.querySelector("#messages");

			let container = previous.parentNode;
			container.insertBefore(messages, previous);
			container.removeChild(previous);
		});
	}
}

customElements.define("message-form", MessageForm, { extends: "form" });
