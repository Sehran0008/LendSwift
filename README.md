# LendSwift — Loan Application Management System

LendSwift is a full-stack web application that allows users to submit loan applications and enables administrators to manage submitted applications through a secure admin dashboard.

## Live Demo

- **Frontend:** https://lendswift-4.onrender.com
- **Backend:** https://lendswift-3.onrender.com
- **GitHub Repository:** https://github.com/Sehran0008/LendSwift

## Features

- Multi-step loan application form
- Personal, home, and business loan options
- EMI calculation and repayment summary
- Form validation and application submission
- MongoDB database integration
- Admin authentication
- Protected application management APIs
- Admin dashboard for viewing submitted applications
- Admin login rate limiting
- Deployed frontend and backend

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- HTML
- CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- MongoDB Atlas

**Deployment and Version Control**
- Render
- GitHub

## Application Workflow

The application form follows these eight steps:

1. Loan Details
2. Personal Information
3. KYC Verification
4. Address
5. Employment & Income
6. Co-Applicant
7. Documents & Signature
8. Review & Submit

## Project Structure

```text
LendSwift/
├── backend/
│   ├── package.json
│   └── server.js
├── loan-application/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

*Note: The exact files and folders may vary depending on the current repository structure.*

## Local Setup

### Prerequisites

- Node.js and npm
- Git
- MongoDB Atlas account or another configured MongoDB database

### 1. Clone the Repository

```bash
git clone https://github.com/Sehran0008/LendSwift.git
cd LendSwift
```

### 2. Configure and Start the Backend

Open a terminal and run:

```bash
cd backend
npm install
```

Configure the required environment variables according to the backend configuration. Keep credentials and secrets private.

Start the backend using the available script in `backend/package.json`:

```bash
npm start
```

### 3. Start the Frontend

Open a **second terminal** from the project root and run:

```bash
cd loan-application
npm install
npm run dev
```

Configure the frontend API URL to point to the backend running in your local environment.

## Security Notes

- Admin application APIs require authentication.
- Admin login uses rate limiting.
- Database credentials and token secrets should be stored in environment variables.
- Never commit `.env` files, passwords, API secrets, or real applicant information.
- Use appropriate access controls for the database and deployed services.

## Project Status

The deployed application has been tested for:

- Loan application submission
- MongoDB data persistence
- Admin dashboard visibility
- Admin login rate limiting
- Unauthorized API access protection

This project demonstrates full-stack web development, database integration, deployment, and basic application security practices.

## Author

**Sehran**  
B.Tech — Computer Science & Engineering
