import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadCenter from "./pages/UploadCenter";
import StudyMode from "./pages/StudyMode";
import Flashcards from "./pages/Flashcards";
import Exam from "./pages/Exam";
import ProjectBuilder from "./pages/ProjectBuilder";
import CodeGenerator from "./pages/CodeGenerator";
import Settings from "./pages/Settings";

function MainLayout() {

  return (

    <div className="flex">

      <Sidebar />

      <div className="ml-64 flex-1 min-h-screen bg-slate-100">

        <Navbar />

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/chat"
            element={<Chat />}
          />

          <Route
            path="/study"
            element={<StudyMode />}
          />

          <Route
            path="/upload"
            element={<UploadCenter />}
          />

          <Route
            path="/flashcards"
            element={<Flashcards />}
          />

          <Route
            path="/exams"
            element={<Exam />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/project-builder"
            element={<ProjectBuilder />}
          />

          <Route
            path="/code-generator"
            element={<CodeGenerator />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>

      </div>

    </div>

  );

}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Pages */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Layout */}

        <Route
          path="/*"
          element={<MainLayout />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;