import React ,{useContext, useEffect, useRef}from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

export const Message = ({message}) => {
  console.log(message);

  const {currentUser} = useContext(AuthContext); // curret user
  const {data} = useContext(ChatContext); // other user whom we chatted

  const ref = useRef();

  useEffect(()=> {
    ref.current?.scrollIntoView({behavior:"smooth"});
  }, [message]);


  return (
    <div ref={ref}
    className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt=""/>
        <span> just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt=""/>}
      </div>
    </div>
  )
}
