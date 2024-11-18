import React from 'react'

const CartItem = ({item}) => {
    return (
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          {/* Image and Description */}
          <div className="flex items-center">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md mr-4" />
            <div>
              <p className="text-lg font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              {item.inStock ? (
                <p className="text-green-500 text-sm">In stock</p>
              ) : (
                <p className="text-gray-500 text-sm">Not in stock </p>
              )}
            </div>
          </div>
    
          {/* Price and Remove */}
          <div className="flex flex-col items-end">
            <p className="text-lg font-medium">${item.price}</p>
            <button className="text-purple-500 text-sm mt-2">Remove</button>
          </div>
        </div>
      );
}

export default CartItem