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

//get all the todos from database
app.get('/todos', async (req, res) => {
	try {
	  const result = await pool.query(`
		SELECT todos.*, ARRAY_AGG(tags.name) as tags FROM todos
		LEFT JOIN todo_tags ON todos.id = todo_tags.todo_id
		LEFT JOIN tags ON todo_tags.tag_id = tags.id
		GROUP BY todos.id;
		`)
	  res.json(result.rows)
	} catch (err) {
	  console.error(err)
	  res.status(500).json({ error: 'Internal server error' })
	}
  })

// Create a new todo
app.post('/todos', async (req, res) => {
	const { title, description } = req.body
	try {
	  const result = await pool.query(
		'INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *',
		[title, description]
	  )
	  res.status(201).json(result.rows[0])
	} catch (err) {
	  console.error(err)
	  res.status(500).json({ error: 'Internal server error' })
	}
});

//delete a todo
app.delete('/todos/delete/:id', async (req, res) => {
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

//update a todo
app.patch('/todos/:id', async (req, res) => {
	
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
app.get('/todos/:id', async (req, res) => {
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

// Get all tags
app.get('/todos/tags', async (req, res) => {
	try {
	  const result = await pool.query('SELECT * FROM tags')
	  res.json(result.rows)
	} catch (err) {
	  console.error(err)
	  res.status(500).json({ error: 'Internal server error' })
	}
  })

  // Create a new tag
app.post('/todos/tags', async (req, res) => {
	const { name } = req.body
	try {
	  const result = await pool.query(
		'INSERT INTO tags (name) VALUES ($1) RETURNING *',
		[name]
	  )
	  res.status(201).json(result.rows[0])
	} catch (err) {
	  console.error(err)
	  res.status(500).json({ error: 'Internal server error' })
	}
  })

  // Delete a tag
app.delete('/todos/tags/:id', async (req, res) => {
	const { id } = req.params
	try {
	  const result = await pool.query(
		'DELETE FROM tags WHERE id = $1 RETURNING *',
		[id]
	  )
	  if (result.rows.length === 0) {
		return res.status(404).json({ error: 'Tag not found' })
	  }
	  res.json({ message: 'Tag deleted successfully' })
	} catch (err) {
	  console.error(err)
	  res.status(500).json({ error: 'Internal server error' })
	}
  })

  // Add a tag to a todo
app.post('/todos/:todoId/tags/:tagId', async (req, res) => {
	const { todoId, tagId } = req.params
	try {
	  await pool.query(
		'INSERT INTO todo_tags (todo_id, tag_id) VALUES ($1, $2)',
		[todoId, tagId]
	  )
	  res.status(201).json({ message: 'Tag added to todo successfully' })
	} catch (err) {
	  console.error(err)
	  res.status(500).json({ error: 'Internal server error' })
	}
  })

  // Remove a tag from a todo
app.delete('/todos/:todoId/tags/:tagId', async (req, res) => {
	const { todoId, tagId } = req.params
	try {
	  const result = await pool.query(
		'DELETE FROM todo_tags WHERE todo_id = $1 AND tag_id = $2',
		[todoId, tagId]
	  )
	  if (result.rowCount === 0) {
		return res.status(404).json({ error: 'Todo-tag association not found' })
	  }
	  res.json({ message: 'Tag removed from todo successfully' })
	} catch (err) {
	  console.error(err)
	  res.status(500).json({ error: 'Internal server error' })
	}
  })

  // Get all tags for a specific todo
app.get('/todos/:todoId/tags', async (req, res) => {
	const { todoId } = req.params
	try {
	  const result = await pool.query(
		'SELECT tags.* FROM tags JOIN todo_tags ON tags.id = todo_tags.tag_id WHERE todo_tags.todo_id = $1',
		[todoId]
	  )
	  res.json(result.rows)
	} catch (err) {
	  console.error(err)
	  res.status(500).json({ error: 'Internal server error' })
	}
  })


//delete all completed todos
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

//CRUD create read update and delete


// app.get ('/', async (req, res) => {
// 	try{
// 		const result = await pool.query(`SELECT * FROM todos;`);
// 		res.json(result.rows);
// 	} catch (error){
// 		console.log(error);
// 		res.json({err: "An error occurred"});
// 	}
// })