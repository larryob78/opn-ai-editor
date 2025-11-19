# StreetCheck

**StreetCheck** is a geolocation-based reporting system designed to help members of the public report people sleeping rough who may be in danger from cold weather. The system provides accurate geolocation, weather data integration, optional photo uploads with face blur, intelligent charity routing, responder dashboards, and comprehensive admin tools.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [User Roles](#user-roles)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### For Spotters (Public)
- **Easy Reporting Flow**: Simple, step-by-step process to report someone in need
- **GPS Location**: Automatic location detection with manual adjustment
- **Weather Integration**: Real-time weather data and automatic risk assessment
- **Photo Upload**: Optional photo with client-side face blur for privacy
- **Anonymity Options**: Choose to remain anonymous or provide contact details
- **Report Status Tracking**: Check the status of submitted reports

### For Responders (Charity Workers)
- **Live Dashboard**: Map and list views of all active reports
- **Risk Prioritization**: Color-coded markers (RED/AMBER/GREEN)
- **Case Management**: Accept, update, and resolve cases
- **Detailed Report View**: Full information including location, weather, notes, and photos
- **Assignment Tracking**: Track your active and completed cases

### For Admins (System Management)
- **Analytics Dashboard**: Overview of all reports and organizations
- **Organization Management**: Create and manage charity organizations
- **Coverage Zones**: Define geographic coverage areas for each organization
- **System-Wide Map View**: See all reports across all organizations
- **User Management**: Manage responders and their permissions

### Routing Intelligence
- **Dublin Priority**: Reports in Dublin with temperature ≤5°C automatically route to Beta
- **Haversine Distance**: Nearest charity calculation using precise geographic distance
- **Multi-Organization Notify**: RED risk alerts in Dublin notify both Beta and Peter McVerry Trust
- **Audit Logging**: All routing decisions are logged for transparency

---

## Architecture

StreetCheck uses a modern full-stack architecture:

- **Frontend**: Next.js 14 with App Router, TypeScript, and TailwindCSS
- **Backend**: Next.js API Routes with server-side authentication
- **Database**: Firebase Firestore (NoSQL document database)
- **Authentication**: Firebase Auth with role-based access control
- **Storage**: Firebase Storage for photo uploads
- **Maps**: Google Maps JavaScript SDK for mapping and geocoding
- **Weather**: OpenWeather API for real-time weather data

---

## Tech Stack

### Core Technologies
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **Firebase**: Backend-as-a-Service (Firestore, Auth, Storage)

### External APIs
- **Google Maps API**: Geocoding and map visualization
- **OpenWeather API**: Real-time weather data

### Development Tools
- **tsx**: TypeScript execution for scripts
- **ESLint**: Code linting
- **PostCSS**: CSS processing

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Package manager
- **Firebase Account**: For Firestore, Auth, and Storage
- **Google Cloud Account**: For Maps API
- **OpenWeather Account**: For weather data API

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/streetcheck.git
cd streetcheck
```

### 2. Install Dependencies

```bash
npm install
```

---

## Configuration

### 1. Create Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Firestore Database**, **Authentication**, and **Storage**
4. Get your Firebase configuration from Project Settings
5. Create a service account for Firebase Admin SDK

Update `.env` with your Firebase credentials:

```env
# Firebase Client (from Firebase Console > Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (from Service Account JSON)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your_project_id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

### 3. Configure Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Geocoding API**
3. Create an API key
4. Add restrictions (HTTP referrers for production)

Update `.env`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Configure OpenWeather API

1. Sign up at [OpenWeather](https://openweathermap.org/api)
2. Get your API key

Update `.env`:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
```

---

## Database Setup

### 1. Firestore Security Rules

In Firebase Console, set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reports: public write, authenticated read
    match /reports/{reportId} {
      allow create: if true;
      allow read: if request.auth != null &&
        (request.auth.token.role == 'RESPONDER' ||
         request.auth.token.role == 'ADMIN');
      allow update: if request.auth != null &&
        (request.auth.token.role == 'RESPONDER' ||
         request.auth.token.role == 'ADMIN');
    }

    // Organizations: public read, admin write
    match /organisations/{orgId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.role == 'ADMIN';
    }

    // Users: owner and admin can read/write
    match /users/{userId} {
      allow read: if request.auth != null &&
        (request.auth.uid == userId ||
         request.auth.token.role == 'ADMIN');
      allow write: if request.auth != null &&
        request.auth.token.role == 'ADMIN';
    }

    // Assignments: responders and admins
    match /assignments/{assignmentId} {
      allow read, write: if request.auth != null &&
        (request.auth.token.role == 'RESPONDER' ||
         request.auth.token.role == 'ADMIN');
    }

    // Audit logs: admin only
    match /auditLogs/{logId} {
      allow read, write: if request.auth != null &&
        request.auth.token.role == 'ADMIN';
    }
  }
}
```

### 2. Seed the Database

Run the seed script to populate initial organizations and create default users:

```bash
npm run seed
```

This will create:
- **5 Organizations**: Beta, Peter McVerry Trust, and regional outreach teams
- **Admin User**: `admin@streetcheck.ie` / `StreetCheck2024!`
- **Responder User**: `responder@beta.ie` / `Responder2024!`

**IMPORTANT**: Change these default passwords immediately in production!

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## User Roles

### SPOTTER (Public)
- No authentication required
- Can submit reports anonymously
- Can optionally provide contact information
- Can upload and blur photos
- Can view report status

### RESPONDER (Charity Workers)
- Must authenticate
- View reports for their organization
- Accept and manage cases
- Update report status
- Add outcome notes

### ADMIN (System Administrators)
- Must authenticate
- Full system access
- Manage all organizations
- View all reports across organizations
- Manage users and responders
- Access analytics and audit logs

---

## API Routes

### Reports
- `POST /api/reports/create` - Create a new report
- `GET /api/reports/list` - List reports (authenticated)
- `GET /api/reports/by-id?id={reportId}` - Get report by ID
- `POST /api/reports/update-status` - Update report status (authenticated)
- `POST /api/reports/assignment` - Manage assignments (authenticated)

### Organizations
- `POST /api/organisations/create` - Create organization (admin)
- `GET /api/organisations/list` - List all organizations
- `GET /api/organisations/nearest` - Find nearest organization
- `POST /api/organisations/update` - Update organization (admin)

### Weather & Maps
- `GET /api/weather/get?latitude={lat}&longitude={lng}` - Get weather data
- `GET /api/maps/reverse-geocode?latitude={lat}&longitude={lng}` - Reverse geocode

### Upload
- `POST /api/upload` - Upload photo to Firebase Storage

---

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard
4. Configure custom domain (optional)

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- All Firebase credentials
- Google Maps API key (with production domain restrictions)
- OpenWeather API key
- `NODE_ENV=production`

### Post-Deployment Checklist

- [ ] Update Firebase security rules
- [ ] Change default admin/responder passwords
- [ ] Configure Google Maps API restrictions
- [ ] Set up monitoring and error tracking
- [ ] Test all user flows (Spotter, Responder, Admin)
- [ ] Verify email notifications (if implemented)
- [ ] Check mobile responsiveness

---

## Project Structure

```
streetcheck/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── admin/               # Admin dashboard pages
│   │   ├── responder/           # Responder dashboard pages
│   │   ├── report/              # Spotter reporting flow
│   │   ├── status/              # Report status page
│   │   ├── api/                 # API routes
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── MapComponent.tsx
│   │   ├── RiskSelector.tsx
│   │   ├── PhotoUploader.tsx
│   │   ├── FaceBlurTool.tsx
│   │   ├── ReportCard.tsx
│   │   └── LoadingSpinner.tsx
│   ├── lib/                     # Utilities and helpers
│   │   ├── db/                  # Database access layer
│   │   ├── firebase/            # Firebase configuration
│   │   └── utils/               # Utility functions
│   └── types/                   # TypeScript type definitions
├── scripts/
│   └── seed.ts                  # Database seed script
├── public/                      # Static assets
├── .env.example                 # Environment variables template
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

---

## Key Features Explained

### Routing Logic

The system uses intelligent routing to assign reports to the most appropriate organization:

1. **Reverse Geocode**: Convert GPS coordinates to address
2. **Fetch Weather**: Get real-time temperature and conditions
3. **Calculate Risk**: Determine GREEN/AMBER/RED based on weather
4. **Route Decision**:
   - If Dublin AND temp ≤ 5°C → Route to Beta (org_beta_dublin)
   - Else → Find nearest active organization using Haversine distance
   - If RED risk in Dublin → Also notify Peter McVerry Trust
5. **Audit Log**: Record all routing decisions

### Risk Assessment

Risk levels are automatically calculated based on weather:

- **RED** (Extreme Danger):
  - Feels like ≤ 0°C
  - Temperature ≤ 2°C
  - Temperature ≤ 5°C + Rain/Snow

- **AMBER** (Significant Risk):
  - Feels like ≤ 5°C
  - Temperature ≤ 7°C
  - Temperature ≤ 10°C + Rain
  - Wind speed > 10 m/s

- **GREEN** (Low Risk):
  - All other conditions

### Face Blur

The system includes client-side face blurring to protect privacy:

1. User uploads photo
2. Photo is loaded into canvas
3. Simple Gaussian blur is applied
4. For production: integrate TensorFlow.js BlazeFace for face detection
5. Blurred photo is uploaded to Firebase Storage

---

## Security Considerations

### Authentication
- Role-based access control using Firebase Custom Claims
- Server-side token verification for all protected routes
- Automatic token refresh

### Data Privacy
- Anonymous reporting option
- Optional contact information
- Client-side photo blur
- GDPR-compliant data handling

### API Security
- All sensitive routes require authentication
- Rate limiting (implement in production)
- Input validation and sanitization
- HTTPS only in production

---

## Future Enhancements

- [ ] SMS notifications for RED risk alerts
- [ ] Real-time updates using Firebase Realtime Database
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with emergency services
- [ ] Offline mode with service workers
- [ ] Advanced face detection with TensorFlow.js
- [ ] Email notifications for responders
- [ ] Report export (CSV, PDF)

---

## Troubleshooting

### Common Issues

**Firebase Authentication Error**
```
Error: The default Firebase app does not exist
```
Solution: Ensure `.env` file is correctly configured and Firebase is initialized

**Google Maps Not Loading**
```
Google Maps JavaScript API error: InvalidKeyMapError
```
Solution: Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is correct and APIs are enabled

**Weather API Error**
```
OpenWeather API error: Unauthorized
```
Solution: Check `OPENWEATHER_API_KEY` and ensure it's activated

**Build Errors**
```
Module not found: Can't resolve '@/...'
```
Solution: Ensure `tsconfig.json` has correct path mappings

---

## Support

For issues, questions, or contributions:

- **Email**: support@streetcheck.ie
- **Issues**: [GitHub Issues](https://github.com/yourusername/streetcheck/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/streetcheck/wiki)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- **Beta**: Primary cold-weather response partner in Dublin
- **Peter McVerry Trust**: Secondary response partner
- **OpenWeather**: Weather data provider
- **Google Maps**: Mapping and geocoding services
- **Firebase**: Backend infrastructure

---

## Emergency Contact

**In a medical emergency, always call 999 or 112 immediately.**

StreetCheck is designed to supplement, not replace, emergency services.

---

**Built with ❤️ to help those in need**
