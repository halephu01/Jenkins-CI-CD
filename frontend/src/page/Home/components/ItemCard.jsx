import React from 'react'
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="m-2 cursor-pointer transform transition duration-300 hover:scale-105"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden">
        <div className="aspect-w-1 aspect-h-1 overflow-hidden">
          <img 
            src={product?.imageUrl[0]} 
            alt={product?.name}
            className="w-full h-64 object-cover transform transition duration-300 hover:scale-110" 
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product?.name}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {product?.description}
          </p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-bold text-indigo-600">
              {new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
              }).format(product?.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;