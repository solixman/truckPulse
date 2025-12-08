const express= require('express');
let app = express();

require('./config/DB');

const session=require('express-session');
const sessionConfig=require('./config/session');
const flash=require("connect-flash");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended : true }));
app.use(session(sessionConfig));
app.use(express.json())
app.use(flash());




const authRoutes=require('./routes/authRoutes');


app.use('/auth',authRoutes);



app.listen(3333);