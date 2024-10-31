import React, { useState, useEffect } from 'react';
import LoginPage from "./Components/pages/Login/Login";
import SignUpPage from "./Components/pages/SignUp/Signup";
import Dashboard from './Components/sidebar/Dashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/sidebar/Sidebar";
import { HomePage } from "./Components/sidebar/Sidebar";
import StudentDashboard from './Components/sidebar/StudentDashboard';
import CoursesManagement from './Components/sidebar/CourseManagement';
import TeacherManagement from './Components/sidebar/Teachers';
interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<
    "login" | "signup" | "dashboard"
  >("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(loggedInUser));
      setCurrentPage("dashboard");
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentPage("dashboard");
      return true;
    }
    return false;
  };

  const handleSignUp = (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const newUser = { firstName, lastName, email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsLoggedIn(true);
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setCurrentPage("login");
  };

  const switchToSignUp = () => setCurrentPage("signup");
  const switchToLogin = () => setCurrentPage("login");

  if (isLoggedIn && currentUser) {
        return <Dashboard user={currentUser} onLogout={handleLogout} />;
    // return(
    // <Router>
    //   <div className="flex h-screen">
    //     <Sidebar />

    //     <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
    //       <Routes>
    //         <Route path="/" element={<HomePage />} />
    //         <Route path="/profile" element={<TeacherManagement />} />
    //         <Route path="/students" element={<StudentDashboard />} />
    //         <Route path="/courses" element={<CoursesManagement />} />
    //       </Routes>
    //     </main>
    //   </div>
    // </Router>
    // );
  };

  return (
    <div>
      {currentPage === "login" ? (
        <LoginPage onLogin={handleLogin} onSwitchToSignUp={switchToSignUp} />
      ) : (
        <SignUpPage onSignUp={handleSignUp} onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default App;
