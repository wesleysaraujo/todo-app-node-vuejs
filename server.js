// set up
var express = require('express');
var mongoose = require('mongoose');
var morgan  = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

// configuration
mongoose.connect('mongodb://usertodo:todo#123@jello.modulusmongo.net:27017/x6osUwum');

app.use(express.static(__dirname + '/public')); // set arquivos estáticos em /public
app.use(morgan('dev'));    // log de qualquer requisição para o console
app.use(bodyParser.urlencoded({'extended' : true})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js)
app.listen(8080);
console.log("App rodando na porta 8080");

// define model
var Todo = mongoose.model('Todo',{
	text : String
});

// Routes
// api
// Get all todos
app.get('/api/todos', function(req, res){
	// use mongoose to get all todos in te database
	Todo.find(function(err, todos){
		if (err)
			res.send(err)

		res.json(todos); // return all todos in JSON format
	});
});

// Create todo and send back all tdos after creation
app.post('/api/todos', function(req, res) {
	// create a todo, information comes from AJAX request form Vue.js
	Todo.create({
		text : req.body.text,
		done : false
	}, function(err, todo) {
		if (err)
			res.send(err)

		Todo.find(function(err, todos) {
			if (err)
				res.send(err)

			res.json(todos);
		});
	});
});

// Delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err)

		Todo.find(function (err, todos) {
			if(err)
				res.send(err)
			res.json(todos);
		});
	});
});

//
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});