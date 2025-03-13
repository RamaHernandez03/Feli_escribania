import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

const CardsTablet = () => {
  const projectData = [
    { id: "gestion-notarial-digital", image: digital, title: "Gestión Notarial Digital", description: "Trámites notariales con firma digital y certificaciones electrónicas, sin traslados." },
    { id: "compraventa-inmuebles", image: imagenGenerica, title: "Compraventa de Inmuebles", description: "Acompañamiento integral en la compra y venta de propiedades con seguridad jurídica." },
    { id: "constitucion-sociedades", image: sociedades, title: "Constitución de Sociedades", description: "Asesoramiento en la creación y modificación de sociedades como S.A., S.A.S. y S.R.L." },
    { id: "fideicomisos", image: fideicomisos, title: "Fideicomisos", description: "Soluciones legales para adquisición de terrenos y desarrollo de proyectos inmobiliarios." },
    { id: "planificacion-patrimonial", image: patrimonio, title: "Planificación Patrimonial", description: "Asesoría en donaciones y testamentos para garantizar seguridad y tranquilidad." },
    { id: "actas-notariales", image: actas, title: "Actas Notariales", description: "Certificación legal de hechos para resguardar derechos e intereses." },
    { id: "poderes-notariales", image: poderes, title: "Poderes Notariales", description: "Redacción de poderes generales o especiales ajustados a cada necesidad." },
    { id: "contratos-privados", image: contratos, title: "Contratos Privados", description: "Formalización de contratos de locación, préstamos y otros acuerdos con validez legal." },
    { id: "autorizaciones-permisos", image: autorizaciones, title: "Autorizaciones y Permisos", description: "Gestión de autorizaciones de viaje y permisos de conducción de vehículos y embarcaciones." },
    { id: "certificaciones-notariales", image: certificaciones, title: "Certificaciones Notariales", description: "Certificación de firmas y documentos con autenticidad y validez legal." },
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
        Servicios
        <span className="block w-40 md:w-64 h-1 mt-1 bg-[#D1AE85] mx-auto"></span>
      </h2>
      <p className="text-[#222222] text-lg text-justify max-w-4xl px-6 md:px-12 mb-8">
        Brindamos un servicio notarial de excelencia, combinando profesionalismo y calidez humana. Sabemos que detrás de cada trámite hay sueños y decisiones importantes. Por eso, acompañamos a personas y empresas con asesoramiento personalizado y contención, garantizando procesos claros, seguros y confiables.
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
