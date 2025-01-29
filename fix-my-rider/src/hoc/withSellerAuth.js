import React from 'react';
import { useNavigate } from 'react-router-dom';

const withSellerAuth = (Component) => {
    const AuthenticatedComponent = (props) => {
        const navigate = useNavigate();
        const userRole = localStorage.getItem('role');

        if (userRole !== 'seller') {
            navigate('/');
            return null;
        }

        return <Component {...props} />;
    };

    return AuthenticatedComponent;
};

export default withSellerAuth;