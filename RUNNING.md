# AttendX Execution & Run Guide

This guide details the steps to run, develop, and build **AttendX**—a modern desktop and web attendance system integrated with **MediaPipe Facial Landmark detection** and a **Spring Boot** backend.

---

## 📋 Prerequisites

Before running the application, make sure you have the following installed on your machine:

1. **Java Development Kit (JDK) 21**
   - Required to run the Spring Boot backend (`backend.jar`).
   - Verify by running: `java -version` (should show version 21).
2. **Node.js (LTS version recommended) & npm**
   - Required to run the Vite dev server and Electron.
   - Verify by running: `node -v` and `npm -v`.
3. **Active Internet Connection**
   - The backend connects to a remote MongoDB cloud instance: `mongodb+srv://mrsivakumar216_db_user...` as configured in `backend/.env`.

---

## 🚀 Recommended: Run as a Standalone Desktop Application (Electron)

The project is pre-configured to run as a native desktop application. In this mode, Electron launches and manages the **Spring Boot Backend** and **Face Recognition Microservice** automatically.

### Step 1: Start the Frontend Dev Server
Electron loads the web client from the local Vite development server in development mode.

1. Open a terminal (PowerShell, Command Prompt, or Git Bash).
2. Navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```
3. Install frontend dependencies (if not already done):
   ```powershell
   npm install
   ```
4. Start the Vite dev server:
   ```powershell
   npm run dev
   ```
   *(Keep this terminal open. It runs the frontend dev server at `http://localhost:5173`.)*

### Step 2: Start the Desktop App (Electron)
With the dev server active, Electron will spawn the backend services automatically and display the UI.

1. Open a **second** terminal window.
2. Navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```
3. Launch the Electron app:
   ```powershell
   npm run electron:start
   ```

> [!NOTE]
> When you run `npm run electron:start`, Electron automatically executes:
> - **Spring Boot Backend:** Spawns `backend/target/backend.jar` on port `8080`.
> - **Face Recognition Service:** Spawns `mediapipe_face/dist/app.exe` on port `5000`.
> - **Main Window:** Displays the AttendX application window, loading from `http://localhost:5173`.
>
> Closing the Electron window will automatically terminate the background Java and Python processes.

---

## 📦 Build & Package as a Production Desktop App (.exe)

To build a standalone installer (`.exe`) that packs the entire system (Frontend, Spring Boot backend, and Face recognition engine) into a single installable file:

1. Navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```
2. Build the production assets:
   ```powershell
   npm run build
   ```
3. Build the desktop installer:
   ```powershell
   npm run electron:build
   ```
4. Once completed, the standalone Windows installer (`.exe`) will be generated inside:
   `frontend/dist/`

---

## 🛠️ Advanced: Run Components Individually (Web Mode)

If you wish to debug specific parts of the system or run it purely in the browser without Electron, you can launch each component independently:

### 1. Spring Boot Backend
- **Port:** `8080`
- **Steps:**
  1. Open a terminal and go to `backend`:
     ```powershell
     cd backend
     ```
  2. Run using Maven:
     ```powershell
     .\mvnw spring-boot:run
     ```
     *Alternatively, run the pre-built JAR:*
     ```powershell
     java -jar target/backend.jar
     ```

### 2. MediaPipe Face Recognition Microservice
- **Port:** `5000`
- **Steps:**
  1. Open a terminal and go to `mediapipe_face`:
     ```powershell
     cd mediapipe_face
     ```
  2. Run the pre-compiled executable directly:
     ```powershell
     .\dist\app.exe
     ```
     *(Or if running from python source, install `requirements.txt` and run `python app.py`)*

### 3. Frontend Web Server
- **Port:** `5173`
- **Steps:**
  1. Open a terminal and go to `frontend`:
     ```powershell
     cd frontend
     ```
  2. Run:
     ```powershell
     npm run dev
     ```
  3. Open your browser and go to `http://localhost:5173`.

---

## 🔍 Troubleshooting

- **Error: `java` command not found:** Ensure Java 21 is installed and added to your system `PATH` environment variable.
- **Port `8080` or `5000` or `5173` already in use:** A previous instance of the server may still be running. You can close all active command prompts, or check Task Manager for any orphaned `java.exe` or `app.exe` processes and end them.
- **Database Connection Issues:** Make sure your internet connection is active, as MongoDB is hosted in the cloud.
