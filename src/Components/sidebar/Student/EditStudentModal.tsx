import React, { useState, useEffect } from 'react';
interface Course {
    id: number;  
    name: string; 
  }
  
  interface Student {
    id: string;  
    Name: string;
    Department: string;
    grade: string;
    status: 'Active' | 'Inactive';
    courses: Course[];  
  }

  interface EditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null; 
    fetchStudents: () => void; 
  }
  
  const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, student, fetchStudents }) => {
    const [editStudent, setEditStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [courseError, setCourseError] = useState<string>(''); 
     const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  
    useEffect(() => {
        if (isOpen) {
            fetchAvailableCourses();
          }
      setEditStudent(student); 
    }, [student,isOpen]);

    const fetchAvailableCourses = async () => {
        try {
          const response = await fetch('http://localhost:5005/course/getcourse');
          if (!response.ok) {
            throw new Error('Failed to fetch courses');
          }
          const data = await response.json();
          setAvailableCourses(data.courses || []);
        } catch (error) {
          console.error('Error fetching courses:', error);
          alert('Failed to load available courses');
        }
      };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!editStudent) return;
      const { name, value } = e.target;
      setEditStudent(prev => prev ? { ...prev, [name]: value } : null);
    };
  
    
    const handleCoursesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const courseNames = value.split(',').map(course => course.trim());
  
      if (courseNames.length > 3) {
        setCourseError('You can add a maximum of 3 courses.');
      } else {
        setCourseError('');
      }
  
     
      const updatedCourses = courseNames.map((course, index) => ({
        id: index + 1,  
        name: course,
      }));
  
      setEditStudent(prev => prev ? { ...prev, courses: updatedCourses } : null);
    };

    // const handleCoursesChange = (course: Course) => {
    //     setEditStudent((prev) => {
    //       if (!prev) return prev; 
      
         
    //       const isSelected = prev.courses.some(c => c.id === course.id);
      
    //       let updatedCourses: Course[];
      
    //       if (isSelected) {
    //         // If the course is already selected, remove it
    //         updatedCourses = prev.courses.filter(c => c.id !== course.id);
    //       } else {
    //         // If the course is not selected and the max selection limit is not reached
    //         if (prev.courses.length >= 3) {
    //           setCourseError('You can select a maximum of 3 courses.');
    //           return prev; // Return previous state if limit is reached
    //         }
    //         // Add the new course to the selected list
    //         updatedCourses = [...prev.courses, course];
    //         setCourseError(''); // Clear the error message
    //       }
      
    //       // Return updated state with modified courses
    //       return {
    //         ...prev,
    //         courses: updatedCourses,
    //       };
    //     });
    //   };
      

    const handleSave = async () => {
        if (!editStudent) return;
      
        const { Name, grade, Department, courses } = editStudent;
        if (!Name || !grade || !Department || courses.length === 0) {
          alert('Please fill in all required fields and add courses.');
          return;
        }
        const courseNames = courses.map(course => course.name);
        const studentToUpdate = {
          Name,
          grade,
          Department,
          courses: courseNames,  
          status: editStudent.status,
        };
      
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5005/student/updatestudent/${editStudent.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentToUpdate),  // Send the updated student object with course names
          });
      
          if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} ${errorMessage}`);
          }
      
          await response.json();
          alert('Student details updated successfully!');
          fetchStudents(); 
          onClose(); 
        } catch (error) {
          console.error('Failed to update student:', error);
          alert('Failed to update student. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
  
    if (!isOpen || !editStudent) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Student</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="space-y-4">
            <input
              name="Name"
              type="text"
              placeholder="Enter student name"
              value={editStudent.Name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              name="grade"
              type="text"
              placeholder="Enter student grade"
              value={editStudent.grade}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              name="Department"
              type="text"
              placeholder="Enter student department"
              value={editStudent.Department}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <select
              name="status"
              value={editStudent.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              name="courses"
              type="text"
              placeholder="Enter courses (comma separated)"
              value={editStudent.courses?.map(course => course.name).join(', ')} // Display courses as comma-separated list
              onChange={handleCoursesChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            {courseError && <p className="text-red-500">{courseError}</p>} {/* Display error if more than 3 courses */}
  
            <div className="flex space-x-4">
              <button type="button" onClick={onClose} className="w-full bg-gray-300 text-gray-700 py-2 rounded">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-full bg-blue-500 text-white py-2 rounded"
                disabled={loading || editStudent.courses.length > 3}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EditStudentModal;