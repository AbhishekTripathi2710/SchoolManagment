# School Management API

A Node.js API for managing schools with location-based sorting functionality.

## Features

- Add new schools with name, address, and coordinates
- List schools sorted by proximity to a given location
- Input validation
- Error handling
- Google Maps integration for:
  - Address autocomplete and validation
  - Geocoding (address to coordinates conversion)
  - Distance calculation between locations
  - Interactive map display of school locations

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- Google Maps API key with the following APIs enabled:
  - Places API
  - Geocoding API
  - Maps JavaScript API

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Create a MySQL database
   - Update the database configuration in `config/database.js`
   - Run the schema.sql file to create the necessary tables

4. Configure Google Maps API:
   - Create a Google Cloud project
   - Enable the required APIs (Places, Geocoding, Maps JavaScript)
   - Create an API key
   - Add the API key to your environment variables:
     ```
     GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

5. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Add School
- **POST** `/api/schools/addSchool`
- **Payload:**
  ```json
  {
    "name": "School Name",
    "address": "School Address",
    "latitude": 12.3456,
    "longitude": 78.9012
  }
  ```

### List Schools
- **GET** `/api/schools/listSchools`
- Returns all schools in the database

### Get Address Suggestions
- **GET** `/api/schools/address-suggestions?query=address`
- Returns address suggestions from Google Places API

### Get School Distance
- **GET** `/api/schools/distance?schoolId=123&latitude=12.3456&longitude=78.9012`
- Returns the distance between a school and a given location

## Testing with Postman

1. Import the following endpoints into Postman:

### Add School
```
POST https://schoolmanagment-0a3b.onrender.com/api/schools/addSchool
Content-Type: application/json

{
    "name": "Example School",
    "address": "123 School Street",
    "latitude": 12.3456,
    "longitude": 78.9012
}
```

### List Schools
```
GET https://schoolmanagment-0a3b.onrender.com/api/schools/listSchools
```

### Get Address Suggestions
```
GET https://schoolmanagment-0a3b.onrender.com/api/schools/address-suggestions?query=address
```

### Get School Distance
```
GET https://schoolmanagment-0a3b.onrender.com/api/schools/distance?schoolId=123&latitude=12.3456&longitude=78.9012
```

## Deployment

The application is deployed using a multi-service architecture:

### Backend Service
- **Platform**: Render
- **URL**: https://schoolmanagment-0a3b.onrender.com
- **Environment**: Production
- **Runtime**: Node.js
- **Port**: 10000

### Database Service
- **Platform**: Railway
- **Type**: MySQL
- **Host**: shortline.proxy.rlwy.net
- **Port**: 52807
- **Database**: railway

### Environment Variables
The following environment variables are required for deployment:

```
# Database Configuration (Railway)
DB_HOST=shortline.proxy.rlwy.net
DB_PORT=52807
DB_NAME=railway
DB_USER=root
DB_PASSWORD=your_railway_db_password

# Application Configuration
NODE_ENV=production
PORT=10000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Error Handling

The API includes proper error handling for:
- Invalid input data
- Missing required fields
- Database errors
- Invalid coordinates

## Security Considerations

- Input validation for all fields
- SQL injection prevention using parameterized queries
- CORS enabled for cross-origin requests
- Environment variables for sensitive data
- HTTPS enforced for all API endpoints

