import React from "react";
import { useNavigate } from "react-router-dom";

const withAdminAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");

    // if (userRole !== 'admin') {
    //     navigate('/');
    //     return null;
    // }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAdminAuth;
