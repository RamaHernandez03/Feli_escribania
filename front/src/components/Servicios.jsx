import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Servicios = ({ image, title, description, id }) => {
  const { t } = useTranslation();

  return (
    <div 
      className="bg-[#A89E97] ml-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-2 transition-transform duration-500 max-w-[300px] w-full h-[450px] flex flex-col"
      style={{
        maxWidth: window.innerWidth < 768 ? "250px" : "300px",
        height: window.innerWidth < 768 ? "400px" : "450px"
      }}
    >
      <img src={image} alt={title} className="w-full h-44 object-cover rounded-t-2xl" />

      <div className="p-6 flex flex-col flex-grow justify-between items-center text-center">
        <h2 className="text-[#F5F1EB] text-xl font-bold mb-2">{title}</h2>
        <p className="text-[#F5F1EB] text-sm flex-grow">{description}</p>
        <Link 
          to={`/servicios/${id}`} 
          className="bg-[#D1AE85] text-white py-2 px-4 rounded-lg font-medium shadow-md hover:bg-[#A67C52] transition mt-4"
        >
          {t("servicios.agendar_consulta")}
        </Link>
      </div>
    </div>
  );
};

export default Servicios;
