import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "./redux/userSlice";
import logo from "./assets/qredlogo.webp";
import "./UserList.css";
import { RootState, AppDispatch } from "./redux/store"; // Ensure correct import

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch here
  const users = useSelector((state: RootState) => state.user.users.entities);
  const usersStatus = useSelector(
    (state: RootState) => state.user.users.status
  );
  const error = useSelector((state: RootState) => state.user.users.error);

  // Fetch users when component mounts and usersStatus is 'idle'

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  // Handling different states of the user fetching process

  if (usersStatus === "loading")
    return <p className="loading-message">Loading users...</p>;
  if (usersStatus === "failed" || error)
    return <p className="loading-error-message">Error fetching users: {error}</p>;

  return (
    <div className="userlist-overlay">
      <div className="userlist-logo-container">
        <img src={logo} alt="Logo" className="userlist-logo" />
      </div>
      <h2 className="userlist-title">List of All Users</h2>
      <div className="userlist-container">
        <ul>
          {users?.map((user) => (
            <li key={user.id}>
              <span className="black-text">{user.name}</span>
              <Link to={`/user/${user.id}`} className="button green-button">
                Edit this user
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
