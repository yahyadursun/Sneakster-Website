import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Modal } from "antd";
import { MapPin } from "lucide-react";
import citiesAndDistricts from "../components/citiesAndDistricts";

const PlaceOrder = () => {
  const [method, setMethod] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  });
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [districts, setDistricts] = useState([]); // Şehir seçimine göre güncellenen ilçeler
  const cities = Object.keys(citiesAndDistricts); // Şehirlerin listesi

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Kullanıcı bilgilerini ve adreslerini getir
  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (response.data.success) {
        const { user } = response.data;

        // Kullanıcı bilgilerini form'a doldur
        setFormData((prevData) => ({
          ...prevData,
          firstName: user.name || "",
          lastName: user.surname || "",
          phone: user.phoneNo || "",
          email: user.email || "",
        }));

        // Adresleri kaydet
        if (user.addresses) {
          setUserAddresses(user.addresses);
        }
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri yüklenirken hata oluştu:", error);
      toast.error("Kullanıcı bilgileri yüklenirken bir hata oluştu");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Seçilen adrese göre sadece adres bilgilerini doldur
  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.label);
    setFormData((prevData) => ({
      ...prevData,
      street: address.street || "",
      city: address.city || "", // şehir bilgisini form'da tutuyoruz
      state: address.state || "", // ilçe bilgisini de burada güncelliyoruz
      zipcode: address.postalCode || "",
      country: address.country || "",
    }));

    // İlçeleri güncelle (şehir seçimine göre)
    if (address.city) {
      setDistricts(citiesAndDistricts[address.city] || []);
    } else {
      setDistricts([]); // Şehir seçilmemişse ilçeleri sıfırla
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;

    // Şehir seçildiğinde ilçeleri güncelle ve ilçe alanını sıfırla
    setFormData((prev) => ({
      ...prev,
      city: selectedCity,
      state: "", // İlçeyi sıfırla
    }));
    setDistricts(citiesAndDistricts[selectedCity] || []);
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };
const handleCardChange = (event) => {
  const { name, value } = event.target;
  if (/[^0-9]/.test(value) && value !== '') return;

  if (name === "cardNumber" && value.length <= 16) {
    setCardData(prev => ({ ...prev, [name]: value }));
  } else if (name === "expiryMonth") {
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  } else if (name === "expiryYear") {
    if (value === '' || (parseInt(value) >= 2 && parseInt(value) <= 99)) {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
    
  
  } else if (name === "cvc" && value.length <= 3) {
    setCardData(prev => ({ ...prev, [name]: value }));
  }
};
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (method === "Sanal Ödeme" || method === "Kredi Kartı") {
      setIsModalOpen(true);
      return;
    }

    await placeOrder();
  };

  const placeOrder = async () => {
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + Number(delivery_fee || 0),
        paymentMethod: method,
      };

      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        
        toast.success("Ödeme yapıldı! Siparişiniz başarıyla oluşturuldu.");
        setCartItems({});
        navigate("/orders", { state: { fromPayment: true } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePayment = async () => {
    if (
      !cardData.cardNumber ||
      !cardData.expiryMonth ||
      !cardData.expiryYear ||
      !cardData.cvc
    ) {
      toast.error("Lütfen tüm kart bilgilerini doldurun.");
      return;
    }
    
    setIsModalOpen(false);
    await placeOrder();
  };

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* Left Side */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2x1 my-3">
            <Title text1={"TESLİMAT"} text2={"BİLGİSİ"} />
          </div>

          {/* Kayıtlı Adresler Seçimi */}
          {userAddresses.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Kayıtlı Adresleriniz</h3>
              <div
                className="grid gap-3 overflow-y-auto max-h-60"
                style={{
                  scrollbarWidth: "thin", // Firefox için
                  scrollbarColor: "gray lightgray", // Firefox için
                }}
              >
                {userAddresses.map((address) => (
                  <div
                    key={address.label}
                    onClick={() => handleAddressSelect(address)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAddressId === address.label
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="text-gray-500" />
                      <span className="font-medium">{address.label}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state}, {address.postalCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Inputs - Existing code remains the same */}
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="Adınız"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="Soyadınız"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            type="email"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="E-posta Adresiniz"
          />
          <input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="Sokak Adresi"
          />
          <div className="flex gap-3">
            {/* Şehir Seçimi */}
            <select
              name="city"
              value={formData.city}
              onChange={handleCityChange}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              required
            >
              <option value="" disabled>
                Şehir Seçiniz
              </option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* İlçe Seçimi */}
            <select
              name="state"
              value={formData.state}
              onChange={onChangeHandler}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              required
              disabled={districts.length === 0} // İlçe listesi yoksa seçim kapalı
            >
              <option value="" disabled>
                İlçe Seçiniz
              </option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="Posta Kodu"
            />
            <input
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              type="text"
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              placeholder="Ülke"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="Telefon Numarası"
          />
        </div>
        {/* Right Side */}
        <div className="mt-8">
          <CartTotal />
          <div className="mt-12">
            <Title text1={"Ödeme"} text2={"Seçenekleri"} />
            <div className="flex gap-3 flex-col lg:flex-row">
              <div
                onClick={() => setMethod("Sanal Ödeme")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                  method === "Sanal Ödeme" ? "bg-green-400" : ""
                }`}
              >
                <img
                  className="h-5 mx-4"
                  src={assets.stripe_icon}
                  alt="Stripe"
                />
              </div>
              <div
                onClick={() => setMethod("Kredi Kartı")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                  method === "Kredi Kartı" ? "bg-green-400" : ""
                }`}
              >
                <img
                  className="h-5 mx-4"
                  src={assets.kredikart_icon}
                  alt="Kredi Kartı"
                />
              </div>
              <div
                onClick={() => setMethod("Kapıda Ödeme")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                  method === "Kapıda Ödeme" ? "bg-green-400" : ""
                }`}
              >
                <p className="montserrat text-gray-500 text-sm font-medium mx-4">
                  Kapıda Ödeme
                </p>
              </div>
            </div>
            <div className="w-full text-end mt-8">
              <button
                type="submit"
                className="montserrat bg-black text-white px-16 py-3 text-sm"
              >
                Ödeme
              </button>
            </div>
          </div>
        </div>
      </form>

      <Modal
        title="Ödeme Bilgileri"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={400}
      >
        <div className="text-center">
          <div>
            <input
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleCardChange}
              type="text"
              placeholder="Kart Numarası"
              maxLength={16}
              className="montserrat border p-3 rounded w-full mb-3"
            />
          </div>
          <div className="flex gap-3">
            <input
              name="expiryMonth"
              value={cardData.expiryMonth} 
              onChange={handleCardChange}
              type="text"
              placeholder="Ay"
              maxLength={2}
              className="montserrat border p-3 rounded w-full"
            />
            <input
              name="expiryYear"
              value={cardData.expiryYear} // Değer burada bağlanıyor
              onChange={handleCardChange}
              type="text"
              placeholder="Yıl"
              maxLength={2}
              className="montserrat border p-3 rounded w-full"
            />
            <input
              name="cvc"
              value={cardData.cvc}
              onChange={handleCardChange}
              type="text"
              placeholder="CVC"
              maxLength={3}
              className="montserrat border p-3 rounded w-full"
            />
          </div>
          <div className="mt-6">
            <button
              onClick={handlePayment}
              className="montserrat bg-black text-white px-16 py-3 text-sm"
            >
              Onayla ve Öde
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PlaceOrder;