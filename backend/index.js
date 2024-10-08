const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

app.use(express.json());

let todoData = JSON.parse(fs.readFileSync('database.json', 'utf8'))

//CRUD create read update and delete
app.get ('/', (req, res) => {
	res.send(todoData);
})

function saveDataToFile() {
	fs.writeFileSync('database.json', JSON.stringify(todoData, null, 2), 'utf-8');
}

app.post ('/', (req, res) => {
	const todo = req.body.task;
	const newTodo = {
		id: Date.now(),
		task: todo,
		completed: false
	}
	todoData.push(newTodo);
	saveDataToFile();
	res.send(newTodo);

})

app.delete('/delete/:id', (req, res) => {
	const todoId = parseInt(req.params.id);
	todoData = todoData.filter((todo) => todo.id !== todoId);
	saveDataToFile();
	res.send(todoData);
})

app.put('/todo/:id', (req, res) => {
	const todoId = parseInt(req.params.id);
	const newTodo = req.body.task;

	todoData = todoData.map((todo) => {
		if (todo.id === todoId) {
			return {...todo, ...newTodo, id: todo.id }; //spreads the tdo object and the newTodo object
		}
	return todo;
	})
	saveDataToFile();
	res.send(todoData);
})

//update-status endpoint

app.put('/todo/:id/completed', (req, res) => {
	const todoId = parseInt(req.params.id);
	const newTodo = req.body.completed;

	todoData = todoData.map((todo) => {
		if (todo.id === todoId) {
			return {...todo, ...newTodo};
		}
	return todo;
	})
	saveDataToFile();
	res.send(todoData);
})


//get one todo endpoint

app.get('/todo/:id', (req, res) => {
	const todoId = parseInt(req.params.id);
	const todo = todoData.find((todo) => todo.id === todoId);
	if (!todo){
		res.status(404).json({message: 'Todo not found'})
	}
	else{
		res.json(todo);
	}
});

app.listen(port, () => {
  console.log(`Hello from port ${port}`)
})

// if (!todo){
// 	res.status(404).json({message: 'Todo not found'})
// }
// else{
// 	res.json{ 'todo updated successfully'};
// }
// send