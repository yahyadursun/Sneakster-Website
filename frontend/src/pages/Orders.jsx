import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");

  const loadOrderData = async () => {
    try {
      if (!token) {
        return;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const formattedItem = { ...item };
            formattedItem["status"] = order.status;
            formattedItem["payment"] = order.payment;
            formattedItem["paymentMethod"] = order.paymentMethod;
            formattedItem["date"] = order.date;
            allOrdersItem.push(formattedItem);
          });
        });

        const reversedOrders = allOrdersItem.reverse();
        setOrderData(reversedOrders);
        setFilteredOrders(reversedOrders);
      } else {
        toast.error(response.data.message || "Siparişler alınamadı.");
      }
    } catch (error) {
      console.error("Siparişler yüklenirken hata oluştu:", error);
      toast.error("Siparişler yüklenemedi. Lütfen daha sonra tekrar deneyin.");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, filterPeriod);
  };

  const handleFilterPeriod = (period) => {
    setFilterPeriod(period);
    applyFilters(searchQuery, period);
  };

  const applyFilters = (query, period) => {
    let filtered = orderData;

    if (period !== "all") {
      const now = new Date();
      let filterDate;

      if (period === "30days") {
        filterDate = new Date(now.setDate(now.getDate() - 30));
      } else if (period === "3months") {
        filterDate = new Date(now.setMonth(now.getMonth() - 3));
      } else if (period === "1year") {
        filterDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      filtered = filtered.filter((item) => new Date(item.date) >= filterDate);
    }

    if (query) {
      filtered = filtered.filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query) ||
          item.paymentMethod.toLowerCase().includes(query)
        );
      });
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "sipariş verildi":
      case "paketlemede":
        return "bg-yellow-500";
      case "kargoya verildi":
      case "teslimat için yolda":
        return "bg-green-500";
      case "teslim edildi":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="border-t pt-16 min-h-screen montserrat">
      <div className="text-2xl text-center mb-8">
        <Title text1={"Siparişlerim"} />
      </div>

      <div className="mx-auto max-w-4xl px-4">
        <input
          type="text"
          placeholder="Sipariş ara (isim, durum, ödeme yöntemi)"
          value={searchQuery}
          onChange={handleSearch}
          className="border p-3 w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-gray-700 montserrat"
        />

        <div className="flex justify-between gap-4 mb-6">
          <button
            onClick={() => handleFilterPeriod("all")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-md montserrat ${
              filterPeriod === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            Tüm Siparişler
          </button>
          <button
            onClick={() => handleFilterPeriod("30days")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-md montserrat ${
              filterPeriod === "30days"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            Son 30 Gün
          </button>
          <button
            onClick={() => handleFilterPeriod("3months")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-md montserrat ${
              filterPeriod === "3months"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            Son 3 Ay
          </button>
          <button
            onClick={() => handleFilterPeriod("1year")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200 shadow-md montserrat ${
              filterPeriod === "1year"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            Son 1 Yıl
          </button>
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t-4 border-gray-200 montserrat"
              >
                <div className="flex items-start gap-4 text-sm">
                  <img
                    className="w-16 h-16 object-cover rounded-md border"
                    src={item.image?.[0] || "fallback-image-url.jpg"}
                    alt={item.name}
                  />
                  <div>
                    <p className="text-base font-medium text-gray-800 montserrat">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <p>
                        <span className="font-medium text-gray-700">
                          Fiyat:
                        </span>{" "}
                        {item.price}
                        {currency}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">Adet:</span>{" "}
                        {item.quantity}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Beden:
                        </span>{" "}
                        {item.size}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Tarih:</span>{" "}
                      {new Date(item.date).toDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Ödeme:</span>{" "}
                      {item.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <p
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    ></p>
                    <p className="text-sm font-medium text-gray-700 montserrat">
                      {item.status}
                    </p>
                  </div>
                  <button
                    onClick={loadOrderData}
                    className="border px-4 py-2 text-sm font-medium rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition montserrat"
                  >
                    Kargo Takip
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm montserrat">
              Sipariş bulunamadı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
