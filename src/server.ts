import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Middleware pour permettre les requêtes cross-origin
app.use(cors());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/taskdb', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
});

// Définition du schéma pour une tâche
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

// Création du modèle Task basé sur le schéma
const Task = mongoose.model('Task', taskSchema);

// Route pour obtenir toutes les tâches
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  console.log('get all tasks');
  res.json(tasks); // Retourne toutes les tâches en format JSON
});

// Route pour ajouter une nouvelle tâche
app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body); // Crée une nouvelle tâche avec les données du corps de la requête
  await newTask.save(); // Sauvegarde la nouvelle tâche dans la base de données
  res.json(newTask); // Retourne la nouvelle tâche en format JSON
  console.log('add task');
});

// Route pour mettre à jour une tâche existante
app.put('/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Met à jour la tâche avec l'ID donné
  res.json(updatedTask); // Retourne la tâche mise à jour en format JSON
  console.log('update task');
});

// Route pour supprimer une tâche existante
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id); // Supprime la tâche avec l'ID donné
  console.log('delete task');
  res.sendStatus(204); // Retourne un statut 204 (No Content) pour indiquer que la suppression a réussi
});

// Démarre le serveur et écoute sur le port défini
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});