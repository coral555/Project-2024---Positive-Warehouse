import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchProducts, fetchCategories, fetchOrders, fetchOrdersWithConditions } from '../utils/firebaseUtils';

const CombinedContext = createContext();

const fetchData = async (fetchFunction, setLoading, setError, setData) => {
  setLoading(true); 
  setError(null);
  try {
    const data = await fetchFunction();
    setData(data);
  } 
  catch(error) {
    console.error("Error fetching data:", error);
    setError(error);
  } 
  finally {
    setLoading(false);
  }
};

export const CombinedProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productQuantities, setProductQuantities] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isFetchingAll, setIsFetchingAll] = useState(true);
  const [categoriesFetched, setCategoriesFetched] = useState(false);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState(''); 
  const [subCategories, setSubCategories] = useState([]);
  const [sortBy, setSortBy] = useState(''); 

  const fetchInitialCategories = useCallback(() => {
    fetchData(fetchCategories, setLoading, setError, setCategories);
  }, []);

  const handleResetDates = () => {
    setStartDate(null);
    setEndDate(null);
    localStorage.removeItem('startDate');
    localStorage.removeItem('endDate');
    setCategory('');
    setSubCategory('');
    setSubCategories([]);
    clearQuantities();
    clearCart();
  };

  const fetchInitialProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProducts(10, null, category, subCategory, sortBy)
      .then(({ productList, lastVisible }) => {
        setProducts(productList);
        setLastVisible(lastVisible);
        setIsFetchingAll(true);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, subCategory, sortBy]);  // Added sortBy to dependencies

  const fetchMoreProducts = async () => {
    if (!lastVisible || isFetchingMore) return;
    setIsFetchingMore(true);
    try {
      const { productList, lastVisible: newLastVisible } = await fetchProducts(10, lastVisible, category, subCategory, sortBy);
      if (productList.length === 0) {
        setIsFetchingAll(false);
      }
      setProducts((prevProducts) => [...prevProducts, ...productList]);
      setLastVisible(newLastVisible);
    } 
    catch (error) {
      console.error("Error fetching more products:", error);
    } 
    finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    if (!categoriesFetched) {
      fetchInitialCategories();
    }
  }, [categoriesFetched, fetchInitialCategories]);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find(cat => cat.name === category);
      if (selectedCategory && selectedCategory.subCategory) {
        setSubCategories(selectedCategory.subCategory);
      } else {
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
  }, [category, categories]);

  useEffect(() => {
    if (startDate && endDate) {
      const fetchOrdersInRange = async () => {
        setOrdersLoading(true);
        setOrdersError(null);
        try {
          const ordersInRange = await fetchOrders(startDate, endDate);
          setOrders(ordersInRange);
          createProductQuantitiesMap(ordersInRange);
        } 
        catch (error) {
          console.error("Error fetching orders:", error);
          setOrdersError(error);
        } 
        finally {
          setOrdersLoading(false);
        }
      };
      fetchOrdersInRange();
    }
  }, [startDate, endDate]);

  const createProductQuantitiesMap = useCallback((orders) => {
    const quantitiesMap = {};
    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (!quantitiesMap[product.id]) {
          quantitiesMap[product.id] = 0;
        }
        quantitiesMap[product.id] += product.selectedQuantity;
      });
    });
    setProductQuantities(quantitiesMap);
  }, []);

  const handleAddToCart = (productId, quantity) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + quantity,
    }));
    setIsModalOpen(false);
  };

  const getRemainingQuantity = useCallback(
    (productId, initialQuantity) => {
      const orderedQuantity = productQuantities[productId] || 0;
      return initialQuantity - orderedQuantity;
    },
    [productQuantities]
  );

  const clearQuantities = () => {
    setProductQuantities({});
  };

  const clearCart = () => {
    setProductQuantities({});
  };

  const searchOrders = async (searchParams, olddate = null) => {
    const fetchedOrders = await fetchOrdersWithConditions(searchParams, olddate);
    setOrders(fetchedOrders);
  };

  return (
    <CombinedContext.Provider
      value={{
        setProducts,
        products,
        categories,
        loading,
        error,
        handleResetDates,
        productQuantities,
        setProductQuantities,
        isModalOpen,
        setIsModalOpen,
        selectedProductId,
        setSelectedProductId,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleAddToCart,
        createProductQuantitiesMap,
        getRemainingQuantity,
        orders,
        ordersLoading,
        ordersError,
        clearCart,
        fetchMoreProducts,
        isFetchingMore, 
        category,
        setCategory,
        subCategory,
        setSubCategory,
        subCategories,
        setSubCategories,
        isFetchingAll,
        searchOrders,
        clearQuantities,
        sortBy,        // Added sortBy to the context
        setSortBy,     // Added setSortBy to the context
        setCategoriesFetched,
      }}
    >
      {children}
    </CombinedContext.Provider>
  );
};

export const useCombined = () => useContext(CombinedContext);
