if (Notification.permission === "granted") {
	var el = document.getElementById("enable");
	el.parentElement.removeChild(el);
}

const enable = () => {
	if (Notification.permission === "default") Notification.requestPermission().then(start);
};

function start(res) {
	if (res === "granted") {
		new Notification("Yay, notifications are enabled!", {
			badge: "/logo.png",
			icon: "/logo.png",
			requireInteraction: true
		});

		if (Notification.permission) {
			var el = document.getElementById("enable");
			el.parentElement.removeChild(el);
		}
	}
}