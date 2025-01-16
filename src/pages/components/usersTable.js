import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaSave, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Swal from "sweetalert2";
import axios from "axios";

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpanded = (row) => {
    setExpandedRows({
      ...expandedRows,
      [row.email]: !expandedRows[row.email]
    });
  };

  const EditableField = ({ 
    label, 
    value, 
    onChange, 
    type = "text",
    className = ""
  }) => (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-300 text-sm"
      />
    </div>
  );


  const ExpandedComponent = ({ data }) => (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Academic Details</h4>
          <div className="space-y-3">
           
              <>
                <p><span className="font-medium">Field of Study:</span> {data.fieldOfStudy}</p>
                <p><span className="font-medium">10th Grade:</span> {data.tenthGradePercentage}%</p>
                <p><span className="font-medium">12th Grade:</span> {data.twelfthGradePercentage}%</p>
                <p><span className="font-medium">Graduation:</span> {data.graduationPercentage}%</p>
              </>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Personal Details</h4>
          <div className="space-y-3">
            
              <>
                <p><span className="font-medium">Contact:</span> {data.contactNumber}</p>
                <p><span className="font-medium">Age:</span> {data.age}</p>
                <p><span className="font-medium">PWD %:</span> {data.pwdPercentage}</p>
                <p><span className="font-medium">Guardian:</span> {data.guardianOccupation}</p>
              </>
        </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Scholarship Details</h4>
          <div className="space-y-3">
            
              <>
                <p><span className="font-medium">Name:</span> {data.scholarshipName}</p>
                <p><span className="font-medium">Amount Disbursed:</span> ₹{data.amountDisbursed}</p>
                <div className="mt-3">
                  <h5 className="font-medium mb-2">Installments:</h5>
                  {data.installments.map((inst, idx) => (
                    <div key={idx} className="text-xs">
                      #{inst.installmentNumber}: ₹{inst.amount} ({inst.status})
                    </div>
                  ))}
                </div>
              </>
          </div>
        </div>
      </div>
    </div>
  );

  const columns = [
    {
      name: "#",
      cell: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "50px",
      sortable: false,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        editingRow === row.email ? (
          <input
            type="text"
            value={editedData.name || row.name}
            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-300"
          />
        ) : (
          <div className="font-medium text-gray-900">{row.name}</div>
        )
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <div className="text-gray-600">{row.email}</div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        editingRow === row.email ? (
          <select
            value={editedData.status || row.status}
            onChange={(e) => setEditedData({ ...editedData, status: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 bg-white text-gray-700"
          >
            <option value="Selected">Selected</option>
            <option value="Not Selected">Not Selected</option>
          </select>
        ) : (
          <span
            className={`inline-flex items-center whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
              row.status === "Selected"
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {row.status}
          </span>
        )
      ),
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
      cell: (row) => (
        editingRow === row.email ? (
          <input
            type="text"
            value={editedData.state || row.state}
            onChange={(e) => setEditedData({ ...editedData, state: e.target.value })}
            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-300"
          />
        ) : (
          <div className="text-gray-800">{row.state}</div>
        )
      ),
    },
    {
      name: "Details",
      cell: (row) => (
        <button
          onClick={() => toggleRowExpanded(row)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          {expandedRows[row.email] ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      ),
      width: "70px",
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          {editingRow === row.email ? (
            <>
              <button
                onClick={() => handleSave(row.email)}
                className="p-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                <FaSave />
              </button>
              <button
                onClick={() => handleCancelEdit()}
                className="p-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleEdit(row)}
                className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(row.email)}
                className="p-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const fetchStudents = async (page = 1, limit = 5) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/scholarships/studentlist", {
        params: {
          page,
          limit,
          search: searchTerm,
        },
      });
      if (!data || !data.students) {
        throw new Error("Invalid data received from server");
      }
      setStudents(data.students);
      setTotalRows(data.pagination.totalItems);
      setCurrentPage(page);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to fetch students',
        text: error.response?.data?.message || error.message || "An unexpected error occurred",
        confirmButtonColor: '#3085d6',
      });
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    if (!row || !row.email) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Operation',
        text: 'Cannot edit this record due to missing information',
      });
      return;
    }
    setEditingRow(row.email);
    setEditedData(row);
  };

  const handleCancelEdit = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Your changes will be lost!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel edit'
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingRow(null);
        setEditedData({});
      }
    });
  };

  const handleSave = async (email) => {
    if (!email || !editedData) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Data',
        text: 'Please fill all required fields',
      });
      return;
    }

    try {
      const response = await axios.put(`/api/scholarships/studentlist?email=${email}`, editedData);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Student updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
        setEditingRow(null);
        setEditedData({});
        fetchStudents(currentPage, perPage);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || "Failed to update student information",
      });
      console.error("Error updating student:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (email) => {
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Operation',
        text: 'Cannot delete this record due to missing information',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete("/api/scholarships/studentlist", {
        params: { email },
      });
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Student has been deleted successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        fetchStudents(currentPage, perPage);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error.response?.data?.message || "Failed to delete student",
      });
      console.error("Error deleting student:", error);
    }
  };

  const handlePageChange = (page) => {
    fetchStudents(page, perPage);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    fetchStudents(1, newPerPage);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStudents(1, perPage);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const customLoader = (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
      <div className="mt-4 text-lg font-semibold text-indigo-600 animate-pulse">Loading Data...</div>
      <div className="mt-2 text-sm text-gray-500">Please wait while we fetch the latest information</div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Scholarships Students</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or state..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
        />
      </div>

      <DataTable
        columns={columns}
        data={students}
        progressPending={loading}
        progressComponent={customLoader}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handleRowsPerPageChange}
        onChangePage={handlePageChange}
        paginationPerPage={perPage}
        paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        expandableRowExpanded={row => expandedRows[row.email]}
        onRowExpandToggled={(expanded, row) => toggleRowExpanded(row)}
        fixedHeader
        fixedHeaderScrollHeight="450px"
        customStyles={{
          headRow: {
            style: {
              backgroundColor: "#0F1233",
              fontWeight: "bold",
              fontSize: "0.875rem",
              color: "#ffffff",
              minHeight: "48px",
            },
          },
          rows: {
            style: {
              fontSize: "0.875rem",
              minHeight: "60px",
              "&:hover": {
                backgroundColor: "#f9fafb",
              },
            },
          },
          pagination: {
            style: {
              padding: "16px",
              borderTop: "1px solid #e5e7eb",
            },
          },
          expanderRow: {
            style: {
              backgroundColor: "#f9fafb",
            },
          },
        }}
        noDataComponent={
          <div className="p-4 text-center text-gray-500">No students found</div>
        }
      />
    </div>
  );
};

export default StudentsTable;
