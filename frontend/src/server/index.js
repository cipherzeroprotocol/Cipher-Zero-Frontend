const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create an Express app
const app = express();
const port = 5000;

// Setup file upload destination and storage options
const upload = multer({ dest: 'uploads/' });

// Handle file transfer
app.post('/api/transfer-file', upload.single('file'), (req, res) => {
    const { destination } = req.body;
    const file = req.file;

    if (!destination) {
        return res.status(400).json({ error: 'Destination is required.' });
    }

    if (!file) {
        return res.status(400).json({ error: 'File is required.' });
    }

    // Ensure the destination path is valid and safe
    const safeDestination = path.resolve(destination);
    if (!safeDestination.startsWith(path.resolve('uploads'))) {
        return res.status(400).json({ error: 'Invalid destination path.' });
    }

    // Simulate file transfer process
    // For real-world usage, you might want to transfer the file to a remote server or process it accordingly
    setTimeout(() => {
        try {
            // Optionally, move or process the file here
            // fs.renameSync(path.join(__dirname, 'uploads', file.filename), path.join(safeDestination, file.originalname));

            // Clean up the uploaded file
            fs.unlinkSync(path.join(__dirname, 'uploads', file.filename));

            res.status(200).json({ message: 'File transferred successfully.' });
        } catch (error) {
            console.error('Error during file transfer:', error);
            res.status(500).json({ error: 'Failed to transfer file.' });
        }
    }, 2000);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
