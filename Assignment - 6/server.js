const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const Item = require('./models/Item');
const Appointment = require('./models/Appointment');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/automartDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Milddlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// 1. Home Page: Show all items
app.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.render('index', { items });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 2. Add New Item Form
app.get('/items/new', (req, res) => {
  res.render('add-item');
});

// 3. Post New Item
app.post('/items', async (req, res) => {
  try {
    const { title, description, price, category, imageURL, manufacturingYear } = req.body;
    const newItem = new Item({
      title,
      description,
      price,
      category,
      imageURL,
      manufacturingYear
    });
    await newItem.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add item');
  }
});

// 4. View Item Detail
app.get('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found');
    res.render('item-detail', { item });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 5. Book an Appointment
app.post('/items/:id/appointments', async (req, res) => {
  try {
    const { customerName, customerEmail, appointmentDate, message } = req.body;
    const newAppointment = new Appointment({
      itemId: req.params.id,
      customerName,
      customerEmail,
      appointmentDate,
      message
    });
    await newAppointment.save();
    // In a real app we might redirect to a success page or back with a message
    // For simplicity, we just redirect back to the item
    res.redirect(`/items/${req.params.id}?booking=success`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to book appointment');
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
