const db = require('../config/database');
const MapsService = require('../services/mapsService');

const schoolController = {
    // Add a new school (Created a controller to add a new school)
    addSchool: async (req, res) => {
        try {
            const { name, address, latitude, longitude } = req.body;
            
            // If coordinates are not provided, geocode the address
            let finalLatitude = latitude;
            let finalLongitude = longitude;
            
            if (!latitude || !longitude) {
                const coordinates = await MapsService.getAddressCoordinate(address);
                finalLatitude = coordinates.latitude;
                finalLongitude = coordinates.longitude;
            }
            
            const [result] = await db.execute(
                'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
                [name, address, finalLatitude, finalLongitude]
            );

            res.status(201).json({
                message: 'School added successfully',
                schoolId: result.insertId,
                coordinates: {
                    latitude: finalLatitude,
                    longitude: finalLongitude
                }
            });
        } catch (error) {
            console.error('Error adding school:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // List schools with distance information (Created a controller to list schools with distance information)
    listSchools: async (req, res) => {
        try {
            const { latitude, longitude, radius = 10 } = req.query;
            
            if (!latitude || !longitude) {
                return res.status(400).json({ error: 'Latitude and longitude are required' });
            }

            // Get schools within radius
            const schools = await MapsService.getSchoolsInRadius(
                parseFloat(latitude),
                parseFloat(longitude),
                parseFloat(radius)
            );

            // Calculate distance and time for each school
            const schoolsWithDetails = schools.map(school => {
                const distanceInfo = MapsService.calculateDistance(
                    parseFloat(latitude),
                    parseFloat(longitude),
                    school.latitude,
                    school.longitude
                );

                return {
                    ...school,
                    travelDistance: distanceInfo.distance,
                    travelTime: distanceInfo.time
                };
            });

            res.json(schoolsWithDetails);
        } catch (error) {
            console.error('Error listing schools:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get address suggestions (Created a controller to get address suggestions)
    getAddressSuggestions: async (req, res) => {
        try {
            const { input } = req.query;
            
            if (!input) {
                return res.status(400).json({ error: 'Input is required' });
            }

            const suggestions = await MapsService.getAutoCompleteSuggestions(input);
            res.json(suggestions);
        } catch (error) {
            console.error('Error getting address suggestions:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = schoolController; 