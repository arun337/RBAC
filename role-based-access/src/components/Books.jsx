import React, { useState, useEffect } from 'react';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
  
    useEffect(() => {
      fetchBooks();
      fetchUsers();
    }, []);
  
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3001/books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
  
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    const getUserName = (userId) => {
      const user = users.find((user) => user.id === userId);
      return user ? user.username : 'Available';
    };
  
    const handleUserClick = (userId) => {
      const user = users.find((user) => user.id === userId);
      setSelectedUser(user);
      setNewStatus(user.status);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedUser(null);
    };
  
    const handleStatusChange = (event) => {
      setNewStatus(event.target.value);
    };
  
    const saveStatusChange = async () => {
      if (!selectedUser) return;

      try {
        const response = await fetch(`http://localhost:3001/users/${selectedUser.id}`, {
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('Failed to update user status');
        }

       
        setUsers(users.map(user => user.id === selectedUser.id ? { ...user, status: newStatus } : user));
        closeModal(); 
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    };
  
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Books List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">#</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Author</th>
                  <th className="py-3 px-6 text-left">Checked Out By</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {books.map((book, index) => (
                  <tr key={book.id} className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="py-3 px-6 text-left">{index + 1}</td>
                    <td className="py-3 px-6 text-left">{book.title}</td>
                    <td className="py-3 px-6 text-left">{book.author}</td>
                    <td className="py-3 px-6 text-left">
                      {book.checkedOutBy ? (
                        <button onClick={() => handleUserClick(book.checkedOutBy.id)} className="text-blue-500 hover:underline">
                          {getUserName(book.checkedOutBy.id)}
                        </button>
                      ) : 'Available'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isModalOpen && selectedUser && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h4 className="text-xl font-bold mb-4">User Details</h4>
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Username:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <div className="mt-4">
                  <label className="block text-gray-700">Change Status:</label>
                  <select
                    value={newStatus}
                    onChange={handleStatusChange}
                    className="mt-2 block w-full bg-gray-100 border border-gray-300 rounded py-2 px-3"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button onClick={saveStatusChange} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Save
                  </button>
                  <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

export default Books;