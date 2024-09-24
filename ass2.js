const { program } = require('commander');
const fs = require('fs');
const path = require('path');

// File path to store todos
const TODO_FILE = path.join(__dirname, 'todos.json');

// Ensure the todos.json file exists
if (!fs.existsSync(TODO_FILE)) {
    fs.writeFileSync(TODO_FILE, JSON.stringify([]));
}

// Function to load todos from the file
function loadTodos() {
    const data = fs.readFileSync(TODO_FILE);
    return JSON.parse(data);
}

// Function to save todos to the file
function saveTodos(todos) {
    fs.writeFileSync(TODO_FILE, JSON.stringify(todos, null, 4));
}

// Add a todo
function addTodo(todoText) {
    const todos = loadTodos();
    const newTodo = {
        id: Date.now(),
        text: todoText,
        done: false,
    };
    todos.push(newTodo);
    saveTodos(todos);
    console.log(`Added: "${todoText}"`);
}

// Delete a todo by id
function deleteTodo(id) {
    let todos = loadTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    if (todos.length === filteredTodos.length) {
        console.log(`Todo with ID: ${id} not found.`);
    } else {
        saveTodos(filteredTodos);
        console.log(`Deleted todo with ID: ${id}`);
    }
}

// Mark a todo as done by id
function markTodoAsDone(id) {
    const todos = loadTodos();
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
        todo.done = true;
        saveTodos(todos);
        console.log(`Marked todo with ID: ${id} as done.`);
    } else {
        console.log(`Todo with ID: ${id} not found.`);
    }
}

// Lists all todos
function listTodos() {
    const todos = loadTodos();
    if (todos.length === 0) {
        console.log('No todos found!');
    } else {
        todos.forEach((todo) => {
            console.log(`[${todo.done ? 'x' : ' '}] ${todo.id} - ${todo.text}`);
        });
    }
}

// Commander.js CLI setup
program
  .command('add <todo>')
  .description('Add a new todo')
  .action((todo) => {
    addTodo(todo);
  });

program
  .command('delete <id>')
  .description('Delete a todo by ID')
  .action((id) => {
    const todoId = parseInt(id);
    if (!isNaN(todoId)) {
      deleteTodo(todoId);
    } else {
      console.log('Please provide a valid todo ID.');
    }
  });

program
  .command('done <id>')
  .description('Mark a todo as done by ID')
  .action((id) => {
    const todoId = parseInt(id);
    if (!isNaN(todoId)) {
      markTodoAsDone(todoId);
    } else {
      console.log('Please provide a valid todo ID.');
    }
  });

program
  .command('list')
  .description('List all todos')
  .action(() => {
    listTodos();
  });

program.parse(process.argv);
