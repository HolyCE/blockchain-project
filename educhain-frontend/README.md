# EduChain - Blockchain Academic Records System

A modern React application for managing academic records with blockchain verification.

## 📁 Project Structure

```
educhain/
├── src/
│   ├── components/
│   │   ├── Sidebar.js
│   │   ├── StatCard.js
│   │   ├── ResultTable.js
│   │   └── AuditTrail.js
│   │
│   ├── pages/
│   │   ├── Login.js
│   │   └── Dashboard.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── styles/
│   │   ├── App.css
│   │   ├── Login.css
│   │   ├── Dashboard.css
│   │   ├── Sidebar.css
│   │   ├── StatCard.css
│   │   ├── ResultTable.css
│   │   └── AuditTrail.css
│   │
│   ├── App.js
│   └── index.js
│
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Ganache (for blockchain testing)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

## 🎨 Features

- **Role-Based Access**: Separate interfaces for Lecturers, Students, and Admins
- **Dashboard**: Overview with statistics and metrics
- **Result Management**: Grade input and verification
- **Blockchain Integration**: Commit results to blockchain
- **Audit Trail**: Track all system activities
- **Responsive Design**: Works on desktop and mobile devices

## 🔐 Login Credentials (Mock)

Use any email and password to login. Select the role:
- **Lecturer**: Access to course and result management
- **Student**: View courses and grades
- **Admin**: Full system access including blockchain operations

## 📦 File Descriptions

### Components
- **Sidebar.js**: Navigation menu with role-based items
- **StatCard.js**: Reusable stat display cards
- **ResultTable.js**: Student results table with editing capabilities
- **AuditTrail.js**: Activity log display

### Pages
- **Login.js**: Authentication interface with role selection
- **Dashboard.js**: Main dashboard with stats and content areas

### Services
- **api.js**: Mock API service (ready to connect to backend)

## 🔧 Connecting to Backend

To connect to your Python/Flask backend:

1. Open `src/services/api.js`
2. Uncomment the real API implementation at the bottom
3. Update `API_BASE_URL` in your `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Next Steps

1. **Set up backend**: Configure Python/Flask API
2. **Deploy Ganache**: Start local blockchain
3. **Connect Web3**: Update blockchain service
4. **Add authentication**: Implement JWT tokens
5. **Database integration**: Connect to your database
6. **Deploy**: Host on Vercel, Netlify, or your server

## 📝 Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## 🎨 Customization

### Colors
Main colors are defined in the CSS files:
- Primary: `#3b82f6`
- Success: `#10b981`
- Warning: `#f59e0b`
- Gray scale: Various shades defined in each CSS file

### Layout
- Sidebar width: `260px`
- Content padding: `32px`
- Border radius: `8px` to `12px`

## 📱 Responsive Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🛠️ Tech Stack

- **Frontend**: React 18
- **HTTP Client**: Axios
- **Blockchain**: Web3.js
- **Styling**: Pure CSS (no frameworks)

## 📄 License

This project is for educational purposes.

---

**Happy Coding!** 🎓⛓️
