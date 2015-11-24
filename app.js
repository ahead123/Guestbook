'use strict';

var express = require('express'),
Sequelize = require('sequelize'),
bodyParser = require('body-parser'),

// require mongodb
// mongoose = require('mongoose'),
// MongooseStore = require('express-mongodb')(express),
// Session = mongoose.model('Session'),

app = express();

// create mongo connection with mongoose
// db = "mongodb://localhost:27017/test";
// mongoose.connect(db);

var sequelize = new Sequelize(process.env.GB_URL, {
  host: 'GB_HOST',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


var User = sequelize.import(__dirname + "/models/user");

// User.sync().then(function() {
//   return User.create({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20)
//   });
// }).then(function(jane) {
//   console.log(jane.get({
//     plain: true
//   }))
// });

var Post = sequelize.import(__dirname + "/models/post");

// Post.sync().then(function() {
//   return Post.create({
//     title: "First Post",
//     description: "hey this is the first post in the Node.JS Guestbook"
//   })
// }).then(function(first){
//     console.log(first.get({
//       plain: true
//   }))
// });

app.set('view engine', 'jade');

app.get('/', function (req, res){
	res.render('index');
});

app.get('/new', function (req, res){
  res.render('new_post')
})


app.get('/posts', function (req, res){
  sequelize.query("SELECT * FROM posts",{type: sequelize.QueryTypes.SELECT})
  .then(function (data){
    console.log(data)
    res.render('view_all_posts', {
      data : data
    });
  }) 
})

app.post('/new', function (req, res){
  Post.create({
    title: req.body.title,
    description: req.body.description
  }).then(function(){
    res.redirect('/posts')
  })
});

app.get('/edit/:id', function (req, res){
  var id = req.params.id;
  Post.findById(id)
  .then(function (data){
    console.log(data)
    res.render('edit_post', {
      data : data
    })
  })
})

app.post('/edit/:id', function (req, res){
  var id = req.params.id;
  console.log(id);
  Post.findById(id)
  .then(function (data){
    data.updateAttributes({
      title: req.body.title,
      description: req.body.description
    });
  })
  .then(function(){
    res.redirect("/posts"); 
  });
});

app.get('/delete/:id', function (req, res){
  var id = req.params.id;
  Post.findById(id)
  .then(function (data){
    console.log(data)
    res.render('delete_post', {
      data : data
    })
  })
})

app.post('/delete/:id', function (req, res){
  var id = req.params.id;
  Post.findById(id)
  .then(function (data){   
    data.destroy();
  }).then(function(){
    res.redirect("/posts")
  })
})


app.listen(8000, function(){
	console.log("Frontend server running on port 8000!");
});




