import React , {useState}from 'react';
import {createUserWithEmailAndPassword ,updateProfile} from "firebase/auth";
import {ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth ,storage, db} from "../firebase";
import { useNavigate, Link } from 'react-router-dom';
import {doc , setDoc} from 'firebase/firestore';



export const Register = () => {
const [err, setErr] = useState(false);
const [loading, setLoading] = useState(false);
const navigate = useNavigate()

const handleSubmit = async (e) => {
  setLoading(true);
  e.preventDefault();
  const displayName = e.target[0].value;
  const email = e.target[1].value;
  const password = e.target[2].value;
  const file = e.target[3].files[0];

  try{
    const res = await createUserWithEmailAndPassword(auth, email, password);

    const date = new Date().getTime();
    const storageRef = ref(storage, `${displayName + date}`);

    await uploadBytesResumable(storageRef, file).then(()=>{
      getDownloadURL(storageRef).then(async (downloadURL) => {
        try {
          //Update profile
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });
          //create user on firestore
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          //create empty user chats on firestore
          await setDoc(doc(db, "userChats", res.user.uid), {});
          navigate("/");
        } catch (err) {
          console.log(err);
          setErr(true);
          setLoading(false);
        }
      });
    });
  }
  catch(err){
    console.log(err);
    setErr(true);
    setLoading(false);
 
  }

};

  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className='logo'>Hi There!</span>
            <span className='title'>Register</span>
            <form onSubmit={ handleSubmit }>
                <input type='text' placeholder='Your Name'/>
                <input type='email' placeholder='Email'/>
                <input type='password' placeholder='Enter Password'/>
                <input style={{display:'none'}} type='file' id="file" />
                <label htmlFor="file">
                    <p className='uploadText'>Upload</p>
                </label>
                <button disabled={loading}>Sign Up</button>
                {loading && "Uploading...."}
                {err && <span>Something went wrong</span>}
            </form>
            <p>You do have an account? <Link to="/login">Login</Link></p>
        </div>
    </div>
  );
};
