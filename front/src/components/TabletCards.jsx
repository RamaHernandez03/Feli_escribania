import React, { useState, useRef, useEffect } from "react";
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
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [isTablet, setIsTablet] = useState(false);
  const gap = 30;

  useEffect(() => {
    const updateLayout = () => {
      const screenWidth = window.innerWidth;
      setIsTablet(screenWidth >= 768 && screenWidth < 1273);
      
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newCardWidth = (containerWidth - gap) / 2;
        setCardWidth(newCardWidth);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  if (!isTablet) return null;

  const maxIndex = Math.max(0, projectData.length - 2);

  return (
    <div id="cards-tablet" className="bg-[#F5F1EB] min-h-screen flex flex-col items-center justify-center border-4 border-b-[#D1AE85]">
      <h2 className="text-[#222222] text-4xl font-bold pb-2 mb-6">
        Servicios
        <span className="block w-full h-[4px] bg-[#D1AE85] mt-1"></span>
      </h2>
      <p className="text-[#222222] text-lg text-justify max-w-4xl px-8 mb-8">
        Brindamos un servicio notarial de excelencia, combinando profesionalismo y calidez humana. Sabemos que detrás de cada trámite hay sueños y decisiones importantes. Por eso, acompañamos a personas y empresas con asesoramiento personalizado y contención, garantizando procesos claros, seguros y confiables.
      </p>
      <div className="w-full max-w-5xl flex items-center justify-between mx-auto">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          className={`bg-[#D1AE85] text-white p-3 sm:p-4 rounded-full shadow-md hover:bg-[#A67C52] transition ${
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          ◀
        </button>
        <div className="overflow-hidden w-full py-4 min-h-[400px]" ref={containerRef}>
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex * (cardWidth + gap)}px + 15px))`,
              width: `${(cardWidth * projectData.length) + (gap * (projectData.length - 1))}px`,
            }}
          >
            {projectData.map((card, index) => (
              <div key={index} style={{ width: `${cardWidth}px`, flexShrink: 0 }}>
                <Servicios image={card.image} title={card.title} description={card.description} id={card.id} />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, projectData.length - 2))}
          disabled={currentIndex >= projectData.length - 2}
          className={`bg-[#D1AE85] text-white p-3 sm:p-4 rounded-full shadow-md hover:bg-[#A67C52] transition ${
            currentIndex >= projectData.length - 2 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default CardsTablet;
