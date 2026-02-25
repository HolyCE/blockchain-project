# EduChain Folder Structure Guide

## Complete File Organization

```
educhain/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   │
│   ├── components/              # Reusable UI Components
│   │   ├── Sidebar.js          # Navigation sidebar
│   │   ├── StatCard.js         # Statistics display card
│   │   ├── ResultTable.js      # Student results table
│   │   └── AuditTrail.js       # Activity log component
│   │
│   ├── pages/                  # Page-level Components
│   │   ├── Login.js            # Login page with role selection
│   │   └── Dashboard.js        # Main dashboard page
│   │
│   ├── services/               # API and External Services
│   │   └── api.js              # API service layer (mock + real)
│   │
│   ├── styles/                 # CSS Files
│   │   ├── App.css             # Global app styles
│   │   ├── Login.css           # Login page styles
│   │   ├── Dashboard.css       # Dashboard layout styles
│   │   ├── Sidebar.css         # Sidebar styles
│   │   ├── StatCard.css        # Stat card styles
│   │   ├── ResultTable.css     # Result table styles
│   │   └── AuditTrail.css      # Audit trail styles
│   │
│   ├── App.js                  # Main App component (root)
│   └── index.js                # React entry point
│
├── package.json                # Dependencies and scripts
├── README.md                   # Documentation
└── .gitignore                  # Git ignore rules
```

## File Relationships

### App.js (Main Entry)
```
App.js
├── imports → Login (page)
└── imports → Dashboard (page)
```

### Login Page
```
Login.js
├── imports → api.js (service)
└── uses → Login.css (style)
```

### Dashboard Page
```
Dashboard.js
├── imports → Sidebar (component)
├── imports → StatCard (component)
├── imports → ResultTable (component)
├── imports → AuditTrail (component)
├── imports → api.js (service)
└── uses → Dashboard.css (style)
```

### Components
```
Sidebar.js → Sidebar.css
StatCard.js → StatCard.css
ResultTable.js → ResultTable.css
AuditTrail.js → AuditTrail.css
```

## How to Use This Structure

1. **Copy all files** from the provided project folder
2. **Maintain the folder structure** exactly as shown
3. **Import paths** are already configured correctly
4. **Run `npm install`** to install dependencies
5. **Run `npm start`** to launch the app

## Key Import Patterns

### In Components (e.g., Sidebar.js):
```javascript
import React from 'react';
import '../styles/Sidebar.css';  // Note: ../ to go up one level
```

### In Pages (e.g., Dashboard.js):
```javascript
import React from 'react';
import Sidebar from '../components/Sidebar';  // Import from components
import API from '../services/api';            // Import from services
import '../styles/Dashboard.css';             // Import CSS
```

### In App.js:
```javascript
import React from 'react';
import Login from './pages/Login';      // Same level, then pages folder
import Dashboard from './pages/Dashboard';
import './styles/App.css';
```

## Adding New Components

To add a new component:

1. Create `NewComponent.js` in `src/components/`
2. Create `NewComponent.css` in `src/styles/`
3. Import in the parent component:
```javascript
import NewComponent from '../components/NewComponent';
```

## Modifying Styles

Each component has its own CSS file. This keeps styles:
- **Organized**: Easy to find styles for each component
- **Modular**: Changes don't affect other components
- **Maintainable**: Clear separation of concerns

## Environment Setup

Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BLOCKCHAIN_URL=http://localhost:7545
```

Access in code:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

---

**All files are properly linked and ready to run!** ✅
