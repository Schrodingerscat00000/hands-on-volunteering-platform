
# HandsOn Volunteering Platform

## Project Overview
HandsOn connects volunteers with community initiatives, enabling event discovery, help requests, team formation, and impact tracking.

## Technologies Used
- **Backend**: Node.js, Express.js, Sequelize, PostgreSQL
- **Frontend**: React.js, Material-UI, Axios
- **Tools**: Git, GitHub, npm

## Features
- Volunteer event listing and registration
- Community help requests with comments
- Team creation with dashboards and leaderboards
- Volunteer hour logging with peer/auto-verification
- Point system and certificate generation

## Database Schema
Users
├── id (PK)
├── name
├── email
├── password
├── points
└── verifiedHours

Events
├── id (PK)
├── title
├── name
├── description
├── date
├── time
├── location
├── category
├── organizerId (FK -> Users)
└── teamId (FK -> Teams)


## Setup Instructions
1. Clone: `git clone https://github.com/Schrodingerscat00000/hands-on-volunteering-platform.git`
2. Backend: `cd backend`, `npm install`, configure `.env`, `node index.js`
3. Frontend: `cd frontend`, `npm install`, `npm start`
4. Database Setup:
The project uses PostgreSQL as its database. Follow these steps to set it up:
1.Create the database: 'CREATE DATABASE handson_db','\q'
2.Configure Environment Variables:
In the backend/ folder, create a .env file:
cd backend
echo DB_NAME=handson_db > .env
echo DB_USER=postgres >> .env
echo DB_PASSWORD=your_postgres_password >> .env
echo DB_HOST=localhost >> .env
echo JWT_SECRET=your_secret_key >> .env

Replace your_postgres_password with the password set during PostgreSQL installation.
Replace your_secret_key with a random string (e.g., mysecret123).

3.(Optional) Seed Initial Data: To populate the database with sample data, run: 'node seedEvents.js'

## API Documentation
- **GET /api/events**: List events
- **POST /api/impact/hours**: Log hours
- ...

## Running the Project
- Locally: Run backend and frontend separately
- Production: Deploy backend (e.g., Heroku), frontend (e.g., Netlify)
