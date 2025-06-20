import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import UpdateProduct from "./UpdateProduct";
import { Filter, Search } from 'lucide-react';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState({
    min: "",
    max: ""
  });
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [brandFilter, setBrandFilter] = useState("all");
  const brands = [
    "all",
    "adidas",
    "Converse",
    "Greyder",
    "Hummel",
    "Kinetix",
    "Lacoste",
    "Lescon",
    "Lumberjack",
    "New Balance",
    "Nike",
    "North Face",
    "Polaris",
    "Puma",
    "Reebok",
    "Skechers",
    "Timberland",
    "Tommy Hilfiger",
    "U.S. Polo Assn.",
    "Under Armour",
    "Vans",
    "Other"
  ];


  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
        setFilteredList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getTotalStock = (product) => {
    if (!product.stock) return 0;
    return Object.values(product.stock).reduce((total, count) => total + count, 0);
  };

  const applyFilters = () => {
    let result = [...list];

    // Search filter
    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Brand filter 
    if (brandFilter !== "all") {
      result = result.filter(item => item.brand === brandFilter);
    }
    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(item => item.category === categoryFilter);
    }

    // Price range filter
    if (priceRange.min !== "") {
      result = result.filter(item => item.price >= Number(priceRange.min));
    }
    if (priceRange.max !== "") {
      result = result.filter(item => item.price <= Number(priceRange.max));
    }

    // Enhanced Stock filter based on total stock quantity
    if (stockFilter === "in-stock") {
      result = result.filter(item => getTotalStock(item) > 0);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter(item => getTotalStock(item) === 0);
    } else if (stockFilter === "low-stock") {
      result = result.filter(item => {
        const totalStock = getTotalStock(item);
        return totalStock > 0 && totalStock <= 10;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-asc":
          return getTotalStock(a) - getTotalStock(b);
        case "stock-desc":
          return getTotalStock(b) - getTotalStock(a);
        default:
          return 0;
      }
    });

    setFilteredList(result);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setBrandFilter("all");
    setPriceRange({ min: "", max: "" });
    setStockFilter("all");
    setSortBy("name-asc");
    setFilteredList(list);
  };

  // Get unique categories from the list
  const categories = ["all", ...new Set(list.map(item => item.category))];

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, brandFilter, priceRange, stockFilter, sortBy]);

  const removeProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: productToDelete._id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setProductToDelete(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleUpdateSuccess = () => {
    fetchList();
    setEditingProduct(null);
  };

  return (
    <>
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün adına göre ara..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand === "all" ? "Tüm Markalar" : brand}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "Tüm Kategoriler" : category}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min Fiyat"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max Fiyat"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Enhanced Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tüm Stok Durumu</option>
            <option value="in-stock">Stokta Var</option>
            <option value="out-of-stock">Stokta Yok</option>
            <option value="low-stock">Düşük Stok (≤10)</option>
          </select>

          {/* Enhanced Sort By with Stock Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name-asc">İsim (A-Z)</option>
            <option value="name-desc">İsim (Z-A)</option>
            <option value="price-asc">Fiyat (Düşük-Yüksek)</option>
            <option value="price-desc">Fiyat (Yüksek-Düşük)</option>
            <option value="stock-asc">Stok (Az-Çok)</option>
            <option value="stock-desc">Stok (Çok-Az)</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Filtreleri Sıfırla
        </button>
      </div>

      <p className="mb-2">Tüm Ürünler ({filteredList.length} ürün)</p>
      <div className="flex flex-col gap-2">
        {/* List table title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Total Stock</b>
          <b>Action</b>
        </div>

        {/* List items */}
        {filteredList.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border bg-gray-100 text-sm"
            data-testid="item"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{item.price}{currency}</p>
            <p>{getTotalStock(item)}</p>
            <div className="flex gap-2">
              <p
                onClick={() => setEditingProduct(item)}
                className="text-right md:text-center cursor-pointer text-blue-500"
              >
                Edit
              </p>
              <p
                onClick={() => setProductToDelete(item)}
                className="text-right md:text-center cursor-pointer text-red-500"
              >
                Delete
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {editingProduct && (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <UpdateProduct
              token={token}
              product={editingProduct}
              onSuccess={handleUpdateSuccess}
            />
            <button
              onClick={() => setEditingProduct(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete the product "{productToDelete.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setProductToDelete(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={removeProduct}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;