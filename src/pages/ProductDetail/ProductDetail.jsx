//src\pages\ProductDetail\ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ProductDetail.css";
import { useCombined } from "../../context/CombinedContext";

export const ProductDetail = () => {
  const { products} = useCombined();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const getProducts = async () => {
      const selectedProduct = products.find(
        (product) => product.id === id
      );
      setProduct(selectedProduct);
    };
    getProducts();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }
  return (
    <div className="product-detail">
      <div className="details">
        <h1>{product.name}</h1>
        <p className="price">quantity: {product.quantity}</p>
        <p className="description">description: {product.description}</p>
        <button onClick={() => navigate(-1)}> go back </button>
      </div>
      <img src={product.imageURL} alt={product.name} />
    </div>
  );
};
