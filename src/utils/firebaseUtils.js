//src\utils\firebaseUtils.js
import { collection, addDoc,getDocs, doc,query, getDoc,updateDoc,orderBy, limit,where, startAfter } from "firebase/firestore";
import { db, storage } from "./firebase";
import { ref, getDownloadURL } from "firebase/storage";

export const fetchProducts = async (pageSize = 5, startAfterDoc = null, category = '', subCategory = '') => {
  let productsQuery = query(
    collection(db, "products"),
    orderBy('quantity', "desc"),
    limit(pageSize)
  );
 
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


export const selectfetchProducts = async (category = '', subCategory = '') => {
  try {
    let q = query(collection(db, "products"));
    
    if (category) {
      q = query(collection(db, "products"), where("category", "==", category));
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

  const startDateInRangeQuery = query(
    ordersCollection,
    where("startDate", ">=", startDate),
    where("startDate", "<=", endDate)
  );

  const endDateInRangeQuery = query(
    ordersCollection,
    where("endDate", ">=", startDate),
    where("endDate", "<", endDate)
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
export const fetchOrdersWithConditions = async ({ userEmail, userName, userPhone }) => {
  const ordersCollection = collection(db, "orders");
  let ordersQuery = query(ordersCollection);

  if (userEmail) {
    ordersQuery = query(ordersQuery, where("user.email", "==", userEmail));
  }

  if (userName) {
    ordersQuery = query(ordersQuery, where("user.name", "==", userName));
  }

  if (userPhone) {
    ordersQuery = query(ordersQuery, where("user.phone", "==", userPhone));
  }

  try {
    const orderSnapshot = await getDocs(ordersQuery);
    const ordersList = orderSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return ordersList;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const addProductToOrder = async (orderId, product) => {
  try {
    // Create a reference to the specific order document
    const orderRef = doc(db, 'orders', orderId);

    // Fetch the order document
    const orderDoc = await getDoc(orderRef);

    if (orderDoc.exists()) {
      const orderData = orderDoc.data();

      // Update the products array in the order document
      const updatedProducts = [...orderData.products, product];
      await updateDoc(orderRef, { products: updatedProducts });
    } else {
      throw new Error('Order document not found'); // Throw an error if document not found
    }
  } catch (error) {
    console.error('Error adding product to order:', error);
    throw error; // Rethrow the error to handle it in the caller function
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