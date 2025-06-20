import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const UpdateProduct = ({ token, product }) => {
  const [image1, setimage1] = useState(false);
  const [image2, setimage2] = useState(false);
  const [image3, setimage3] = useState(false);
  const [image4, setimage4] = useState(false);

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [price, setPrice] = useState(product?.price || "");
  const [category, setCategory] = useState(product?.category || "Erkek");
  const [subCategory, setsubCategory] = useState(
    product?.subCategory || "Sneaker"
  );
  const [color, setColor] = useState(product?.color || "");
  const [sizes, setSizes] = useState(product?.sizes || []);
  const [bestseller, setBestseller] = useState(product?.bestseller || false);
  const [newSeason, setNewSeason] = useState(product?.newSeason || false);
  const [stock, setStock] = useState(() => {
    // If product has stock, create a copy to avoid direct mutation
    if (product?.stock) {
      return { ...product.stock };
    }
    return {};
  });

  const availableSizes = Array.from({ length: 73 }, (_, i) =>
    (19 + i * 0.5).toFixed(1).toString()
  );

  const handleStockChange = (size, value) => {
    setStock((prevStock) => {
      const newStock = { ...prevStock };
      const numericValue = Number(value);

      if (!numericValue || numericValue < 1) {
        delete newStock[size];
      } else {
        newStock[size] = numericValue;
      }
      return newStock;
    });
  };

  const handleSizeChange = (e) => {
    const selectedSize = e.target.value;
    if (sizes.includes(selectedSize)) {
      // If size is deselected, remove its stock
      setStock((prevStock) => {
        const newStock = { ...prevStock };
        delete newStock[selectedSize];
        return newStock;
      });
      setSizes(sizes.filter((size) => size !== selectedSize));
    } else {
      // If size is selected, add it to sizes
      setSizes([...sizes, selectedSize]);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("id", product._id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("color", color);
      formData.append("bestseller", bestseller);
      formData.append("newSeason", newSeason);

      // Ensure only selected sizes are in stock
      const filteredStock = {};
      sizes.forEach((size) => {
        if (stock[size] > 0) {
          filteredStock[size] = Number(stock[size]);
        }
      });

      if (Object.keys(filteredStock).length === 0) {
        toast.error("Lütfen en az bir beden için stok girin.");
        return;
      }

      formData.append("sizes", JSON.stringify(sizes));
      formData.append("stock", JSON.stringify(filteredStock));

      // Image handling
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        formData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-3 p-4"
      >
        <div>
          <p className="mb-2">Upload Image</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((num) => {
              const imageState = eval(`image${num}`);
              const setImageState = eval(`setimage${num}`);
              return (
                <label
                  key={num}
                  htmlFor={`image${num}`}
                  className="flex-shrink-0"
                >
                  <img
                    className="w-20 h-20 object-cover"
                    src={
                      imageState
                        ? URL.createObjectURL(imageState)
                        : product?.[`image${num}`] || assets.upload_area
                    }
                    alt=""
                  />
                  <input
                    onChange={(e) => setImageState(e.target.files[0])}
                    type="file"
                    id={`image${num}`}
                    hidden
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2">Product name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3 py-2"
            type="text"
            placeholder="Type here"
            required
          />
        </div>
        <div className="w-full">
          <p className="mb-2">Product description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-3 py-2 h-24"
            placeholder="Write content here"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <div>
            <p className="mb-2">Product Brand</p>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2"
            >
              <option value="adidas">Adidas</option>
              <option value="Converse">Converse</option>
              <option value="Greyder">Greyder</option>
              <option value="Hummel">Hummel</option>
              <option value="Kinetix">Kinetix</option>
              <option value="Lacoste">Lacoste</option>
              <option value="Lescon">Lescon</option>
              <option value="Lumberjack">Lumberjack</option>
              <option value="New Balance">New Balance</option>
              <option value="Nike">Nike</option>
              <option value="North Face">North Face</option>
              <option value="Polaris">Polaris</option>
              <option value="Puma">Puma</option>
              <option value="Reebok">Reebok</option>
              <option value="Skechers">Skechers</option>
              <option value="Timberland">Timberland</option>
              <option value="Tommy Hilfiger">Tommy Hilfiger</option>
              <option value="U.S. Polo Assn.">U.S. Polo Assn.</option>
              <option value="Under Armour">Under Armour</option>
              <option value="Vans">Vans</option>
              <option value="Other">Other</option>
              {/* Reduced brand list for brevity */}
            </select>
          </div>

          <div>
            <p className="mb-2">Product Color</p>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-3 py-2"
            >
              <option value="Kırmızı">Kırmızı</option>
              <option value="Mavi">Mavi</option>
              <option value="Siyah">Siyah</option>
              <option value="Gri">Gri</option>
              <option value="Beyaz">Beyaz</option>
              <option value="Pembe">Pembe</option>
              <option value="Krem">Krem</option>
              <option value="Lacivert">Lacivert</option>
              <option value="Haki">Haki</option>
            </select>
          </div>

          <div>
            <p className="mb-2">Product category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2"
            >
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
              <option value="Çocuk">Çocuk</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div>
            <p className="mb-2">Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2"
              type="number"
              placeholder="25"
              required
            />
          </div>

          <div>
            <p className="mb-2">Sub category</p>
            <select
              value={subCategory}
              onChange={(e) => setsubCategory(e.target.value)}
              className="w-full px-3 py-2"
            >
              <option value="Bot">Bot</option>
              <option value="Koşu Ayakkabısı">Koşu Ayakkabısı</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Sneaker">Sneaker</option>
              <option value="Sandalet">Sandalet</option>
              <option value="Terlik">Terlik</option>
              {/* Reduced sub-category list for brevity */}
            </select>
          </div>
        </div>

        <div className="w-full">
          <p>Product Sizes</p>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            <div className="flex flex-wrap gap-1">
              {availableSizes.map((size, index) => (
                <label key={index} className="inline-flex items-center mr-2">
                  <input
                    type="checkbox"
                    value={size}
                    onChange={handleSizeChange}
                    className="mr-1"
                    checked={sizes.includes(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full">
          <p>Stock for Selected Sizes</p>
          <div className="max-h-40 overflow-y-auto border rounded p-2 flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-1">
                <span>{size}:</span>
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock[size] || ""}
                  onChange={(e) => handleStockChange(size, e.target.value)}
                  className="w-20 px-1 py-1 border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
            className="h-4 w-4"
          />
          <label htmlFor="bestseller" className="cursor-pointer">
            Add to Bestseller
          </label>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            onChange={() => setNewSeason((prev) => !prev)}
            checked={newSeason}
            type="checkbox"
            id="newSeason"
            className="h-4 w-4"
          />
          <label htmlFor="newSeason" className="cursor-pointer">
            Add to New Season
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          UPDATE PRODUCT
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
