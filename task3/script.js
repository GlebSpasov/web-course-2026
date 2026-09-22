let todos = [];
let currentFilter = 'all';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const errorMessage = document.getElementById('error-message');
const todoList = document.getElementById('todo-list');
const activeCountEl = document.getElementById('active-count');
const completedCountEl = document.getElementById('completed-count');
const filterBtns = document.querySelectorAll('.filter-btn');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (!text) {
        errorMessage.textContent = 'Поле не должно быть пустым!';
        return;
    }

    errorMessage.textContent = '';
    addTodo(text);
    input.value = '';
    input.focus();
});

input.addEventListener('input', () => {
    if (input.value.trim()) {
        errorMessage.textContent = '';
    }
});

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

function addTodo(text) {
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    todos.push(newTodo);
    render();
}

function toggleTodo(id) {
    todos = todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    render();
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    render();
}

function render() {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter((todo) => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    filteredTodos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-item__content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-item__checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const span = document.createElement('span');
        span.className = `todo-item__text ${todo.completed ? 'completed' : ''}`;
        span.textContent = todo.text;

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.title = 'Удалить задачу';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });

    const activeCount = todos.filter((todo) => !todo.completed).length;
    const completedCount = todos.filter((todo) => todo.completed).length;

    activeCountEl.textContent = activeCount;
    completedCountEl.textContent = completedCount;
}

render();