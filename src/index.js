import {initializeApp} from 'firebase/app';
import { getDatabase, set, ref, onValue, child, get } from 'firebase/database';

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

function sendMessage(time, user_name, message){
    set(ref(db,`conversation/${time}`), {
        user_name:user_name,
        message: message
    })
}

function updateChat(time,user_name, message){
    const message_container = document.getElementById("messages_container");
    const current_content = message_container.innerHTML;
    const new_content = 
    `<div class="message_bubble"  id="${user_name}_${time}">
          <p class="bubble_p name_tag"><b>${user_name}</b></p>
          <p class="bubble_p bubble_text">
              ${message}
          </p>
          <p class="bubble_p time_tag">${time}</p>
      </div>`;
    message_container.innerHTML= current_content+new_content;
}

function listenAndUpdate(time){
  const message_logged = ref(db, `conversation/${time}`);
  onValue(message_logged,(snapshot)=>{
    console.log(snapshot.val());
    const data = snapshot.val();
    const name = data["user_name"];
    const message = data["message"];
    updateChat(time,name,message);
  })
}

function loadChat(){
    const conversation = ref(db, 'conversation/');
    get(child(conversation,"/")).then((snapshot)=>{
      if(snapshot.exists()){
        const chat = snapshot.val();
        console.log(chat);
        console.log(chat["0:44:9"]);

        for(const time in chat){
          const u_name = chat[time]["user_name"];
          const u_msg = chat[time]["message"];
          updateChat(time,u_name, u_msg);
        }
      }else{
        console.log("No data!!")
      }
    }).catch((error)=>{
      console.error(error);
    })
}
loadChat();

send_btn.addEventListener("click",()=>{
    const time = new Date();
    const h=time.getHours(),m=time.getMinutes(),s=time.getSeconds();
    const now = `${h}:${m}:${s}`;
    const message = document.getElementById("input_box");

    sendMessage(now,"Necho", message.value );

    listenAndUpdate(now);

    message.value = ""
}) 



function updateUser(name, age, course){
  set(ref(db,'updates'),{
    name:name,
    age:age,
    course:course
  })
}


