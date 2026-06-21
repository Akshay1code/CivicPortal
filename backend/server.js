let express=require('express')
let cors=require('cors')
let morgan=require('morgan')
let cookieParser=require('cookie-parser')

require('dotenv').config()


let auth=require('./routes/auth.routes.js')
let com=require('./routes/complaint.routes.js')
let port=process.env.PORT
let app=express()
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use('/auth',auth)
app.use('/complaints',com)
app.listen(port,()=>console.log("Server is listening at",port))