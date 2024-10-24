require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const config = require('./config');
const { generateTrackers, updateTrackers } = require('./helpers/trackers');

let trackers = generateTrackers() || [];
const corsOptions = { credentials: true, origin: '*' };

setInterval(() => {
  if (trackers.length < 50) {
    trackers = generateTrackers();
  } else {
    trackers = updateTrackers(trackers).filter((item) => item !== undefined);
  }
}, 3000);

app.use(cors(corsOptions));

app.post('/api/auth', (req, res) => {
  const authKey = req.headers['authorization'];

  if (authKey === process.env.AUTH_KEY) {
    res.status(200).json({ message: 'Authorization successful' });
  } else {
    res.status(403).json({ message: 'Invalid key' });
  }
});

app.get('/api/trackers', (req, res) => {
  const authKey = req.headers['authorization'];

  if (authKey !== process.env.AUTH_KEY) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (trackers.length < 50) {
    trackers = generateTrackers();
  } else {
    trackers = updateTrackers(trackers).filter((item) => item !== undefined);
  }

  res.json(trackers);
});

app.listen(config.port, () => {
  console.log(`Mock server is running`);
});
