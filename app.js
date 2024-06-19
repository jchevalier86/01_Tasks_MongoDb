// Ajoute un écouteur d'événement pour 'DOMContentLoaded' qui s'exécute lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  // Récupère le formulaire de tâches par son ID
  const taskForm = document.getElementById('task-form');
  // Récupère le corps du tableau de tâches par son ID
  const taskTable = document.getElementById('task-table').getElementsByTagName('tbody')[0];

  // Fonction asynchrone pour récupérer les tâches depuis le serveur
  const fetchTasks = async () => {
      // Envoie une requête GET pour obtenir la liste des tâches
      const response = await fetch('http://localhost:3000/tasks');
      // Convertit la réponse en JSON
      const tasks = await response.json();
      // Vide le tableau de tâches
      taskTable.innerHTML = '';
      // Pour chaque tâche, l'ajoute au tableau
      tasks.forEach(task => {
          addTaskToTable(task);
      });
  };

  // Fonction pour ajouter une tâche au tableau
  const addTaskToTable = (task) => {
      // Insère une nouvelle ligne dans le tableau
      const row = taskTable.insertRow();
      // Associe l'ID de la tâche à l'attribut de la ligne
      row.setAttribute('data-id', task._id);

      // Crée et remplit la cellule du titre
      const titleCell = row.insertCell(0);
      titleCell.textContent = task.title;

      // Crée et remplit la cellule de la description
      const descriptionCell = row.insertCell(1);
      descriptionCell.textContent = task.description;

      // Crée et remplit la cellule des actions avec des boutons pour éditer et supprimer
      const actionsCell = row.insertCell(2);
      actionsCell.innerHTML = `
          <div class="actions">
              <button onclick="editTask('${task._id}')">Edit</button>
              <button onclick="deleteTask('${task._id}')">Delete</button>
          </div>
      `;
  };

  // Ajoute un écouteur d'événement pour soumettre le formulaire de tâche
  taskForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire
      // Récupère les valeurs du titre et de la description depuis le formulaire
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;

      // Envoie une requête POST pour ajouter une nouvelle tâche
      const response = await fetch('http://localhost:3000/tasks', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, description }) // Envoie les données de la nouvelle tâche en JSON
      });

      // Convertit la réponse en JSON et ajoute la nouvelle tâche au tableau
      const newTask = await response.json();
      addTaskToTable(newTask);
      taskForm.reset(); // Réinitialise le formulaire
  });

  // Fonction pour éditer une tâche
  window.editTask = async (id) => {
      // Demande à l'utilisateur d'entrer un nouveau titre et une nouvelle description
      const title = prompt('Enter new title');
      const description = prompt('Enter new description');

      // Envoie une requête PUT pour mettre à jour la tâche
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, description }) // Envoie les données mises à jour de la tâche en JSON
      });

      // Convertit la réponse en JSON et met à jour la tâche dans le tableau
      const updatedTask = await response.json();
      const row = document.querySelector(`tr[data-id='${id}']`);
      row.cells[0].textContent = updatedTask.title;
      row.cells[1].textContent = updatedTask.description;
  };

  // Fonction pour supprimer une tâche
  window.deleteTask = async (id) => {
      // Envoie une requête DELETE pour supprimer la tâche
      await fetch(`http://localhost:3000/tasks/${id}`, {
          method: 'DELETE'
      });

      // Supprime la ligne correspondante du tableau
      const row = document.querySelector(`tr[data-id='${id}']`);
      row.remove();
  };

  // Appelle la fonction pour récupérer et afficher les tâches au chargement de la page
  fetchTasks();
});  