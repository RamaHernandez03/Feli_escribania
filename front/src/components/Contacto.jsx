import React from "react";
import { useTranslation } from "react-i18next";
import Formulario from "./Formulario";

const Contacto = () => {
  const { t } = useTranslation();

  return (
    <div id="contacto" className="flex flex-col md:flex-col lg:flex-row items-center justify-center min-h-screen bg-[#A89E97] p-6 md:p-16 text-white gap-12 relative">
      <div className="hidden lg:block absolute left-1/2 top-[15%] bottom-[15%] w-[4px] bg-[#D1AE85] transform -translate-x-1/2"></div>

      {/* Formulario */}
      <div className="w-full md:w-3/4 lg:w-1/2 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block pb-2 text-[#F5F1EB]">
          {t("contact.title")}
          <span className="block w-40 h-1 bg-[#D1AE85] mt-2 mx-auto"></span>
        </h2>
        <p className="mt-4 mb-6 text-lg text-[#F5F1EB] font-semibold">{t("contact.subtitle")}</p>
        <div className="w-full max-w-[500px] h-[400px] flex items-center justify-center">
          <Formulario />
        </div>
      </div>

      {/* Ubicación con OpenStreetMap */}
      <div className="w-full md:w-3/4 lg:w-1/2 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block pb-2 text-[#F5F1EB]">
          {t("contact.location.title")}
          <span className="block w-40 h-1 bg-[#D1AE85] mt-2 mx-auto"></span>
        </h2>
        <p className="mt-4 mb-6 text-lg text-[#F5F1EB] font-semibold">{t("contact.location.address")}</p>
        <div className="w-full max-w-[500px] h-[400px] rounded-xl overflow-hidden shadow-lg">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.958825961751!2d-58.38997022434905!3d-34.60520265757646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccb7447b91feb%3A0xd9df7afcd6d063b1!2sEscribania%20La%20Riva!5e0!3m2!1sen!2sar!4v1742339596694!5m2!1sen!2sar"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
