import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import UserProfile from "./UserProfile";
import UserList from "./UserList";
import "./index.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/" element={<UserList />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
