import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Formulario = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://feli-back.onrender.com/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (result.success) {
        alert(t("form.alert.success"));
      } else {
        alert(t("form.alert.error"));
      }
    } catch (error) {
      alert(t("form.alert.connection"));
    }
  };  

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-[#F5F1EB] p-10 rounded-lg shadow-lg w-full max-w-md border-2 border-[#D1AE85]">
      <input name="nombre" type="text" placeholder={t("form.name")} value={formData.nombre} onChange={handleChange} className="p-3 rounded text-[#A89E97]" required />
      <input name="email" type="email" placeholder={t("form.email")} value={formData.email} onChange={handleChange} className="p-3 rounded text-[#A89E97]" required />
      <textarea name="mensaje" placeholder={t("form.message")} value={formData.mensaje} onChange={handleChange} className="p-3 rounded h-24 text-[#A89E97]" required />
      <button type="submit" className="p-3 rounded-lg text-[#F5F1EB] font-semibold bg-[#D1AE85] hover:bg-[#A67C52] transition">
        {t("form.send_button")}
      </button>
      <button
        type="button"
        onClick={() => window.open('https://walink.co/7db4c2', '_blank')}
        className="bg-[#F5F1EB] border-2 font-semibold border-green-500 text-green-500 p-3 rounded-lg hover:bg-green-500 hover:text-[#F5F1EB] transition"
      >
        {t("form.whatsapp_button")}
      </button>
    </form>
  );
};

export default Formulario;
