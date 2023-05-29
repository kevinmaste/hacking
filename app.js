const  express =require('express')
const cors = require("cors")
const bodyParser = require('body-parser')

const app = express()
const PORT = 8000


const corsOption = {
    origin:"*"
}
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get('/',(req,res)=>{
    res.send('You here')
})

app.use('/api',require('./router/hacking'))


app.listen(PORT,()=>console.log('listen to port :',PORT))















