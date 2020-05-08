let conversationNames = [];
let conversationID;
//gets all different conversations
getConversations()

function getConversations() {
  // loops throgh all the given messages and filters out all separetate conversations 
  //if we dont found the id anywhere. We push it to array
  for (let i = messages.length - 1; i >= 0; i--) {

    let userIDfound = false;
    let sentIDfound = false;
    for (let z = 0; z < conversationNames.length; z++) {
      //in these 2 condition the if converstaionNames array already has the given id. we dont want to push it again
      if (conversationNames[z].user_id === messages[i].user_id) {
        userIDfound = true;
      }
      else if (conversationNames[z].user_id === messages[i].sent_user_id) {
        sentIDfound = true;
      }
    }
    // depending on if the user was found on sent_user_id(receiver) or user_id(sender) we store that inside the conversationNames array.
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
    
    //creating the needed divs for username element
    let userBox = document.createElement("div");
    let userNameDiv = document.createElement("div");
    let userLastMessage = document.createElement("div");

  //adding user id as data to user box which later triggers the populateChat function
    userBox.className = "user";
    userBox.dataset.userId = element.user_id;
  
    //for populate chat we need userid and using event we can get needed id from cliked div
    userBox.onclick = (event) => {
      populateChat(event.target.dataset.userId);
    };
    
    //adding classes and style
    userNameDiv.className = "user-text";
    userLastMessage.className = "user-text";
    userLastMessage.style = "font-size: 10px;margin-top: 7%;";
  
    userNameDiv.innerHTML = element.username;
  
    display.appendChild(userBox);
    userBox.appendChild(userNameDiv);
    //Getting last sent message and displaying it next to the username
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

// this is called when we want to open a chat page and view messages
function populateChat(otherID) {
  conversationID = otherID;
  const usernameText = document.querySelector("#username-text");
  const usernameInfo = document.querySelector("#user-info");
  const sendButton = document.querySelector("#send-button");

  const Chat = document.querySelector("#chat-body");
  Chat.innerHTML = "";


  let usr = conversationNames.find((conversationNames) => conversationNames.user_id == otherID);
  usernameText.innerHTML = usr.username;

  //looping throuh all messages
  for (let i = 0; i < messages.length; i++) {
    //this is executed if the sender is other user
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

      //this is executed if the sender is current client
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
//this emits the message to server using the socket.io connection
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
