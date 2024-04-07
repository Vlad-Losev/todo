// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// Массив, который содержит в себе все задачи
let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

// Добавляет блок "Список дел пуст"
checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask);

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);

// Функции

// Функция добавления задачи
function addTask(event) {
  // Отменяем отправку формы
  event.preventDefault();
  
  // Достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  // Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем задачу в массив с задачами
  tasks.push(newTask);

  // Сохраняем список задач в хранилище браузера localStorage
  saveToLocalStorage();

  // Рендерим задачу на страницу
  renderTask(newTask);

  // Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = '';
  taskInput.focus();

  // Удаляем блок "Список дел пуст"
  checkEmptyList();
}

// Функция удаление задачи
function deleteTask(event) {
  // Проверяем если клик был Не по кнопке "удалить задачу"
  if (event.target.dataset.action !== 'delete') return;

  // Проверяем что клик был по кнопке "удалить задачу"
  const parenNode = event.target.closest('.list-group-item');

  // Определяем ID задачи
  const id = Number(parenNode.id);

  // Удаляем задачу через фильтрацию массива
  tasks = tasks.filter((task) => task.id !== id);

  // Сохраняем список задач в хранилище браузера localStorage
  saveToLocalStorage();

  // Удаляем задачу из разметки
  parenNode.remove();

  // Добавляем блок "Список дел пуст", если нужно
  checkEmptyList();
}

// Функция. Отмечаем задачу завершенной
function doneTask(event) {
  // Проверяем что клик был Не по кнопке "задача выполнена"
  if (event.target.dataset.action !== "done") return

  // Проверяем что клик был по кнопке "задача выполнена"
  const parentNode = event.target.closest('.list-group-item');

  // Определяем id задачи
  const id = Number(parentNode.id);
  const task = tasks.find((task) => (task.id === id));
  task.done = !task.done;

  // Сохраняем список задач в хранилище браузера localStorage
  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

// Функция. Удаляет или вставляет блок "Список дел пуст"
function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
      <li id="emptyList" class="list-group-item empty-list">
				<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
				<div class="empty-list__title">Список дел пуст</div>
			</li>`;

      tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');

    emptyListEl ? emptyListEl.remove() : null;
  }
}

// Сохранение изменений в localStorage
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
  // Формируем CSS класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
    
  // Формируем разметку для новой задачи
  const taskHTML = 
      `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="${cssClass}">${task.text}</span>
        <div class="task-item__buttons">
          <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
          </button>
          <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
          </button>
        </div>
      </li>`

  // Добавляем задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}