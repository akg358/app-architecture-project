const express = require('express');

const cors = require('cors');
const axios = require('axios');


const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Service URLs
const SERVICES = {
    users: process.env.USER_SERVICE_URL || 'http://user-service:3001',
    notes: process.env.NOTE_SERVICE_URL || 'http://note-service:3002',

    audit: process.env.AUDIT_SERVICE_URL || 'http://audit-service:3003'
};

// Middleware to log all requests to audit service
const logRequest = async (req, action, resourceType, resourceId = null) => {
    try {
        await axios.post(`${SERVICES.audit}/log`, {
            user_id: req.headers['user-id'] || null,
            action: action,
            resource_type: resourceType,
            resource_id: resourceId,
            details: JSON.stringify({
                method: req.method,
                path: req.path,
                ip: req.ip
            })
        });
    } catch (error) 

    {
        console.error('Audit logging failed:', error.message);
    }
};

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'api-gateway',
        timestamp: new Date().toISOString()
    });
});

// ===== USER SERVICE ROUTES =====

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        await logRequest(req, 'LIST', 'user');
        const response = await axios.get(`${SERVICES.users}/`);
        res.json(response.data);
    } catch (error) {

        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});

//create user
app.post('/api/users', async (req, res) => {
    try {



        const response = await axios.post(`${SERVICES.users}/`, req.body);
        await logRequest(req, 'CREATE', 'user', response.data.id);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});



// Get aall notes (with optional user_id filter)
app.get('/api/notes', async (req, res) => {
    try {


        await logRequest(req, 'LIST', 'note');
        const response = await axios.get(`${SERVICES.notes}/`, { 
            params: req.query 
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});

// Get single notes


app.get('/api/notes/:id', async (req, res) => {
    try {
        await logRequest(req, 'VIEW', 'note', req.params.id);
        const response = await axios.get(`${SERVICES.notes}/${req.params.id}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});

// Create note



app.post('/api/notes', async (req, res) => {
    try {
        const response = await axios.post(`${SERVICES.notes}/`, req.body);
        await logRequest(req, 'CREATE', 'note', response.data.id);
        res.status(201).json(response.data);
    } catch (error) {



        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});

// Update note
app.put('/api/notes/:id', async (req, res) => {
    try {



        const response = await axios.put(`${SERVICES.notes}/${req.params.id}`, req.body);
        await logRequest(req, 'UPDATE', 'note', req.params.id);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
    try {


        const response = await axios.delete(`${SERVICES.notes}/${req.params.id}`);
        await logRequest(req, 'DELETE', 'note', req.params.id);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});



// audit logs
app.get('/api/audit', async (req, res) => {
    try {
        const response = await axios.get(`${SERVICES.audit}/`, { 
            params: req.query 
        });
        res.json(response.data);
    } catch (error) {



        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});

// Get audit log by ID
app.get('/api/audit/:id', async (req, res) => {
    try {
        const response = await axios.get(`${SERVICES.audit}/${req.params.id}`);
        res.json(response.data);
    } catch (error) {


        res.status(error.response?.status || 500).json({ 

            error: error.response?.data || error.message 
        });
    }
});

// Get audit statistics
app.get('/api/audit/stats/summary', async (req, res) => {
    try {
        const response = await axios.get(`${SERVICES.audit}/stats/summary`, { 
            params: req.query 
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});

// Get action statistics
app.get('/api/audit/stats/actions', async (req, res) => {
    try {
        const response = await axios.get(`${SERVICES.audit}/stats/actions`, { 
            params: req.query 
        });
        res.json(response.data);
    } catch (error) {

        
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || error.message 
        });
    }
});

// Catch-all route
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
