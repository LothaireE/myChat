import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onChildAdded,
  remove,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

// // ******* Authentication *******

// ******* firebase *******

const firebaseConfig = {
  //rajouter dans votre config
  databaseURL:
    "https://test1-aeefc-default-rtdb.europe-west1.firebasedatabase.app/",
  apiKey: "AIzaSyDaLe5_Bdj00LtaLj0EFvHmYFG6t863T2A",
  authDomain: "test1-aeefc.firebaseapp.com",
  projectId: "test1-aeefc",
  storageBucket: "test1-aeefc.appspot.com",
  messagingSenderId: "850516172021",
  appId: "1:850516172021:web:232f6b548cc481d89c79bc",
  measurementId: "G-39M2LN231E",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ******* Authentication *******

const provider = new GoogleAuthProvider();
let user;
const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    // const user = result.user;
    user = result.user.displayName;

    console.log("user===>", user);
    // const username = user.displayName;
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

let input = document.getElementById("myInput");
let btn = document.getElementById("myBtn");
let messageBox = document.querySelector(".messageBox");
let date = Date.now();
let userSelect = document.getElementById("userSelect");

// ******* création de l'user *******

// let user;
if (localStorage.getItem("user") == null) {
  //DEMANDER À L'UTILISATEUR UNE INFO
  user = prompt("Quel est votre nom ?");
  localStorage.setItem("user", user);
  function createUser() {
    let option = document.createElement("option");
    option.className = "user";
    option.innerHTML = user;
    userSelect.appendChild(option);
    // input.value = "";
  }
  createUser();
} else {
  user = localStorage.getItem("user");
  function getUser() {
    let option = document.createElement("option");
    option.className = "user";
    option.innerHTML = user;
    userSelect.appendChild(option);
    // input.value = "";
  }
  getUser();
}

// ********** new gif **********

// if (data.val().gifs) {
//     const messageGif = document.createElement("img");
//     messageGif.src = data.val().gifs;
//     message.appendChild(messageGif);
//   }
//   listOfMessages.appendChild(message);

// ********** new message **********

function newMessage(event) {
  let dateTime = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  let messageDateTime = dateTime.toLocaleDateString("fr-FR", options);

  const timestamp = Date.now();
  const refMessage = ref(db, "message/" + timestamp);
  set(refMessage, {
    message: event.currentTarget.value,
    date: messageDateTime,
  });
}

input.addEventListener("change", (event) => {
  newMessage(event);
});

btn.addEventListener("click", () => {
  console.log("input", input);
  console.log("click", input.value);
});

const dir = ref(db, "message/");

// console.log("dir", dir);

// ******* each new message *******

onChildAdded(dir, function (data) {
  console.log("dir", dir);
  console.log("data", data);

  let dmBox = document.createElement("div");
  dmBox.className = "dmBox";
  dmBox.id = data.key;
  let h6 = document.createElement("h6");
  h6.textContent = user;
  h6.className = "dmUserName";
  let p = document.createElement("p");
  p.className = "dm";
  p.textContent = data.val().message;
  let div = document.createElement("div");
  div.textContent = data.val().date;
  div.className = "dmTime";
  let i = document.createElement("i");
  i.className = "fa-solid fa-trash";
  i.addEventListener("click", function () {
    remove(ref(db, "message/" + this.parentNode.id));
  });

  dmBox.appendChild(h6);
  dmBox.appendChild(p);
  dmBox.appendChild(div);
  dmBox.appendChild(i);
  messageBox.appendChild(dmBox);

  input.value = "";
});

// ******* each new message *******
