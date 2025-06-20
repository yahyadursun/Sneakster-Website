import React from "react";
import { useNavigate,Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Oturum kontrolü için token kullanılıyor

  const handleOrdersClick = () => {
    if (token) {
      navigate("/orders"); // Eğer kullanıcı giriş yaptıysa, siparişler sayfasına yönlendir
    } else {
      navigate("/login"); // Eğer kullanıcı giriş yapmadıysa, login sayfasına yönlendir
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="montserrat w-full md:w-2/3 text-gray-600">
            Adımını At, Farkı Hisset! Sneakster ile Tarzını Konuştur.
          </p>
        </div>

        <div>
          <p className="montserrat text-x1 font-bold mb-5">ŞİRKET</p>
          <ul className="montserrat flex flex-col gap-1 text-gray-600">
            <li>
              <Link to="/">Ana Sayfa</Link>
            </li>
            <li>
              {/* Siparişler butonuna tıklanınca handleOrdersClick fonksiyonu çalışacak */}
              <button onClick={handleOrdersClick} className="cursor-pointer">
                Siparişler
              </button>
            </li>
            <li>Gizlilik Politikası</li>
          </ul>
        </div>
        <div>
          <p className="montserrat text-x1 font-bold mb-5">BİZE ULAŞIN</p>
          <ul className="montserrat flex flex-col gap-1 text-gray-600">
            <li>222-22-222</li>
            <li>contact@sneakster.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="montserrat-bold py-5 text-sm text-center">
          Copyright 2024@sneakster.com - Tüm Hakları Saklıdır.
        </p>
      </div>
    </div>
  );
};

export default Footer;
