const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/', noteRoutes);

app.listen(PORT, () => {
    console.log('Server running on port 3000');
});
