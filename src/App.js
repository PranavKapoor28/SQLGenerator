// src/App.js
import React, { useState } from 'react';
import './App.css';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Form from './Components/Form';
import DataTable from './Components/DataTable';
import Footer from './Components/Footer';

function App() {
    const [tableData, setTableData] = useState({ columns: [], rows: [] });

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Header />
                <Form setData={setTableData} />
                <DataTable columns={tableData.columns} data={tableData.rows} />
                <Footer />
            </div>
        </div>
    );
}

export default App;
