// src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
    const [active, setActive] = useState('Generate SQL');

    const menuItems = ['Generate SQL', 'Generate Testcase', 'Upload', 'Settings'];

    return (
        <div className="sidebar">
            <ul>
                {menuItems.map((item) => (
                    <li
                        key={item}
                        className={active === item ? 'active' : ''}
                        onClick={() => setActive(item)}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
