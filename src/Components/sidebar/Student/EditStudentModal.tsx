import React, { useState, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  grade: string;
  department: string;
  status: 'Active' | 'Inactive';
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (student: Student) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, student, onSave }) => {
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  useEffect(() => {
    setEditStudent(student);
  }, [student]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editStudent) return;
    const { name, value } = e.target;
    setEditStudent(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = () => {
    if (editStudent) {
      onSave(editStudent);
      onClose();
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
            name="name"
            type="text"
            value={editStudent.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="grade"
            type="text"
            value={editStudent.grade}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="department"
            type="text"
            value={editStudent.department}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
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
          <div className="flex space-x-4">
            <button onClick={onClose} className="w-full bg-gray-300 text-gray-700 py-2 rounded">Cancel</button>
            <button onClick={handleSave} className="w-full bg-blue-500 text-white py-2 rounded">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
