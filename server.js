var express = require('express');
app = express();
var bodyParser = require('body-parser')
const path = require("path");
var firebase = require('firebase/app');
require("firebase/auth");
require("firebase/firestore");
const bcrypt = require("bcrypt");

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
//var serviceAccount = require("./service-account-file.json");
let ownedBooks = []

var userID;
var firebaseConfig = {
  apiKey: "AIzaSyB8qtYqUk95tgv1dtIp1e-VUayLgaomHYU",
  authDomain: "e-book-app-e4ef1.firebaseapp.com",
  projectId: "e-book-app-e4ef1",
  storageBucket: "e-book-app-e4ef1.appspot.com",
  messagingSenderId: "880958040339",
  appId: "1:880958040339:web:61d49a751c03b2e6ab52e6",
  measurementId: "G-MKN3EDRVNM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

app.engine('.html',require('ejs').renderFile)
app.set('views',__dirname + '/views');
app.set('view engine', 'html');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname+'/public'));

var credentials;
app.get("/", function(req,res){
    res.render("index");
    //db.collection("Users").doc().set({farkmaz: "naber"});
});
app.get("/userPDFReader",function(req,res){
    res.render("userPDFReader")
});

app.get("/userAvailableBooks",function(req,res){
  res.render("userAvailableBooks")
});

app.get("/intoLogin",function(req,res){
    res.render("login");
})
app.post("/login",function(req,res){
    console.log("naber");
    console.log(req.body.email);
    console.log(req.body.pass);
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.pass)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("Girdim ya sakin");
      userID = user.uid;
      console.log(userID);
      res.render("userPDFReader");
      
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      res.send("giremedim abi")
      console.log("Giremeeeeediiiiiiiiim");
    });

});
app.get("/intoCreate",function(req,res){
  res.render("create")
});
app.get("/library",function(req,res){
  ownedBooks = [];
  let userFirestore = db.collection("Users").doc(userID);
      userFirestore.get().then((books) =>{
      var data = books.get("ebooks");
        for(var key in data){
          if (data.hasOwnProperty(key) ){
            ownedBooks.push(key);
          }
        }
        res.send(ownedBooks);
      });
});
app.get("/credentials",function(req,res){
  let userFirestore = db.collection("Users").doc(userID);
  userFirestore.get().then((credentials) =>{
    console.log(credentials.data())
    res.send(credentials.data());
  });
})
app.post("/create", function(req,res){
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.body.country);
  console.log(req.body.gender);
  auth.createUserWithEmailAndPassword(req.body.email, req.body.password)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      credentials = userCredential.user;
      console.log(user.uid);
      var userData = {
        age: req.body.age.toString(),
        country: req.body.country.toString(),
        ebooks: {},
        email: req.body.email.toString(),
        gender: req.body.gender.toString(),
        userId: user.uid
    }
    db.collection("Users").doc(userData.userId).set(userData).then(()=>{
      console.log("oldu")
    }).catch(() =>{
      console.log("olmadı")
    });
      //firebase.firestore().collection("Users").doc(user.uid).set(userData);
        
      
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });

  

})

app.listen(4000,function(){
    console.log("Server is running");
});
