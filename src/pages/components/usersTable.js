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
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async (page = 1, limit = itemsPerPage) => {
    setLoading(true);
    const token = Cookies.get("authToken");
    try {
      const response = await axios.get(`/api/scholarships/studentlist?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data.students);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching students data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const filteredUsers = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    return status.toLowerCase() === "selected"
      ? "bg-green-500/20 text-green-500 px-2 py-1 rounded-full"
      : "bg-red-500/20 text-red-500 px-2 py-1 rounded-full";
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
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-2">Loading...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-gray-900 z-10">
                <TableRow className="border-b border-gray-700">
                  <TableHead className="text-gray-200">Name</TableHead>
                  <TableHead className="text-gray-200">Email</TableHead>
                  <TableHead className="text-gray-200">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((student) => (
                  <TableRow
                    key={student.id}
                    className="border-b border-gray-700 hover:bg-gray-800/50"
                  >
                    {["name", "email"].map((field) => (
                      <TableCell key={field} className="text-gray-300">
                        {editingId === student.id ? (
                          <Input
                            value={editData[field]}
                            key={field}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
