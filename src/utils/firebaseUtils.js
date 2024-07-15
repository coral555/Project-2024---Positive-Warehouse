//src\utils\firebaseUtils.js
import { collection, addDoc,getDocs, doc,query, getDoc,updateDoc,orderBy, limit,where, startAfter } from "firebase/firestore";
import { db, storage } from "./firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { Timestamp } from 'firebase/firestore';

export const fetchProducts = async (pageSize = 10, startAfterDoc = null, category = '', subCategory = '', sortBy = '') => {
  let productsQuery = query(
    collection(db, "products"),
    limit(pageSize)
  );

  switch (sortBy) {
    case 'quantity':
      productsQuery = query(productsQuery, orderBy('quantity', 'desc'));
      break;
    case 'category':
      productsQuery = query(productsQuery, orderBy('category'));
      break;
    case 'subcategory':
      productsQuery = query(productsQuery, orderBy('subcategory'));
      break;
    case 'name':
      productsQuery = query(productsQuery, orderBy('name'));
      break;
    default:
      productsQuery = query(productsQuery, orderBy('quantity', 'desc'));
      break;
  }
 
  if (category) {
    productsQuery = query(productsQuery, where("category", "==", category));
  }

  if (subCategory) {
    productsQuery = query(productsQuery, where("subcategory", "==", subCategory));
  }
  if (startAfterDoc) {
    productsQuery = query(productsQuery, startAfter(startAfterDoc));
  }

  try {
    const productSnapshot = await getDocs(productsQuery);
    const productList = await Promise.all(
      productSnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const imageRef = ref(storage, data.imageURL);
        const productImageURL = await getDownloadURL(imageRef);
        return { id: doc.id, ...data, imageURL: productImageURL };
      })
    );
    return { productList, lastVisible: productSnapshot.docs[productSnapshot.docs.length - 1] };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchCollection = async (collectionName) => {
  const categoriesCollection = collection(db, collectionName);
  const categorySnapshot = await getDocs(categoriesCollection);
  const orderList = categorySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  return orderList;
};

export const selectfetchProducts = async (category = '', subCategory = '', sortBy = '') => {
  if (!category) {
    return [];
  } 
  try {
    let q = query(collection(db, "products"));

    switch (sortBy) {
      case 'quantity':
        q = query(q, orderBy('quantity', 'desc'));
        break;
      case 'category':
        q = query(q, orderBy('category'));
        break;
      case 'subcategory':
        q = query(q, orderBy('subcategory'));
        break;
      case 'name':
        q = query(q, orderBy('name'));
        break;
      default:
        q = query(q, orderBy('quantity', 'desc'));
        break;
    }

    if (category) {
      q = query(q, where("category", "==", category));
      if (subCategory) {
        q = query(q, where("subcategory", "==", subCategory));
      }
    }
    
    const querySnapshot = await getDocs(q);
    console.log('Query Snapshot:', querySnapshot);
    
    const productsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Products List:', productsList);
    return productsList;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};


export const fetchCategories = async () => {
  const categoriesCollection = collection(db, "קטגוריות");
  const categorySnapshot = await getDocs(categoriesCollection);
  const categoryList = categorySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    subCategory: doc.data().subcategory || []
  }));
  return categoryList;
};


export const fetchOrders = async (startDate, endDate) => {
  const ordersCollection = collection(db, "orders");
  const startDateTimestamp = Timestamp.fromDate(new Date(startDate)); 
  const endDateTimestamp = Timestamp.fromDate(new Date(endDate)); 


  const startDateInRangeQuery = query(
    ordersCollection,
    where("startDate", ">=", startDateTimestamp),
    where("startDate", "<=", endDateTimestamp)
  );

  const endDateInRangeQuery = query(
    ordersCollection,
    where("endDate", ">=", startDateTimestamp),
    where("endDate", "<", endDateTimestamp)
  );

  const [startDateSnapshot, endDateSnapshot] = await Promise.all([
    getDocs(startDateInRangeQuery),
    getDocs(endDateInRangeQuery),
  ]);

  const startDateOrders = startDateSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const endDateOrders = endDateSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const ordersList = [...startDateOrders, ...endDateOrders];
  return ordersList ;
};
export const fetchOrdersWithConditions = async ({ userEmail, userName, userPhone }, olddate) => {
  const ordersCollection = collection(db, "orders");
  let ordersQuery = query(ordersCollection);
 
  if (olddate) {
    console.log(olddate);
    ordersQuery = query(ordersQuery, where("endDate", "<", olddate), where("startDate", "<", olddate));
  } else {
    if (userEmail) {
      ordersQuery = query(ordersQuery, where("user.email", "==", userEmail));
    }

    if (userName) {
      ordersQuery = query(ordersQuery, where("user.name", "==", userName));
    }

    if (userPhone) {
      ordersQuery = query(ordersQuery, where("user.phone", "==", userPhone));
    }
  }

  try {
    const orderSnapshot = await getDocs(ordersQuery);
    const ordersList = orderSnapshot.docs.map(doc => {
      const data = doc.data();
      if (data.orderDate instanceof Timestamp) {
        data.orderDate = data.orderDate.toDate();
      }
      if (data.startDate instanceof Timestamp) {
        data.startDate = data.startDate.toDate();
      }
      if (data.endDate instanceof Timestamp) {
        data.endDate = data.endDate.toDate();
      }
      if (data.orderTime instanceof Timestamp) {
        data.orderTime = data.orderTime.toDate();
      }
      return {
        id: doc.id,
        ...data
      };
    });
    console.log(ordersList);

    return ordersList;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};


export const addProductToOrder = async (orderId, product) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);

    if (orderDoc.exists()) {
      const orderData = orderDoc.data();
      const updatedProducts = [...orderData.products, product];
      await updateDoc(orderRef, { products: updatedProducts });
    } else {
      throw new Error('Order document not found');
    }
  } catch (error) {
    console.error('Error adding product to order:', error);
    throw error;
  }
}; 

export const placeOrder = async (order) => {
  try {
    const ordersCollection = collection(db, "orders");
    const docRef = await addDoc(ordersCollection, order);
    console.log("Order placed with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};