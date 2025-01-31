import React, { useState, useEffect } from 'react';

const CoursesManagement = () => {

  const [courses, setCourses] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [newCourse, setNewCourse] = useState({
    name: '',
    price: '',
    institute: ''
  });

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5005/course/getcourse');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data.courses || []); 
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); 
      } else {
        setError('An unknown error occurred'); 
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.price) {
      alert('Please fill in course name and price');
      return;
    }

    const courseToAdd = {
      ...newCourse,
      price: parseFloat(newCourse.price)
    };

    try {
      const response = await fetch('http://localhost:5005/course/addcourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseToAdd),
      });

      if (!response.ok) {
        throw new Error('Failed to add course');
      }

      await response.json();
      fetchCourses(); 
      setNewCourse({ name: '', price: '', institute: '' });
      setIsAddCourseModalOpen(false);
    } catch (error) {
      alert('Failed to add course. Please try again.');
    }
  };
  const handleRemoveCourse = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5005/course/deletecourse/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove course');
      }

      fetchCourses(); 
    } catch (error) {
      alert('Failed to remove course. Please try again.');
    }
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
      {loading && <div className="text-center text-blue-500">Loading courses...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <div className="space-y-4 mb-6">
        {courses.map((course) => (
          <div
            key={course._id} 
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
              onClick={() => handleRemoveCourse(course._id)} 
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
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
                <label htmlFor="course-name" className="block mb-2 font-medium">
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
                <label htmlFor="course-institute" className="block mb-2 font-medium">
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
                <label htmlFor="course-price" className="block mb-2 font-medium">
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
