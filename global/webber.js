class Webber {
	constructor(element, config) {
		// Check if element is an HTMLElement or string to set this.element
		if (
			typeof HTMLElement === "object" ? element instanceof HTMLElement :
			element && typeof element === "object" && element !== null && element.nodeType === 1 && typeof element.nodeName==="string"
		) {
			this.element = element;
		} else if (typeof element === "string") {
			this.element = document.querySelector(element);
		} else {
			throw new Error("Webber selector is not a string or HTMLElement!")
		}

		// Setup for config object
		if (!config) return;

		// event listener setup
		if (config.events) {
			this.events = config.events;
			let eventKeys = Object.keys(config.events);
			for (let i = 0; i < eventKeys.length; i++) {
				let key = eventKeys[i];
				let func = this.events[eventKeys[i]];
				this.element.addEventListener(key, () => func.call(this));
			}
		}

		// method setup
		if (config.methods) {
			let methodKeys = Object.keys(config.methods);
			for (let i = 0; i < methodKeys.length; i++) {
				let key = methodKeys[i];
				let func = config.methods[methodKeys[i]];
				this[key] = () => func.call(this);
			}
		}
	}

	set text(string) {
		this.element.innerText = string;
	}

	set html(string) {
		this.element.innerHTML = string;
	}

	get text() {
		return this.element.innerText;
	}

	get html() {
		return this.element.innerHTML;
	}
}