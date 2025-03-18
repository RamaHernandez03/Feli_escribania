import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import FooterMobile from "./FooterMobile";
import LogoFeli from "../assets/Logo_feli.jpg";
import LogoNegro from "../assets/logo_negro.png";

const SecondNavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    toggleMenu();
  };

  return (
    <div className={`lg:block fixed w-full px-4 py-2 z-50 transition-all duration-300 ${scroll ? "bg-[#F5F1EB] text-[#222222] shadow-lg" : "bg-transparent text-[#F5F1EB]"}`}>
      <div className="flex justify-between items-center">
        <div className="h-20 md:h-24">
          <img src={scroll ? LogoFeli : LogoNegro} alt="Logo" className="h-full transition-all duration-300" />
        </div>
        <button
          onClick={toggleMenu}
          className={`text-4xl focus:outline-none ${scroll ? "text-black" : "text-[#F5F1EB]"}`}
        >
          <FaBars />
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-[#F5F1EB] text-[#222222] flex flex-col justify-center text-center z-50">
          <button onClick={toggleMenu} className="absolute top-4 right-4 text-[#222222] text-4xl focus:outline-none">
            <FaTimes />
          </button>
          <div className="flex flex-col items-center justify-center flex-grow">
            <ul className="text-4xl space-y-8 font-bold w-full">
              {[{ name: "Inicio", id: "hero" }, { name: "Servicios", id: "cards" }, { name: "Nosotros", id: "nosotros" }, { name: "Contacto", id: "contacto" }].map((item, index) => (
                <li key={index} className="w-full">
                  <Link
                    to="/"
                    onClick={() => handleScrollToSection(item.id)}
                    className="block w-full text-center py-2 hover:bg-[#D1AE85] transition-all duration-300"
                  >
                    {item.name}
                  </Link>
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
