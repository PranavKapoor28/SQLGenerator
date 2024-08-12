import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DataTable from './components/DataTable';
import Footer from './components/Footer';

function App() {
    const [sheetData, setSheetData] = useState({});
    const [currentSheetName, setCurrentSheetName] = useState('');

    const setCurrentSheetData = ({ columns, rows, sheetName }) => {
        setSheetData(prevData => ({
            ...prevData,
            [sheetName]: { columns, rows, selectedRows: [] }
        }));
        setCurrentSheetName(sheetName);
    };

    const updateSelectedRows = (sheetName, selectedRows) => {
        setSheetData(prevData => ({
            ...prevData,
            [sheetName]: {
                ...prevData[sheetName],
                selectedRows
            }
        }));
    };

    return (
        <div className="app">
            <div className="sidebar">
                <Sidebar setCurrentSheetData={setCurrentSheetData} />
            </div>
            <div className="main-content">
                <Header />
                {currentSheetName && sheetData[currentSheetName] && (
                    <DataTable
                        columns={sheetData[currentSheetName].columns}
                        data={sheetData[currentSheetName].rows}
                        selectedRows={sheetData[currentSheetName].selectedRows}
                        updateSelectedRows={(selectedRows) => updateSelectedRows(currentSheetName, selectedRows)}
                        sheetName={currentSheetName}
                    />
                )}
                <Footer />
            </div>
        </div>
    );
}

export default App;
