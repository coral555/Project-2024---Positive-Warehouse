import "./Reports.css";
import React, { useState } from "react";
import { fetchOldOrders } from "../../../utils/firebaseUtils";

const Reports = () => {
    const [date_start, setDateStart] = useState('');
    const [date_end, setDateEnd] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [reports, setReports] = useState([]);
    const [noReports, setNoReports] = useState(false);

    const handleChangeStart = (event) => {
        setDateStart(event.target.value);
    };

    const handleChangeEnd = (event) => {
        setDateEnd(event.target.value);
    };

    const handleChangeName = (event) => {
        setName(event.target.value);
    };

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleChangePhone = (event) => {
        setPhone(event.target.value);
    };

    const doDatesOverlap = (start_1, end_1, start_2, end_2) => {
        const startDate = new Date(start_1);
        const endDate = new Date(end_1);
        const startDate2 = new Date(start_2);
        const endDate2 = new Date(end_2);

        return startDate2 <= startDate && endDate <= endDate2;
    };

    const filterByDate = (reports) => {
        return reports.filter((report) => doDatesOverlap(report.startDate, report.endDate, date_start, date_end));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const Oldorders = await fetchOldOrders();

        let newReports = [];

        if (date_end && date_start) {
            newReports = filterByDate(Oldorders);
        }

        if (newReports.length === 0)
            setNoReports(true);
        else
            setNoReports(false);

        setReports(newReports);
    };

    return (
        <div className="reports-container">
            <h1>Reports</h1>
            <div className="reports-display">
                <div className="reports-input">

                    <label style={{fontSize: '20px'}}>Filter By:</label>
                    
                    <div className="column-input">
                        <label>Contains Product:</label>
                        <input
                            className="text-input"
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleChangeName}
                        />
                    </div>

                    <div className="column-input">
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input
                                className="text-input"
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={handleChangeName}
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                className="text-input"
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChangeEmail}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone:</label>
                            <input
                                className="text-input"
                                type="text"
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={handleChangePhone}
                            />
                        </div>
                    </div>

                    <div className="column-input">
                        <div>
                            <label htmlFor="startDate">From:</label>
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
                            <label htmlFor="EndDate">Up to:</label>
                            <input
                                type="date"
                                id="EndDate"
                                name="EndDate"
                                className="date-input"
                                value={date_end}
                                onChange={handleChangeEnd}
                            />
                        </div>
                    </div>
                    <input className="submit-button" type="submit" value="Get Report" onClick={handleSubmit} />
                </div>

                <div className="reports-reports">
                    {noReports ? (
                        <h1 style={{ color: 'red' }}>No reports to display</h1>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="report">
                                Name: {report.user.name}, Phone: {report.user.phone}, Email: {report.user.email}
                                <ul>
                                    <li>Id: {report.id}</li>
                                    <li>End date: {report.endDate}</li>
                                    <li>Start date: {report.startDate}</li>
                                    <li>Order date: {report.orderDate}</li>
                                </ul>
                                <ul>
                                    {report.products.map((product, index) => (
                                        <li key={index}>
                                            <strong>Product Name:</strong> {product.productName}, <strong>Quantity:</strong> {product.selectedQuantity}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;

