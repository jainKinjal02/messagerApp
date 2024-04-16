import React, {useContext, useState} from 'react'
import {collection, query, where, getDoc,serverTimestamp, setDoc, doc,updateDoc, getDocs} from 'firebase/firestore';
import {db} from '../firebase';
import {AuthContext} from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

export const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  const handleSearch = async () => {
    const q = query(collection(db, "users"),
      where("displayName", "==", username));

      try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
      }catch(err){
        setErr(true);
      }
  };
  const handleKey = e=> {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (u) => {
    //check   the group(chats in firestore) exists,if not create a new one
    const combinedId =  currentUser.uid > user.uid ?  
      currentUser.uid + user.uid : 
      user.uid + currentUser.uid;
      dispatch({type: "CHANGE_USER",payload: user});


    try{
      const res = await getDoc(doc(db, "chats", combinedId));
      if(!res.exists()){

        await setDoc(doc(db, "chats", combinedId),{messages: []});

        //create user  chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId+".userInfo"] : {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId+".date"]: serverTimestamp()
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId+".userInfo"] : {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId+ ".date"]: serverTimestamp()
        });
      }
    } catch(err){
    }
    setUser(null);
    setUsername("");
  }

  return (
    <div className='search'>
      <div className='searchForm'>
      <input type='text' placeholder='Find Your Friend' onKeyDown={handleKey} 
        onChange={e=> setUsername(e.target.value)}
        value={username}/>
      </div>
      {err && <span>User not found!</span>}
     {user && (<div className='userChat' onClick={()=>handleSelect(user)}>
        <img src={user.photoURL} alt=''/>
        <div className='userChatInfo'>
            <span>{user.displayName}</span>
        </div>
      </div> )}
    </div>
  );
};
