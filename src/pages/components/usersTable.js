"use client";

import { useState } from "react";
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

export default function UsersTable() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "selected" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "not selected",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditData(user);
  };

  const handleSave = (id) => {
    setUsers(users.map((user) => (user.id === id ? editData : user)));
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (e, field) => {
    setEditData({
      ...editData,
      [field]: e.target.value,
    });
  };

  return (
    <div className="p-4 text-white">
      <div className="mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-gray-200">Name</TableHead>
            <TableHead className="text-gray-200">Email</TableHead>
            <TableHead className="text-gray-200">Status</TableHead>
            <TableHead className="text-gray-200">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow
              key={user.id}
              className="border-b border-gray-700 hover:bg-gray-800/50"
            >
              {["name", "email"].map((field) => (
                <TableCell key={field} className="text-gray-300">
                  {editingId === user.id ? (
                    <Input
                      value={editData[field]}
                      onChange={(e) => handleChange(e, field)}
                      className="bg-gray-700 text-gray-200"
                    />
                  ) : (
                    user[field]
                  )}
                </TableCell>
              ))}
              <TableCell className="text-gray-300">
                {editingId === user.id ? (
                  <select
                    value={editData.status}
                    onChange={(e) => handleChange(e, "status")}
                    className="bg-gray-700 text-gray-200 rounded p-1"
                  >
                    <option value="selected">Selected</option>
                    <option value="not selected">Not Selected</option>
                  </select>
                ) : (
                  user.status
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Button
                    onClick={() => handleSave(user.id)}
                    variant="outline"
                    className="text-blue-400 hover:text-blue-300 hover:border-blue-300"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEdit(user)}
                    variant="outline"
                    className="text-emerald-400 hover:text-emerald-300 hover:border-emerald-300"
                  >
                    Edit
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>{" "}
      </Table>{" "}
    </div>
  );
}
