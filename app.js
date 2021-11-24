//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

const homeStartingContent = "This is a blog webiste. Here you can create post by clicking on 'create post' button.";
const aboutContent = "This website is design and develope by Gaurav Sharma.";
const phoneContactContent = "Mobile No. : 8630767682";
const emailContactContent = "Email : gauravbhardwaj882@gmail.com";

const app = express();

app.use(express.static("public"));

const mongo_url_cloud = "mongodb+srv://admin-gaurav:gaurav%40sharma@cluster0.udwj8.mongodb.net/blogDB?retryWrites=true&w=majority";
const mongo_url_local = "mongodb://localhost:27017/blogDB";

mongoose.connect(mongo_url_cloud);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

const postSchema = {
  title: String,
  body: String
};

const Post = mongoose.model('Post',postSchema);

app.use('/favicon.ico', express.static('public/blog-icon.svg'));

app.get('/', function(req, res) {
  try{
    Post.find({}, function(err, posts){
      if(!err){
        res.render('home', {
          homePageContent: homeStartingContent,
          postsData: posts
        });
      }else{
        console.log('error while getting posts ' + err);
        res.render('home', {
          homePageContent: homeStartingContent,
          postsData: []
        });
      }
    });
  }catch(e){
    console.log('error loading page ' + e);
    res.send('503...Server side error...Please conatct to owner');
  }
});

app.get('/about', function(req, res) {
  res.render('about', {
    aboutPageContent: aboutContent
  });
});

app.get('/contact', function(req, res) {
  res.render('contact', {
    phoneContactContent: phoneContactContent,
    emailContactContent: emailContactContent
  });
});

app.get('/compose', function(req, res) {
  res.render('compose', {});
});

app.get('/posts/:topic', function(req, res) {
  const topic = _.lowerCase(req.params.topic);
  Post.findOne({title: topic},function(err, foundPost) {
    if(!err){
      if(foundPost){
        res.render('post',{
          title: foundPost.title,
          body: foundPost.body
        });
      }else{
        res.send('There is no post with that title!');
      }
    }else{
      res.send('error while searching post ' + err);
    }
  });
});

app.post('/posts/', function(req, res){
  const postTitle = req.body.postTitle;
  res.redirect('/posts/' + postTitle);
});

app.post('/compose', function(req, res) {
  const post = new Post({
    title: req.body.title,
    body: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect('/');
    }else{
      res.send('error while saving post : ' + err);
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
