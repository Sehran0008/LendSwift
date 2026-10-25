# LendSwift — Loan Application Management System

LendSwift is a full-stack web application for submitting loan applications and managing them through an administrator dashboard. It demonstrates frontend development, backend APIs, database integration, and basic authentication controls.

## Live Demo

- **Frontend:** https://lendswift-4.onrender.com
- **Backend:** https://lendswift-3.onrender.com
- **GitHub:** https://github.com/Sehran0008/LendSwift

> This project is intended for educational and demonstration purposes. It does not provide real loans or guarantee loan approval.

## Features

- Multi-step loan application form
- Personal, home, and business loan options
- Loan amount and tenure selection
- EMI and repayment summary
- Applicant information and document submission steps
- Form validation and application submission
- MongoDB database integration
- Admin login and protected application APIs
- Admin dashboard for viewing submitted applications
- Login rate limiting
- Responsive user interface

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
- REST APIs

**Database**
- MongoDB
- MongoDB Atlas

**Deployment and Version Control**
- Render
- GitHub

## Application Workflow

1. Loan Details
2. Personal Information
3. KYC Verification
4. Address
5. Employment & Income
6. Co-Applicant
7. Documents & Signature
8. Review & Submit

## Local Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a configured MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/Sehran0008/LendSwift.git
cd LendSwift
```

### 2. Configure and Start the Backend

```bash
cd backend
npm install
```

Configure the environment variables required by the backend using the variable names expected by the server. Do not commit credentials or secret values.

Start the backend using the start script defined in `backend/package.json`.

### 3. Start the Frontend

Open a separate terminal in the repository directory:

```bash
cd loan-application
npm install
npm run dev
```

Configure the frontend API URL using the environment variable expected by the frontend.

## Security Notes

- Admin application APIs require authentication.
- Admin login uses rate limiting.
- Keep database credentials, passwords, and token secrets in environment variables.
- Never commit `.env` files, credentials, or real applicant information.

## Project Status

The deployed application has been tested for loan submission, MongoDB data persistence, admin dashboard visibility, login rate limiting, and unauthorized API access.

## Author

**Sehran**  
B.Tech — Computer Science & Engineering
