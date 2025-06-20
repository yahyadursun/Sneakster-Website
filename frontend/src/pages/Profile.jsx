import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { User, Edit, Save, X, List, Plus } from "lucide-react";
import AddressForm from "../components/AddressForm";

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    surname: "",
    email: "",
    phoneNo: "",
    identityNo: "",
    gender: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [editAddress, setEditAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
  });

  // Get user profile and addresses
  const getUserProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token: token },
      });

      if (response.data.success) {
        setUser(response.data.user);
        setEditForm(response.data.user);
        setAddresses(response.data.user.addresses || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    if (!token) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    // Telefon numarasının sadece rakamlardan oluşup oluşmadığını kontrol et
    if (editForm.phoneNo && !/^\d+$/.test(editForm.phoneNo)) {
      toast.error("Telefon numarası sadece rakamlardan oluşmalıdır.");
      return;
    }

    // Telefon numarası validasyonu (Başlangıçta "05" ile başlamalı ve 10 rakam olmalı)
    if (editForm.phoneNo && !/^(05\d{9})$/.test(editForm.phoneNo)) {
      toast.error("Telefon numarası geçerli bir formatta olmalıdır (örn: 05366666689).");
      return;
    }

    // TC Kimlik numarasının sadece rakamlardan oluşup oluşmadığını kontrol et
    if (editForm.identityNo && !/^\d+$/.test(editForm.identityNo)) {
      toast.error("TC Kimlik numarası sadece rakamlardan oluşmalıdır.");
      return;
    }

    // TC Kimlik numarası validasyonu (11 haneli olmalı)
    if (editForm.identityNo && editForm.identityNo.length !== 11) {
      toast.error("TC Kimlik numarası 11 haneli olmalıdır.");
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/user/profile`,
        editForm,
        { headers: { token: token } }
      );

      if (response.data.success) {
        // Update local state with the new user data while keeping existing addresses
        const updatedUser = {
          ...response.data.user,
          addresses: user.addresses
        };
        setUser(updatedUser);
        setEditForm(updatedUser);
        toast.success("Profil başarıyla güncellendi.");
        setIsEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // Add or Edit Address
  const saveAddress = async () => {
    if (!token) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    // Validasyon
    if (
      !editAddress.label ||
      !editAddress.street ||
      !editAddress.city ||
      !editAddress.state ||
      !editAddress.postalCode ||
      !editAddress.country
    ) {
      toast.error("Lütfen tüm adres alanlarını doldurun.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/address`,
        {
          ...editAddress,
          userId: user._id,
        },
        { headers: { token: token } }
      );

      if (response.data.success) {
        // Update local state with new addresses
        const updatedUser = {
          ...user,
          addresses: response.data.addresses
        };
        setUser(updatedUser);
        setAddresses(response.data.addresses);
        toast.success("Adres başarıyla kaydedildi.");
        setIsAddressEditing(false);
        setEditAddress({
          label: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const deleteAddress = async (label) => {
    if (!token) {
      toast.error("Lütfen giriş yapın.");
      return;
    }

    try {
      const response = await axios.delete(`${backendUrl}/api/user/address`, {
        data: {
          userId: user._id,
          label: label,
        },
        headers: { token: token },
      });

      if (response.data.success) {
        // Update local state with new addresses
        const updatedUser = {
          ...user,
          addresses: response.data.addresses
        };
        setUser(updatedUser);
        setAddresses(response.data.addresses);
        toast.success("Adres başarıyla silindi.");
        setIsAddressEditing(false);
        setEditAddress({
          label: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="animate-pulse text-gray-500">
          <User size={48} className="mx-auto mb-4" />
          <p className="text-xl font-semibold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="text-center">
          <X size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-xl text-red-500">
            Kullanıcı bilgileri bulunamadı.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info Section */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-300 p-6">
          <div className="bg-gray-200 text-gray-800 p-6 flex items-center border-b border-gray-300">
            <User size={48} className="mr-4 text-gray-600" />
            <h1 className="text-2xl montserrat-bold text-gray-700">Profilim</h1>
          </div>

          <div className="space-y-4 mt-2">
            {isEditing ? (
              <div>
                <h2 className="text-xl montserrat font-semibold text-gray-700 mt-2 mb-2">
                  Profil Bilgilerini Düzenle
                </h2>
                <div className="space-y-4 ">
                  {[
                    { label: "Ad", key: "name" },
                    { label: "Soyad", key: "surname" },
                    { label: "Email", key: "email", type: "email" },
                    { label: "Telefon Numarası", key: "phoneNo" },
                    { label: "TC Kimlik", key: "identityNo",},
                  ].map(({ label, key, type = "text" }) => (
                    <div key={key} className="relative">
                      <input
                        type={type}
                        value={editForm[key]}
                        placeholder={label}
                        onChange={(e) =>
                          setEditForm({ ...editForm, [key]: e.target.value })
                        }
                        className="w-full montserrat bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
                      />
                    </div>
                  ))}

                  {/* Gender Selection */}
                  <div className="relative">
                    <select
                      value={editForm.gender}
                      onChange={(e) =>
                        setEditForm({ ...editForm, gender: e.target.value })
                      }
                      className="w-full montserrat bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
                    >
                      <option value="" hidden disabled>
                        Cinsiyet Seçin
                      </option>
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-6 space-x-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 montserrat bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
                  >
                    <X size={20} className="mr-2" /> İptal
                  </button>
                  <button
                    onClick={updateUserProfile}
                    className="flex-1 bg-gray-100 montserrat text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
                  >
                    <Save size={20} className="mr-2" /> Kaydet
                  </button>
                </div>
              </div>
            ) : (
              <div>
              
                <div className="space-y-3">
                  {[
                    { label: "Ad", value: user.name },
                    { label: "Soyad", value: user.surname },
                    { label: "Email", value: user.email },
                    { label: "Telefon Numarası", value: user.phoneNo },
                    { label: "TC Kimlik", value: user.identityNo },
                    { label: "Cinsiyet", value: user.gender },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-100 p-3 rounded-lg">
                      <span className="montserrat text-gray-500 font-medium mr-2">
                        {label}:
                      </span>
                      <span className="montserrat text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-6 space-x-4">
                  <button
                    onClick={() => (window.location.href = "/orders")}
                    className="flex-1 montserrat bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
                  >
                    <List size={20} className="mr-2" /> Siparişlerim
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 montserrat bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
                  >
                    <Edit size={20} className="mr-2" /> Profil Düzenle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Addresses Section */}
<div className="bg-white shadow-lg rounded-2xl border border-gray-300 p-6">
  <div className="bg-gray-200 text-gray-800 p-6 flex items-center justify-between border-b border-gray-300">
    <h2 className="text-xl montserrat font-semibold text-gray-700">Adreslerim</h2>
    <button
      onClick={() => {
        setEditAddress({
          label: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
        setIsAddressEditing(true);
      }}
      className="bg-gray-100 montserrat text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
    >
      <Plus size={20} className="mr-2" /> Yeni Adres
    </button>
  </div>

  {/* Address List with Scrollbar */}
  <div
    className="space-y-4 mt-4 overflow-y-auto max-h-96"
    style={{
      scrollbarWidth: "thin", // For Firefox
      scrollbarColor: "gray lightgray", // For Firefox
    }}
  >
    {user.addresses && user.addresses.length > 0 ? (
      user.addresses.map((address, index) => (
        <div
          key={index}
          className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
        >
          <div className="space-y-1">
            <div className="montserrat font-semibold text-gray-700">
              {address.label}
            </div>
            <div className="montserrat text-gray-600">{address.street}</div>
            <div className="montserrat text-gray-600">
              {address.city}, {address.state}, {address.postalCode}
            </div>
            <div className="montserrat text-gray-600">{address.country}</div>
          </div>
          <button
            onClick={() => {
              setEditAddress(address);
              setIsAddressEditing(true);
            }}
            className="bg-gray-200 montserrat text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
          >
            <Edit size={20} className="mr-2" /> Düzenle
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-500 montserrat text-center py-4">
        Kayıtlı adres bulunmamaktadır.
      </p>
    )}
  </div>
</div>
        {/* Address Form Modal */}
        <AddressForm
          isOpen={isAddressEditing}
          onClose={() => {
            setIsAddressEditing(false);
            setEditAddress({
              label: "",
              street: "",
              city: "",
              state: "",
              postalCode: "",
              country: "",
            });
          }}
          editAddress={editAddress}
          setEditAddress={setEditAddress}
          onSave={saveAddress}
          onDelete={deleteAddress}
        />
      </div>
    </div>
  );
};

export default Profile;
