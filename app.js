
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");


mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9t0akcl.mongodb.net/BlogDB`, 

    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(() => { console.log("Connected") })
.catch((err) => { console.log(err)});


const homeStartingContent = "Welcome to our blog! We share interesting stories, useful tips, and insightful articles on a wide range of topics. Explore our collection of posts to discover new ideas and perspectives.";
const aboutContent = "At our blog, we are passionate about providing valuable content to our readers. Our team of writers consists of experts in various fields who are dedicated to delivering high-quality articles that inspire, educate, and entertain. Get to know us better as we continue our mission of sharing knowledge and creativity with the world.";
const contactContent = "Have a question or feedback? We would love to hear from you! Reach out to us mail - omkarauti11052001@gmail.com and we'll get back to you as soon as possible. Your opinions matter to us, and we are always open to suggestions for improvement.";


const postSchema = new mongoose.Schema({
    title: String,
    content: String
});


const Post = mongoose.model("Post", postSchema);


app.get("/", async function(req,res) {
    try {
            
        const posts = await Post.find({});

        res.render("home", {
            home: homeStartingContent,
            allPosts: posts
        });

    } catch (err) {
        console.log(err);
    }

});


app.get("/about", function(req,res) {
    res.render("about", {
        about: aboutContent
    });
});


app.get("/contact", function(req,res) {
    res.render("contact", {
        contact: contactContent
    });
});


app.get("/compose", function(req,res) {
    res.render("compose");
});


app.post("/compose", async function(req,res) {
    try {
        const post = new Post({
            title: req.body.postTitle,
            content: req.body.postBody
        });

        
        await post.save();

        res.redirect("/"); 

    } catch (err) {
        console.log(err);
    }

});



app.get("/posts/:postId", async function(req,res) {
    try {
        const requestedPostId = req.params.postId;

        
        const post = await Post.findOne({ _id: requestedPostId });

        if (!post) {
           
            console.log("Post not found")
            return;
        }

        res.render("post", {
            title: post.title,
            content: post.content
        });

    } catch (err) {
        console.log(err);
    }   

});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});



