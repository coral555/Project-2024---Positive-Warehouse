import React from "react";

export const Product = ({ data }) => {
  const { name, quantity, imageURL, category, subcategory } = data;

  return (
    <div className="lg:w-1/1 md:w-1/1 w-full">
      <div className="relative group">
        <div className="block h-48 rounded overflow-hidden">
          <img
            alt={name}
            className="object-cover object-center w-full h-full block transition-transform transform translate-y-[-5]"
            src={imageURL}
          />
        </div>
        <div className="mt-4 mr-2">
          <h3 className="text-green-700 text-xs tracking-widest title-font mb-1">
            קטגוריה: {category}
          </h3>
          <h3 className="text-green-700 text-xs tracking-widest title-font mb-1">
            תת קטגוריה: {subcategory}
          </h3>
          <h2 className="text-green-900 title-font text-lg font-medium">
            {name}
          </h2>
          <h2 className="text-green-900 title-font text-lg font-medium">
            כמות :{quantity}
          </h2>
        </div>
      </div>
    </div>
  );
};
