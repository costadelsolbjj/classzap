const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let classes = [];
let students = [];

app.post('/api/classes', (req, res) => {
  const newClass = { id: Date.now(), ...req.body };
  classes.push(newClass);
  res.status(201).send(newClass);
});

app.get('/api/classes', (req, res) => {
  res.send(classes);
});

app.post('/api/students', (req, res) => {
  const newStudent = { id: Date.now(), ...req.body };
  students.push(newStudent);
  res.status(201).send(newStudent);
});

app.post('/api/classes/:id/register', (req, res) => {
  const classId = req.params.id;
  const student = req.body.studentName;
  const cls = classes.find(c => c.id == classId);
  if (cls) {
    cls.students = cls.students || [];
    cls.students.push(student);
    res.send(cls);
  } else {
    res.status(404).send({ message: 'Class not found' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
