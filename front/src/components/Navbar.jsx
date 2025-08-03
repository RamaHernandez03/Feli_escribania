import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoFeli from "../assets/Logo_feli.jpg";
import LogoNegro from "../assets/logo_negro.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { LanguageContext } from "../locales";

const Nav = () => {
  const [scroll, setScroll] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const section = document.getElementById(hash);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location]);

  const handleNavigation = (path, id) => {
    if (id) {
      if (location.pathname === "/") {
        setTimeout(() => {
          const section = document.getElementById(id);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        navigate(path);
        setTimeout(() => {
          const section = document.getElementById(id);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 500);
      }
    } else {
      navigate(path); // Para rutas como "/formulario"
    }
  };

  const navItems = [
    { name: language === "es" ? "Inicio" : "Home", path: "/", id: "hero" },
    { name: language === "es" ? "Servicios" : "Services", path: "/", id: "cards" },
    { name: language === "es" ? "Nosotros" : "About Us", path: "/", id: "nosotros" },
    { name: language === "es" ? "Contacto" : "Contact", path: "/", id: "contacto" },
    { name: language === "es" ? "Formulario Legal" : "Legal Form", path: "/formulario", id: null }, // Nuevo ítem
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-2 md:px-8 text-lg z-50 transition-all duration-300 ${
        scroll ? "bg-[#F5F1EB] text-[#222222] shadow-lg" : "bg-transparent text-[#F5F1EB]"
      }`}
    >
      <div className={`transition-all duration-300 ${scroll ? "h-20 md:h-24" : "h-28 md:h-32"}`}>
        <img src={scroll ? LogoFeli : LogoNegro} alt="Logo" className="h-full transition-all duration-300" />
      </div>
      <ul className="flex space-x-4 md:space-x-6 font-semibold items-center">
        {navItems.map((item, index) => (
          <li key={index} className="relative cursor-pointer">
            <button
              onClick={() => handleNavigation(item.path, item.id)}
              className="after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#D1AE85] after:transition-all after:duration-300 hover:after:w-full cursor-pointer bg-transparent border-none text-inherit"
            >
              {item.name}
            </button>
          </li>
        ))}
        <li className="relative cursor-pointer">
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
