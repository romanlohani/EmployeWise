import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditUserModal from "../components/EditUserModal";
import icon from "../images/search.png";

function AllUsers() {
  const [users, setUser] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) navigate("/login");

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://reqres.in/api/users?page=${page}`
        );
        setUser(response.data.data);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleUpdateUser = (updatedUser, user) => {
    // Update the user in the users array
    setUser(
      users.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
    setEditingUser(null); // Close the modal
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${userId}`);
      setUser(users.filter((user) => user.id !== userId));
      alert("User deleted successfully!"); // Show success message
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user."); // Show error message
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user); // Open the modal and set the user to be edited
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value;
    if (term === "") {
      setSearchTerm(term);
      setSearchResults([]);
    } else {
      setSearchTerm(term);
      
      const results = users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(term.toLowerCase()) ||
          user.last_name.toLowerCase().includes(term.toLowerCase())
      );
      
      setSearchResults(results);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className=" py-8 p-6 bg-amber-100">
      <h1 className="text-3xl font-bold mb-5 text-center text-purple-800">
        "The Folks in the Machine"
      </h1>
      <div className="mb-10 flex flex-col md:flex-row items-center justify-center">
        <span className="text-2xl font-semibold mr-4">Search for users </span>
        <div className="bg-amber-50 p-2 h-10 rounded-2xl relative">
          <input
            className="ml-2 border-none outline-none rounded-l-xl bg-transparent"
            type="text"
            placeholder="#Search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="h-10 px-2 py-3 absolute top-0 right-0 flex items-center justify-center rounded-r-2xl">
            <img src={icon} className="h-6" />
          </button>
        </div>
      </div>
      {searchResults.length > 0 && (
        <div className="relative w-72 mx-auto flex items-center justify-center">
          <ul className="flex items-center flex-col gap-1.5 mb-5">
            {searchResults.map((user) => (
              <li>
                <div key={user.id} className="flex gap-3 items-center  pb-1">
                  <img
                    src={user.avatar}
                    className="h-12 w-12 rounded-full bg-gray-300"
                    alt=""
                  />
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
     
      <div className="flex flex-wrap gap-8 items-center justify-center">
        {users.map((user) => (
          <div
            key={user.id}
            className="min-w-60 max-w-96 bg-amber-200 h-70 shadow-md flex flex-col items-center justify-center gap-4 rounded-lg overflow-hidden"
          >
            <img
              src={user.avatar}
              alt={user.first_name}
              className="h-30 w-30  object-cover rounded-full flex justify-center"
            />
            <h2 className="text-lg font-semibold">
              {" "}
              {user.first_name} {user.last_name}{" "}
            </h2>

            <div className="flex w-full px-3 justify-between mt-4">
              <button
                onClick={() => handleEditUser(user)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Edit
              </button>
              {editingUser && (
                <EditUserModal
                  user={editingUser}
                  onClose={() => setEditingUser(null)} // Close modal
                  onUpdateUser={handleUpdateUser} // Update user list
                />
              )}
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-white hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-l-lg mr-2"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`py-2 px-4 ${
                page === pageNumber
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-200 text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="bg-white hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-r-lg ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AllUsers;
