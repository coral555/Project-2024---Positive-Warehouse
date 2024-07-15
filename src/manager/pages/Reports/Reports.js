import "./Reports.css";
import React, { useState, useEffect } from "react";
import { fetchCollection } from "../../../utils/firebaseUtils";
import 'firebase/firestore';

// Todo: final styles are required

const Reports = () => {

    // Selects to display different report Inputs
    const [DisplayOrders, setDisplayOrders] = useState(true);
    const [DisplayProducts, setDisplayProducts] = useState(false);
    const [DisplayCategories, setDisplayCategories] = useState(false);


    // Selects to display different reports
    const [showOrders, setShowOrders] = useState(false);
    const [showPopularProducts, setShowPopularProducts] = useState(false);
    const [showcategories, setShowCategories] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [showNoReports, setShowNoReports] = useState(false);

    // For orders display
    const [date_start, setDateStart] = useState('');
    const [date_end, setDateEnd] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [mostPopular, setMostPopular] = useState([]);

    const [ordersToDisplay, setOrdersToDisplay] = useState([]);

    // For products display
    const [quantityInputFrom, setNumberInputFrom] = useState(0);
    const [quantityInputTo, setNumberInputTo] = useState(0);
    const [productName, setProductName] = useState('');
    const [productCategoryName,setProductCategoryName] = useState('');
    const [productSubCategoryName,setProductSubCategoryName] = useState('');
    const [productsDescription, setProductsDescription] = useState('');

    const [productsToDisplay, setProductsToDisplay] = useState([]);

    // For category display
    const [categoryName, setcategoryName] = useState('');
    const [subCategory, setSubCategory] = useState('');

    const [categoriesToDisplay, setCategoriesToDisplay] = useState('');

    // All collections
    const [allOrders, setAllOrders] = useState([]);
    const [allProducts, setProducts] = useState([]);
    const [allCategories, setCategories] = useState([]); 

    // To save on data reads from firebase, old product will be loaded on page refresh
    // Note: useful for production, but not for development, as react will re-render on every change
    useEffect(() => {
        const fetchReports = async () => {
            console.log('Fetching reports...');
            const oldOrders = await fetchCollection('oldOrders');
            const orders = await fetchCollection('orders');
            const products = await fetchCollection('products');
            const categories = await fetchCollection('קטגוריות');
            
            setCategories(categories);
            setProducts(products);

            const ordersTotal = oldOrders.concat(orders);
            setDisplayOrders(true);
            setAllOrders(ordersTotal);
        };

        fetchReports();
    }, []);

    const checkIfNoReportsToDisplay = (list) => {
        if (list.length === 0) {
            resetReportsDisplay();
            setShowNoReports(true);
        } else {
            setShowNoReports(false);
        }
    };

    const resetReportsDisplay = () => {
        setShowOrders(false);
        setShowPopularProducts(false);
        setShowNoReports(false);
        setShowProducts(false);
        setShowCategories(false);
    };

    const HandleChangeDisplay = (orders,products,category) => {
        return () => {
            setDisplayOrders(orders);
            setDisplayProducts(products);
            setDisplayCategories(category);
        }
    };

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

    const handleNumberChangeFrom = (event) => {
        if (quantityInputFrom <= quantityInputTo)
            setNumberInputFrom(event.target.value);
    } 
    const handleNumberChangeTo = (event) => {
        if (quantityInputFrom <= quantityInputTo)
            setNumberInputTo(event.target.value);
    }

    const handleProductNameChange = (event) => {
        setProductName(event.target.value);
    }

    const handleProductCategoryName = (event) => {
        setProductCategoryName(event.target.value)
    }
    
    const handleProductSubCategoryName = (event) => {
        setProductSubCategoryName(event.target.value)
    }

    const handleProductsDescriptionChange = (event) => {
        setProductsDescription(event.target.value);
    }

    // Handlers for categories
    const handleCategoryChange = (event) => {
        console.log(event.target.value);
        setcategoryName(event.target.value);
    }

    const handleSubCategoryChange = (event) => {
        setSubCategory(event.target.value);
    }


    // Handlers for showing all reports of some type
    const handleShowAllProducts = function() {
        setProductsToDisplay(allProducts)
        resetReportsDisplay();
        setShowProducts(true);
    }

    const handleShowAllCategories = () => {
        setCategoriesToDisplay(allCategories);
        resetReportsDisplay();
        setShowCategories(true)
    }
    
    const handleShowAllOrders = async () => {
        setOrdersToDisplay(allOrders);
        resetReportsDisplay()
        setShowOrders(true);
    };

    // Filtering handlers:
    const handleDisplayFilteredProducts = function() {
        
        const quantityFrom = quantityInputFrom;
        const quantityTo = quantityInputTo;
        const product_name = productName;
        const productsDescription_name = productsDescription;
        const productCategory_name = productCategoryName;
        const productSubCategory_name = productSubCategoryName;

        var all_products = allProducts;

        console.log(all_products);

        if (quantityFrom && quantityTo) {
            all_products = all_products.filter(product => {
                return (product.quantity >= quantityFrom && product.quantity <= quantityTo)
            });
        }

        if (product_name) {
            all_products = all_products.filter(product => product.name.includes(product_name));
        }

        if (productsDescription_name) {
            all_products = all_products.filter(product => product.description.includes(productsDescription_name));
        }

        if (productCategory_name) {
            all_products = all_products.filter(product => product.category.includes(productCategory_name));
        }

        if (productSubCategory_name) {
            all_products = all_products.filter(product => product.subcategory.includes(productSubCategory_name));
        }

        setProductsToDisplay(all_products);
        resetReportsDisplay();
        setShowProducts(true);
        checkIfNoReportsToDisplay(all_products)
    }


    const handleShowFilteredCategories = () => {

        const category_name = categoryName;
        const subCategory_name = subCategory;

        var all_categories = allCategories;

        // Filtering
        if (category_name) {
            all_categories = all_categories.filter(category => category.name.includes(category_name));
        }

        if (subCategory_name) {
            all_categories = all_categories.filter(
                category => category.subcategory.some((sub) => sub.includes(subCategory_name)));
        }

        setCategoriesToDisplay(all_categories);
        resetReportsDisplay();
        setShowCategories(true);
        checkIfNoReportsToDisplay(all_categories)
    }

    const handleFilterOrders = async () => {
        const oldOrders = allOrders;
        setShowPopularProducts(false);

        var newReports = oldOrders;

        // filtering for date
        if (date_end && date_start) {
            newReports = filterByDate(newReports);
        }

        // filtering for name, phone, and email.
        if (name)
            newReports = newReports.filter((report) => report.user.name.includes(name));

        if (email)
            newReports = newReports.filter((report) => report.user.email.includes(email));

        if (phone)
            newReports = newReports.filter((report) => report.user.phone.includes(phone));

        // Displaying no reports if there are none
        resetReportsDisplay()
        setShowOrders(true);
        setOrdersToDisplay(newReports);
        checkIfNoReportsToDisplay(newReports)
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
        const oldOrders = allOrders;
        resetReportsDisplay();
        setShowPopularProducts(true);
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

    return (
        <div className="reports-container">
            <h1 className="reports-main-title">הפקת דוחות</h1>

            <div className="reports-display">

            <div className="reports-input">

                <div className="report-type-input">
                    <input className="submit-button" type="submit" value="הזמנות" onClick={HandleChangeDisplay(true,false,false)} />
                    <input className="submit-button" type="submit" value="מוצרים" onClick={HandleChangeDisplay(false,true,false)} />
                    <input className="submit-button" type="submit" value="קטגוריות" onClick={HandleChangeDisplay(false,false,true)}/>
                </div>

                <div className="reports-input-container">

                    {/** Display For Orders */}

                    {
                        DisplayOrders? (
                            <div className="old-orders-input">   

                            <h1 className="orders-title">הזמנות</h1>                

                            <div className="right-sticking">
                                <h2 className="sort-title">סנן לפי:</h2>
                            </div>
                            

                            <div className="column-input">
                                <div>
                                    <input
                                        className="text-input"
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="שם"
                                        value={name}
                                        onChange={handleChangeName}
                                    />
                                </div>
                                <div>
                                    <input
                                        className="text-input"
                                        type="text"
                                        id="email"
                                        name="email"
                                        placeholder="אימייל"
                                        value={email}
                                        onChange={handleChangeEmail}
                                    />
                                </div>
                                <div>
                                    <input
                                        className="text-input"
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        placeholder="טלפון"
                                        value={phone}
                                        onChange={handleChangePhone}
                                    />
                                </div>
                            </div>
                            <div className="date-Container">
                                <div className="four-by-four-box">
                                    <input
                                        
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        className="date-input grid-item"
                                        value={date_start}
                                        onChange={handleChangeStart}
                                    />

                                    <label className="grid-item" htmlFor="startDate">:מתאריך</label>
                                    <input 
                                        type="date"
                                        id="EndDate"
                                        name="EndDate"
                                        className="grid-item date-input"
                                        value={date_end}
                                        onChange={handleChangeEnd}
                                    />
                                    <label className="grid-item" htmlFor="EndDate">:עד תאריך</label>
                                    
                                </div>
                            </div>

                            <div className="row-input">
                                <input className="submit-button" type="submit" value="הצג את כל ההזמנות" onClick={handleShowAllOrders} />
                                <input className="submit-button" type="submit" value="הצג הזמנות מסוננות" onClick={handleFilterOrders} />
                            </div>

                        </div>
                        ): null
                    }

                    {/** Display Products */}
                    {
                        DisplayProducts? (
                            <div className="old-orders-input">

                                <h1>מוצרים</h1>

                                
                                <div className="right-sticking">
                                    <h2>סנן לפי:</h2>
                                </div>

                                <div className="column-input">

                                    <label className="input-label" htmlFor="quantity">טווח כמות:</label>

                                    <div className="centered">
                                        <input value={quantityInputFrom} className="number-input" type="number" id="range" name="quantity" min="0" onChange={handleNumberChangeFrom}/>
                                        <label>:עד</label>
                                        <input value={quantityInputTo} className="number-input" type="number" id="quantity" name="quantity" min="0" onChange={handleNumberChangeTo}/>
                                        <label>:מ </label>                                        

                                    </div>
                                </div>

                                <div>
                                    <input
                                        className="text-input"
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="שם"
                                        onChange={handleProductNameChange}
                                    />
                                </div>  

                                <div>
                                    <input
                                        className="text-input"
                                        type="text"
                                        id="category-name"
                                        name="category-name"
                                        placeholder="קטגוריה"
                                        onChange={handleProductCategoryName}
                                    />
                                </div>  

                                <div>
                                    <input
                                        className="text-input"
                                        type="text"
                                        id="subcategory-name"
                                        name="subcategory-name"
                                        placeholder="תת קטגוריה"
                                        onChange={handleProductSubCategoryName}
                                    />
                                </div>    
                                
                                <div>
                                    <textarea 
                                        className="styled-textarea"
                                        id="message" name="message"
                                        placeholder="תיאור המוצר"
                                        onChange={handleProductsDescriptionChange}>
                                    </textarea>
                                </div>

                                <div className="row-input">
                                    <input className="submit-button" type="submit" value="הצג את כל במוצרים" onClick={handleShowAllProducts}/>
                                    <input className="submit-button" type="submit" value="הצג מוצרים לפי סינון" onClick={handleDisplayFilteredProducts}/>
                                </div>

                                <input
                                    style={{ width: '230px' }}
                                    className="display-button"
                                    type="submit"
                                    value="הצג את המוצרים הכי פופולריים"
                                    onClick={handleShowMostPopular}
                                />

                            </div>
                        ): null
                    }

                    {/** Display Categories */}

                    {
                        DisplayCategories? (
                            <div className="old-orders-input">

                                <h1>קטגוריות</h1>

                                <div className="right-sticking">
                                    <h2>סנן לפי:</h2>
                                </div>

                                <div>
                                    <input 
                                    className="text-input" 
                                    type="text" 
                                    id="category" 
                                    name="category" 
                                    placeholder="שם קטגוריה"
                                    onChange={handleCategoryChange}/>
                                </div>

                                <div>
                                    <input 
                                    className="text-input" 
                                    type="text" 
                                    id="category" 
                                    name="category" 
                                    placeholder="שם תת קטגוריה"
                                    onChange={handleSubCategoryChange}/>
                                </div>

                                <div className="row-input">
                                    <input className="submit-button" type="submit" value="הצג את כל הקטגוריות" onClick={handleShowAllCategories} />
                                    <input className="submit-button" type="submit" value="הצג קטגוריות לפי סינון" onClick={handleShowFilteredCategories} />
                                </div>
                            </div>
                        ): null
                    }

                </div>
                    
            </div>

            <div className="reports-reports">

                {/** Show Most Popular Products */}

                {showPopularProducts && (
                    <div className="most-popular-display">
                        <h2>מוצרים פופולריים</h2>
                        <ul>
                            {mostPopular.map(([productName, quantity], index) => (
                                <li key={index}>
                                    {productName}: {quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/** Show Orders */}

                { showOrders && (
                    ordersToDisplay.map((report) => (
                        <div key={report.id} className="report">
                            <div className="row-input">

                                <div className="column-input">
                                    <ul>
                                        <label><strong>מוצרים</strong></label>
                                        {report.products.map((product, index) => (
                                            <li key={index}>
                                                <strong>שם מוצר:</strong> {product.productName} - <strong>כמות:</strong> {product.selectedQuantity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="column-input">
                                    <label>{report.user.name}<strong> :שם</strong></label>
                                    <label><strong>טלפון: </strong>{report.user.phone}</label>
                                    <label>{report.user.email}<strong> :דואר אלקטרוני</strong></label>
                                    <ul>
                                        <li>{report.id} <strong>:מזהה</strong></li>
                                        <li>{report.endDate.toDate().toLocaleDateString()} <strong>:תאריך החזרה</strong></li>
                                        <li>{report.startDate.toDate().toLocaleDateString()} <strong>:תאריך התחלה</strong></li>
                                        <li>{report.orderDate.toDate().toLocaleDateString()} <strong>:תאריך קבלת הזמנה</strong></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/** Show Products */}

                {showProducts && (
                    productsToDisplay.map((product) => (
                        <div className="report">
                            <div className="row-input">
                                <div className="column-input">
                                    <label><strong>שם: </strong>{product.name}</label>
                                    <label><strong>קטגוריה: </strong>{product.category}</label>
                                    <label><strong>תת קטגוריה: </strong>{product.subcategory}</label>
                                    <label><strong>כמות: </strong>{product.quantity} </label>

                                </div>

                                <div className="column-input">
                                    {/* <label>{product.id} :מזהה</label> */}
                                    <label><    strong>תיאור</strong>: {product.description} </label>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/** Show Categories */}

                {showcategories && (
                    categoriesToDisplay.map((category) => (
                        <div className="report">
                            <strong></strong>
                            <div className="row-input">
                                <div className="column-input">
                                    <label> <strong>שם: </strong>{category.name}</label>

                                    <label> {category.id} <strong>:מזהה</strong></label>
                                </div>

                                <div className="column-input">
                                    <label><strong> תת קטגוריות </strong></label>
                                    {category.subcategory.map((subCategory, index) => (
                                        <li key={index}>
                                            {subCategory}
                                        </li>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {showNoReports && (
                    <h2 style={{ color: 'black' }}>אין דוחות להצגה</h2>
                )}
            </div>
        </div>
    </div>
    );
};

export default Reports;
