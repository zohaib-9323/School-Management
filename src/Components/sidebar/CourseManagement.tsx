import React, { useState } from 'react';

const CoursesManagement = () => {
  // State for courses and form
  const [courses, setCourses] = useState([
    { id: 1, name: 'Web Development', price: 499.99, institute: 'Tech Academy' },
    { id: 2, name: 'Data Science', price: 599.99, institute: 'Data Insights' },
    { id: 3, name: 'Digital Marketing', price: 349.99, institute: 'Marketing Pro' }
  ]);

  // State for adding new course
  const [newCourse, setNewCourse] = useState({
    name: '',
    price: '',
    institute: ''
  });

  // State for form visibility
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new course
  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.price) {
      alert('Please fill in course name and price');
      return;
    }

    const courseToAdd = {
      ...newCourse,
      id: courses.length + 1,
      price: parseFloat(newCourse.price)
    };

    setCourses(prev => [...prev, courseToAdd]);
    
    // Reset form
    setNewCourse({ name: '', price: '', institute: '' });
    setIsAddCourseModalOpen(false);
  };

  // Remove course
  const handleRemoveCourse = (id: number) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Courses Management</h2>
        <button 
          onClick={() => setIsAddCourseModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          + Add Course
        </button>
      </div>
      
      {/* Courses List */}
      <div className="space-y-4 mb-6">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="flex justify-between items-center p-4 border rounded-lg bg-gray-50"
          >
            <div>
              <h3 className="font-semibold text-lg">{course.name}</h3>
              <p className="text-gray-600">
                Institute: {course.institute}
              </p>
              <p className="text-blue-600 font-medium">
                Price: ${course.price.toFixed(2)}
              </p>
            </div>
            <button 
              onClick={() => handleRemoveCourse(course.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Course</h3>
              <button 
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="course-name" 
                  className="block mb-2 font-medium"
                >
                  Course Name
                </label>
                <input 
                  id="course-name"
                  name="name"
                  type="text"
                  value={newCourse.name}
                  onChange={handleInputChange}
                  placeholder="Enter course name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label 
                  htmlFor="course-institute" 
                  className="block mb-2 font-medium"
                >
                  Institute
                </label>
                <input 
                  id="course-institute"
                  name="institute"
                  type="text"
                  value={newCourse.institute}
                  onChange={handleInputChange}
                  placeholder="Enter institute name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label 
                  htmlFor="course-price" 
                  className="block mb-2 font-medium"
                >
                  Price
                </label>
                <input 
                  id="course-price"
                  name="price"
                  type="number"
                  value={newCourse.price}
                  onChange={handleInputChange}
                  placeholder="Enter course price"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddCourse}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Add Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-gray-600">
        Total Courses: {courses.length}
      </div>
    </div>
  );
};

export default CoursesManagement;