import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: { type: String, required: true }, // Adres türü (Ev, İş, vb.)
  street: { type: String, required: true }, // Sokak adresi
  city: { type: String, required: true },   // il
  state: { type: String, required: true },   // ilçe
  postalCode: { type: String, required: true }, // Posta Kodu
  country: { type: String, required: true }, // Ülke
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phoneNo: { type: String, required: true },
    identityNo: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cartData: { type: Object, default: {} },
    addresses: { type: [addressSchema], default: [] }, // Çoklu adresler
    password: { type: String, required: true },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
