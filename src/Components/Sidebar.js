import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = ({ setCurrentSheetData }) => {
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');

    useEffect(() => {
        const fetchSheets = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/sheets');
                if (!response.ok) throw new Error('Failed to fetch sheet names');
                const sheets = await response.json();

                setSheetNames(sheets);
                setSelectedSheet(sheets[0]); // Automatically select the first sheet
                loadSheetData(sheets[0]); // Load data for the first sheet by default
            } catch (err) {
                console.error('Error fetching sheet names:', err);
            }
        };

        fetchSheets();
    }, []);

    const loadSheetData = async (sheetName) => {
        try {
            const response = await fetch(`http://localhost:5001/api/data/${sheetName}`);
            if (!response.ok) throw new Error('Failed to fetch sheet data');

            const data = await response.json();
            console.log('Fetched data:', data); // Log the fetched data

            const columns = Object.keys(data[0]).map((key, index) => ({
                Header: key,
                accessor: `col${index}`,
            }));

            const rows = data.map(row => {
                const rowObject = {};
                Object.values(row).forEach((cell, index) => {
                    rowObject[`col${index}`] = cell;
                });
                return rowObject;
            });

            console.log('Columns:', columns);
            console.log('Rows:', rows);

            setCurrentSheetData({ columns, rows, sheetName });
        } catch (err) {
            console.error('Error fetching sheet data:', err);
        }
    };

    const handleSheetChange = (e) => {
        const selected = e.target.value;
        setSelectedSheet(selected);
        loadSheetData(selected);
    };

    return (
        <div className="sidebar-content">
            <h2>Select a Sheet</h2>
            <select value={selectedSheet} onChange={handleSheetChange}>
                {sheetNames.map(sheet => (
                    <option key={sheet} value={sheet}>
                        {sheet}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Sidebar;
