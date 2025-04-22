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
POST http://localhost:3000/api/schools/addSchool
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
GET http://localhost:3000/api/schools/listSchools
```

### Get Address Suggestions
```
GET http://localhost:3000/api/schools/address-suggestions?query=address
```

### Get School Distance
```
GET http://localhost:3000/api/schools/distance?schoolId=123&latitude=12.3456&longitude=78.9012
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

