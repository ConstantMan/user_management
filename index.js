import express from "express"
import session from "express-session"
import { fileURLToPath } from 'url';
import {dirname} from "path"
import usersRouter from "./users/users.js"
import requireLogin from "./middlewares/requireLogin.js";
import bodyParser from "body-parser";


const app =express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
    cookie: {
        maxAge:269999999999
      }
}));





app.use(express.static(__dirname))

app.use(bodyParser.urlencoded({ extended: true }));



app.use('/users' ,usersRouter)



app.get('/user_page' , requireLogin , async(req , res)=>{
  res.sendFile(__dirname+'/user_page.html')
})
app.get("/change_password", requireLogin, async (req, res) => {


  res.sendFile(__dirname+'/change_password.html')

})
const PORT =5000;


app.listen(PORT,()=>console.log('Listening to port :'+PORT))



export default app;
