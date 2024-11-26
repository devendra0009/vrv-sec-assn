import React, { useState, useEffect } from "react";
import CustomTable from "./CustomTable";
import { userColumns } from "../utils/Columns";
import { v4 as uuidv4 } from "uuid";
import Badge from "./Badge";

const Users = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("users")) || [];
    const savedRoles = JSON.parse(localStorage.getItem("roles")) || [];
    setRoles(savedRoles);
    setData(storedData);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!currentUser.name) newErrors.name = "Name is required.";
    else if (currentUser.name.length > 200)
      newErrors.name = "Name cannot exceed 200 characters.";

    if (!currentUser.email) newErrors.email = "Email is required.";
    else if (currentUser.email.length > 200)
      newErrors.email = "Email cannot exceed 200 characters.";
    else if (!/\S+@\S+\.\S+/.test(currentUser.email))
      newErrors.email = "Enter a valid email address.";

    if (!currentUser.role) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    setCurrentUser({
      id: uuidv4(),
      name: "",
      email: "",
      role: "",
      status: true,
    });
    setIsEditMode(false);
    setErrors({});
    setShowModal(true);
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setIsEditMode(true);
    setErrors({});
    setShowModal(true);
  };

  const handleSaveUser = () => {
    if (!validateForm()) return;

    if (isEditMode) {
      // Update existing user
      setData((prevData) =>
        prevData?.map((user) =>
          user.id === currentUser.id ? currentUser : user
        )
      );
    } else {
      // Add new user
      setData([...data, { ...currentUser, id: data.length + 1 }]);
    }
    setShowModal(false);
    setCurrentUser(null);
  };

  const toggleUserStatus = (id) => {
    setData((prevData) =>
      prevData?.map((user) =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };

  const handleDeleteClick = (id) => {
    const updatedData = data.filter((user) => user.id !== id);
    setData(updatedData);
    localStorage.setItem("users", JSON.stringify(updatedData));
  };

  useEffect(() => {
    if (data.length !== 0) localStorage.setItem("users", JSON.stringify(data));
  }, [data]);

  return (
    <div>
      <div className="header flex justify-between">
        <Badge content="Users" />
        <div className="buttons">
          <button
            type="button"
            onClick={handleAddClick}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
          >
            Add User
          </button>
        </div>
      </div>
      <CustomTable
        columns={[
          ...userColumns,
          {
            header: "Status",
            accessor: "status",
            render: (_, row) => (
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={row.status}
                  onChange={() => toggleUserStatus(row.id)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            ),
          },
          {
            header: "Action",
            accessor: "action",
            render: (_, row) => (
              <div className="flex space-x-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditClick(row);
                  }}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteClick(row.id);
                  }}
                  className="font-medium text-red-600 dark:text-red-500 hover:underline"
                >
                  Delete
                </a>
              </div>
            ),
          },
        ]}
        data={data}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {isEditMode ? "Edit User" : "Add User"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter name"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter email"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                  value={currentUser.role}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Role</option>
                  {roles?.map((role, index) => (
                    <option key={index} value={role?.id}>
                      {role?.roleName}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <span className="text-red-500 text-sm">{errors.role}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentUser.status}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        status: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="ml-2">
                    {currentUser.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg me-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  {isEditMode ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
