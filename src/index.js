import {initializeApp} from 'firebase/app';
import { getDatabase, set, ref, onValue, child, get, onChildAdded } from 'firebase/database';

//below is creating a firebase application
//Future me, you have probably done this a billion times.
const app = initializeApp({
    apiKey: "AIzaSyCK2RDrF2zeFoPhf2v509ada3xX8jatRfE",
    authDomain: "josh-3bd10.firebaseapp.com",
    databaseURL:"https://josh-3bd10-default-rtdb.firebaseio.com/",
    projectId: "josh-3bd10",
    storageBucket: "josh-3bd10.firebasestorage.app",
    messagingSenderId: "1069974348479",
    appId: "1:1069974348479:web:86d5e18c3213f98719dc0a",
    measurementId: "G-HMNS7TBVV3"
})
const db = getDatabase(app);

const send_btn = document.getElementById("send_btn");
const change_usr = document.getElementById("change_user");

function scrollToBottom() {
  const container = document.getElementById("messages_container");
  container.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth'
  });
}
// below is a simple function to update the database
// time and date are used to track where the data should be placed
//user_name and message are the actual data being placed
function sendMessage(time, date, user_name, message){
    set(ref(db,`conversation/${date}/${time}`), {
        user_name:user_name,
        message: message
    })
}

// The code below is for creating a new day container.
// CASE1: where there is none in the DOM
// CASE2: It is a new day
function constNewDayContainer(u_date){
    const message_container = document.getElementById("messages_container");
    const current_content = message_container.innerHTML;
    const new_content = 
    `<div class="message_day_container" id="${u_date}">
        <div class="date" >${u_date}</div>

    </div>`;
    message_container.innerHTML=current_content+new_content;
}

// below, Updates the chat on the client side
// DOES NOT touch the database
// only changes time, user_name and message
// date parameter is only entered in case the container does not already exist
function updateChat(time, date, user_name, message){
    const day_message_container = document.getElementById(`${date}`);
    function updateBubble(d_container){
      const current_content = d_container.innerHTML;
      const new_content = 
      `<div class="message_bubble ${user_name}"  id="${user_name}_${time}">
            <p class="bubble_p name_tag"><b>${user_name}</b></p>
            <p class="bubble_p bubble_text">
                ${message}
            </p>
            <p class="bubble_p time_tag">${time}</p>
        </div>`;
      d_container.innerHTML= current_content+new_content;
      scrollToBottom();
      // day_message_container.scrollTop = day_message_container.scrollHeight;

    }
    if(day_message_container){
      updateBubble(day_message_container);
    } else {
      constNewDayContainer(date);
      const new_container = document.getElementById(`${date}`);
      updateBubble(new_container);
    } 
}

// below, Listens to the database while client is on page
// calls updateChat() function
// gets new updates from database then changes client side

function listenAndUpdate(time,date){
  const message_logged = ref(db, `conversation/${date}/${time}`);
  onValue(message_logged,(snapshot)=>{
    console.log(snapshot.val());
    const data = snapshot.val();
    const name = data["user_name"];
    const message = data["message"];
    updateChat(time,date,name,message);
  })
}

// this checks the database and loads all the messages
// calls the updateChat() function
// takes in **u_date** parameter incase there is no data in the db

function loadChat(u_date){
    const conversation = ref(db, 'conversation/');
    get(child(conversation,"/")).then((snapshot)=>{
      if(snapshot.exists()){
        const chat = snapshot.val();
        console.log(chat);
 
        for(const date in chat){
          const tsiku = chat[date];
          for(const time in tsiku){
            const u_name = tsiku[time]["user_name"];
            const u_msg = tsiku[time]["message"];
            updateChat(time,date,u_name, u_msg);
          }
        }
        scrollToBottom();
      }else{
        console.log("No data!!");
        console.log("Constructing a new day container...");
        constNewDayContainer(u_date);
      }
    }).catch((error)=>{
      console.error(error);
    })
}

// Just creates a date and time in a format easy for me to handle
function getDateTime(){
    function padZero(num) {
        return num < 10 ? `0${num}` : num;
      }
    const now = new Date();

    const h = padZero(now.getHours());
    const m = padZero(now.getMinutes());
    const s = padZero(now.getSeconds());
    const time = `${h}:${m}:${s}`;

    const year = now.getFullYear();
    const month = padZero(now.getMonth()+1);
    const day = padZero(now.getDate());
    const date = `${year}_${month}_${day}`;
    return [date, time]

}

// This is the whole working of the code
function sendAndUpdate(){
    const dateTime = getDateTime();
    const date = dateTime[0];
    const time = dateTime[1];
    const current_user =document.getElementById("current_user");

    const message_box = document.getElementById("input_box");
    if(message_box.value!==""){
        sendMessage(time, date,`${current_user.textContent}`, message_box.value);
        listenAndUpdate(time,date);
    }
    message_box.value = "";
}
// loading the chat the moment the page is loaded

loadChat(getDateTime()[0]);

// code depends on one button
send_btn.addEventListener("click",()=>{
    sendAndUpdate();
}) 






change_usr.addEventListener("click",()=>{
  console.log("changing user");
  const current_user = document.getElementById("current_user");
  console.log(current_user.innerText);
  if(current_user.textContent=="Necho"){
    current_user.textContent="Henry";
  } else if(current_user.textContent=="Henry"){
    current_user.textContent="Penjani";
  } else if(current_user.textContent=="Penjani"){
    current_user.textContent="Necho";
  } else{
    console.log("Error in Changing user")
  }
})

function updateUser(name, age, course){
  set(ref(db,'updates'),{
    name:name,
    age:age,
    course:course
  })
}
