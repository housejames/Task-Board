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
    // Loop through each status in taskList
    for (const [status, tasks] of Object.entries(taskList)) {
      // Find the corresponding lane container based on status
      const lane = $(`#${status.replace(/\s/g, '-').toLowerCase()}-cards`);
      lane.empty(); // Clear the lane container
  
      // Check if tasks array exists and is not empty
      if (Array.isArray(tasks) && tasks.length > 0) {
        // Loop through each task in the tasks array
        tasks.forEach(task => {
          // Create a task card for the current task
          const card = createTaskCard(task);
          // Append the task card to the corresponding lane container
          lane.append(card);
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
  
    // Make lanes droppable
    $(".lane").droppable({
      accept: ".card",
      drop: handleDrop
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
      taskList["To Do"] = []; // Initialize if not exists
    }
  
    // Add task to To Do column
    taskList["To Do"].push(task);
    console.log("Task list after adding task:", taskList); // Check the updated taskList
  
    // Update localStorage and render the task list
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
    const newStatus = $(this).closest('.lane').attr('id'); // Get the ID of the closest lane
    const statusKey = newStatus.replace(/-/g, ' '); // Convert ID to status key format
  
    // Move the task to the new status
    for (const [status, tasks] of Object.entries(taskList)) {
      if (Array.isArray(tasks)) {
        const index = tasks.findIndex(task => task.id == taskId);
        if (index !== -1) {
          const task = tasks.splice(index, 1)[0];
          taskList[statusKey].push(task); // Push the task to the new status
          break;
        }
      }
    }
    
    // Update localStorage and render the task list
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }
  

// Event listener for form submission
$(document).on("submit", "#taskForm", handleAddTask);

// Event listener for delete button
$(document).on("click", ".delete-btn", handleDeleteTask);

// Event listener for save task button
$(document).on("click", "#saveTaskBtn", handleAddTask);

$("#saveTaskBtn").click(handleAddTask);

// Initialize task list and make lanes droppable on page load
$(document).ready(function () {
  renderTaskList();
});
