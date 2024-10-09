const express = require('express')
const {Pool} = require('pg')
const app = express()
const port = 3000

app.use(express.json());

// let todoData = JSON.parse(fs.readFileSync('database.json', 'utf8'))

const pool = new Pool({
	user: 'youruser',
	host: 'localhost',
	database: 'tododb',
	password: 'yourpassword',
	port: 5432,
  })

//CRUD create read update and delete
app.get ('/', async (req, res) => {
	try{
		const result = await pool.query(`SELECT * FROM todos;`);
		res.json(result.rows);
	} catch (error){
		console.log(error);
		res.json({err: "An error occurred"});
	}
})

app.post ('/', async (req, res) => {
	const todo = req.body;
	const newTodo = {
		title: todo.title,
		description: todo.description
	}

	const result = await pool.query(
		`INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *;`,
		[newTodo.title, newTodo.description]
	);
	res.json(result);
})

app.delete('/delete/:id', async (req, res) => {
	const todoId = parseInt(req.params.id);
	try{
	const result = await pool.query(
		`DELETE FROM todos WHERE id=($1) RETURNING title;`,
		[todoId]);
	res.json({result: result.rows[0].title + " has been deleted"});
	}catch {
		console.log(error);
		res.json({err: "An error occurred"});
	}
})

app.patch('/todo/:id', async (req, res) => {
	
	const todoId = parseInt(req.params.id);
	try{
		const result = await pool.query(
			`UPDATE todos SET completed = true WHERE id=($1) RETURNING *;`,
			[todoId]
		);
		res.json(result);
	}
	catch (error){
		console.log(error);
		res.json({err: "An error occurred"});
	}
})

//get one todo

app.get('/todo/:id', async (req, res) => {
	const todoId = parseInt(req.params.id);
	try{
		const res = await pool.query(
			`SELECT * FROM todos WHERE id=($1);`,
			[todoId]
		);
		res.json(result.rows);
	}catch (error){
		console.log(error);
		res.status(500).json({err: "Internal server error"});
	}
});

//get all the todos from database with left join

app.get('/todos', async (req, res) => {
	try{
		const res = await pool.query(
			`SELECT todos.*, ARRAY_AGG(tags.name) as tags FROM todos LEFT JOIN todo_tags ON todos.id = todo_tags.todo_id LEFT JOIN tags ON todo_tags.tag_id = tags.id GROUP BY todos.id;`
		);
		res.json(result.rows);
	}catch (error){
		console.log(error);
		res.status(500).json({err: "Internal server error"});
	}
});

//creating a new todo

app.post('/todo', async (req, res) => {
	const todo = req.body;
	const newTodo = {
		title: todo.title,
		description: todo.description
	}
	try{
		const result = await pool.query(
			`INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *;`,
			[newTodo.title, newTodo.description]
		);
		res.json(result.rows);
	}catch (error){
		console.log(error);
		res.status(500).json({err: "Internal server error"});
	}
});

app.delete('/todos/completed', async (req, res) => {
	try{
		const res = await pool.query(`DELETE FROM todos WHERE completed = true;`);
		res.json({message: "All completed todos have been deleted"});
	}catch (error){
		console.log(error);
		res.status(500).json({err: "Internal server error"});
	}
});

app.listen(port, () => {
  console.log(`Hello from port ${port}`)
})


// function saveDataToFile() {
// 	fs.writeFileSync('database.json', JSON.stringify(todoData, null, 2), 'utf-8');
// }

//delete all done todos



	// const newTodo = req.body.task;

	// todoData = todoData.map((todo) => {
	// 	if (todo.id === todoId) {
	// 		return {...todo, ...newTodo, id: todo.id }; //spreads the tdo object and the newTodo object
	// 	}
	// return todo;
	// })
	// saveDataToFile();
	// res.send(todoData);

//update-status endpoint

// app.put('/todo/:id/completed', (req, res) => {
// 	const todoId = parseInt(req.params.id);
// 	const newTodo = req.body.completed;

// 	todoData = todoData.map((todo) => {
// 		if (todo.id === todoId) {
// 			return {...todo, ...newTodo};
// 		}
// 	return todo;
// 	})
// 	saveDataToFile();
// 	res.send(todoData);
// })