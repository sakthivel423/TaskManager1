document.addEventListener('DOMContentLoaded', function() {
  const startTimerBtn = document.getElementById('startTimerBtn');
  const stopTimerBtn = document.getElementById('stopTimerBtn');
  const timerDisplay = document.getElementById('timerDisplay');
  const taskTableBody = document.getElementById('taskTableBody');
  const filterDropdown = document.getElementById('filterDropdown');

  let startTime;
  let intervalId;
  let tasks = [];

  startTimerBtn.addEventListener('click', function() {
      startTime = new Date().getTime();
      intervalId = setInterval(updateDuration, 1000);
  });

  stopTimerBtn.addEventListener('click', function() {
      const endTime = new Date().getTime();
      const duration = formatDuration(endTime - startTime);
      clearInterval(intervalId);
      timerDisplay.textContent = '00:00:00';
      const taskName = document.getElementById('taskName').value;
      const taskDescription = document.getElementById('taskDescription').value;
      addTaskToArray(taskName, taskDescription, duration);
  });

  function updateDuration() {
      const currentTime = new Date().getTime();
      const duration = formatDuration(currentTime - startTime);
      timerDisplay.textContent = duration;
  }

  function formatDuration(duration) {
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((duration % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function addTaskToArray(name, description, duration) {
      const task = { name, description, duration };
      tasks.push(task);
      renderTasks(tasks);
      updateFilterDropdown(tasks);
  }

  function renderTasks(tasks) {
      taskTableBody.innerHTML = '';
      tasks.forEach((task, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${task.name}</td>
              <td>${task.description}</td>
              <td>${task.duration}</td>
              <td>
                  <button class="editBtn">Edit</button>
                  <button class="deleteBtn">Delete</button>
              </td>
          `;
          taskTableBody.appendChild(row);

          // Add event listeners to edit and delete buttons
          const editBtn = row.querySelector('.editBtn');
          editBtn.addEventListener('click', function() {
              editTask(index);
          });

          const deleteBtn = row.querySelector('.deleteBtn');
          deleteBtn.addEventListener('click', function() {
              deleteTask(index);
          });
      });
  }

  function updateFilterDropdown(tasks) {
      filterDropdown.innerHTML = '<option value="">All Tasks</option>';

      const uniqueTaskNames = [...new Set(tasks.map(task => task.name))];
      uniqueTaskNames.map(name => {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          filterDropdown.appendChild(option);
      });

      // Enable dropdown box
      filterDropdown.disabled = false;
  }

  function editTask(index) {
      const task = tasks[index];
      const newName = prompt("Enter new task name:", task.name);
      const newDescription = prompt("Enter new task description:", task.description);
      if (newName !== null && newDescription !== null) {
          tasks[index].name = newName;
          tasks[index].description = newDescription;
          renderTasks(tasks);
          updateFilterDropdown(tasks);
      }
  }

  function deleteTask(index) {
      tasks.splice(index, 1);
      renderTasks(tasks);
      updateFilterDropdown(tasks);
  }

  // Filter tasks based on task name
  filterDropdown.addEventListener('change', function() {
      const selectedTaskName = this.value;
      const filteredTasks = selectedTaskName ? tasks.filter(task => task.name === selectedTaskName) : tasks;
      renderTasks(filteredTasks);
  });
});
