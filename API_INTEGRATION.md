# Womencypedia Frontend - API Integration Guide

This document provides detailed specifications for integrating the Womencypedia frontend with a backend API.

## Overview

The frontend is designed to work with a RESTful API backend. All API communication is handled through the centralized modules in the `js/` directory:

- **`config.js`** - Configuration constants and API endpoints
- **`api.js`** - API service module with all HTTP request methods
- **`auth.js`** - Authentication and authorization handling
- **`ui.js`** - UI utilities, loading states, and toast notifications
- **`forms.js`** - Form submission handling for contributions

## Configuration

Update the `API_BASE_URL` in `js/config.js` to point to your backend:

```javascript
// Development
API_BASE_URL: 'http://localhost:8000/api/v1'

// Production
API_BASE_URL: 'https://api.womencypedia.org/api/v1'
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| POST | `/auth/refresh` | Refresh access token | No (uses refresh token) |
| GET | `/auth/me` | Get current user info | Yes |

#### Login Request
```json
POST /auth/login
{
  "email": "admin@womencypedia.org",
  "password": "securepassword"
}
```

#### Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@womencypedia.org",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Entries (Biographies)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/entries` | List all entries with pagination/filtering | No |
| GET | `/entries/:id` | Get single entry | No |
| GET | `/entries/search` | Search entries | No |
| POST | `/entries` | Create new entry | Admin |
| PUT | `/entries/:id` | Update entry | Admin |
| DELETE | `/entries/:id` | Delete entry | Admin |

#### List Entries Request
```
GET /entries?page=1&limit=12&region=Africa&era=Colonial&search=queen
```

#### List Entries Response
```json
{
  "entries": [
    {
      "id": 1,
      "name": "Queen Amina of Zazzau",
      "region": "Africa",
      "era": "Pre-colonial",
      "category": "Leadership",
      "domain": "Monarch",
      "tags": ["Warrior Queen", "Military Leader"],
      "introduction": "A 16th-century Hausa warrior queen...",
      "image": "/images/queen-amina.png",
      "status": "published",
      "createdAt": "2026-01-15T00:00:00Z",
      "updatedAt": "2026-01-15T00:00:00Z"
    }
  ],
  "page": 1,
  "total_pages": 5,
  "total": 50
}
```

#### Single Entry Response
```json
{
  "id": 1,
  "name": "Queen Amina of Zazzau",
  "region": "Africa",
  "era": "Pre-colonial",
  "category": "Leadership",
  "domain": "Monarch",
  "tags": ["Warrior Queen", "Military Leader"],
  "introduction": "A 16th-century Hausa warrior queen...",
  "earlyLife": "Born around 1533 CE in Zazzau...",
  "pathToInfluence": "Ascended to the throne in 1576 CE...",
  "contributions": "Her military campaigns are legendary...",
  "symbolicPower": "Represents female sovereignty...",
  "culturalContext": "Ruled during the 16th century...",
  "legacy": "Her legacy continues in Nigerian folklore...",
  "image": "/images/queen-amina.png",
  "sources": [
    {
      "type": "Secondary",
      "title": "The Emirates of Northern Nigeria",
      "author": "Hogben & Kirk-Greene",
      "year": 1966,
      "citation": "Oxford University Press"
    }
  ],
  "relatedWomen": [2, 3],
  "relatedMovements": ["African Queenship Systems"],
  "relatedDynasties": ["Hausa Kingdoms"],
  "status": "published",
  "createdAt": "2026-01-15T00:00:00Z",
  "updatedAt": "2026-01-15T00:00:00Z"
}
```

#### Create Entry Request
```json
POST /entries
Authorization: Bearer <token>
{
  "name": "Wangari Maathai",
  "region": "Africa",
  "era": "Contemporary",
  "category": "Activism & Justice",
  "tags": ["Nobel Peace Prize", "Green Belt Movement"],
  "introduction": "A Kenyan environmental and political activist...",
  "earlyLife": "Born in 1940 in Kenya...",
  "pathToInfluence": "Founded the Green Belt Movement in 1977...",
  "contributions": "Planted over 30 million trees...",
  "legacy": "Her work continues through the Green Belt Movement..."
}
```

### Contributions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/contributions/nominations` | Submit a nomination | No |
| POST | `/contributions/stories` | Submit a story | No |
| GET | `/contributions/pending` | Get pending contributions | Admin |
| POST | `/contributions/:id/approve` | Approve contribution | Admin |
| POST | `/contributions/:id/reject` | Reject contribution | Admin |

#### Nomination Request
```json
POST /contributions/nominations
{
  "nomineeName": "Ada Lovelace",
  "era": "19th Century",
  "region": "Europe",
  "collection": "science",
  "bio": "Ada Lovelace was the first computer programmer...",
  "sources": "Various historical documents...",
  "submitterName": "Jane Doe",
  "submitterEmail": "jane@example.com",
  "type": "nomination",
  "status": "pending"
}
```

#### Story Submission Request
```json
POST /contributions/stories
{
  "storyType": "other",
  "subjectName": "My Grandmother",
  "relationship": "Grandmother",
  "region": "Nigeria",
  "theme": "resilience",
  "story": "My grandmother was a remarkable woman who...",
  "lessons": "Her story teaches us about perseverance...",
  "contactName": "Jane Doe",
  "contactEmail": "jane@example.com",
  "permissionGranted": true,
  "type": "story",
  "status": "pending"
}
```

#### Pending Contributions Response
```json
{
  "contributions": [
    {
      "id": 1,
      "type": "nomination",
      "nomineeName": "Ada Lovelace",
      "bio": "Ada Lovelace was...",
      "submitterName": "Jane Doe",
      "submittedAt": "2026-01-15T00:00:00Z",
      "status": "pending"
    }
  ],
  "total": 5
}
```

### Collections

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/collections` | List all collections | No |
| GET | `/collections/:id` | Get collection with entries | No |

### Statistics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats/dashboard` | Dashboard statistics | Admin |
| GET | `/stats/public` | Public statistics | No |

#### Dashboard Stats Response
```json
{
  "totalEntries": 150,
  "pendingApproval": 12,
  "nominations": 8,
  "stories": 4,
  "recentActivity": [
    {
      "type": "add",
      "description": "Added new entry: Wangari Maathai",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ]
}
```

## Authentication Flow

### JWT Tokens

The frontend expects JWT tokens in the response:

1. **Access Token**: Short-lived (15-60 minutes), used for API requests
2. **Refresh Token**: Long-lived (7 days), used to get new access tokens

Tokens are stored in `localStorage`:
- `womencypedia_access_token`
- `womencypedia_refresh_token`
- `womencypedia_user` (JSON string)

### User Roles

- **`admin`**: Full access to all features, CRUD operations
- **`contributor`**: Can submit contributions, view their own submissions
- **`public`**: Read-only access, can submit nominations/stories

### Authorization Header

All authenticated requests include:
```
Authorization: Bearer <access_token>
```

## Error Responses

All errors should return JSON with this structure:

```json
{
  "detail": "Human-readable error message",
  "code": "ERROR_CODE",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Unprocessable Entity (validation failed)
- `500` - Internal Server Error

## CORS Configuration

The backend should allow CORS from the frontend domain:

```
Access-Control-Allow-Origin: https://womencypedia.org
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## Fallback Behavior

The frontend is designed to gracefully fallback to static data (`js/data.js`) when the API is unavailable. This allows:

1. Development without a running backend
2. Demonstration of the UI/UX
3. Progressive enhancement as the API is developed

## File Structure

```
js/
├── config.js    # API configuration and endpoints
├── api.js       # HTTP client and API methods
├── auth.js      # Authentication handling
├── ui.js        # UI utilities and components
├── forms.js     # Form submission handling
├── browse.js    # Browse page functionality
├── data.js      # Static fallback data
└── navigation.js # Navigation component logic
```

## Integration Checklist

- [ ] Set up backend with RESTful API
- [ ] Implement JWT authentication
- [ ] Create database schema for entries
- [ ] Add CORS configuration
- [ ] Update `config.js` with production API URL
- [ ] Test all CRUD operations
- [ ] Verify form submissions
- [ ] Test authentication flow
- [ ] Verify admin dashboard functionality

## Contact & Support

For questions about the API integration, please contact the development team.
