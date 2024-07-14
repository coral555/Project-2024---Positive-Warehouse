import React, { useState } from 'react';
import './Reports.css';
import Charts from './Charts';

const Statistics = ({ allOrders }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [number, setNumber] = useState('5');
    const [selectedOption, setSelectedOption] = useState('range');
    const [selectedMonth, setSelectedMonth] = useState('0');
    
    // States for chart
    const [displayingChart, setDisplayingChart] = useState(false);
    const [infoToDisplay, setInfoToDisplay] = useState({});


    // Event Handlers
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleNumberChange = (event) => {
        var numInput = event.target.value;
        if (numInput < 2)
            numInput = 2;
        setNumber(numInput);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSelectMonth = (event) => {
        setSelectedMonth(event.target.value);
    };

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

    // Counting and sorting each product in every order to display most popular
    const countAndSortProductsByRange = (orders, start_date, end_date) => {
        var productCount = {};

        orders.forEach(order => {
            if (doDatesOverlap(order.startDate, order.endDate, start_date, end_date)) {
                order.products.forEach(product => {
                    const productName = product.productName;
                    if (productCount[productName]) {
                        productCount[productName] += product.selectedQuantity;
                    } else {
                        productCount[productName] = product.selectedQuantity;
                    }
                });
            }
        });

        const sortedProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]);

        return sortedProducts;
    };

    const countAndSortProductsByMonth = (orders, month) => {
        var productCount = {};

        orders.forEach(order => {
            
            const startDate = new Date(order.startDate.seconds * 1000);
            const endDate1 = new Date(order.endDate.seconds * 1000);
        
            if (startDate.getMonth() == month || endDate1.getMonth() == month) {

                order.products.forEach(product => {
                    const productName = product.productName;
                    if (productCount[productName]) {
                        productCount[productName] += product.selectedQuantity;
                    } else {
                        productCount[productName] = product.selectedQuantity;
                    }
                });
            }
        });

        const sortedProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]);

        return sortedProducts;
    }

    const displayMostPopular = () => {
        var result = {};
        if (selectedOption === 'range' && startDate && endDate) {
            result = countAndSortProductsByRange(allOrders, startDate, endDate);
        } else if (selectedOption === 'month' && selectedMonth) {
            result = countAndSortProductsByMonth(allOrders, selectedMonth);
        }



        if (result.length > 0) {
            const firstNProducts = result.slice(0, parseInt(number, 10));
            setDisplayingChart(true);
            setInfoToDisplay(firstNProducts);
        }
    };

    return (
    <>  
        <h2>סטטיסטיקה</h2>
        <div className='reports-display'>
        

        {
            (selectedOption === 'range')?
                <>
                    <label htmlFor="start-date-input">Select Start Date:</label>
                    <input
                    type="date"
                    id="start-date-input"
                    className="date-input"
                    value={startDate}
                    onChange={handleStartDateChange}
                    />

                    <label htmlFor="end-date-input">Select End Date:</label>
                    <input
                    type="date"
                    id="end-date-input"
                    className="date-input"
                    value={endDate}
                    onChange={handleEndDateChange}
                    />
                </>
            : null
        }


        {
            (selectedOption === 'month')?

                <>
                    <label htmlFor="select-input">בחרו חודש</label>
                    <select
                    id="select-month"
                    className="select-input"
                    value={selectedMonth}
                    onChange={handleSelectMonth}
                    >
                        <option value="0">ינואר</option>
                        <option value="1">פברואר</option>
                        <option value="2">מרץ</option>
                        <option value="3">אפריל</option>
                        <option value="4">מאי</option>
                        <option value="5">יוני</option>
                        <option value="6">יולי</option>
                        <option value="7">אוגוסט</option>
                        <option value="8">ספטמבר</option>
                        <option value="9">אוקטובר</option>
                        <option value="10">נובמבר</option>
                        <option value="11">ספטמבר</option>
                    </select>
                </>
            : null
        }


        <label htmlFor="number-input">Enter Number:</label>
        <input
            type="number"
            id="number-input"
            className="number-input"
            min='2'
            value={number}
            onChange={handleNumberChange}
        />

        <label htmlFor="select-input">Select Option:</label>
        <select
            id="select-input"
            className="select-input"
            value={selectedOption}
            onChange={handleSelectChange}
        >
            <option value="range">לפי טווח</option>
            <option value="month">לפי חודש</option>
        </select>

        <button onClick={displayMostPopular} className="submit-button">הצג</button>

        <div className='charts-display'>
            {/* Render charts here */}
            {
                displayingChart?
                    <Charts info={infoToDisplay}/>
                : null
            }

        </div>
        </div>
    </>
    );
};

export default Statistics;
