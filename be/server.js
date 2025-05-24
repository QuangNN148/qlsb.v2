const express = require('express');
const app = express();

// Define a route for the root URL
app.get('/', (req, res) => {
res.send('Hello, World!');
});

app.get('/user', (req, res) => {
res.send('HLQ!');
});
// Start the server on port 3000
app.listen(3000, () => {
console.log('Server is running on http://localhost:3000');
});