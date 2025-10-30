// In file: backend/routes/analyze.js

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// Use memoryStorage to handle the file buffer without saving to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    console.log('Request received at /api/analyze');
    if (!req.file) {
        return res.status(400).json({ error: 'No image file provided.' });
    }

    // Use the environment variable for the Python server URL
    const pythonApiUrl = `${process.env.PYTHON_API_URL}/predict`;

    try {
        const formData = new FormData();
        // Append the file buffer from multer
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        console.log(`Forwarding image to Python service at ${pythonApiUrl}...`);
        
        const response = await axios.post(pythonApiUrl, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log('✅ Analysis successful. Sending results to frontend.');
        res.json(response.data);

    } catch (error) {
        console.error('❌ Error calling Python API:', error.message);
        // Provide a more specific error if the connection is refused
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ error: 'Could not connect to the Python AI service. Is it running?' });
        }
        res.status(500).json({ error: 'Failed to analyze image.' });
    }
});

module.exports = router;