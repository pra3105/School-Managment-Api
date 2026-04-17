const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check route ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏫 School Management API is running',
    version: '1.0.0',
    endpoints: {
      addSchool: 'POST /addSchool',
      listSchools: 'GET /listSchools?latitude=<lat>&longitude=<lon>',
    },
  });
});

// ── School routes ──────────────────────────────────────────────────────────────
const schoolRoutes = require('./routes/schoolRoutes');
app.use('/', schoolRoutes);

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
});

// ── Start server (FIXED FOR RAILWAY) ───────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;