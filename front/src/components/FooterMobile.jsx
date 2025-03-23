import React from "react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LogoFeli from "../assets/Logo_feli.jpg"; // Asegúrate de que la ruta sea correcta

const FooterMobile = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#F5F1EB] text-black py-4 border-t border-gray-400 flex flex-col items-center px-4">
      <div className="h-16 mb-2">
        <img src={LogoFeli} alt="Logo" className="h-full" />
      </div>
      <div className="flex space-x-4 mb-2 mt-1">
        <a href="https://www.linkedin.com/in/felipelariva/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-[#D1AE85] transition">
          <FaLinkedin />
        </a>
        <a href="https://walink.co/7db4c2" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-[#D1AE85] transition">
          <FaWhatsapp />
        </a>
      </div>
      <p className="text-sm font-semibold text-center mt-1">
        {t("footer.rights")}
      </p>
    </footer>
  );
};

export default FooterMobile;
