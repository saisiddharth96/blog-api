const express = require("express");

const port = 5000 || process.env.PORT;
const app = express();

app.get("/", function(req,res){
    res.send("Welcome to the blog API").status(200);
});


app.listen(port, function(){
    console.log(`Server started on ${port}`);    
})