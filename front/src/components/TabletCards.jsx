import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Servicios from "./Servicios";
import poderes from "../assets/poderes.jpeg";
import fideicomisos from "../assets/fideicomisos.jpeg";
import patrimonio from "../assets/patrimonio.jpeg";
import contratos from "../assets/contratos.jpeg";
import lawyer from "../assets/lawyer.jpeg";
import actas from "../assets/actas.jpeg";
import autorizaciones from "../assets/autorizaciones.jpeg";
import imagenGenerica from "../assets/bsas1.jpeg";

const CardsTablet = () => {
  const { t } = useTranslation();

  const projectData = [
    { id: "gestion-notarial-digital", image: poderes, title: t("cards.services.digital.title"), description: t("cards.services.digital.description") },
    { id: "compraventa-inmuebles", image: imagenGenerica, title: t("cards.services.realEstate.title"), description: t("cards.services.realEstate.description") },
    { id: "constitucion-sociedades", image: fideicomisos, title: t("cards.services.societies.title"), description: t("cards.services.societies.description") },
    { id: "planificacion-patrimonial", image: patrimonio, title: t("cards.services.estatePlanning.title"), description: t("cards.services.estatePlanning.description") },
    { id: "actas-notariales", image: actas, title: t("cards.services.notarialActs.title"), description: t("cards.services.notarialActs.description") },
    { id: "poderes-notariales", image: lawyer, title: t("cards.services.powers.title"), description: t("cards.services.powers.description") },
    { id: "contratos-privados", image: contratos, title: t("cards.services.privateContracts.title"), description: t("cards.services.privateContracts.description") },
    { id: "autorizaciones-permisos", image: autorizaciones, title: t("cards.services.authorizations.title"), description: t("cards.services.authorizations.description") },
  ];  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const containerRef = useRef(null);

  const cardWidth = 280;
  const gap = 16;
  const step = cardWidth + gap;

  useEffect(() => {
    const updateMaxIndex = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const visibleCards = Math.floor(containerWidth / step);
        setMaxIndex(Math.max(0, projectData.length - visibleCards));
      }
    };

    updateMaxIndex();
    window.addEventListener("resize", updateMaxIndex);
    return () => window.removeEventListener("resize", updateMaxIndex);
  }, [projectData.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div id="cards" className="bg-[#F5F1EB] min-h-screen flex flex-col items-center justify-center border-4 border-b-[#D1AE85]">
      <h2 className="text-[#222222] text-4xl font-bold relative inline-block pb-2 mb-6 text-center">
        {t("cards.title")}
        <span className="block w-40 md:w-64 h-1 mt-1 bg-[#D1AE85] mx-auto"></span>
      </h2>
      <p className="text-[#222222] text-lg text-justify max-w-4xl px-6 md:px-12 mb-8">
        {t("cards.description")}
      </p>
      <div ref={containerRef} className="relative w-full max-w-5xl flex items-center mx-auto px-12">
        <button
          onClick={prevSlide}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-[#D1AE85] text-white p-3 rounded-full shadow-md transition ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#A67C52]"
          } hidden md:flex`}
          disabled={currentIndex === 0}
        >
          ◀
        </button>

        <div className="overflow-hidden w-full py-4 min-h-[400px]">
          <motion.div
            className="flex gap-4"
            animate={{
              x: -currentIndex * step,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            style={{
              width: `${(cardWidth + gap) * projectData.length}px`,
              justifyContent: "flex-start",
            }}
          >
            {projectData.map((card, index) => (
              <motion.div
                key={index}
                style={{ width: `${cardWidth}px`, flexShrink: 0 }}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
              >
                <Servicios image={card.image} title={card.title} description={card.description} id={card.id} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <button
          onClick={nextSlide}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-[#D1AE85] text-white p-3 rounded-full shadow-md transition ${
            currentIndex === maxIndex ? "opacity-50 cursor-not-allowed" : "hover:bg-[#A67C52]"
          } hidden md:flex`}
          disabled={currentIndex === maxIndex}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default CardsTablet;
