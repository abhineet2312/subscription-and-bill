// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const mongoURL = 'mongodb://127.0.0.1:27017';
const dbName = 'subscription_tracker';

let db;
let subscriptions;

MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log("✅ Connected to MongoDB");
    db = client.db(dbName);
    subscriptions = db.collection('subscriptions');
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

app.get('/subscriptions', async (req, res) => {
  const data = await subscriptions.find().toArray();
  res.json(data);
});

app.post('/subscriptions', async (req, res) => {
  await subscriptions.insertOne(req.body);
  res.send("✅ Added");
});

app.delete('/subscriptions/:id', async (req, res) => {
  await subscriptions.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send("🗑️ Deleted");
});

app.put('/subscriptions/:id', async (req, res) => {
  await subscriptions.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send("✏️ Updated");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
