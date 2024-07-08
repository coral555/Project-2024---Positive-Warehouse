import "./Reports.css";
import React, { useState } from "react";

const Reports = () => {

    const [date_start, setDateStart] = useState('');

    const [date_end, setDateEnd] = useState('');

    const [reports, setReports] = useState([]);

    const handleChangeStart = (event) => {
        setDateStart(event.target.value);
    };

    const handleChangeEnd = (event) => {
        setDateEnd(event.target.value);
    };
  
    const handleSubmit = (event) => {

        event.preventDefault();

        alert(`Searching from ${date_start} to ${date_end}`);

        const numOfReports = reports.length;

        const newReports = [
            ...reports,
            { id: numOfReports, content: `report ${numOfReports}` },
        ];

        setReports(newReports);
        
    };

    return (
        <div className="reports-container">   
            <h1>Reports</h1>
            <div className="reports-display">
                <div className="reports-input">
                    <div>
                        <label
                            htmlFor="startDate"
                        >
                            From: 
                        </label>
                        <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="date-input"
                        value={date_start}
                        onChange={handleChangeStart}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="EndDate"
                        >
                            Up to:
                        </label>
                        <input
                            type="date"
                            id="EndDate"
                            name="EndDate"
                            className="date-input"
                            value={date_end}
                            onChange={handleChangeEnd}
                        />
                    </div>
                    <input className="submit-button" type="submit" value="Get Report" onClick={handleSubmit}/>
                </div>

                <div className="reports-reports">
                    
                    {reports.map((report) => (
                        <div key={report.id} className="report">
                            {report.content}
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}

export default Reports