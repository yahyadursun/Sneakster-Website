import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ProductItem from "./ProductItem";
import Title from "./Title";
import "swiper/css";
import "swiper/css/pagination";

const RelatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      setRelated(productsCopy.slice(0, 7));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-16">
      <div className="text-center text-xl py-2">
        <Title text1="Benzer " text2="Ürünler" />
      </div>
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          480: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {related.map((item, index) => (
          <SwiperSlide key={index} className="p-2">
            <ProductItem
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
              className="small-product"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RelatedProduct;
