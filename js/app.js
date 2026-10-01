// Secure Dynamic Task Manager
// Task markup is built only with createElement() and textContent.

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const EMPTY_MESSAGE = "Task cannot be empty";
let taskCounter = 0;

// Generates an ID that is unique even if one is already in the DOM.
function generateTaskId() {
  let id;
  do {
    taskCounter += 1;
    id = "task-" + taskCounter;
  } while (taskList.querySelector('[data-task-id="' + id + '"]'));
  return id;
}

function showMessage(text) {
  taskMessage.textContent = text;
}

function clearMessage() {
  taskMessage.textContent = "";
}

// Creates and returns one task <li>. Does NOT attach it to #taskList.
function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("complete-btn");
  completeBtn.type = "button";
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.type = "button";
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.type = "button";
  removeBtn.textContent = "Remove";

  li.append(span, completeBtn, editBtn, removeBtn);
  return li;
}

// Validates, creates, appends, and resets the form.
function addTask(taskText) {
  const text = taskText.trim();
  if (text === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const taskItem = createTaskElement(text, generateTaskId());
  taskList.appendChild(taskItem);

  taskInput.value = "";
  clearMessage();
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  const isCompleted = taskItem.classList.toggle("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

// Swaps the task text span for an edit input; Edit button becomes Save.
function beginTaskEdit(taskItem) {
  const span = taskItem.querySelector(".task-text");
  if (!span) return;

  const input = document.createElement("input");
  input.type = "text";
  input.classList.add("edit-input");
  input.value = span.textContent;

  taskItem.replaceChild(input, span);
  taskItem.querySelector(".edit-btn").textContent = "Save";
  input.focus();
}

// Validates the edit, swaps the input back for a span; Save becomes Edit.
function saveTaskEdit(taskItem) {
  const input = taskItem.querySelector(".edit-input");
  if (!input) return;

  const text = input.value.trim();
  if (text === "") {
    showMessage(EMPTY_MESSAGE);
    return;
  }

  const span = document.createElement("span");
  span.classList.add("task-text");
  span.textContent = text;

  taskItem.replaceChild(span, input);
  taskItem.querySelector(".edit-btn").textContent = "Edit";
  clearMessage();
}

function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

// Counts are always derived from the live DOM.
function updateTaskCounts() {
  const items = taskList.querySelectorAll(".task-item");
  let completed = 0;
  items.forEach(function (item) {
    if (item.dataset.state === "completed") completed += 1;
  });

  totalCount.textContent = items.length;
  completedCount.textContent = completed;
  pendingCount.textContent = items.length - completed;
}

// The single delegated click handler for all task-level actions.
function handleTaskListClick(event) {
  const target = event.target;
  if (!target.matches("button")) return;

  const taskItem = target.closest(".task-item");
  if (!taskItem || !taskList.contains(taskItem)) return;

  if (target.classList.contains("complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.classList.contains("edit-btn")) {
    if (taskItem.querySelector(".edit-input")) {
      saveTaskEdit(taskItem);
    } else {
      clearMessage();
      beginTaskEdit(taskItem);
    }
  } else if (target.classList.contains("remove-btn")) {
    removeTask(taskItem);
  }
}

// Builds the three sample tasks in a DocumentFragment, appended once.
function loadSampleTasks() {
  const samples = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();
  samples.forEach(function (text) {
    fragment.appendChild(createTaskElement(text, generateTaskId()));
  });

  taskList.appendChild(fragment);
  clearMessage();
  updateTaskCounts();
}

// Event wiring: exactly one click listener on #taskList.
taskList.addEventListener("click", handleTaskListClick);
addTaskBtn.addEventListener("click", function () {
  addTask(taskInput.value);
});
loadSamplesBtn.addEventListener("click", loadSampleTasks);
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTask(taskInput.value);
});

updateTaskCounts();