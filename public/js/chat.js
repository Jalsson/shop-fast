let conversationNames = [];
let conversationID;
//gets all different conversations
getConversations()
function getConversations() {
  for (let i = messages.length - 1; i >= 0; i--) {

    let userIDfound = false;
    let sentIDfound = false;
    for (let z = 0; z < conversationNames.length; z++) {
      if (
        conversationNames[z].user_id === messages[i].user_id) {
        userIDfound = true;
      }
      else if (
        conversationNames[z].user_id === messages[i].sent_user_id) {
        sentIDfound = true;
      }
    }
    if (!sentIDfound) {
      if (messages[i].sent_user_id != myID) {
        conversationNames.push({
          user_id: messages[i].sent_user_id,
          username: messages[i].receiver,
        });
      }

    }
    if(!userIDfound){
      if (messages[i].user_id != myID) {
        conversationNames.push({
          user_id: messages[i].user_id,
          username: messages[i].sender,
        });
      }
    }
  }
  populateSideBar()
}

function populateSideBar(){
  const display = document.querySelector("#users-display-window");
  display.innerHTML = "";
  conversationNames.forEach(element => {
    
    let userBox = document.createElement("div");
    let userNameDiv = document.createElement("div");
    let userLastMessage = document.createElement("div");

  
    userBox.className = "user";
    userBox.dataset.userId = element.user_id;
  
    userBox.onclick = (event) => {
      populateChat(event.target.dataset.userId);
    };
  
    userNameDiv.className = "user-text";
    userLastMessage.className = "user-text";
    userLastMessage.style = "font-size: 10px;margin-top: 7%;";
  
    userNameDiv.innerHTML = element.username;
  
    display.appendChild(userBox);
    userBox.appendChild(userNameDiv);
    for (let x = messages.length - 1; x >= 0; x--) {
      if (
        (element.user_id === messages[x].user_id && messages[x].sent_user_id === myID) ||
        (messages[x].user_id === myID && messages[x].sent_user_id === element.user_id)
      ) {
        userLastMessage.innerHTML = messages[x].message;
        break;
      }
    }
    userBox.appendChild(userLastMessage);
  });

}

function populateChat(otherID) {
  conversationID = otherID;
  const usernameText = document.querySelector("#username-text");
  const usernameInfo = document.querySelector("#user-info");
  const sendButton = document.querySelector("#send-button");

  const Chat = document.querySelector("#chat-body");
  Chat.innerHTML = "";


  let usr = conversationNames.find((conversationNames) => conversationNames.user_id == otherID);
  usernameText.innerHTML = usr.username;

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].sent_user_id == otherID && messages[i].user_id == myID) {
      let chatBox = document.createElement("div");
      let chatText = document.createElement("div");
      chatText.className = "message ";
  
      Chat.appendChild(chatBox);
      chatBox.appendChild(chatText);

      usernameText.innerHTML = usr.username;
      chatBox.className = "message-container user-message";
      sendButton.dataset.userId = messages[i].sent_user_id;
      chatText.innerHTML = messages[i].message;

    } else if (messages[i].sent_user_id == myID && messages[i].user_id == otherID) {
      let chatBox = document.createElement("div");
      let chatText = document.createElement("div");
      chatText.className = "message other-message";

      Chat.appendChild(chatBox);
      chatBox.appendChild(chatText);

      usernameText.innerHTML = messages[i].sender;
      chatBox.className = "message-container otheruser-message";
      sendButton.dataset.userId = messages[i].user_id;
      chatText.innerHTML = messages[i].message;
    }
    
  }
}

// Luo yhteys
const socket = io('https://'+window.location.hostname, {
  path: '/app/socket.io/'
});


socket.on("disconnect", function () {
  console.log("disconnecting");
});

socket.on("connect", () => {
  socket.emit("newUserToServer", {
    userName: myName,
    userID: myID,
  });
});

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// Query DOM
let message = document.getElementById("message-field");
let chatBody = document.getElementById("chat-body");

//aika

function sendMessage(e) {
  console.log(
    "sending message " +
      message.value +
      " to " +
      e.target.parentElement.dataset.userId
  );

  let messageToSend = message.value;
  let userToWhisper = messageToSend
    .substr(1, messageToSend.indexOf(" "))
    .replace(/\s/g, "");
  let parsedMessage = messageToSend.substr(messageToSend.indexOf(" ") + 1);
  /* tarkistaa viestin ja lähettää sen serverille*/

  socket.emit("messageToServer", {
    message: message.value,
    senderID: myID,
    userToSendID: e.target.parentElement.dataset.userId,
  });
  message.value = "";
}

socket.on("messageToUser", function (data) {
  messages.push({
    message: data.message,
    user_id: data.senderID,
    sent_user_id: data.userToSendID,
  });
  if (data.senderID == conversationID || data.userToSendID == conversationID) {
    populateChat(conversationID);
  }
  console.log(`user ${data.senderName} sended a message ${data.message}`);
});
