# LendSwift — Online Loan Application System

LendSwift is a full-stack web application that allows users to fill out loan application forms, review their details, and submit applications. An admin dashboard allows authorized administrators to view submitted applications.

## Live Demo

- **Frontend:** https://lendswift-4.onrender.com
- **Backend:** https://lendswift-3.onrender.com

> This project is intended for demonstration and educational purposes. It does not provide real loans or process real loan approvals.

## Features

- Multi-step loan application form
- Personal, home, and business loan options
- Loan EMI calculation
- Applicant information and document steps
- Form validation and application submission
- MongoDB database integration
- Admin login and protected application dashboard
- Search and filter applications
- Responsive user interface

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
- MongoDB
- MongoDB Node.js integration

**Deployment**
- Render
- MongoDB Atlas
- GitHub

## Application Workflow

1. Select a loan type and enter loan details.
2. Complete the applicant information.
3. Review the application.
4. Submit the application.
5. Authorized admins can view saved applications in the dashboard.

## Run Locally

### Prerequisites
- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance

### Backend Setup

```bash
cd backend
npm install
```

Configure the required environment variables using the project's existing configuration and documentation. Never commit credentials or secret values.

Start the backend using the start script defined in `backend/package.json`.

### Frontend Setup

```bash
cd loan-application
npm install
```

Create a local `.env` file with the appropriate API URL configuration:

```env
VITE_API_URL=http://localhost:10000
```

Run the frontend:

```bash
npm run dev
```

Use the actual backend port configured in your local environment if it differs.

## Security Notes

- Admin access is protected by authentication.
- Database access should follow the principle of least privilege.
- Store passwords, database connection strings, and token secrets in environment variables.
- Do not commit `.env` files or real applicant information.
- This demonstration project has not been represented as a production-ready lending platform.

## Author

**Sehran**

GitHub: https://github.com/Sehran0008

---

Made for learning and demonstrating full-stack web development.
