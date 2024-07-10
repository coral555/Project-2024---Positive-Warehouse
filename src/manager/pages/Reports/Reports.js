import "./Reports.css";
import React, { useState, useEffect } from "react";
import { fetchOldOrders } from "../../../utils/firebaseUtils";
import 'firebase/firestore';

// Todo: final styles are required

const Reports = () => {
    const [date_start, setDateStart] = useState('');
    const [date_end, setDateEnd] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [oldReports, setoldReports] = useState([]);
    const [reports, setReports] = useState([]);
    const [noReports, setNoReports] = useState(false);
    const [mostPopular, setMostPopular] = useState([]);
    const [showPopular, setShowPopular] = useState(false);

    // To save on data reads from firebase, old product will be loaded on page refresh
    // Note: useful for production, but not for development, as react will re-render on every change
    useEffect(() => {
        const fetchReports = async () => {
            const oldOrders = await fetchOldOrders();
            setoldReports(oldOrders);
        };

        fetchReports();
    }, []);

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

    // Counnting and sorting each products in every order to display most popular
    const countAndSortProducts = (orders) => {
        const productCount = {};
    
        orders.forEach(order => {
            order.products.forEach(product => {
                const productName = product.productName;
                if (productCount[productName]) {
                    productCount[productName] += product.selectedQuantity;
                } else {
                    productCount[productName] = product.selectedQuantity;
                }
            });
        });
    
        const sortedProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]);
    
        return sortedProducts;
    };

    // Function to display most popular products
    const handleShowMostPopular = async () => {
        const oldOrders = oldReports;
        setShowPopular(true);
        setNoReports(true);
        setReports([]);
        const mostPopularProducts = countAndSortProducts(oldOrders);
        setMostPopular(mostPopularProducts);
    };

    // Function to check if two dates overlap
    // Note: checking for ANY overlap
    const doDatesOverlap = (start_1, end_1, start_2, end_2) => {
        // Convert timestamps to Date objects
        const startDate1 = new Date(start_1.seconds * 1000);
        const endDate1 = new Date(end_1.seconds * 1000);
        const startDate2 = new Date(start_2);
        const endDate2 = new Date(end_2);

        // Check for overlap
        const overlap = (startDate1 < startDate2 && startDate2 < endDate1) ||
                        (startDate1 < endDate2 && endDate2 < endDate1) ||
                        (startDate2 < startDate1 && endDate1 < endDate2) ||
                        (startDate1 < startDate2 && endDate2 < endDate1);

        return overlap;
    };

    // Function to filter by date using the function doDatesOverlap
    const filterByDate = (reports) => {
        return reports.filter((report) => doDatesOverlap(report.startDate, report.endDate, date_start, date_end));
    };

    // Function to display all the reports
    const handleGetAll = async () => {
        const oldOrders = oldReports;
        setShowPopular(false);
        setNoReports(false)
        setReports(oldOrders);
    };

    // Function to filter by date, name, email, and phone
    const handleFilter = async () => {
        const oldOrders = oldReports;
        setShowPopular(false);

        let newReports = oldOrders;

        // filtering for date
        if (date_end && date_start) {
            newReports = filterByDate(newReports);
        }

        // filtering for name, phone, and email.
        if (name) {
            newReports = newReports.filter((report) => report.user.name === name);
        }

        if (email) {
            newReports = newReports.filter((report) => report.user.email === email);
        }

        if (phone) {
            newReports = newReports.filter((report) => report.user.phone === phone);
        }


        // Displaying no reports if there are none
        if (newReports.length === 0) {
            setNoReports(true);
        } else {
            setNoReports(false);
        }

        setReports(newReports);
    };

    // Convert timestamps to Date objects
    const convertTimestampToDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        }
        return null;
    };

    return (
        <div className="reports-container">
            <h1>Reports</h1>
            <div className="reports-display">
                <div className="reports-input">
                    <input
                        style={{ width: '230px' }}
                        className="display-button"
                        type="submit"
                        value="Show Most Popular Products"
                        onClick={handleShowMostPopular}
                    />

                    <label style={{ fontSize: '20px' }}>Filter By:</label>

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

                    <div className="column-input">
                        <input className="submit-button" type="submit" value="Show All Reports" onClick={handleGetAll} />
                        <input className="submit-button" type="submit" value="Show Filtered Reports" onClick={handleFilter} />
                    </div>
                </div>

                <div className="reports-reports">
                    {showPopular && (
                        <div className="most-popular-display">
                            <h2>Most Popular Products</h2>
                            <ul>
                                {mostPopular.map(([productName, quantity], index) => (
                                    <li key={index}>
                                        {productName}: {quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {noReports && !showPopular ? (
                        <h2 style={{ color: 'black' }}>No reports to display..</h2>
                    ) : (
                        reports.map((report) => (
                            <div key={report.id} className="report">
                                Name: {report.user.name}, Phone: {report.user.phone}, Email: {report.user.email}
                                <ul>
                                    <li>Id: {report.id}</li>
                                    <li>End date: {convertTimestampToDate(report.endDate).toLocaleDateString()}</li>
                                    <li>Start date: {convertTimestampToDate(report.startDate).toLocaleDateString()}</li>
                                    <li>Order placement date: {convertTimestampToDate(report.orderDate).toLocaleDateString()}</li>
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
