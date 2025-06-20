import React from "react";

const NewsLetterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };
  return (
    <div className="text-center">
      <p className="text-4x1 montserrat-bold text-gray-800">
      Sneakster Ailesine Katıl, İlk Alışverişinde %20 İndirim Kazan!
      </p>
    
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          className="w-full sm:flex-1 outline-none bg-gray-50"
          type="email"
          placeholder="Email"
          required
        ></input>
        <button
          type="submit"
          className="bg-black montserrat-bold text-white text-xs px-10 py-4"
        >
          OLUŞTUR
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
