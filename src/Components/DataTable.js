import React, { useState, useEffect } from 'react';
import './DataTable.css';
import * as XLSX from 'xlsx';

const DataTable = ({ columns, data, selectedRows, updateSelectedRows, sheetName }) => {
    const [localSelectedRows, setLocalSelectedRows] = useState(selectedRows || []);

    useEffect(() => {
        setLocalSelectedRows(selectedRows || []);
    }, [selectedRows]);

    const handleCheckboxChange = (row, isChecked) => {
        let updatedSelectedRows;
        if (isChecked) {
            updatedSelectedRows = [...localSelectedRows, row];
        } else {
            updatedSelectedRows = localSelectedRows.filter(selectedRow => selectedRow !== row);
        }
        setLocalSelectedRows(updatedSelectedRows);
        updateSelectedRows(updatedSelectedRows);
    };

    const handleSubmit = () => {
        if (localSelectedRows.length === 0) {
            alert(`No rows selected in ${sheetName}!`);
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(localSelectedRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `SelectedRows_${sheetName}`);

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `selected_rows_${sheetName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="data-table-container">
            <h2>{sheetName}</h2>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            {columns.map((column) => (
                                <th key={column.accessor}>{column.Header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={localSelectedRows.includes(row)}
                                        onChange={(e) => handleCheckboxChange(row, e.target.checked)}
                                    />
                                </td>
                                {columns.map((column) => (
                                    <td key={column.accessor}>{row[column.accessor]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {localSelectedRows.length > 0 && (
                <div className="selected-rows-container">
                    <h3>Selected Rows for {sheetName}</h3>
                    <table className="selected-rows-table">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.accessor}>{column.Header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {localSelectedRows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column) => (
                                        <td key={column.accessor}>{row[column.accessor]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="submit-button" onClick={handleSubmit}>
                        Submit {sheetName} Selections
                    </button>
                </div>
            )}
        </div>
    );
};

export default DataTable;
