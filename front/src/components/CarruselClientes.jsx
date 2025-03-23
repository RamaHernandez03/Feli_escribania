import React from "react";
import { useTranslation } from "react-i18next";
import reason from "../assets/reason.png";
import plantBasedFood from "../assets/plant_based_food.png";
import thermo from "../assets/thermo.png";
import westMall from "../assets/west_mall.png";
import poolGroup from "../assets/poolGroup.png";
import bnco from "../assets/bnco.png";
import apdeca from "../assets/apdeca.png";
import dakotta from "../assets/dakotta.png";
import hurling from "../assets/hurling.png";
import purafrutta from "../assets/purafrutta.svg";

const logosClientes = [
  { src: reason, link: "https://www.instagram.com/reason_prod/" },
  { src: purafrutta, link: "https://purafrutta.com/" },
  { src: plantBasedFood, link: "https://vegabundancia.com/" },
  { src: thermo, link: "https://thermoquality.cl/" },
  { src: westMall, link: "https://www.instagram.com/somoswestmall/" },
  { src: poolGroup, link: "https://www.instagram.com/poolgroup.piscinas/" },
  { src: bnco, link: "https://www.grupobnco.com/" },
  { src: apdeca, link: "https://www.apdeca.org/" },
  { src: dakotta, link: "https://www.apdeca.org/" },
  { src: hurling, link: "https://www.instagram.com/materialesdakotta/" },
];

const CarruselClientes = () => {
    const { t } = useTranslation();
  
    return (
      <section className="bg-[#F5F1EB] text-[#222222] py-8 overflow-hidden">
        {/* Título con subrayado */}
        <div className="relative w-fit mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold relative inline-block pb-2 mb-6 text-center">
            {t("clientes.titulo")}
            <span className="absolute left-0 bottom-[-4px] w-full h-[4px] bg-[#D1AE85]"></span>
          </h2>
        </div>
  
        {/* Subtítulo */}
        <p className="text-justify text-base sm:text-lg font-extralight leading-6 sm:leading-8 px-4 sm:px-8 max-w-screen-md mx-auto">
          {t("clientes.subtitulo")}
        </p>
  
        {/* Contenedor del carrusel */}
        <div className="relative w-full overflow-hidden py-8">
          <div className="flex w-[200%] sm:w-[150%] animate-scroll space-x-6 sm:space-x-8 flex-nowrap hover:[animation-play-state:paused]">
            {[...logosClientes, ...logosClientes].map((cliente, index) => (
              <a key={index} href={cliente.link} target="_blank" rel="noopener noreferrer">
                <img 
                  src={cliente.src} 
                  alt={`Cliente ${index + 1}`} 
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-full shadow-md hover:scale-105 transition-transform flex-shrink-0"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  };
  

export default CarruselClientes;
