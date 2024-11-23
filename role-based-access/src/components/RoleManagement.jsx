import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: "", permissions: "" });
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/roles")
      .then(response => response.json())
      .then(data => setRoles(data))
      .catch(error => console.error("Error fetching roles:", error));
  }, []);

  const addRole = () => {
    const permissionsArray = newRole.permissions.split(',').map(permission => permission.trim());
    const newRoleId = (roles.length + 1).toString();
    fetch("http://localhost:3001/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newRole, permissions: permissionsArray, id: newRoleId })
    })
    .then(response => response.json())
    .then(role => setRoles([...roles, role]))
    .catch(error => console.error("Error adding role:", error));
  };

  const deleteRole = (id) => {
    fetch(`http://localhost:3001/roles/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      setRoles(roles.filter(role => role.id !== id));
    })
    .catch(error => console.error("Error deleting role:", error));
  };

  const startEditing = (role) => {
    setEditingRole(role);
  };

  const saveRole = () => {
    const permissionsArray = editingRole.permissions.split(',').map(permission => permission.trim());
    fetch(`http://localhost:3001/roles/${editingRole.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editingRole, permissions: permissionsArray })
    })
    .then(response => response.json())
    .then(updatedRole => {
      setRoles(roles.map(role => (role.id === updatedRole.id ? updatedRole : role)));
      setEditingRole(null);
    })
    .catch(error => console.error("Error updating role:", error));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Role Management</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Role Name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          className="border p-2 rounded flex-grow"
        />
        <input
          type="text"
          placeholder="Permissions (comma-separated)"
          value={newRole.permissions}
          onChange={(e) => setNewRole({ ...newRole, permissions: e.target.value })}
          className="border p-2 rounded flex-grow"
        />
        <button onClick={addRole} className="bg-blue-500 text-white p-2 rounded">
          Add Role
        </button>
      </div>
      <ul className="list-disc pl-5">
        {roles.map(role => (
          <li key={role.id} className="py-2 flex justify-between items-center">
            <div>
              <span className="font-bold">{role.name}</span> - Permissions: {role.permissions.join(", ")}
            </div>
            <div className="flex space-x-2">
              <button onClick={() => startEditing(role)} className="text-blue-500">
                <FaEdit />
              </button>
              <button onClick={() => deleteRole(role.id)} className="text-red-500">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingRole && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Edit Role</h3>
          <input
            type="text"
            placeholder="Role name"
            value={editingRole.name}
            onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
            className="border p-2 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Permissions (comma-separated)"
            value={editingRole.permissions}
            onChange={(e) => setEditingRole({ ...editingRole, permissions: e.target.value })}
            className="border p-2 rounded mb-2"
          />
          <div>
            <button onClick={saveRole} className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
            <button onClick={() => setEditingRole(null)} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement; 