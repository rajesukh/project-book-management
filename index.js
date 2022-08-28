const express = require('express');
const router = require('./route/route.js');
const mongoose  = require('mongoose');
const app = express();

app.use(express.json());                                       //only accept the http request



mongoose.connect("mongodb+srv://Raichu:Rishi1234@cluster0.xw5ct.mongodb.net/group20Database?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) );


app.use('/', router);
app.all('*', function(req,res){                //
    throw new Error("Bad Request")
});

app.use(function(e,req,res,next){
    if(e.message=="Bad Request")
    return res.status(400).send({error : e.message})
})


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});