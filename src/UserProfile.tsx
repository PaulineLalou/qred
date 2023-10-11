import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import { fetchUser } from "./redux/userSlice";
import { User } from "./interfaces";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "./assets/qredlogo.webp";
import "./UserProfile.css";

interface EditData extends Partial<User> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = userId ? parseInt(userId, 10) : NaN;
  const user = useSelector(
    (state: RootState) => state.user.user.entity
  ) as User | null;
  const userStatus = useSelector((state: RootState) => state.user.user.status);

  const [editData, setEditData] = useState<EditData | null>(user || null);
  const dispatch = useDispatch<AppDispatch>();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  // Fetch user data when component mounts and userId is valid
  useEffect(() => {
    if (!isNaN(numericUserId)) {
      dispatch(fetchUser(numericUserId));
    }
  }, [dispatch, numericUserId]);

  // Update editData state when user data is fetched
  useEffect(() => {
    setEditData(user);
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "email") {
      setIsEmailValid(event.target.validity.valid);
    } else if (name === "phone") {
      setIsPhoneValid(/^[0-9-() ]+$/.test(value));
    }

    if (editData) {
      if (name.includes("address.")) {
        const addressKey = name.split(".")[1];
        setEditData({
          ...editData,
          address: {
            ...editData.address,
            [addressKey]: value,
          },
        });
      } else {
        setEditData({ ...editData, [name]: value });
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${numericUserId}`,
        {
          method: "PUT",
          body: JSON.stringify(editData),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      if (response.ok) {
        dispatch(fetchUser(numericUserId));
      } else {
        console.error("Failed to update user:", response.statusText);
        alert("Failed to update user. Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred while updating the user:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  if (userStatus === "loading" || userStatus === "idle") {
    return <p>Loading...</p>;
  }

  if (userStatus === "failed") {
    return <p>Failed to load user profile</p>;
  }

  return (
    <div className="overlay">
      <div className="logo-container">
        <Link to={`/`}>
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <h2>Update the user profile</h2>
      </div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editData?.name || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editData?.email || ""}
            onChange={handleInputChange}
            className={isEmailValid ? "" : "invalid"}
            aria-invalid={!isEmailValid}
          />
          {!isEmailValid && (
            <p className="error-message" role="alert" aria-live="assertive">
              Please write a valid email address
            </p>
          )}

          <label htmlFor="street">Street Name</label>
          <input
            type="text"
            id="street"
            name="address.street"
            value={editData?.address?.street || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="zipcode">Postal Code</label>
          <input
            type="text"
            id="zipcode"
            name="address.zipcode"
            value={editData?.address?.zipcode || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="address.city"
            value={editData?.address?.city || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={editData?.phone || ""}
            onChange={handleInputChange}
            className={isPhoneValid ? "" : "invalid"}
            aria-invalid={!isPhoneValid}
          />
          {!isPhoneValid && (
            <p className="error-message" role="alert" aria-live="assertive">
              Please write a valid phone number
            </p>
          )}

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
