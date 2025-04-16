import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    const [validate, setValidate] = useState(false);
    const [name, setName] = useState('');
    const location =useLocation();
    const navigate = useNavigate();


    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log("I am in Navv: "+localStorage.getItem('user'));
        if(location.pathname==="/register") return;
        if (storedUser) {
            try {
                console.log("Stored user data:", storedUser);
                const userObj = JSON.parse(storedUser);
                console.log("Parsed user object:", userObj);
                setValidate(true); 
                setName(userObj.firstName); 
            } catch (error) {
                console.error("Unable to parse user data:", error);
                navigate("/login");  
            }
        } else {
            navigate("/login"); 
        }
    }, [navigate,location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');  
        setValidate(false);
        setName('');
        navigate('/login');  
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/scan">Extract Data</Link></li>
                <li><Link to="/analysis">Data Analysis</Link></li>
                {validate ? (
                    <>
                        <li className='welcome-msg'>Welcome, {name}!</li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;
