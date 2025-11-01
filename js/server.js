const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json())

const filePath = path.join(process.cwd(), '../dangers.json');
const filePath1 = path.join(process.cwd(), '../safezones.json');

app.post('/add-location', (req, res) => {
    const { latitude, longitude, signalCount } = req.body;
    if (!latitude || !longitude) {
        return res.status(400).json({error: 'Missing coordinates' });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data.push({ latitude, longitude, signalCount: signalCount || 1 });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ message: 'Location added successfully', total: data.length });
})

app.post('/add-safezone', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Missing coordinates' });
        }

        const data = fs.existsSync(filePath1)
            ? JSON.parse(fs.readFileSync(filePath1, 'utf8'))
            : [];

        data.push({ latitude, longitude, createdAt: new Date().toISOString() });

        fs.writeFileSync(filePath1, JSON.stringify(data, null, 2));

        res.status(200).json({ message: 'Safe zone added successfully' });
    } catch (err) {
        console.error('Error adding safe zone:', err);
        res.status(500).json({ message: 'Failed to add safe zone' });
    }
});


app.post("/remove-safezone", (req, res) => {
    const { latitude, longitude } = req.body;
    console.log("🟡 Received remove-safezone request:", req.body);

    if (latitude === undefined || longitude === undefined) {
        return res.status(400).send("Missing latitude or longitude");
    }

    try {

        const data = JSON.parse(fs.readFileSync(filePath1, "utf-8"));
        if (!Array.isArray(data)) {
            console.log("⚠️ safezones.json is not an array, resetting...");
            fs.writeFileSync(filePath1, JSON.stringify([], null, 2));
            return res.json({ success: true, reset: true });
        }

        // Allow small coordinate rounding differences (≈11 meters margin)
        const tolerance = 0.0001;

        const updated = data.filter(zone => 
            Math.abs(zone.latitude - latitude) > tolerance ||
            Math.abs(zone.longitude - longitude) > tolerance
        );

        if (updated.length === data.length) {
            console.log("⚠️ No safe zone found near:", latitude, longitude);
            return res.status(404).send("No matching safe zone found");
        }

        fs.writeFileSync(filePath1, JSON.stringify(updated, null, 2));
        console.log(`✅ Safe zone removed near ${latitude}, ${longitude}`);

        res.json({ success: true });
    } catch (err) {
        console.error("❌ Failed to remove safe zone:", err);
        res.status(500).send("Server error: " + err.message);
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
})