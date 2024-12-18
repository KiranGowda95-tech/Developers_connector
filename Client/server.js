const express=require('express')
const connectDB=require('./config/db')

const app=express()

//Connect to Database
connectDB()

//Init Middleware
app.use(express.json({extended:false}))


app.get('/',(req,res)=>{
    res.send('APP RUNNING')
})

//Promise.resolve(2).then(()=>6).then(3).then(n=>n*3).then(console.log).then(Promise.resolve(4).then(console.log)).then(console.log)

app.use('/api/users',require('./routes/api/users'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/posts',require('./routes/api/posts'))




const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{console.log(`Server started on ${PORT}`)})