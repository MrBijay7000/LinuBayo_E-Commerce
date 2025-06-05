import { useCallback, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/Context/auth-context";
import { FiUsers } from "react-icons/fi";
import ErrorModal from "../../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/UIElements/LoadingSpinner";
import "./CustomersPage.css";

export default function CustomersPage() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5001/api/users/getCustomers",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        setLoadedUsers(responseData.users);
      } catch (err) {
        console.log(err);
      }
    };
    if (auth.token) {
      fetchUsers();
    }
  }, [sendRequest, auth.token]);

  // Filter users based on search term
  // const filteredUsers = loadedUsers.filter(
  //   (user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.phonenumber.toString().includes(searchTerm)
  // );

  const filterUsers = useCallback(() => {
    return loadedUsers.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phonenumber.toString().includes(searchTerm) // phone numbers are often searched as numbers
      );
    });
  }, [loadedUsers, searchTerm]);

  const filteredUsers = filterUsers();

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="customers-page">
        <h1>
          <FiUsers /> Customers
        </h1>

        {/* <div className="search-bar">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
        />
      </div> */}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search customers"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="search-results-count">
          Showing {currentUsers.length} of {filteredUsers.length} customers
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        <ErrorModal error={error} onClear={clearError} />

        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}

        {!isLoading && loadedUsers.length === 0 && (
          <div className="empty-state">
            <FiUsers size={48} />
            <p>No customers found</p>
          </div>
        )}

        {!isLoading && currentUsers.length > 0 && (
          <>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    {auth.role === "admin" && <th>Role</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={user.role === "admin" ? "admin-row" : ""}
                    >
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phonenumber}</td>
                      {auth.role === "admin" && (
                        <td data-role={user.role}>{user.role || "user"}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={currentPage === number ? "active" : ""}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
