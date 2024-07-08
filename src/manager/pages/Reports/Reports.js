import "./Reports.css";
import React, { useState } from "react";
 
import {fetchOldOrders} from "../../../utils/firebaseUtils";

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
  

    const filterByDate = (reports) => {

        // Unimplimented yet

        return reports
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        const Oldorders = await fetchOldOrders();

        const newReports = filterByDate(Oldorders);

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
                            Name: {report.user.name}, Phone: {report.user.phone}, email: {report.user.email}
                            <ul>
                                <li>id: {report.id}</li>
                                <li>End date: {report.endDate}</li>
                                <li>Start date: {report.startDate}</li>
                                <li>orderDate: {report.orderDate}</li>
                            </ul>
                            <ul>
                                {report.products.map((product, index) => (
                                    <li key={index}>
                                        <strong>Product Name:</strong> {product.productName}, <strong>Quantity:</strong> {product.selectedQuantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}

export default Reports