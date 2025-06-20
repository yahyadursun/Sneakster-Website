import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
      setIsLoading(false);
    }
  }, [cartItems, products]);

  if (isLoading || !products || products.length === 0) {
    return (
      <div className="border-t pt-14">
        <div className="text-2xl mb-3">
          <Title text1={"Sepetinizdeki"} text2={" Ürünler"}></Title>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-gray-500">
            Loading cart items...
          </div>
        </div>
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className="border-t pt-14">
        <div className="text-2xl mb-3">
          <Title text1={"Sepetinizdeki"} text2={" Ürünler"}></Title>
        </div>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 montserrat">Sepetinizde ürün bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"Sepetinizdeki"} text2={" Ürünler"}></Title>
      </div>
      <div>
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          
          // Skip rendering if product data isn't found
          if (!productData) return null;

          return (
            <div 
              key={`${item._id}-${item.size}`}
              className="flex items-center gap-6 p-4 bg-white montserrat shadow-md rounded-lg border mb-4"
            >
              <img
                className="w-16 sm:w-20 rounded-lg object-cover"
                src={productData.image[0]}
                alt={productData.name}
              />

              <div className="flex flex-col gap-2 flex-grow">
                <p className="text-sm sm:text-lg montserrat font-semibold text-gray-800">
                  {productData.name}
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-base sm:text-lg montserrat font-medium text-gray-600">
                    {productData.price}
                    {currency}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="px-3 montserrat py-1 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-full border border-gray-300">
                  Size: {item.size}
                </p>
                <input
                  onChange={(e) =>
                    e.target.value === "" || e.target.value === "0"
                      ? null
                      : updateQuantity(item._id, item.size, Number(e.target.value))
                  }
                  className="border w-16 sm:w-20 px-1 sm:px-2 py-1 text-center rounded-full"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="w-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate('/place-order')}
              className="bg-black montserrat text-white text-sm my-8 px-8 py-3"
            >
              SEPETİ ONAYLA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;