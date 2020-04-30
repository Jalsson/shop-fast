// Luo yhteys
const socket = io.connect();
const urlParams = new URLSearchParams(window.location.search);




let path = window.location.pathname;
path = path[0] == '/' ? path.substr(11) : path;


socket.on("connect", () => {
	
	socket.emit("newUserToServer", {
		userName: userName,
		room: path
	})
});


String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

//document.getElementById('room').innerHTML = "<h2 style='font-size: 27px;'>" + path.capitalize(); +"</h2>"

// Query DOM
let message = document.getElementById('message-field');
let chatBody = document.getElementById("chat-body");

//aika

function SendMessage(e) {
	console.log("sending message "+message.value+" to "+ e.target.parentElement.dataset.userId)
	
	let messageToSend = message.value
	let userToWhisper = messageToSend.substr(1, messageToSend.indexOf(' ')).replace(/\s/g, '');
	let parsedMessage = messageToSend.substr(messageToSend.indexOf(' ') + 1);
	/* tarkistaa viestin ja lähettää sen serverille*/
	if (message.value == "" || message.value < 1) {
		message.value = null;
	}
	//we send normal message to public chat from here if statement checks if the whisper field is empty
	if ("/" != message.value.substr(0, 1)) {
		let cleanMessage = message.value.replace(/</g, "&lt;").replace(/>/g, "&gt;")
		let d = new Date();
		let dateNow = (getFormattedTime(d) + " " + d.getDate() + "." + (+1 + +d.getMonth()) + " " + d.getFullYear())
		socket.emit("chatToServer", {
			message: cleanMessage,
			userName: userName,
			roomToSend: path,
			date: dateNow
		})
		document.getElementById("message").value = ""
	}
	//this sends out the whisper to named client
	else if (parsedMessage.length >= 1 && userToWhisper.length > 1) {
		var cleanMessage = parsedMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")
		socket.emit("whisperToServer", {
			message: cleanMessage,
			userName: userName,
			userToSend: userToWhisper,
			date: dateNow
		})
		document.getElementById("message").value = ""
	}

}
/*<<--here we check for keypress and send the message as we detect one */
message.onkeypress = function (evt) {
	evt = evt || window.event;
	var charCode = evt.keyCode || evt.which;

	if (charCode == 13) {
		SendMessage();
		document.getElementById("chat-button").click();
	}
}


//Listen for events
function ClearMessage(){
	document.getElementById("eventBox").innerHTML ="<i style='/*! color: gray;' >-------------</i>"
}


socket.on("eventMessage", (data) => {
	document.getElementById("eventBox").innerHTML = "<i style='color: gray;'> "+data.eventMessage+"</i>"
	window.setTimeout(ClearMessage,2500)
})

socket.on("UserListToClient", function(data) {
	AddUsersToList(data.connectedUsers)
})

socket.on('chat', function (data) {
	var d = new Date();
	output.innerHTML += "<p>" + getFormattedTime(d) + "<strong onclick='AddUsernameToMessageField(event,0)' style='cursor: pointer;'>" + " " + data.userName + ': </strong>' + data.message + '</p>'
	chatWindow.scrollTop = 10000;
});
// handling whispering
socket.on("whisperToUser", function (data) {
	var d = new Date();
	output.innerHTML += '<p>' + getFormattedTime(d) + " " + "<strong onclick='AddUsernameToMessageField(event,0)' style='color: #54c3ff; cursor: pointer;'>" + data.userName + ': </strong>' + "<i>" + data.message + "</i>" + '</p>'
	chatWindow.scrollTop = 10000;
});



