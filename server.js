const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

// Example API endpoint
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from your Express server!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
