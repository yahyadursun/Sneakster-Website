import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, deliveryFee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount() > 0 ? getCartAmount() : 0;
  const isFreeDelivery = subtotal > 500; 
  const finalDeliveryFee = isFreeDelivery ? 0 : deliveryFee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"SEPET"} text2={"TUTARI"} />
      </div>
      <div className="montserrat flex flex-col gap-2 mt-2 text-sm">
        <div className="montserrat flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {subtotal}.00
          </p>
        </div>
        <hr />
        <div className=" montserrat flex justify-between">
          <p>Kargo ücreti</p>
          <p>
            {currency} {finalDeliveryFee.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="montserrat flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {(subtotal + finalDeliveryFee).toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
