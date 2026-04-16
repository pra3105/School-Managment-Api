const db = require('../config/db');

// ── Haversine formula: distance in km between two lat/lon points ───────────────
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

// ── POST /addSchool ────────────────────────────────────────────────────────────
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const [result] = await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
    );

    return res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
  } catch (error) {
    console.error('addSchool error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while adding school',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ── GET /listSchools ───────────────────────────────────────────────────────────
const listSchools = async (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    const [schools] = await db.execute('SELECT * FROM schools');

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found in the database',
        data: [],
      });
    }

    // Attach distance and sort ascending
    const sorted = schools
      .map((school) => ({
        ...school,
        distance_km: parseFloat(
          haversineDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: `Found ${sorted.length} school(s) sorted by proximity`,
      user_location: { latitude: userLat, longitude: userLon },
      data: sorted,
    });
  } catch (error) {
    console.error('listSchools error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching schools',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { addSchool, listSchools };