const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const app = express();

app.use(cors());

app.get('/api/sheets', (req, res) => {
    const filePath = '/Users/Pranavkapoor1/Desktop/HCL WORK/Employee_Sample_Data.xlsx';

    try {
        const workbook = XLSX.readFile(filePath);
        const sheetNames = workbook.SheetNames;  // Get all sheet names

        res.json(sheetNames);  // Return the sheet names as JSON
    } catch (error) {
        res.status(500).send('Error reading file');
    }
});

app.get('/api/data/:sheetName', (req, res) => {
    const filePath = '/Users/Pranavkapoor1/Desktop/HCL WORK/Employee_Sample_Data.xlsx';
    const sheetName = req.params.sheetName;

    try {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        res.json(jsonData);
    } catch (error) {
        res.status(500).send('Error reading sheet');
    }
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
