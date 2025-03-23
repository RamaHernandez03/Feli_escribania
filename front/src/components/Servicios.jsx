import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Servicios = ({ image, title, description, id }) => {
  const { t } = useTranslation();

  return (
    <div 
      className="bg-[#A89E97] ml-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-2 transition-transform duration-500 max-w-[280px] w-full h-[400px] flex flex-col"
      style={{
        maxWidth: window.innerWidth < 768 ? "230px" : "280px",
        height: window.innerWidth < 768 ? "370px" : "400px"
      }}
    >
      <img src={image} alt={title} className="w-full h-40 object-cover rounded-t-2xl" />

      <div className="p-4 flex flex-col flex-grow justify-between items-center text-center">
        <h2 className="text-[#F5F1EB] text-lg font-semibold mb-2">{title}</h2>
        <p className="text-[#F5F1EB] text-xs flex-grow">{description}</p>
        <Link 
          to={`/servicios/${id}`} 
          className="bg-[#D1AE85] text-white py-2 px-3 rounded-lg font-medium shadow-md hover:bg-[#A67C52] transition mt-3 text-sm"
        >
          {t("servicios.agendar_consulta")}
        </Link>
      </div>
    </div>
  );
};

export default Servicios;