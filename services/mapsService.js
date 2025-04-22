const axios = require('axios');
const db = require('../config/database');
require('dotenv').config();

class MapsService {
    static async getAddressCoordinate(address) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                const location = response.data.results[0].geometry.location;
                return {
                    latitude: location.lat,
                    longitude: location.lng
                };
            } else {
                throw new Error('Unable to fetch coordinates');
            }
        } catch (error) {
            console.error('Error getting coordinates:', error);
            throw error;
        }
    }

    // Calculate distance using Haversine formula
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius(KM)
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Estimate travel time (assuming average speed of 30 km/h)
        const travelTime = (distance / 30) * 60; // in minutes
        
        return {
            distance: distance.toFixed(2) + ' km',
            time: Math.round(travelTime) + ' mins'
        };
    }

    static toRad(degrees) {
        return degrees * (Math.PI/180);
    }

    static async getAutoCompleteSuggestions(input) {
        if (!input) {
            throw new Error('Query is required');
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                return response.data.predictions.map(prediction => prediction.description);
            } else {
                throw new Error('Unable to fetch suggestions');
            }
        } catch (error) {
            console.error('Error getting suggestions:', error);
            throw error;
        }
    }

    // Get schools within a radius
    static async getSchoolsInRadius(latitude, longitude, radius) {
        // Add a small buffer to the radius to account for rounding (Added a small buffer to the radius to account for rounding)
        const radiusWithBuffer = radius * 1.1; 
        
        const query = `
            SELECT 
                id,
                name,
                address,
                latitude,
                longitude,
                (
                    6371 * 2 * ASIN(
                        SQRT(
                            POWER(SIN((RADIANS(?) - RADIANS(latitude)) / 2), 2) +
                            COS(RADIANS(latitude)) * COS(RADIANS(?)) *
                            POWER(SIN((RADIANS(?) - RADIANS(longitude)) / 2), 2)
                        )
                    )
                ) AS distance
            FROM schools
            ORDER BY distance
        `;

        try {
            const [schools] = await db.execute(query, [latitude, latitude, longitude]);
            
            const schoolsInRadius = schools.filter(school => school.distance <= radiusWithBuffer);
            
            return schoolsInRadius;
        } catch (error) {
            console.error('Error getting schools in radius:', error);
            throw error;
        }
    }
}

module.exports = MapsService; 