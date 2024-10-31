import React, { useState } from 'react';

// Define the Teacher interface
interface Teacher {
  id: number | null;
  name: string;
  email: string;
  course: string;
}

// Define available courses
const AVAILABLE_COURSES = [
  'Mathematics',
  'Science',
  'English Literature', 
  'History',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Biology'
];

const TeacherManagement: React.FC = () => {
  // State to manage teachers list
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  // State for showing add teacher submenu
  const [isAddingTeacher, setIsAddingTeacher] = useState<boolean>(false);
  
  // State for new teacher form
  const [newTeacher, setNewTeacher] = useState<Teacher>({
    id: null,
    name: '',
    email: '',
    course: ''
  });

  // Validation state
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    
    if (!newTeacher.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newTeacher.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newTeacher.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new teacher
  const addTeacher = () => {
    if (validateForm()) {
      const isDuplicate = teachers.some(teacher => teacher.email === newTeacher.email);

      if (isDuplicate) {
        setErrors(prev => ({
          ...prev,
          email: 'A teacher with this email already exists'
        }));
        return;
      }

      // Add new teacher with unique ID
      const teacherToAdd: Teacher = {
        ...newTeacher,
        id: Date.now() // Use timestamp as a simple unique identifier
      };

      setTeachers(prev => [...prev, teacherToAdd]);
      
      // Reset form and close submenu
      setNewTeacher({ id: null, name: '', email: '', course: '' });
      setErrors({});
      setIsAddingTeacher(false);
    }
  };

  // Remove teacher
  const removeTeacher = (idToRemove: number) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== idToRemove));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
        <button 
          onClick={() => setIsAddingTeacher(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          + Add Teacher
        </button>
      </div>

      {/* Teacher List */}
      {teachers.length === 0 ? (
        <p className="text-gray-500 text-center">No teachers added yet</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id} 
              className="flex justify-between items-center py-4"
            >
              <div>
                <p className="font-medium text-gray-800">{teacher.name}</p>
                <p className="text-gray-600 text-sm">
                  {teacher.email}
                  {teacher.course && ` - ${teacher.course}`}
                </p>
              </div>
              <button 
                onClick={() => removeTeacher(teacher.id!)} // Non-null assertion
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Teacher Submenu (Overlay) */}
      {isAddingTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Teacher</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Teacher Name"
                  value={newTeacher.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Teacher Email"
                  value={newTeacher.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Course (Optional)</label>
                <select
                  name="course"
                  value={newTeacher.course}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Course</option>
                  {AVAILABLE_COURSES.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button 
                  onClick={() => setIsAddingTeacher(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={addTeacher}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Save Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
