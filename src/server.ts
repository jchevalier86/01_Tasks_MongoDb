import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/taskdb', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  console.log('get all tasks');
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
  console.log('add task');
});

app.put('/tasks/:id', async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
  console.log('update task');
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  console.log('delete task');
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});