import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, bestseller, newSeason }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer relative" to={`/product/${id}`}>
      {/* Ateş simgesi - Best Seller */}
      {bestseller && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1">
          🔥 <span>Best Seller</span>
        </div>
      )}
      {/* Çiçek simgesi - New Season */}
      {newSeason && (
        <div className="absolute top-2 right-2 bg-blue-300 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1">
          ⛄ <span>New Season</span>
        </div>
      )}
      {/* Ürün Görseli */}
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out w-full h-auto"
          src={
            Array.isArray(image) && image.length > 0
              ? image[0]
              : 'https://example.com/default-image.jpg'
          }
          alt={name}
        />
      </div>
      {/* Ürün Detayları */}
      <div className="flex flex-col items-center">
        <p className="montserrat pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm prompt-bold">
          {price}
          {currency}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
