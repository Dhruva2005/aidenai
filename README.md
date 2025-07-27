# Employee Travel & Leave Approval System

A comprehensive full-stack web application for managing employee travel requests and leave approvals within an organization.

## 🎯 Project Overview

This system streamlines the process of managing employee travel requests and leave approvals, allowing employees to submit detailed travel requests and enabling managers to view, approve, or reject requests while tracking employee and manager information.

## 🛠️ Technology Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Spring Boot (Java 17)
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **UI Framework**: Material-UI (MUI)
- **REST API**: For frontend-backend communication

## 👨‍💼 User Roles

### Employee
- Login to the system
- Submit travel requests with detailed information
- View personal leave balance
- Track request status (Pending, Approved, Rejected)
- View history of submitted requests

### Manager
- Login to the system
- View all travel requests from team members
- Filter requests by status (Approved, Rejected, Pending)
- View detailed travel request information
- Approve or reject travel requests
- View employee leave balances

## 📋 Core Functionalities

### 🔐 Authentication System
- Email and password-based login
- Role-based redirection (Employee → Dashboard, Manager → Management Dashboard)
- JWT token-based session management

### 🧑‍💻 Employee Features
- **Travel Request Submission**: Create requests with travel dates, locations, transport mode, and purpose
- **Leave Balance Tracking**: Real-time view of available leave days
- **Request History**: View all submitted requests with their current status
- **Automatic Leave Calculation**: System calculates required days based on travel dates

### 👩‍💼 Manager Features
- **Dashboard Overview**: Tabbed interface showing Approved, Rejected, and Pending requests
- **Request Management**: View, approve, or reject employee travel requests
- **Detailed Views**: Access comprehensive request information including employee details
- **Leave Validation**: System prevents approval if employee has insufficient leave balance

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- MySQL database server
- Docker and Docker Compose (for containerized deployment)

### Option 1: Docker Deployment (Recommended)

The easiest way to run the application is using Docker:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ADENAI
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080

For detailed Docker instructions, see [DOCKER_README.md](DOCKER_README.md).

### Option 2: Manual Setup

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Configure database**:
   - Create a MySQL database named `travel_leave_db`
   - Update database credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run the Spring Boot application**:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   The backend server will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   
   The frontend application will open at `http://localhost:3000`

## 👤 Demo Accounts

The system comes with pre-configured demo accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Manager | manager@company.com | password123 | John Manager - Can approve/reject requests |
| Employee | alice@company.com | password123 | Alice Johnson - Regular employee |
| Employee | bob@company.com | password123 | Bob Smith - Regular employee |

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Travel Requests
- `POST /api/travel` - Create new travel request
- `GET /api/travel/myrequests` - Get current user's requests
- `GET /api/travel/all` - Get all requests (Manager only)
- `GET /api/travel/{id}` - Get specific request details
- `PUT /api/travel/{id}/approve` - Approve request (Manager only)
- `PUT /api/travel/{id}/reject` - Reject request (Manager only)

### User Management
- `GET /api/users/me` - Get current user information
- `GET /api/users/{id}/leaves` - Get user leave balance

## 📊 Features in Detail

### Travel Request Form
- **Employee Information**: First Name, Last Name (auto-filled)
- **Travel Details**: From/To dates, locations, destination
- **Transport Options**: Train, Flight, Bus, Car, etc.
- **Purpose**: Detailed reason for travel
- **Automatic Calculations**: Leave days automatically calculated

### Manager Dashboard
- **Tabbed Interface**: Separate views for different request statuses
- **Comprehensive Table**: Shows employee names, dates, destinations, transport modes
- **Quick Actions**: Approve/Reject buttons with confirmation
- **Detailed View**: Modal with complete request information

### Leave Management
- **Balance Tracking**: Real-time leave balance display
- **Automatic Deduction**: Approved requests automatically deduct from balance
- **Validation**: Prevents approval of requests exceeding available leaves

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for employees and managers
- **API Security**: Protected endpoints with proper authorization
- **Input Validation**: Comprehensive validation on both frontend and backend

## 🔮 Future Enhancements

- Email notifications for request status changes
- Excel export functionality for request reports
- Expense claims integration
- Admin dashboard with analytics and reports
- Mobile responsive design improvements
- Calendar integration for travel dates

## 📁 Project Structure

```
├── backend/
│   ├── src/main/java/com/adenai/travelleavesystem/
│   │   ├── controller/          # REST Controllers
│   │   ├── model/              # JPA Entities
│   │   ├── repository/         # Data Access Layer
│   │   ├── security/           # JWT & Security Configuration
│   │   ├── service/            # Business Logic
│   │   └── dto/                # Data Transfer Objects
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── contexts/           # React Context (Auth)
│   │   ├── services/           # API Services
│   │   └── types/              # TypeScript Interfaces
│   └── public/
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support, email admin@company.com or create an issue in the repository.
