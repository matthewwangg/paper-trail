import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();

    const showNavBar = location.pathname === '/notes' || location.pathname === '/tasks';

    if (!showNavBar) return null;

    return (
        <nav
            style={{
                backgroundColor: '#1c1c1c',
                padding: '10px 20px',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
            }}
        >
            <NavLink
                to="/notes"
                style={({ isActive }) => ({
                    margin: '0 15px',
                    textDecoration: 'none',
                    color: isActive ? '#00ffff' : '#fff',
                    fontSize: '18px',
                    fontWeight: isActive ? 'bold' : 'normal',
                })}
            >
                Notes
            </NavLink>
            <NavLink
                to="/tasks"
                style={({ isActive }) => ({
                    margin: '0 15px',
                    textDecoration: 'none',
                    color: isActive ? '#00ffff' : '#fff',
                    fontSize: '18px',
                    fontWeight: isActive ? 'bold' : 'normal',
                })}
            >
                Tasks
            </NavLink>
        </nav>
    );
};

export default NavBar;
