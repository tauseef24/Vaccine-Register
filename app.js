const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// JSON database
let users = [];
let vaccinationCentres = [];
let appointments = [];

// Middleware
app.use(bodyParser.json());

// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email && user.password === password);
  if (user) {
    res.json({ success: true, message: 'Login successful', user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// User Signup
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };
  users.push(user);
  res.json({ success: true, message: 'Signup successful', user });
});

// Vaccination Centre Search
app.post('/searchCentres', (req, res) => {
  const { query } = req.body;
  const results = vaccinationCentres.filter(
    (centre) => centre.name.includes(query) || centre.location.includes(query)
  );
  res.json({ success: true, results });
});

// Apply for Vaccination Slot
app.post('/applySlot', (req, res) => {
  const { userId, centreId } = req.body;
  const user = users.find((user) => user.id === userId);
  const centre = vaccinationCentres.find((centre) => centre.id === centreId);

  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
  } else if (!centre) {
    res.status(404).json({ success: false, message: 'Vaccination centre not found' });
  } else {
    const appointment = { userId, centreId };
    appointments.push(appointment);
    res.json({ success: true, message: 'Appointment booked successfully', appointment });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
