import{ createContext } from 'react';
import PropTypes from 'prop-types';
import useFirebase from '../../hooks/useFirebase';

 const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const allContext = useFirebase();
    return (
        <AuthContext.Provider value={allContext}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export {AuthContext,AuthProvider};