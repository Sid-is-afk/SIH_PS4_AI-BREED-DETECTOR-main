// In file: backend/server.js


const mongoose = require('mongoose');
const dotenv = require('dotenv');


const express = require('express');
const cors = require('cors');


dotenv.config();


const analyzeRoute = require('./routes/analyze');
const generateRoute = require('./routes/generate');

const authRoutes = require('./routes/auth.js');
const analysisRoutes = require('./routes/analysisRoutes.js');

const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();

const port = process.env.PORT || 3001;


const corsOptions = {
    origin: 'https://pashudrishti.netlify.app', // <-- PASTE YOUR LIVE NETLIFY URL HERE
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully!');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); 
    }
};
connectDB(); 


app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes); 
app.use('/api/analyze', analyzeRoute);
app.use('/api/generate', generateRoute);

// app.use('/api/chatbot', chatbotRoutes);



app.listen(port, () => {
    console.log(`🚀 Node.js server listening at http://localhost:${port}`);
});