import React, { useState, useEffect } from 'react';
import { useTable, useRowSelect } from 'react-table';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './DataTable.css';

const DataTable = ({ columns, data }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [comments, setComments] = useState({});
    const [selectedDates, setSelectedDates] = useState({});

    const handleCommentsChange = (id, value) => {
        setComments((prevComments) => ({
            ...prevComments,
            [id]: value,
        }));
    };

    const handleDateChange = (id, value) => {
        setSelectedDates((prevDates) => ({
            ...prevDates,
            [id]: value,
        }));
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { selectedRowIds },
    } = useTable(
        {
            columns,
            data,
        },
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: 'selection',
                    Cell: ({ row }) => (
                        <input type="checkbox" {...row.getToggleRowSelectedProps()} />
                    ),
                },
                ...columns,
            ]);
        }
    );

    useEffect(() => {
        const selectedRows = rows.filter((row) => selectedRowIds[row.id]);
        setSelectedRows(selectedRows);
    }, [selectedRowIds, rows]);

    const filteredColumns = columns.slice(0, 9); // Assuming "Business Unit" is the 9th column

    const handleSubmit = () => {
        const exportData = selectedRows.map((row) => {
            const rowData = {};
            filteredColumns.forEach((col) => {
                rowData[col.Header] = row.original[col.accessor];
            });
            rowData['Comments'] = comments[row.id] || '';
            rowData['Date'] = selectedDates[row.id] || '';
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SelectedRows');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'selected_rows.xlsx');
    };

    return (
        <>
            <div className="table-container">
                <table {...getTableProps()} className="data-table">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="selected-rows">
                <h3>Selected Rows:</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            {filteredColumns.map((col) => (
                                <th key={col.accessor}>{col.Header}</th>
                            ))}
                            <th>Comments</th>
                            <th>Select Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedRows.map((row) => (
                            <tr key={row.id}>
                                {filteredColumns.map((col) => (
                                    <td key={col.accessor}>
                                        {row.original[col.accessor]}
                                    </td>
                                ))}
                                <td>
                                    <textarea
                                        value={comments[row.id] || ''}
                                        onChange={(e) => handleCommentsChange(row.id, e.target.value)}
                                        placeholder="Enter comments here..."
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={selectedDates[row.id] || ''}
                                        onChange={(e) => handleDateChange(row.id, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="submit-button" onClick={handleSubmit}>
                    Submit & Download
                </button>
            </div>
        </>
    );
};

export default DataTable;
