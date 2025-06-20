import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 7));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3x1 py-8">
        <Title text1={"BEST"} text2={"SELLER"} />
        <p className="montserrat w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
        En çok tercih edilen ürünlerimizle tarzınızı zirveye taşıyın – Sneakster'da bestseller koleksiyonuyla her adımda fark yaratın!
        </p>
      </div>
      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Scrollbar, A11y]}
        spaceBetween={30}
        slidesPerView={3} // Ekranda 3 ürün görünecek

        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
      >
        {bestSeller.map((item, index) => (
          <SwiperSlide key={index}>
            <ProductItem
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BestSeller;
