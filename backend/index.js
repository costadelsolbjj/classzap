require('dotenv').config(); // Load environment variables
const { MongoClient, ObjectId } = require('mongodb'); // Ensure ObjectId is imported
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
console.log('uri:', uri);

let sessions = {};

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db('classzapdb');
    const weeksCollection = db.collection('weeks');
    const usersCollection = db.collection('users');

    // Endpoint to create a new week
    app.post('/api/weeks', async (req, res) => {
      const newWeek = req.body;
      const result = await weeksCollection.insertOne(newWeek);
      res.status(201).send(result.ops[0]);
    });

    // Endpoint to add a class to a specific day
    app.post('/api/weeks/:weekId/days/:dayOfWeek/classes', async (req, res) => {
      const { weekId, dayOfWeek } = req.params;
      const newClass = req.body;
      const result = await weeksCollection.updateOne(
        { _id: new ObjectId(weekId), "days.dayOfWeek": dayOfWeek },
        { $push: { "days.$.classes": newClass } }
      );
      res.send(result);
    });

    // Endpoint to register a student to a class
    app.post('/api/weeks/:weekId/days/:dayOfWeek/classes/:classTime/register', async (req, res) => {
      const { weekId, dayOfWeek, classTime } = req.params;
      const { studentName } = req.body;
      const result = await weeksCollection.updateOne(
        { _id: new ObjectId(weekId), "days.dayOfWeek": dayOfWeek, "days.classes.time": classTime },
        { $push: { "days.$.classes.$[class].students": studentName } },
        { arrayFilters: [{ "class.time": classTime }] }
      );
      const updatedWeek = await weeksCollection.findOne({ _id: new ObjectId(weekId) });
      res.send(updatedWeek.days.find(day => day.dayOfWeek === dayOfWeek).classes.find(cls => cls.time === classTime));
    });

    // Endpoint to remove a student from a class
    app.post('/api/weeks/:weekId/days/:dayOfWeek/classes/:classTime/remove', async (req, res) => {
      const { weekId, dayOfWeek, classTime } = req.params;
      const { studentName } = req.body;
      const result = await weeksCollection.updateOne(
        { _id: new ObjectId(weekId), "days.dayOfWeek": dayOfWeek, "days.classes.time": classTime },
        { $pull: { "days.$.classes.$[class].students": studentName } },
        { arrayFilters: [{ "class.time": classTime }] }
      );
      const updatedWeek = await weeksCollection.findOne({ _id: new ObjectId(weekId) });
      res.send(updatedWeek.days.find(day => day.dayOfWeek === dayOfWeek).classes.find(cls => cls.time === classTime));
    });

    // Endpoint to get the week schedule by weekStartDate
    app.get('/api/weeks/start/:weekStartDate', async (req, res) => {
      const { weekStartDate } = req.params;
      const week = await weeksCollection.findOne({ weekStartDate: weekStartDate });
      console.log('Week Schedule:', week); // Log the result
      res.send(week);
    });

 // Endpoint to get the schedule for a specific day
 app.get('/api/weeks/day/:date', async (req, res) => {
  const { date } = req.params;
  const result = await weeksCollection.aggregate([
    { $unwind: "$days" },
    { $match: { "days.date": date } },
    { $project: { _id: 0, dayOfWeek: "$days.dayOfWeek", date: "$days.date", classes: "$days.classes" } }
  ]).toArray();
  if (result.length > 0) {
    res.send(result[0]);
  } else {
    res.status(404).send({ message: 'Schedule not found for this date' });
  }
});

    // Endpoint to handle login
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

    // Endpoint to get users
    app.get('/api/users', async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      const allUsers = users.map(user => ({ email: user.email, name: user.name }));
      res.send(allUsers);
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);
