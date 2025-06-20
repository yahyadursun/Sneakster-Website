import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [identityNo, setIdentityNo] = useState("");
  const [gender, setGender] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Şifre görünürlüğü

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email ve şifre gerekli. Lütfen her iki alanı da doldurun.");
      return;
    }

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          surname,
          email,
          password,
          phoneNo,
          identityNo,
          gender,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Başarıyla kaydoldunuz.");
        } else if (response.data.message === "user already exists") {
          toast.error("Böyle bir kullanıcı zaten mevcut.");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Giriş başarılı!");
        } else if (response.data.message === "User not found") {
          toast.error("Böyle bir kullanıcı bulunamadı.");
        } else if (response.data.message === "Incorrect password") {
          toast.error("Hatalı şifre. Lütfen tekrar deneyin.");
        } else {
          toast.error("Hatalı email veya şifre.");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  // Form geçişinde alanları temizle
  useEffect(() => {
    if (currentState === "Sign Up") {
      setEmail("");
      setPassword("");
    }
  }, [currentState]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-md mx-auto gap-6 mt-14 text-black"
    >
      <div className="inline-flex items-center gap-2 mb-6">
        <p className="prata-regular text-3xl font-semibold">{currentState}</p>
        <hr className="border-none h-[2px] w-10 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <input
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");
              setName(value);
            }}
            value={name}
            type="text"
            className="input-field"
            placeholder="Ad"
            required
          />
          <input
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ\s]/g, "");
              setSurname(value);
            }}
            value={surname}
            type="text"
            className="input-field"
            placeholder="Soyad"
            required
          />
          <input
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setPhoneNo(value);
            }}
            value={phoneNo}
            type="tel"
            className="input-field"
            placeholder="Telefon Numarası"
            maxLength="11"
            required
          />
          <input
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              setIdentityNo(value);
            }}
            value={identityNo}
            type="text"
            className="input-field"
            placeholder="TC Kimlik Numarası"
            maxLength="11"
            required
          />
          <select
            onChange={(e) => setGender(e.target.value)}
            value={gender}
            className="input-field"
            required
          >
            <option value="" disabled>
              Cinsiyet
            </option>
            <option value="Erkek">Erkek</option>
            <option value="Kadın">Kadın</option>
          </select>
        </div>
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="input-field"
        placeholder="Email"
        required
      />
      <div className="relative w-full">
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type={isPasswordVisible ? "text" : "password"}
          className="input-field pr-10"
          placeholder="Şifre"
          maxLength="30"
          required
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
          className="absolute right-2 top-2"
        >
          <img
            src={assets.visible}
            alt={isPasswordVisible ? "Şifreyi Gizle" : "Şifreyi Göster"}
            className="w-6 h-6"
          />  
        </button>
      </div>

      <div className="flex justify-between text-sm w-full mt-2">
        <p className="cursor-pointer hover:underline">Şifremi unuttum</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer hover:underline"
          >
            Hesap Oluştur
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer hover:underline"
          >
            Giriş Yap
          </p>
        )}
      </div>

      <button className="bg-black text-white font-medium px-8 py-2 rounded-md hover:bg-gray-800 mt-4 transition">
        {currentState === "Login" ? "Giriş Yap" : "Hesap Oluştur"}
      </button>
    </form>
  );
};

export default Login;
