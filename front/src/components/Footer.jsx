import React from "react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import LogoFeli from "../assets/Logo_feli.jpg"; // Asegúrate de que la ruta sea correcta

const Footer = () => {
  return (
    <footer className="bg-[#F5F1EB] text-black py-4 border-t border-gray-400 flex justify-between items-center px-8 md:px-16">
      <div className="h-16 md:h-20">
        <img src={LogoFeli} alt="Logo" className="h-full" />
      </div>
      <p className="text-sm font-semibold text-center flex-1">
        ©La Riva - Escribanos | Todos los Derechos Reservados
      </p>
      <div className="flex space-x-4">
        <a href="https://www.linkedin.com/in/felipelariva/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-[#D1AE85] transition">
          <FaLinkedin />
        </a>
        <a href="wa.link/znfrq6" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-[#D1AE85] transition">
          <FaWhatsapp />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
