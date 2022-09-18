import io from 'socket.io-client'
import {useState} from 'react'
import Chat from './chatPage/chat';

const socket = io.connect("http://localhost:3001");
function App() {
  const [username,setusername] = useState("")
  const [room,setroom] = useState("")
  const [showchat,setshowchat] = useState(false);

function joinroom(){
  if(username!=null && room!=null){
    setshowchat(true)
    socket.emit("join_room", room);


  }

}

  return (
    <div className="app">
 <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setusername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setroom(event.target.value);
            }}
          />
<button onClick={joinroom}>Enter</button>


<Chat socket={socket} username={username} room={room}/>

    </div>

  );
}

export default App;
