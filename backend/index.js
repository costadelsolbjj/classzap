require('dotenv').config(); // Load environment variables first
const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = process.env.COSMOSDB_URI;
if (!uri) {
  console.error('COSMOSDB_URI is not defined. Please check your .env file.');
  process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let classes = [
  { id: 1, name: 'Jiu-Jitsu Gi', time: '06:00', day: 'Monday', students: [] },
  { id: 2, name: 'Jiu-Jitsu Gi', time: '06:00', day: 'Tuesday', students: [] },
  { id: 3, name: 'Jiu-Jitsu Gi', time: '06:00', day: 'Wednesday', students: [] },
  { id: 4, name: 'Jiu-Jitsu Gi', time: '06:00', day: 'Thursday', students: [] },
  { id: 5, name: 'Jiu-Jitsu Gi', time: '06:00', day: 'Friday', students: [] },
  { id: 6, name: 'Jiu-Jitsu Gi', time: '06:00', day: 'Saturday', students: [] },
  { id: 7, name: 'Jiu-Jitsu Gi', time: '06:00', day: 'Sunday', students: [] },
];

let sessions = {};

client.connect(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const db = client.db('classzapdb');
  const usersCollection = db.collection('users');

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email, password });
    if (user) {
      const sessionId = Date.now().toString();
      sessions[sessionId] = user;
      res.send({ sessionId, user });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  });

  app.get('/api/classes', (req, res) => {
    res.send(classes);
  });

  app.post('/api/classes/:id/register', (req, res) => {
    const classId = parseInt(req.params.id);
    const student = req.body.studentName;
    const cls = classes.find(c => c.id === classId);
    if (cls) {
      if (!cls.students.includes(student)) {
        cls.students.push(student);
      }
      res.send(cls);
    } else {
      res.status(404).send({ message: 'Class not found' });
    }
  });

  app.get('/api/users', async (req, res) => {
    const users = await usersCollection.find({}).toArray();
    const allUsers = users.map(user => ({ email: user.email, name: user.name }));
    res.send(allUsers);
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
