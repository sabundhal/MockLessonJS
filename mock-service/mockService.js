const express = require('express');
const app = express();
const port = 3000;

let requestIdCounter = 0;
const requests = {};

const payments = Array.from({ length: 55 }, (_, index) => ({
    id: index + 1,
    amount: (Math.random() * 1000).toFixed(2),
    date: new Date().toISOString(),
}));

app.use(express.json());

// Endpoint для получения общего количества платежей
app.get('/payments/count', (req, res) => {
    const requestId = ++requestIdCounter;
    requests[requestId] = { count: 0 };
    res.json({
        totalCount: payments.length,
        requestId: requestId
    });
});

// Endpoint для получения пачек платежей
app.post('/payments', (req, res) => {
    const { requestId } = req.body;
    if (!requests[requestId]) {
        return res.status(400).json({ error: 'Invalid requestId' });
    }

    requests[requestId].count++;
    const count = requests[requestId].count;

    const itemsPerRequest = 10;
    const start = (count - 1) * itemsPerRequest;
    const end = start + itemsPerRequest;

    if (start < payments.length) {
        res.json({
            data: payments.slice(start, end),
            finished: end >= payments.length,
        });
    } else {
        res.status(400).json({
            error: 'No more data',
        });
    }
});

app.listen(port, () => {
    console.log(`Mock service listening at http://localhost:${port}`);
});
