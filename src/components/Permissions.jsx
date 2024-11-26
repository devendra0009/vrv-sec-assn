import React, { useState, useEffect } from "react";
import CustomTable from "./CustomTable";
import { permissionsColumns } from "../utils/Columns";
import { v4 as uuidv4 } from "uuid";
import Badge from "./Badge";

const Permissions = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedPermissions =
      JSON.parse(localStorage.getItem("permissions")) || [];

    // Ensure all permissions have a unique ID
    const migratedPermissions = savedPermissions.map((perm) => ({
      ...perm,
      id: perm.id || uuidv4(),
    }));

    setData(migratedPermissions);
    localStorage.setItem("permissions", JSON.stringify(migratedPermissions)); // Save migrated data
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!currentPermission.permissionName) {
      newErrors.permissionName = "Permission name is required.";
    } else if (currentPermission.permissionName.length > 100) {
      newErrors.permissionName =
        "Permission name cannot exceed 100 characters.";
    }

    if (!currentPermission.description) {
      newErrors.description = "Description is required.";
    } else if (currentPermission.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    setCurrentPermission({ id: uuidv4(), permissionName: "", description: "" });
    setIsEditMode(false);
    setErrors({});
    setShowModal(true);
  };

  const handleEditClick = (permission) => {
    setCurrentPermission(permission);
    setIsEditMode(true);
    setErrors({});
    setShowModal(true);
  };

  const handleSavePermission = () => {
    if (!validateForm()) return;

    const currentTimestamp = new Date().toISOString();

    let updatedPermissions;
    if (isEditMode) {
      updatedPermissions = data.map((perm) =>
        perm.id === currentPermission.id
          ? { ...currentPermission, lastUpdatedAt: currentTimestamp }
          : perm
      );
    } else {
      updatedPermissions = [
        ...data,
        { ...currentPermission, lastUpdatedAt: currentTimestamp },
      ];
    }

    setData(updatedPermissions);
    localStorage.setItem("permissions", JSON.stringify(updatedPermissions));
    setShowModal(false);
  };

  const handleDeleteClick = (id) => {
    const updatedData = data.filter((perm) => perm.id !== id);
    setData(updatedData);
    localStorage.setItem("permissions", JSON.stringify(updatedData));
  };

  return (
    <div>
      <div className="header flex justify-between">
        <Badge content="Permissions" />
        <div className="buttons">
          <button
            type="button"
            onClick={handleAddClick}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700"
          >
            Add Permission
          </button>
        </div>
      </div>
      <CustomTable
        columns={[
          ...permissionsColumns,
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
              {isEditMode ? "Edit Permission" : "Add Permission"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Permission Name</label>
                <input
                  type="text"
                  value={currentPermission.permissionName}
                  onChange={(e) =>
                    setCurrentPermission({
                      ...currentPermission,
                      permissionName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter permission name"
                />
                {errors.permissionName && (
                  <span className="text-red-500 text-sm">
                    {errors.permissionName}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={currentPermission.description}
                  onChange={(e) =>
                    setCurrentPermission({
                      ...currentPermission,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter description"
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description}
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-2 text-gray-600 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePermission}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  {isEditMode ? "Save Changes" : "Add Permission"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permissions;
