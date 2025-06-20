import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-9x1">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="montserrat w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700">
        En yeni koleksiyonumuzla modanın nabzını tutun – Sneakster'da stilinizi yansıtan son trendleri keşfedin!
        </p>
      </div>
      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={20} // Aralık
        slidesPerView={2} // Görünen ürün sayısı
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {latestProducts.map((item, index) => (
          <SwiperSlide key={index}>
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LatestCollection;
