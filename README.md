# LendSwift — Loan Application Management System

LendSwift is a full-stack web application for submitting loan applications and managing them through an administrator dashboard.

## Live Demo

- **Frontend:** https://lendswift-4.onrender.com
- **Backend:** https://lendswift-3.onrender.com
- **GitHub:** https://github.com/Sehran0008/LendSwift

## Features

- Multi-step loan application form
- Personal, home, and business loan options
- EMI calculation and repayment summary
- Form validation and application submission
- MongoDB database integration
- Admin login and protected application APIs
- Admin dashboard for viewing applications
- Login rate limiting

## Technology Stack

- React, Vite, JavaScript, HTML, CSS
- Node.js and Express.js
- MongoDB and MongoDB Atlas
- Render and GitHub

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

Clone the repository:

```bash
git clone https://github.com/Sehran0008/LendSwift.git
cd LendSwift
```

Install backend dependencies from the `backend` folder using `npm install`. Configure the required environment variables, then use the start script in `backend/package.json`.

Install frontend dependencies from `loan-application` using `npm install`, then run `npm run dev`. Configure the frontend API URL as required by the project.

## Security Notes

- Admin application APIs require authentication.
- Admin login uses rate limiting.
- Keep database credentials and token secrets in environment variables.
- Never commit `.env` files or real applicant information.

## Project Status

The deployed application has been tested for loan submission, MongoDB data persistence, admin dashboard visibility, login rate limiting, and unauthorized API access.

## Author

**Sehran**  
B.Tech — Computer Science & Engineering
