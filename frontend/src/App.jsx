import './styles.css';
import React, { useEffect, useId, useState } from 'react';



const App = () => {

const [todoList, setTodoList] = useState([]);
const [editingTodo, setEditingTodo] = useState(null);
const [viewCompleted, setViewCompleted] = useState(false);
const [editingText, setEditingText] = useState("");

useEffect(() => {
  refreshList();

}, [])

const refreshList = () => {
  fetch("/todos")
  .then((response) => response.json())
  .then((data) => setTodoList(data))
  .catch((error) => console.error["Error fetching todos:", error])
}


const handleAdd = () =>{
  //handleAdd
  //form
  //POST
  //update
  //editing state
  const newTodo = { title: "New Task text", description: "no description" };
  fetch("/todos", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(newTodo),
  })
  .then(refreshList())
  .catch((error) => console.error("Error adding todo:", error));
};


const handleDelete = (id) => {
  //handleDelete
  //select
  //DELETE
  //update
  fetch(`/todos/delete/${id}`, {
    method: "DELETE"
  })
  .then(refreshList())
  .catch((error) => console.error("Error deleting todo:", error));
};

const handleEditClick = (todo) => {
  //handleEdit
  //select
  //PUT
  //update
  setEditingTodo(todo.id);
  setEditingText(todo.title);
const handleEditingChange = (event) => {
  setEditingText(event.target.value);
}
}

const handleSave = (id) => {
  title: editingText
fetch(`/todos/$(id)`, {
  method: "PUT",
  headers: {"Constent-Type": "application/json" },
  headers: JSON.stringify(updatedTodo),
})
then (() => {
  setEditingTodo(null);
  setEditingText("")
  refreshList
})
.catch((error) => console.error("Error deleting todo:", error));
}

//viewCompleted
//GET
//state

const renderItems = () => {
  //renderList
  //fetch the data
  //visualize
  //state
  const newItems = todoList;

  return newItems.map((item) => (
    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
    {item.title}: {item.description}
    <span>(
        <input
        type='text'
        value={editingText}
        className="form=control"/>
      )
      <button className="btn btn primary mr-2" onClick={() => handleSave(item.id)}>
        save
      </button>
      <button className="btn btn-danger mr-2"
      onClick={()=> handleDelete(item.id)}>
        Delete
      </button>
    </span>
    </li>
  ))
}

return (
  <main className="container">
    <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
    <div className="row">
      <div className="col-md-6 col-sm-10 mx-auto p-0">
        <div className="card p-3">
          <div className="mb-4">
            <button
              className="btn btn-primary"
              onClick={handleAdd}>
                Add Task
            </button>
            <ul className="list-group list-group-flush border-top-0">
              {renderItems()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}

export default App;
