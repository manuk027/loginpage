import express, { urlencoded } from 'express';
import session from 'express-session';
import nocache from  'nocache';

const app = express();

//middleware to pass keyvalue pair
app.use(urlencoded({ extended: true }));


//middleware to clear cache from any page
app.use(nocache()); 

//session configuration
app.use(session({
  secret : "abc#123",
  resave: false, 
  saveUninitialized: true, 
  cookie : {maxAge: 12000000}
}))

//tells express to use ejs
app.set('view engine', 'ejs');

//route for '/' checks if the session is there or not if session is stored renders home else redirect to '/login'
app.get('/', (req, res) => {
  if(req.session.user){
    res.render("home", {msg: req.session.user});
  }else{
    res.redirect('/login')
  }
})

//if session is stored redirected to '/' and returned else render login with msg nulll.
app.get('/login', (req, res) => {
  if(req.session.user){
    return res.redirect('/');
  }
  res.render("login" , {msg : "", uname: "", pword: ""});
})


//middleware to check if username and password is correct and if then session is created and redirected to '/' else render the 'login' with invalid message.
function credentialValidation(req, res, next) {
  const { username, password } = req.body
  let users={
    "Manu Krishna": "Manu123#*@", 
    "Sreenish": "sreenish###",
    "Adithyan":"adithyan123"
  }
  if(!(Object.keys(users).includes(username))){
    res.render("login", {uname: "Wrong username.", pword:"", msg: ""})
  } else if(users[username]!==password){
    res.render("login", {pword: "Wrong password.", uname: "", msg:""})
  } else if (Object.keys(users).includes(username) && users[username]===password) {
    req.session.user = username;
    next();
  } else {
    res.render("login" , {msg : "Invalid Credentials"});
  }
}

//if logout rout is passed it destroys the session and redirect to the /login page
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
})


//post the username  to middleware and redirect to '/'
app.post('/login', credentialValidation, (req, res) => {
  res.redirect('/')
})

app.listen(3000, () =>{
  console.log("App running on http://localhost:3000");
});