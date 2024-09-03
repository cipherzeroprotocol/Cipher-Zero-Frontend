import fs from 'fs';
import path from 'path';

export default function getData(req, res) {
    const {
        query: { guid },
    } = req;

    if (!guid) {
        res.status(400).send('Bad Request: Missing GUID parameter.');
        return;
    }

    // Construct the file path securely
    const filePath = path.resolve('uploads', `${guid}.zip`);

    // Check if the file exists and get its stats
    fs.stat(filePath, (err, stat) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File does not exist
                res.status(404).send('File not found.');
            } else {
                // Other errors (e.g., permission issues)
                res.status(500).send('Internal Server Error.');
            }
            return;
        }

        // Set headers and stream the file
        res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-Length': stat.size,
            'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
        });

        const readStream = fs.createReadStream(filePath);

        readStream.on('open', () => {
            readStream.pipe(res);
        });

        readStream.on('error', (err) => {
            res.status(500).send('Error reading file.');
        });
    });
}
