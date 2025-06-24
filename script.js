let currentUser = "";
let currentChat = "";
let users = {};
let chatBox = document.getElementById("chatBox");
let emojiPicker;

function signIn() {
  const username = document.getElementById("usernameInput").value.trim();
  const valid = /^[a-zA-Z0-9_.]{3,}$/;
  if (!valid.test(username)) {
    alert("Invalid username. No spaces/emojis. Min 3 characters.");
    return;
  }
  if (users[username]) {
    alert("Username already taken!");
    return;
  }
  currentUser = username;
  users[username] = { friends: [], requests: [], online: true };
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainScreen").style.display = "block";
  updateSearchResults();
}

function updateSearchResults() {
  const results = document.getElementById("searchResults");
  results.innerHTML = "";
  Object.keys(users).forEach(user => {
    if (user !== currentUser) {
      const div = document.createElement("div");
      div.textContent = user;
      div.onclick = () => sendFriendRequest(user);
      results.appendChild(div);
    }
  });
}

function sendFriendRequest(toUser) {
  if (!users[toUser].requests.includes(currentUser)) {
    users[toUser].requests.push(currentUser);
    alert("Friend request sent to " + toUser);
  }
}

function searchUsers() {
  const val = document.getElementById("searchInput").value.toLowerCase();
  const results = document.getElementById("searchResults");
  results.innerHTML = "";
  Object.keys(users).forEach(user => {
    if (user !== currentUser && user.toLowerCase().includes(val)) {
      const div = document.createElement("div");
      div.textContent = user;
      div.onclick = () => openChat(user);
      results.appendChild(div);
    }
  });
}

function openChat(user) {
  if (!users[currentUser].friends.includes(user)) {
    if (users[currentUser].requests.includes(user)) {
      if (confirm(`${user} sent you a request. Accept?`)) {
        users[currentUser].friends.push(user);
        users[user].friends.push(currentUser);
        alert("Now you are friends!");
      } else {
        return;
      }
    } else {
      alert("You must send/accept friend request first.");
      return;
    }
  }
  currentChat = user;
  chatBox.innerHTML = "";
}

function sendMessage() {
  if (!currentChat) return alert("No chat selected!");
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();
  if (msg) {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = `${currentUser}: ${msg}`;
    chatBox.appendChild(div);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function sendImage(event) {
  const file = event.target.files[0];
  if (!file || !currentChat) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const div = document.createElement("div");
    div.className = "message";
    const img = document.createElement("img");
    img.src = e.target.result;
    div.appendChild(img);
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  };
  reader.readAsDataURL(file);
}

document.getElementById("clearBtn").onclick = () => {
  chatBox.innerHTML = "";
};

window.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#emojiBtn");
  const input = document.querySelector("#messageInput");
  emojiPicker = new EmojiButton();
  emojiPicker.on("emoji", emoji => {
    input.value += emoji;
  });
  button.addEventListener("click", () => {
    emojiPicker.togglePicker(button);
  });
});
