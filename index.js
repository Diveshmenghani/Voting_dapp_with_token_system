const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

require('dotenv').config()
const connectDB = require('./db/connect')
const candidateRoutes = require("./routes/candidateRoutes")
const voterRoutes = require("./routes/voterRoutes")
const authenticationRoute = require("./routes/authenticationRoute")

app.use(cors())
app.use(express.json())
app.use('/images',express.static(path.join(__dirname,'votingSystem')))

app.use("/api",authenticationRoute)
app.use("/api",candidateRoutes)
app.use("/api",voterRoutes)

connectDB(process.env.MONGO_URL)
.then(
    ()=>{
        console.log("Database connected")
        app.listen(3000,()=>{
            console.log("server is running")
        })
    }
)
.catch((error)=>{
    console.log(error)
})

