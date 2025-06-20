import React, { useState } from "react";
import { X, Save, Trash2 } from "lucide-react";
import citiesAndDistricts from "./citiesAndDistricts.jsx"; // citiesAndDistricts.js dosyasını import et

const AddressForm = ({
  isOpen,
  onClose,
  editAddress,
  setEditAddress,
  onSave,
  onDelete,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const countries = ["Türkiye"];

  const cities = Object.keys(citiesAndDistricts); // Şehirler için citiesAndDistricts'ten alınan veriler

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl montserrat font-semibold text-gray-700 mb-4">
          {editAddress.id ? "Adresi Düzenle" : "Adresi Düzenle"}
        </h3>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={editAddress.label || ""}
              onChange={(e) =>
                setEditAddress({ ...editAddress, label: e.target.value })
              }
              placeholder="Adres Etiketi (Ev, İş, vb.)"
              className="w-full montserrat bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              value={editAddress.street || ""}
              onChange={(e) =>
                setEditAddress({ ...editAddress, street: e.target.value })
              }
              placeholder="Sokak Adresi"
              className="w-full montserrat  bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />
          </div>
          
          {/* Şehir Seçimi */}
          <div>
            <select
              value={editAddress.city || ""}
              onChange={(e) => {
                const selectedCity = e.target.value;
                setEditAddress({
                  ...editAddress,
                  city: selectedCity,
                  state: "", // Şehir değişince ilçe sıfırlanır
                });
              }}
              className="w-full montserrat bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none appearance-none"
            >
              <option value="" disabled>
                Şehir Seçiniz
              </option>
              {cities.map((city, index) => (
                <option key={index} value={city} className="border-none">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* İlçe Seçimi */}
          <div>
            <select
              value={editAddress.state || ""}
              onChange={(e) =>
                setEditAddress({ ...editAddress, state: e.target.value })
              }
              className="w-full montserrat bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none appearance-none"
              disabled={!editAddress.city}
            >
              <option value="" disabled>
                İlçe Seçiniz
              </option>
              {citiesAndDistricts[editAddress.city]?.map((district, index) => (
                <option key={index} value={district} className="border-none">
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={editAddress.postalCode || ""}
              onChange={(e) =>
                setEditAddress({ ...editAddress, postalCode: e.target.value })
              }
              placeholder="Posta Kodu"
              className="w-full bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none"
            />

            {/* Ülke Seçimi */}
            <select
              value={editAddress.country || ""}
              onChange={(e) =>
                setEditAddress({ ...editAddress, country: e.target.value })
              }
              className="w-full montserrat bg-gray-100 text-gray-700 border-b-2 border-gray-300 focus:border-gray-500 px-2 py-2 transition-colors duration-300 outline-none appearance-none"
            >
              <option value="" disabled>
                Ülke Seçiniz
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country} className="border-none">
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="montserrat bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
            >
              <X size={20} className="montserrat mr-2" /> İptal
            </button>
            {editAddress.label && (
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="bg-red-100 montserrat text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-300 flex items-center justify-center"
              >
                <Trash2 size={20} className="montserrat mr-2" /> Sil
              </button>
            )}
          </div>
          <button
            onClick={onSave}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
          >
            <Save size={20} className="mr-2" /> Kaydet
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h4 className="montserrat text-lg font-semibold text-gray-700 mb-4">
                Adresi Sil
              </h4>
              <p className="montserrat text-gray-600 mb-6">
                Bu adresi silmek istediğinizden emin misiniz?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="montserrat px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    onDelete(editAddress.label);
                    setIsDeleteConfirmOpen(false);
                  }}
                  className="montserrat px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
