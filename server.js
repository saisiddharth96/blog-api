const express = require("express");

const port = process.env.PORT || 5000;
const app = express();

app.get("/", function(req,res){
    res.send("Welcome to the blog API").status(200);
});


app.listen(process.env.PORT || 3000, function(){
    console.log(`Server started on ${port}`);    
})