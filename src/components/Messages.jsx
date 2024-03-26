import React, { useContext, useEffect, useState } from 'react';
import {Message} from './Message';
import { ChatContext } from '../context/ChatContext';
import { onSnapshot ,doc} from 'firebase/firestore';
import { db } from '../firebase';

export const Messages = () => {
  const [messages, setMessages] = useState([]);
  const {data} = useContext(ChatContext);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc)=>{
      doc.exists() && setMessages(doc.data().messages);
    });
    return ()=> {
      unsub();
    };
  },[data.chatId]);

  console.log('inside messages comp');
  console.log(messages);
  
  return (
    <div className='messages'>
       {messages.map((mes)=> (
        <Message message={mes} key={mes.id}/>
       ))}
    </div>
  )
}
