import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, ArrowUpRight, 
  ArrowDown, ArrowUp, Search, UserPlus, GraduationCap, Trash2
} from 'lucide-react';
import studentData from '../Data/studentdata.json'; // Adjust the path if necessary

interface Student {
  id: number;
  name: string;
  grade: string;
  attendance: string;
  department: string;
  status: 'Active' | 'Inactive';
}

const StudentDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Student>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    grade: '',
    attendance: '',
    department: '',
    status: 'Active'
  });

  useEffect(() => {
    setStudents(studentData as Student[]);
  }, []);

  const handleSort = (field: keyof Student) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: name === 'attendance' ? Number(value) : value
    }));
  };

  const handleAddStudent = () => {
    // Validate input
    if (!newStudent.name || !newStudent.grade || !newStudent.department) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new student with a unique ID
    const studentToAdd = {
      ...newStudent,
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1
    };

    // Add student and close modal
    setStudents(prev => [...prev, studentToAdd]);
    setNewStudent({
      name: '',
      grade: '',
      attendance: '',
      department: '',
      status: 'Active'
    });
    setIsAddStudentModalOpen(false);
  };

  const handleRemoveStudent = (id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
//   const averageAttendance = totalStudents > 0 
//     ? (students.reduce((acc, curr) => acc + curr.attendance, 0) / totalStudents).toFixed(1)
//     : '0.0';
//   const excellentStudents = students.filter(s => s.grade.startsWith('A')).length;

  // Sorting logic
  const sortedStudents = [...students].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    if (a[sortField] < b[sortField]) return -1 * modifier;
    if (a[sortField] > b[sortField]) return 1 * modifier;
    return 0;
  });

  return (
    <>
      {/* Summary Cards (Unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* ... (previous summary cards code remains the same) */}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button 
          onClick={() => setIsAddStudentModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add New Student
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Grade</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Department</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedStudents
                .filter(student => 
                  student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  student.department.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.grade}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.attendance}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.department}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button 
                        onClick={() => handleRemoveStudent(student.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove Student"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Student</h3>
              <button 
                onClick={() => setIsAddStudentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                <input 
                  id="name"
                  name="name"
                  type="text"
                  value={newStudent.name}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="grade" className="block mb-2 font-medium">Grade</label>
                <input 
                  id="grade"
                  name="grade"
                  type="text"
                  value={newStudent.grade}
                  onChange={handleInputChange}
                  placeholder="Enter student grade"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="attendance" className="block mb-2 font-medium">Contact</label>
                <input 
                  id="attendance"
                  name="attendance"
                  type="string"
                  value={newStudent.attendance}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="block mb-2 font-medium">Department</label>
                <input 
                  id="department"
                  name="department"
                  type="text"
                  value={newStudent.department}
                  onChange={handleInputChange}
                  placeholder="Enter student department"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block mb-2 font-medium">Status</label>
                <select
                  id="status"
                  name="status"
                  value={newStudent.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddStudent}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDashboard;