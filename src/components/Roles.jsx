import React, { useState, useEffect } from "react";
import CustomTable from "./CustomTable";
import { rolesColumns } from "../utils/Columns";
import { v4 as uuidv4 } from "uuid";
import Badge from "./Badge";

const Roles = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState({ roleName: "", permissions: [] });
  const [isEditMode, setIsEditMode] = useState(false);
  const [permissions, setPermissions] = useState([]); // List of available permissions
  const [errors, setErrors] = useState({}); // To handle validation errors

  useEffect(() => {
    // Load roles and permissions from localStorage
    const savedRoles = JSON.parse(localStorage.getItem("roles")) || [];
    const savedPermissions =
      JSON.parse(localStorage.getItem("permissions")) || [];
    setData(savedRoles);
    setPermissions(savedPermissions);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!currentRole.roleName.trim()) {
      newErrors.roleName = "Role name is required.";
    }
    if (!currentRole.permissions.length) {
      newErrors.permissions = "At least one permission must be selected.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    setCurrentRole({ id: uuidv4(), roleName: "", permissions: [] });
    setIsEditMode(false);
    setErrors({});
    setShowModal(true);
  };

  const handleEditClick = (role) => {
    setCurrentRole(role);
    setIsEditMode(true);
    setErrors({});
    setShowModal(true);
  };

  const handleSaveRole = () => {
    if (!validateForm()) return;

    const currentTimestamp = new Date().toISOString();
    const updatedRoles = isEditMode
      ? data.map((role) =>
          role.id === currentRole.id
            ? { ...currentRole, lastUpdatedAt: currentTimestamp }
            : role
        )
      : [...data, { ...currentRole, lastUpdatedAt: currentTimestamp }];

    setData(updatedRoles);
    localStorage.setItem("roles", JSON.stringify(updatedRoles));
    setShowModal(false);
  };

  const handleDeleteClick = (id) => {
    const updatedData = data.filter((role) => role.id !== id);
    setData(updatedData);
    localStorage.setItem("roles", JSON.stringify(updatedData));
  };

  return (
    <div>
      <div className="header flex justify-between">
      <Badge content="Roles" />
        <div className="buttons">
          <button
            type="button"
            onClick={handleAddClick}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Add Role
          </button>
        </div>
      </div>
      <CustomTable
        columns={[
          ...rolesColumns,
          {
            header: "Permission Count",
            accessor: "permissionCount",
            render: (_, row) => row?.permissions?.length || 0,
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
                  className="font-medium text-blue-600 hover:underline"
                >
                  Edit
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteClick(row.id);
                  }}
                  className="font-medium text-red-600 hover:underline"
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
              {isEditMode ? "Edit Role" : "Add Role"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Role Name</label>
                <input
                  type="text"
                  value={currentRole.roleName}
                  onChange={(e) =>
                    setCurrentRole({ ...currentRole, roleName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter role name"
                />
                {errors.roleName && (
                  <span className="text-red-500 text-sm">{errors.roleName}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Permissions</label>
                <select
                  multiple
                  value={currentRole.permissions}
                  onChange={(e) =>
                    setCurrentRole({
                      ...currentRole,
                      permissions: Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value
                      ),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {permissions.map((permission) => (
                    <option key={permission.id} value={permission.permissionName}>
                      {permission.permissionName}
                    </option>
                  ))}
                </select>
                {errors.permissions && (
                  <span className="text-red-500 text-sm">{errors.permissions}</span>
                )}
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
                  onClick={handleSaveRole}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  {isEditMode ? "Save Changes" : "Add Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
