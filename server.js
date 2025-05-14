const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function loadTodos() {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
}

function saveTodos(todos) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
}

app.get('/api/todos', (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const todos = loadTodos();
  const newTodo = {
    id: Date.now().toString(),
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(newTodo);
});

app.delete('/api/todos/:id', (req, res) => {
  let todos = loadTodos();
  todos = todos.filter(todo => todo.id !== req.params.id);
  saveTodos(todos);
  res.sendStatus(204);
});

app.patch('/api/todos/:id/toggle', (req, res) => {
  const todos = loadTodos();
  const todo = todos.find(t => t.id === req.params.id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
    res.json(todo);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});
