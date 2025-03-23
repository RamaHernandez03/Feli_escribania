import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Servicios from "./Servicios";
import imagenGenerica from "../assets/inmobiliaria.jpg";
import digital from "../assets/digital.jpeg";
import poderes from "../assets/poderes.jpeg";
import sociedades from "../assets/sociedades.jpeg";
import fideicomisos from "../assets/fideicomisos.jpeg";
import patrimonio from "../assets/patrimonio.jpeg";
import contratos from "../assets/contratos.jpeg";
import certificaciones from "../assets/certificaciones.jpeg";
import actas from "../assets/actas.jpeg";
import autorizaciones from "../assets/autorizaciones.jpeg";

const Cards = () => {
  const { t } = useTranslation();

  const projectData = [
    { id: "gestion-notarial-digital", image: digital, title: t("cards.services.digital.title"), description: t("cards.services.digital.description") },
    { id: "compraventa-inmuebles", image: imagenGenerica, title: t("cards.services.realEstate.title"), description: t("cards.services.realEstate.description") },
    { id: "constitucion-sociedades", image: sociedades, title: t("cards.services.societies.title"), description: t("cards.services.societies.description") },
    { id: "fideicomisos", image: fideicomisos, title: t("cards.services.trusts.title"), description: t("cards.services.trusts.description") },
    { id: "planificacion-patrimonial", image: patrimonio, title: t("cards.services.estatePlanning.title"), description: t("cards.services.estatePlanning.description") },
    { id: "actas-notariales", image: actas, title: t("cards.services.notarialActs.title"), description: t("cards.services.notarialActs.description") },
    { id: "poderes-notariales", image: poderes, title: t("cards.services.powers.title"), description: t("cards.services.powers.description") },
    { id: "contratos-privados", image: contratos, title: t("cards.services.privateContracts.title"), description: t("cards.services.privateContracts.description") },
    { id: "autorizaciones-permisos", image: autorizaciones, title: t("cards.services.authorizations.title"), description: t("cards.services.authorizations.description") },
    { id: "certificaciones-notariales", image: certificaciones, title: t("cards.services.certifications.title"), description: t("cards.services.certifications.description") },
  ];  

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const gap = 16;

  useEffect(() => {
    const updateLayout = () => {
      const screenWidth = window.innerWidth;
  
      setVisibleCards(screenWidth < 768 ? 1 : 3);
  
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newCardWidth = screenWidth < 768 
          ? containerWidth  
          : (containerWidth - (gap * (visibleCards - 1))) / visibleCards;
  
        setCardWidth(newCardWidth);
      }
    };
  
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, projectData.length - visibleCards));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div id="cards" className="bg-[#F5F1EB] min-h-screen flex flex-col items-center justify-center border-4 border-b-[#D1AE85]">
      <h2 className="text-[#222222] text-4xl font-bold relative inline-block mt-6 md:mt-0 pb-2 mb-6">
        {t("cards.title")}
        <span className="absolute left-0 bottom-[-4px] w-full h-[4px] bg-[#D1AE85]"></span>
      </h2>
      <p className="text-[#222222] text-lg justify-center max-w-4xl px-8 mb-8">
        {t("cards.description")}
      </p>
      <div className="relative w-full max-w-6xl flex items-center mx-auto px-8">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={`absolute left-2 sm:left-[-60px] bg-[#D1AE85] text-white p-2 sm:p-4 rounded-full shadow-md hover:bg-[#A67C52] transition ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          ◀
        </button>
        <div className="overflow-hidden w-full py-4 min-h-[400px]" ref={containerRef}>
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
              width: `${(cardWidth + gap) * projectData.length}px`,
              justifyContent: visibleCards === 1 ? "center" : "flex-start",
            }}
          >
            {projectData.map((card, index) => (
              <div key={index} style={{ width: `${cardWidth}px`, flexShrink: 0 }} className="flex-shrink-0">
                <Servicios
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  id={card.id}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={nextSlide}
          disabled={currentIndex >= projectData.length - visibleCards}
          className={`absolute right-2 sm:right-[-60px] bg-[#D1AE85] text-white p-2 sm:p-4 rounded-full shadow-md hover:bg-[#A67C52] transition ${
            currentIndex >= projectData.length - visibleCards ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Cards;
