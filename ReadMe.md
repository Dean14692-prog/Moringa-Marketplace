# Moringa School Innovation Marketplace - README

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Team](#team)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The Moringa School Innovation Marketplace is a web-based platform designed to showcase, promote, and monetize student projects from Moringa School's coding bootcamp. This platform serves three primary functions:

1. **Project Showcase**: Students can upload their capstone projects with detailed information about the technology stack, team members, and project goals.
2. **Talent Marketplace**: Recruiters and companies can discover talented developers and potentially hire them based on their demonstrated skills.
3. **E-Commerce Platform**: Moringa School can sell branded merchandise to support its community and operations.

The platform aims to transform abandoned student projects into viable commercial opportunities while increasing students' employability and entrepreneurial experience.

## Features

### Core Features

#### Student Project Management
- Project submission with title, description, tech stack, GitHub link, and demo materials
- Categorization by industry (HealthTech, EdTech, FinTech, etc.)
- Advanced search and filtering capabilities
- Detailed project pages with multimedia support

#### User Authentication
- Role-based access control (Students, Recruiters, Admin)
- JWT authentication
- Student profiles with skills, social links, and project history

#### Admin Dashboard
- Project approval/rejection workflow
- Merchandise inventory management
- Platform analytics and engagement metrics

#### E-Commerce Module
- Product catalog with categories
- Shopping cart functionality
- Secure checkout with M-Pesa 
- Order management system

#### Client Interaction
- Direct messaging system
- Project endorsement system

### Bonus Features
- Project rating and review system
- Featured projects section
- Student analytics dashboard


## Technical Stack

### Frontend
- **Framework**: React.js
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **UI Components**: Material-UI

### Backend
- **Framework**: Flask RESTful
- **Authentication**: JWT 
- **API Documentation**: OpenAPI

### Database
- **Primary Database**:SQlite
- **ORM**: SQLAlchemy

### Services
- **File Storage**:Flask DB
- **Payments**: M-Pesa Daraja API

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **CI/CD**: GitHub Actions

## Installation

### Prerequisites
- React (v18.2.0)
- Python (v3.12 or higher) if using Flask
- SQLAlchemy (v3.11 or higher)
-  Npm (v11.4.2)

### Frontend Setup
```bash
git clone https://github.com/Dean14692-prog/Moringa-Marketplace.git
cd moringa-marketplace/client
npm install
```

### Backend Setup (Strapi)
```bash
cd ../server
pipenv install
```

### Database Setup
1. Create a Sqlite database : flask db init
2. Update the database configuration in : flask db migrate -m "message"

### Environment Variables
Create a `.env` file in both client and server directories with the required variables:

#### Client.env
```env
VITE_APP_URL=your_vite_app_url

```

#### Backend .env
```env
DATABASE_HOST=localhost
DATABASE_PORT=5555
DATABASE_NAME=moringa_marketplace
DATABASE_USERNAME=Sqlite
JWT_SECRET=your_jwt_secret
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret

```

## Configuration

### Payment Gateways
1. **M-Pesa**: Apply for Daraja API credentials at safaricom.co.ke



### Email Service
Configure SendGrid or alternative email service for notifications

## Usage

### Development
```bash
# Start frontend
cd client
npm run dev

# Start backend (Strapi)
cd ../server
flask run 
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5555
- Admin panel: http://localhost:5173/admin

### Production
Refer to the deployment section for production setup instructions.

## API Endpoints

The backend provides RESTful API endpoints for all platform functionality. Complete API documentation is available at `/api-docs` when running the development server.

Key endpoints include:
- `/api/projects` - Project management
- `/api/auth` - Authentication
- `/api/orders` - E-commerce orders
- `/api/merchandise` - Product management
- `/api/messages` - Contact/hiring system

## Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

### Backend Deployment (Render)
    Go to https://dashboard.render.com

    Click "New Web Service"

    Connect your GitHub repo

    Set the environment:

        Runtime: Python 3

        Build Command: pip install -r requirements.txt

        Start Command: gunicorn app:app

    Add any required environment variables (e.g., FLASK_ENV=production)

## Team

Our team followed Agile methodology with the following roles:

- **Product Manager**: Sam Tomashi - Requirements gathering and prioritization
- **Frontend**: [Ken Tuei]- UI implementation and state management
- **Backend**: [Aaron Rashid]- API development and database design
- **Frontend**: [Dennis Ngui] - Deployment and CI/CD pipeline
- **Frontend**: [Shamim Kalande]- Wireframing and user experience design
- **Backend**: [Elvis Otieno]- API development and database design
- **Frontend**: [Rose Boyani]-UI implementation and state management

## Contributing

We welcome contributions from the Moringa School community. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows our style guidelines and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Moringa School for the opportunity and guidance
- Our technical mentor Sam Tomashi for your invaluable support
- The open-source community for the tools that made this possible