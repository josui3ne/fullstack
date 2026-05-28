const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();

// Hardcoded Port for easy routing
const PORT = 5000; 
const SALT_ROUNDS = 10;

// ==========================================
// 1. MIDDLEWARE CONFIGURATION
// ==========================================
app.use(cors({
    origin: 'http://localhost:5173', // Matches your Vite frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Crucial for handling sessions/cookies with Axios
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session with hardcoded secret
app.use(session({
    secret: 'hms_local_dev_secret_key_12345', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Must be false for local HTTP development
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2 // 2-hour login sessions
    }
}));

// ==========================================
// 2. HARDCODED DATABASE CONNECTION (MySQL)
// ==========================================
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Default XAMPP/WAMP user
    password: '',      // Default XAMPP/WAMP blank password
    database: 'HM',   // Your specified database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify connection on boot
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL "HMS" Database successfully.');
        connection.release();
    }
});

// Session Authentication Guard Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
};

// ==========================================
// 3. AUTHENTICATION ENDPOINTS
// ==========================================

// Create Account (Signup)
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Automatically ensures a system Users table exists for testing
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS Users (
                UserID INT AUTO_INCREMENT PRIMARY KEY,
                Username VARCHAR(50) NOT NULL UNIQUE,
                Email VARCHAR(100) NOT NULL UNIQUE,
                Password VARCHAR(255) NOT NULL
            )
        `);

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        await db.promise().query(
            'INSERT INTO Users (Username, Email, Password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Username or Email already exists." });
        }
        res.status(500).json({ message: "Server error during registration." });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const [users] = await db.promise().query('SELECT * FROM Users WHERE Email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.Password);

        if (!match) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Write to session instance
        req.session.user = { id: user.UserID, username: user.Username, email: user.Email };
        res.status(200).json({ message: "Login successful!", user: req.session.user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
});

// Check Active Session (For ProtectedRouter.jsx)
app.get('/api/auth/session', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ authenticated: true, user: req.session.user });
    } else {
        res.status(200).json({ authenticated: false });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Could not log out." });
        }
        res.clearCookie('connect.sid'); 
        res.status(200).json({ message: "Logged out successfully." });
    });
});


// ==========================================
// 4. PATIENT CRUD OPERATIONS
// ==========================================

// Create Patient
app.post('/api/patients', isAuthenticated, async (req, res) => {
    const { FirstName, LastName, Gender, Telephone, Address, RegistrationDate } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO Patient (FirstName, LastName, Gender, Telephone, Address, RegistrationDate) VALUES (?, ?, ?, ?, ?, ?)',
            [FirstName, LastName, Gender, Telephone, Address, RegistrationDate]
        );
        res.status(201).json({ message: "Patient registered successfully", PatientID: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read All Patients
app.get('/api/patients', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Patient');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Patient
app.put('/api/patients/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, Gender, Telephone, Address, RegistrationDate } = req.body;
    try {
        await db.promise().query(
            'UPDATE Patient SET FirstName=?, LastName=?, Gender=?, Telephone=?, Address=?, RegistrationDate=? WHERE PatientID=?',
            [FirstName, LastName, Gender, Telephone, Address, RegistrationDate, id]
        );
        res.status(200).json({ message: "Patient details updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Patient
app.delete('/api/patients/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        await db.promise().query('DELETE FROM Patient WHERE PatientID = ?', [id]);
        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================================
// 5. DOCTOR CRUD OPERATIONS
// ==========================================

// Create Doctor
app.post('/api/doctors', isAuthenticated, async (req, res) => {
    const { DoctorCode, DoctorName, Specialization, Telephone, Email, HireDate } = req.body;
    try {
        await db.promise().query(
            'INSERT INTO Doctor (DoctorCode, DoctorName, Specialization, Telephone, Email, HireDate) VALUES (?, ?, ?, ?, ?, ?)',
            [DoctorCode, DoctorName, Specialization, Telephone, Email, HireDate]
        );
        res.status(201).json({ message: "Doctor record added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read All Doctors
app.get('/api/doctors', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM Doctor');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Doctor
app.put('/api/doctors/:code', isAuthenticated, async (req, res) => {
    const { code } = req.params;
    const { DoctorName, Specialization, Telephone, Email, HireDate } = req.body;
    try {
        await db.promise().query(
            'UPDATE Doctor SET DoctorName=?, Specialization=?, Telephone=?, Email=?, HireDate=? WHERE DoctorCode=?',
            [DoctorName, Specialization, Telephone, Email, HireDate, code]
        );
        res.status(200).json({ message: "Doctor details updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Doctor
app.delete('/api/doctors/:code', isAuthenticated, async (req, res) => {
    const { code } = req.params;
    try {
        await db.promise().query('DELETE FROM Doctor WHERE DoctorCode = ?', [code]);
        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================================
// 6. APPOINTMENT CRUD OPERATIONS
// ==========================================

// Create Appointment
app.post('/api/appointments', isAuthenticated, async (req, res) => {
    const { PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status } = req.body;
    try {
        const [result] = await db.promise().query(
            'INSERT INTO Appointment (PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status) VALUES (?, ?, ?, ?, ?, ?)',
            [PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status || 'Scheduled']
        );
        res.status(201).json({ message: "Appointment booked successfully", AppointmentID: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read All Appointments (Includes joined Patient & Doctor Names for the Table/View)
app.get('/api/appointments', isAuthenticated, async (req, res) => {
    try {
        const query = `
            SELECT a.*, 
                   CONCAT(p.FirstName, ' ', p.LastName) AS PatientName, 
                   d.DoctorName 
            FROM Appointment a
            JOIN Patient p ON a.PatientID = p.PatientID
            JOIN Doctor d ON a.DoctorCode = d.DoctorCode
        `;
        const [rows] = await db.promise().query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Appointment
app.put('/api/appointments/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status } = req.body;
    try {
        await db.promise().query(
            'UPDATE Appointment SET PatientID=?, DoctorCode=?, AppointmentDate=?, Diagnosis=?, Treatment=?, Status=? WHERE AppointmentID=?',
            [PatientID, DoctorCode, AppointmentDate, Diagnosis, Treatment, Status, id]
        );
        res.status(200).json({ message: "Appointment records updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Appointment
app.delete('/api/appointments/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        await db.promise().query('DELETE FROM Appointment WHERE AppointmentID = ?', [id]);
        res.status(200).json({ message: "Appointment cancelled/deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// START EXECUTABLE SERVER
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Engine live at http://localhost:${PORT}`);
});