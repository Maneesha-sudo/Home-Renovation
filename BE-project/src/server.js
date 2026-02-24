const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const contractorRoutes = require('./routes/contractorRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/contractors', contractorRoutes);

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Server is running'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));