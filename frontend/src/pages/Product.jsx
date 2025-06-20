import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProduct from "../components/RelatedProduct.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(
        product.image && product.image.length > 0
          ? product.image[0]
          : "default-image-url"
      );
    }
  };

  // Effect for initial data fetch and product changes
  useEffect(() => {
    if (products && products.length > 0) {
      fetchProductData();
      // Scroll to top whenever productId changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset size when product changes
      setSize("");
    }
  }, [productId, products, location.pathname]);

  const handleAddToCart = () => {
    if (!size) {
      toast.warn("Lütfen bir beden seçin!", { position: "top-right" });
      return;
    }
    addToCart(productData._id, size);
    toast.success(`Beden: ${size} sepete eklendi!`, { position: "top-right" });
  };

  if (!productData) return null;

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <ToastContainer autoClose={3000} />
      
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row scrollbar-hidden">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image && productData.image.length > 0 ? (
              productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt={productData.name || "Product Image"}
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              className="w-full h-auto"
              src={image}
              alt={productData.name || "Product"}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          {/* Product Name and Tags */}
          <div className="flex items-center gap-2 mt-2">
            <h1 className="font-medium montserrat prompt-bold text-3x1">
              {productData.name}
            </h1>
            {productData.bestseller && (
              <span className="montserrat text-sm text-white bg-red-600 px-3 py-1 rounded-full">
                🔥 Bestseller 
              </span>
            )}
            {productData.newSeason && (
              <span className="text-sm montserrat text-white bg-blue-300 px-3 py-1 rounded-full">
               ⛄ New Season
              </span>
            )}
          </div>

          <div className="flex items-center">
            <p className="mt-5 montserrat font-small text-gray-400">
              {productData.description}
            </p>
          </div>

          <p className="mt-5 text-3x1 montserrat font-medium">
            {productData.price}
            {currency}
          </p>

          {/* Select Size Dropdown */}
          <div className="flex flex-col gap-4 my-8 relative">
            <p className="montserrat-bold funnel-sans">Beden Seçin</p>
            <select
              onChange={(e) => setSize(e.target.value)}
              className="custom-select"
              value={size}
            >
              <option value="" hidden disabled>
                Beden Seçin
              </option>
              {productData.sizes
                .sort((a, b) => a - b)
                .map((item, index) => (
                  <option
                    key={index}
                    value={item}
                    disabled={productData.stock[item] == 1}
                    className={
                      productData.stock[item] == 1
                        ? "text-gray-400 cursor-not-allowed"
                        : ""
                    }
                  >
                    {item} {productData.stock[item] == 1 ? "(Stokta Yok)" : ""}
                  </option>
                ))}
            </select>
          </div>

          <button
            onClick={handleAddToCart}
            className="montserrat bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            SEPETE EKLE
          </button>
          <hr className="mt-8 sm:w-4/5" />

          {/* Ürün Detayları ve Teslimat Başlıkları */}
          <div className="mt-4 sm:mt-6 flex justify-between items-center sm:w-full pt-4">
            <div className="w-full sm:w-[50%]">
              <div className="flex gap-8 mb-4">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`font-semibold text-xs ${
                    activeTab === "details"
                      ? "text-gray-700 border-b-2 border-gray-700"
                      : "text-gray-400 border-b border-gray-300"
                  }`}
                >
                  Ürün Detayları
                </button>
                <button
                  onClick={() => setActiveTab("shipping")}
                  className={`font-semibold text-xs ${
                    activeTab === "shipping"
                      ? "text-gray-700 border-b-2 border-gray-700"
                      : "text-gray-400 border-b border-gray-300"
                  }`}
                >
                  Teslimat ve Kargo
                </button>
              </div>

              {/* Seçilen Tab'ın İçeriği */}
              {activeTab === "details" && (
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <p>
                    <strong>Marka:</strong> {productData.brand}
                  </p>
                  <p>
                    <strong>Cinsiyet:</strong> {productData.category}
                  </p>
                  <p>
                    <strong>Renk:</strong> {productData.color}
                  </p>
                  <p>
                    <strong>Ürün Adı:</strong> {productData.name}
                  </p>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <p>
                    Sneakster.com'da siparişler 1-2 gün içinde, hafta sonu ve
                    resmi tatillerde verdiğin siparişler ise takip eden ilk iş
                    gününde hazırlanmaya başlar. Siparişler ortalama 1-3 iş günü
                    içerisinde kargoya teslim edilir.
                  </p>
                  <p>
                    Siparişleri Türkiye'nin her bölgesinde adresine teslim
                    ediyoruz ancak yurt dışı ve Kıbrıs'a şuan için ne yazık ki
                    teslimat yapamıyoruz.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  );
};

export default Product;