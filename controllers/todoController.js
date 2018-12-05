var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to Mongoose Database
// console.log(process.env.MONGO_ATLAS_PW);
var url = 'mongodb://todo12:todo12@ds129051.mlab.com:29051/node-todo';
mongoose.connect( url , {useNewUrlParser: true});

//Create  a Schema - this is like blueprint
var todoSchema = new mongoose.Schema({
  item : String
});

var Todo = mongoose.model('Todo', todoSchema);
var itemOne = Todo({item : 'Learn SCSS'}).save(function(err){
  if(err) throw err;
  console.log('Item saved!');
});

// var data = [{item : 'Complete Node JS'}, {item : 'Complete ToDo App'}, {item : 'Learn Mustache'}];

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
module.exports = function(app){
  app.get('/todo', (req,res)=>{
    //Get data from mongodb and pass it to view
    Todo.find({}, function(err,data){
      if(err) throw err;
      res.render('todo.ejs', {todos: data});
    });
  });

  app.post('/todo', urlencodedParser, (req,res)=>{
    //Get data from view and pass it to mongodb
    var newTodo = Todo(req.body).save(function(err,data){
      if(err) throw err;
      res.render('todo', {todos: data});
    });
    //Normal to add item to object item
  });

  app.delete('/todo/:item', (req,res)=>{
    //Delete the item from mongodb
      Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
        if(err) throw err;
        res.render('todo', {todos: data});
      });

    //Normal object item delete using filter
    // data = data.filter(function(todo){
    //    return todo.item.replace(/ /g, '-') !== req.params.item;
    // });
    // res.render('todo', {todos: data});
  });
};
