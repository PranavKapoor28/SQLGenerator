// src/components/Form.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './Form.css';

const Form = ({ setData }) => {
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            if (jsonData.length > 0) {
                const columns = jsonData[0].map((col, index) => ({
                    Header: col,
                    accessor: `col${index}`,
                }));

                const rows = jsonData.slice(1).map((row) => {
                    const rowObject = {};
                    row.forEach((cell, cellIndex) => {
                        rowObject[`col${cellIndex}`] = cell;
                    });
                    return rowObject;
                });

                setData({ columns, rows });
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleGenerateSQL = () => {
        alert('SQL Generated');
    };

    return (
        <div className="form">
            <div className="form-group">
                <label>Additional Information</label>
                <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Enter additional information here..."
                />
            </div>
            <div className="form-group">
                <label>Upload Excel File</label>
                <input type="file" onChange={handleFileChange} />
                {file && <p className="file-name">{file.name}</p>}
            </div>
            <button className="btn" onClick={handleGenerateSQL}>
                Generate SQL
            </button>
        </div>
    );
};

export default Form;
