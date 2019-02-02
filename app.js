const bodyParser      = require("body-parser"),
      methodOverride  = require("method-override"),
      mongoose        = require("mongoose"),
      express         = require ("express"),
      app             = express()
      
//APP CONFIG.     
mongoose.connect('mongodb://localhost:27017/blog_app', {useNewUrlParser: true}); 
mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//MONGO CONFIG.
const blogSchema = new mongoose.Schema(
    {
        title: String,
        image: String,
        body: String,
        created: {type: Date, default: Date.now}
    });

const Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX route
app.get("/blogs", function(req, res){
        Blog.find({}, function(err, blogs){
            if(err){
                console.log("BEHHH ERROR !!");
            } else {
                res.render("index", {blogs: blogs});
            }
        });
        
});

//NEW Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE Route
app.post("/blogs", function(req, res){
    //create blog
    //Blog.create(data, callback)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then redirect to the index
            res.redirect("/blogs");
        }
    });
    
});

//SHOW Route
app.get("/blogs/:id", function(req, res) {
    //Blog.findById(id, callback)
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT Route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE Route
app.put("/blogs/:id", function(req, res){
    //Blog.findByIdAndUpdate(id, newData, callback)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, updatedBlog){
            if(err){
                res.redirect("/blogs");
            } else {
                res.redirect("/blogs/" + req.params.id);
            }
    });
});

//DELETE Rout
app.delete("/blogs/:id", function(req, res){
    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            //Redirect somewhere
            res.redirect("/blogs");
        }
    });
    
});


app.listen(process.env.PORT, process.env.IP, function(){
     console.log("Server has Started !!!")
});
