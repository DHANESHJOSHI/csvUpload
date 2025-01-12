"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

export default function UsersTable() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = Cookies.get("authToken");
      try {
        const response = await axios.get("/api/scholarships/studentlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students data:", error);
      }
    };
    fetchStudents();
  }, []);

  const filteredUsers = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditData(student);
  };

  const handleSave = (id) => {
    setStudents(students.map((student) => (student.id === id ? editData : student)));
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (e, field) => {
    setEditData({
      ...editData,
      [field]: e.target.value,
    });
  };

  const getStatusStyle = (status) => {
    return status.toLowerCase() === 'selected' 
      ? 'bg-green-500/20 text-green-500 px-2 py-1 rounded-full'
      : 'bg-red-500/20 text-red-500 px-2 py-1 rounded-full';
  };

  return (
    <div className="p-1 text-white">
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="w-full h-full overflow-x-auto">
        <div className="max-h overflow-y-auto relative">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-900 z-10">
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-gray-200">Name</TableHead>
                <TableHead className="text-gray-200">Email</TableHead>
                <TableHead className="text-gray-200">Status</TableHead>
                <TableHead className="text-gray-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((student) => (
                <TableRow
                  key={student.id}
                  className="border-b border-gray-700 hover:bg-gray-800/50"
                >
                  {["name", "email"].map((field) => (
                    <TableCell key={field} className="text-gray-300">
                      {editingId === student.id ? (
                        <Input
                          value={editData[field]}
                          onChange={(e) => handleChange(e, field)}
                          className="bg-gray-700 text-gray-200"
                        />
                      ) : (
                        student[field]
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-gray-300">
                    {editingId === student.id ? (
                      <select
                        value={editData.status}
                        onChange={(e) => handleChange(e, "status")}
                        className="bg-gray-700 text-gray-200 rounded p-1"
                      >
                        <option value="selected">Selected</option>
                        <option value="not selected">Not Selected</option>
                      </select>
                    ) : (
                      <span className={getStatusStyle(student.status)}>
                        {student.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === student.id ? (
                      <Button
                        onClick={() => handleSave(student.id)}
                        variant="outline"
                        className="text-blue-400 hover:text-blue-300 hover:border-blue-300"
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleEdit(student)}
                        variant="outline"
                        className="text-emerald-400 hover:text-emerald-300 hover:border-emerald-300"
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-700 text-gray-200 rounded p-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div>
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="text-gray-200"
              >
                Previous
              </Button>
              <span className="flex items-center px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="text-gray-200"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
