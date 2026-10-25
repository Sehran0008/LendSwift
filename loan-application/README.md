# LendSwift — Loan Application Management System

LendSwift is a full-stack web application that allows users to submit loan applications and enables administrators to review submitted applications through an admin dashboard.

## Live Demo

- **Frontend:** https://lendswift-4.onrender.com
- **Backend:** https://lendswift-3.onrender.com
- **GitHub Repository:** https://github.com/Sehran0008/LendSwift

## Features

- Multi-step loan application form
- Personal, home, and business loan options
- Loan amount and tenure selection
- EMI calculation and repayment summary
- Applicant information and document submission flow
- Application data stored in MongoDB
- Admin login and protected application APIs
- Admin dashboard for viewing applications
- Login rate limiting and server-side authentication checks

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- HTML
- CSS

**Backend**
- Node.js
- Express.js
- REST APIs

**Database**
- MongoDB
- MongoDB Atlas

**Deployment**
- Render
- GitHub

## Loan Application Flow

1. Loan Details
2. Personal Information
3. KYC Verification
4. Address
5. Employment & Income
6. Co-Applicant
7. Documents & Signature
8. Review & Submit

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sehran0008/LendSwift.git
cd LendSwift
```

### 2. Start the backend

```bash
cd backend
npm install
```

Configure the required backend environment variables in a local `.env` file using the variable names expected by the server. Never commit passwords, token secrets, or database credentials.

Start the backend using the start script configured in `backend/package.json`.

### 3. Start the frontend

Open another terminal:

```bash
cd "loan-application"
npm install
npm run dev
```

Configure the frontend API URL using the environment variable expected by the frontend.

## Security Notes

- Keep credentials and secrets in environment variables.
- Do not commit `.env` files or backup files containing secrets.
- Admin application APIs require authentication.
- Admin login has rate limiting.

## Project Status

The deployed application has been tested for loan submission, MongoDB persistence, admin dashboard visibility, login rate limiting, and unauthorized API access.

## Author

**Sehran**  
B.Tech — Computer Science & Engineering
