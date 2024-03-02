// Retrieve tasks and nextId from localStorage or initialize if empty
let taskList = JSON.parse(localStorage.getItem("tasks")) || { "To Do": [], "In Progress": [], "Completed": [] };
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  return `
    <div class="card mb-3 draggable" id="task-${task.id}">
      <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text">Deadline: ${task.deadline}</p>
        <button type="button" class="btn btn-danger delete-btn">Delete</button>
      </div>
    </div>
  `;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    for (const [status, tasks] of Object.entries(taskList)) {
      const lane = $(`#${status.replace(/\s/g, '-').toLowerCase()}-cards`);
      console.log("Lane:", lane); // Log the lane container
      lane.empty();
      if (Array.isArray(tasks)) {
        tasks.forEach(task => {
          const card = createTaskCard(task);
          lane.append(card); // Append the card to the lane container
        });
      }
    }
    
    // Make task cards draggable
    $(".draggable").draggable({
      revert: "invalid",
      zIndex: 1000,
      start: function(event, ui) {
        $(this).addClass("dragging");
      },
      stop: function(event, ui) {
        $(this).removeClass("dragging");
      }
    });
  }
  
  

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    console.log("Add task button clicked!"); // Check if the function is triggered
  
    const title = $("#taskTitle").val();
    const description = $("#taskDescription").val();
    const deadline = $("#taskDeadline").val();
    console.log("Task details:", title, description, deadline); // Check the task details
  
    const id = generateTaskId();
    const task = { id, title, description, deadline };
    console.log("Task:", task); // Check the task object
  
    // Check if "To Do" property exists in taskList
    if (!taskList["To Do"]) {
      taskList["To Do"] = [];
    }
  
    // Add task to To Do column
    taskList["To Do"].push(task);
    console.log("Task list after adding task:", taskList); // Check the updated taskList
  
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
    
    renderTaskList();
    
    // Clear form fields and close modal
    $("#taskForm")[0].reset();
    $("#formModal").modal("hide");
  }
  
// Function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).closest(".card").attr("id").split("-")[1];
  for (const [status, tasks] of Object.entries(taskList)) {
    if (Array.isArray(tasks)) {
      const index = tasks.findIndex(task => task.id == taskId);
      if (index !== -1) {
        tasks.splice(index, 1);
        break;
      }
    }
  }
  renderTaskList();
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr("id").split("-")[1];
  const newStatus = $(this).attr("id").split("-")[0].replace(/-/g, " ");
  
  for (const [status, tasks] of Object.entries(taskList)) {
    if (Array.isArray(tasks)) {
      const index = tasks.findIndex(task => task.id == taskId);
      if (index !== -1) {
        const task = tasks.splice(index, 1)[0];
        taskList[newStatus].push(task);
        break;
      }
    }
  }
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Event listener for form submission
$(document).on("submit", "#taskForm", handleAddTask);

// Event listener for delete button
$(document).on("click", ".delete-btn", handleDeleteTask);

// Event listener for save task button
$(document).on("click", "#saveTaskBtn", function(event) {
    $("#taskForm").submit(); // Simulate form submission
});

// Make lanes droppable
$(".lane").droppable({
  accept: ".card",
  drop: handleDrop
});

// Initialize task list and make lanes droppable on page load
$(document).ready(function () {
  renderTaskList();
});
