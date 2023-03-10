//jshint esversion:6
const dotenv=require("dotenv").config();
const lodash=require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.locals.lodash = lodash;


app.set('view engine', 'ejs');
mongoose.set('strictQuery',false);
mongoose.connect(process.env.mongourl,{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema=new mongoose.Schema({
  title:{
    type:String,
    require:true,
  },
  post:String,
});
const Post=mongoose.model("Post",blogSchema);

app.get("/",function(req,res){
  //res.send("<h1>Home</h1>")
  Post.find({},function(err,posts){
    
    res.render("home",{para:homeStartingContent,data:posts});
  });
  
});

app.get("/about",function(req,res){
  res.render("about",{para:aboutContent})
});

app.get("/contact",function(req,res){
  res.render("contact",{para:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose",{head:"",body:"",Id:""});
});
app.post("/compose",function(req,res){
 
  if(req.body.comp){
    if(req.body.title)
  Post.findByIdAndUpdate(req.body.comp, {title: req.body.title,post:req.body.postbody },
  function (err, docs) {
if (err){
console.log(err)
}

});
  }else if(req.body.title){
  const blogpost=new Post({title:req.body.title,post:req.body.postbody});
   blogpost.save();
  }
  res.redirect("/");

});
app.get("/post/:topic",function(req,res){
    var c=lodash.lowerCase(req.params.topic);
      Post.find({},function(err,posts){
        res.render("post",{data:posts,a:c});
     });
});

app.post("/delete",function(req,res){
  //console.log(req.body.delete);
  Post.findByIdAndDelete(req.body.delete,function(err){
    if(!err)console.log("Deletion success!");
    else console.log(err);
  })
  res.redirect("/");
});
app.post("/edit",function(req,res){
  //console.log(req.body.delete);
  Post.findById(req.body.edit,function(err,p){
    if(err){console.log("Error:Dont match!");}
    else{
      res.render("compose",{head:p.title,body:p.post,Id:p._id});
    }});
});
app.post("/search",function(req,res){
  if(req.body.search)
res.redirect("/post/"+req.body.search);
else res.redirect("/");
});

app.listen(process.env.PORT||3000, function() {
  console.log(typeof aboutContent);
  console.log("Server started on port 3000");
});
