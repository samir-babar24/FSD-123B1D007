const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Destination = require('./models/Destination');
const Booking = require('./models/Booking');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Database connection & fallback
let dbConnected = false;
let mockDestinations = [
  {
    _id: "m1",
    title: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    description: "Experience the tranquil beaches, vibrant culture, and lush landscapes of Bali. Perfect for a relaxing getaway.",
    price: 1200,
    duration: "7 Days"
  },
  {
    _id: "m2",
    title: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1531366936310-6c9ab4fa1e20?auto=format&fit=crop&w=800&q=80",
    description: "Breathtaking mountain views, world-class skiing, and cozy chalets await you in the heart of Switzerland.",
    price: 2500,
    duration: "5 Days"
  },
  {
    _id: "m3",
    title: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    description: "Step back in time to ancient temples, beautiful shrines, and traditional tea houses in magical Kyoto.",
    price: 1800,
    duration: "10 Days"
  }
];

mongoose.connect('mongodb://localhost:27017/travel_agency')
  .then(async () => {
    console.log('Connected to MongoDB');
    dbConnected = true;
    
    // Seed initial data if empty
    const count = await Destination.countDocuments();
    if (count === 0) {
      console.log('Seeding initial destinations...');
      // Remove mock _id for mongodb insertion
      const seedData = mockDestinations.map(({_id, ...rest}) => rest);
      await Destination.insertMany(seedData);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error (fallback to in-memory mode due to connection failure):', err.message);
    dbConnected = false;
  });

// Routes
// Home Page - List Destinations
app.get('/', async (req, res) => {
  try {
    let destinations = dbConnected ? await Destination.find() : mockDestinations;
    res.render('index', { destinations });
  } catch (error) {
    res.status(500).send("Error loading destinations");
  }
});

// Destination Detail Page
app.get('/destination/:id', async (req, res) => {
  try {
    let destination;
    if (dbConnected) {
      destination = await Destination.findById(req.params.id);
    } else {
      destination = mockDestinations.find(d => d._id == req.params.id || d._id.toString() == req.params.id);
    }
    
    if (!destination) {
      return res.status(404).send("Destination not found");
    }
    res.render('destination', { destination });
  } catch (error) {
    res.status(500).send("Error loading page");
  }
});

// Book a Trip
app.post('/book', async (req, res) => {
  try {
    const { name, email, date, destinationId } = req.body;
    
    if (dbConnected) {
      const booking = new Booking({ name, email, date, destinationId });
      await booking.save();
    } else {
      console.log("Mock booking saved:", { name, email, date, destinationId });
    }
    
    // Simulate slight delay and redirect to home with success message
    res.send(`
      <html>
        <body style="font-family: sans-serif; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; background:#f4f7f6;">
          <div style="text-align:center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: #4CAF50;">Booking Successful!</h1>
            <p>Thank you, ${name}. We have received your booking request.</p>
            <a href="/" style="display:inline-block; margin-top:20px; padding: 10px 20px; background: #2563eb; color:white; text-decoration:none; border-radius: 6px;">Return Home</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting booking");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
