import React, { useState } from 'react';

interface Student {
  id: number;
  name: string;
  grade: string;
  department: string;
  status: 'Active' | 'Inactive';
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: Omit<Student, 'id'>) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    grade: '',
    department: '',
    status: 'Active',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = async () => {
    const { name, grade, department } = newStudent;

    // Input validation
    if (!name || !grade || !department) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await onAdd(newStudent);
      setNewStudent({ name: '', grade: '', department: '', status: 'Active' }); // Reset the form
      onClose();
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Student</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Enter student name"
            value={newStudent.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="grade"
            type="text"
            placeholder="Enter student grade"
            value={newStudent.grade}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            name="department"
            type="text"
            placeholder="Enter student department"
            value={newStudent.department}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <select
            name="status"
            value={newStudent.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex space-x-4">
            <button onClick={onClose} className="w-full bg-gray-300 text-gray-700 py-2 rounded">Cancel</button>
            <button onClick={handleAddStudent} className="w-full bg-blue-500 text-white py-2 rounded">Add Student</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
