
import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link 
} from 'react-router-dom';
import { 
  Home, 
  User,  
  Menu, 
  X ,
  GraduationCap,
  BookOpen,
} from 'lucide-react';

export const HomePage = () => <div className="p-6 text-2xl">Home Dashboard</div>;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarLinks = [
    { 
      path: '/', 
      icon: <Home className="w-5 h-5"/>, 
      label: 'Home' 
    },
    { 
      path: '/teachers', 
      icon: <User className="w-5 h-5"/>, 
      label: 'Teachers' 
    },
    { 
      path: '/students', 
      icon: <GraduationCap className="w-5 h-5"/>, 
      label: 'Students'
    },
    { 
      path: '/courses', 
      icon: <BookOpen className="w-5 h-5"/>, 
      label: 'Courses' 
    }
  ];

  return (
    
    <div className="flex h-screen">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isOpen ? <X /> : <Menu />}
      </button>
      <div 
        className={`
          fixed md:relative z-40 
          w-64 h-full 
          bg-gray-800 text-white 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          My App
        </div>

        <nav className="mt-10">
          {sidebarLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="
                flex items-center 
                px-6 py-3 
                hover:bg-gray-700 
                transition-colors 
                duration-200
              "
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar