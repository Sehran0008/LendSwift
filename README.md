# LendSwift — Loan Application Management System

LendSwift is a full-stack web application for submitting loan applications and managing them through an administrator dashboard.

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
- Admin authentication and protected APIs
- Admin dashboard for viewing applications
- Admin login rate limiting

## Technology Stack

- **Frontend:** React, Vite, JavaScript, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, MongoDB Atlas
- **Deployment:** Render
- **Version Control:** Git, GitHub

## Application Workflow

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
├── loan-application/
├── .gitignore
└── README.md
```

## Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Sehran0008/LendSwift.git
cd LendSwift
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start
```

Configure the required environment variables before starting the backend. Check `backend/package.json` to confirm the available start script.

## 3. Start the Frontend

Open a second terminal from the project root:

```bash
cd loan-application
npm install
npm run dev
```

Configure the frontend API URL as required by the project.

## Security Notes

- Admin application APIs require authentication.
- Admin login uses rate limiting.
- Store database credentials and token secrets in environment variables.
- Never commit `.env` files, passwords, secrets, or real applicant information.
- Restrict database access appropriately.

## Project Status

The deployed application has been tested for loan submission, MongoDB data persistence, admin dashboard visibility, login rate limiting, and unauthorized API access.

## Author

**Sehran**  
B.Tech — Computer Science & Engineerin
