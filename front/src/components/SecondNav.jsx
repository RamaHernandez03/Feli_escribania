import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FooterMobile from "./FooterMobile";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoFeli from "../assets/Logo_feli.jpg";
import LogoNegro from "../assets/logo_negro.png";

const SecondNavBar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path, id) => {
    if (id) {
      if (location.pathname === "/") {
        // Si ya estamos en home, solo hacer scroll
        setTimeout(() => {
          const section = document.getElementById(id);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        // Si estamos en otra página, navegar primero y luego hacer scroll
        navigate(path);
        setTimeout(() => {
          const section = document.getElementById(id);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 500);
      }
    } else {
      // Para rutas como "/formulario"
      navigate(path);
    }
    toggleMenu(); // Cerrar el menú después de la navegación
  };

  return (
    <div className={`lg:block fixed w-full px-4 py-2 z-50 transition-all duration-300 ${scroll ? "bg-[#F5F1EB] text-[#222222] shadow-lg" : "bg-transparent text-[#F5F1EB]"}`}>
      <div className="flex justify-between items-center">
        <div className="h-20 md:h-24">
          <img src={scroll ? LogoFeli : LogoNegro} alt="Logo" className="h-full transition-all duration-300" />
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <button
            onClick={toggleMenu}
            className={`text-4xl focus:outline-none ${scroll ? "text-black" : "text-[#F5F1EB]"}`}
          >
            <FaBars />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-[#F5F1EB] text-[#222222] flex flex-col justify-center text-center z-50">
          <button onClick={toggleMenu} className="absolute top-4 right-4 text-[#222222] text-4xl focus:outline-none">
            <FaTimes />
          </button>
          <div className="flex flex-col items-center justify-center flex-grow">
            <ul className="text-4xl space-y-8 font-bold w-full">
              {[
                { name: t("navbar.inicio"), id: "hero", path: "/" },
                { name: t("navbar.servicios"), id: "cards", path: "/" },
                { name: t("navbar.nosotros"), id: "nosotros", path: "/" },
                { name: t("navbar.contacto"), path: "/", id: "contacto" },
                { name: t("navbar.formulario"), id: null, path: "/formulario" },
              ].map((item, index) => (
                <li key={index} className="w-full">
                  <button
                    onClick={() => handleNavigation(item.path, item.id)}
                    className="block w-full text-center py-2 hover:bg-[#D1AE85] transition-all duration-300 bg-transparent border-none text-inherit cursor-pointer"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <FooterMobile />
        </div>
      )}
    </div>
  );
};

export default SecondNavBar;