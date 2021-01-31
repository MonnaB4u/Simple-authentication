import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';


function App() {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  var provider = new firebase.auth.GoogleAuthProvider()
const [newUser, setNewUser]=useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    newUser:false,
    name: '',
    email: '',
    password: '',
    photo: '',

  })

  const signIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signedInUser)

      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert({ errorMessage })
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  // signOut

  const signOut = () => {
    firebase.auth().signOut()
      .then(() => {
        const signedOutuser = {
          isSignedIn: '',
          name: '',
          photo: '',
          email: '',
          error: '',
          success: false,
        }
        setUser(signedOutuser)
      }).catch((error) => {
        // An error happened.
      });
  }

  const handleEmailAndPass = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value)
    }

    if (e.target.name === "password") {
      const passwordSize = e.target.value.length > 6;
      const isPasswordValid = /\d{1}/.test(e.target.value)
      isFieldValid = passwordSize && isPasswordValid
    }

    if (isFieldValid) {
      const newUserInfo = { ...user }
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo)
    }

  }

  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
         const newUserInfo={...user}
         newUserInfo.error='';
         newUserInfo.success=true
         setUser(newUserInfo)
         UpdateUserName(user.name)
        })    
        .catch((error) => {         
          const newUserInfo = { ...user }
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });

    }

    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res=>{
    const newUserInfo={...user}
         newUserInfo.error='';
         newUserInfo.success=true
         setUser(newUserInfo)
         console.log(res.user)
  })
  .catch((error) => {
    const newUserInfo = { ...user }
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
    }

    e.preventDefault();
  }

  const UpdateUserName=name =>{
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
     
    }).then(function() {
      console.log('updated successfully')
    }).catch(function(error) {
      console.log('error')
    });
  }

  return (
    <div className="profile-card">
      {/* <div className="body">
        <div className="body">
          <div class="profile-card">
            <header class="headerp">
              <a target="_blank" href="#">
                <img src="" class="hoverZoomLink" />
              </a> */}

      {
        user.isSignedIn && <h1>{user.name}</h1>
      }

      <h2>
        Front End Developer
             </h2>

      {
        user.isSignedIn ? <button onClick={() => signOut()}> logOut </button> : <button onClick={() => signIn()}>login</button>
      }
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>PassWord: {user.password}</p>

      <h1>our own authentication</h1>
        <input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)} id=""/>
        <label htmlFor="newUser">New user signUp</label><br/>

      <form onSubmit={handleSubmit}>       
      {newUser && <input type="text" name="name" onBlur={handleEmailAndPass} placeholder="Enter your name" /> }
  <br/>    
        <input type="text" name="email" onBlur={handleEmailAndPass} placeholder="input your email" required /><br />
        <input type="password" name="password" onBlur={handleEmailAndPass} id='' placeholder="input your password" /><br />
        <input type="submit" value={newUser ? 'Sign up' : 'Sign In'} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      { user.success && <p style={{ color: 'green' }}>User {newUser ? 'Creted' : 'Logged In'} Successfully</p>}
      {/* </header>
          </div>

        </div>
      </div> */}
    </div>
  );
}

export default App;
