document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTable = document.getElementById('task-table').getElementsByTagName('tbody')[0];
  
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:3000/tasks');
      const tasks = await response.json();
      taskTable.innerHTML = '';
      tasks.forEach(task => {
        addTaskToTable(task);
      });
    };
  
    const addTaskToTable = (task) => {
      const row = taskTable.insertRow();
      row.setAttribute('data-id', task._id);
  
      const titleCell = row.insertCell(0);
      titleCell.textContent = task.title;
  
      const descriptionCell = row.insertCell(1);
      descriptionCell.textContent = task.description;
  
      const actionsCell = row.insertCell(2);
      actionsCell.innerHTML = `
        <div class="actions">
          <button onclick="editTask('${task._id}')">Edit</button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        </div>
      `;
    };
  
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
  
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      });
  
      const newTask = await response.json();
      addTaskToTable(newTask);
      taskForm.reset();
    });
  
    window.editTask = async (id) => {
      const title = prompt('Enter new title');
      const description = prompt('Enter new description');
  
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description })
      });
  
      const updatedTask = await response.json();
      const row = document.querySelector(`tr[data-id='${id}']`);
      row.cells[0].textContent = updatedTask.title;
      row.cells[1].textContent = updatedTask.description;
    };
  
    window.deleteTask = async (id) => {
      await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
      });
  
      const row = document.querySelector(`tr[data-id='${id}']`);
      row.remove();
    };
  
    fetchTasks();
  });
  