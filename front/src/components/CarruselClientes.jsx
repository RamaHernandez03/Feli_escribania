import React from "react";
import "./MarqueeCarousel.css";

import reason from "../assets/reason.png";
import plantBasedFood from "../assets/plant_based_food.png";
import thermo from "../assets/thermo.png";
import westMall from "../assets/west_mall.png";
import poolGroup from "../assets/poolGroup.png";
import bcno from "../assets/bcno.avif";
import apdeca from "../assets/apdeca.png";
import dakotta from "../assets/dakotta.png";
import hurling from "../assets/hurling.png";
import purafrutta from "../assets/purafrutta.svg";
import marrac from "../assets/marrac.avif";
import pronto from "../assets/pronto.png";
import golf from "../assets/golf.png";
import pirca from "../assets/pirca.png";
import cruzando from "../assets/cruzando.png";
import proyectoabismal from "../assets/proyectoabismal.png";

/*

const logosClientes = [
  { src: reason, link: "https://www.instagram.com/reason_prod/" },
  { src: purafrutta, link: "https://purafrutta.com/" },
  { src: plantBasedFood, link: "https://vegabundancia.com/" },
  { src: thermo, link: "https://thermoquality.cl/" },
  { src: westMall, link: "https://www.instagram.com/somoswestmall/" },
  { src: poolGroup, link: "https://www.instagram.com/poolgroup.piscinas/" },
  { src: bcno, link: "https://www.grupobnco.com/" },
  { src: apdeca, link: "https://www.apdeca.org/" },
  { src: dakotta, link: "https://www.apdeca.org/" },
  { src: hurling, link: "https://www.instagram.com/materialesdakotta/" },
  { src: marrac, link: "https://www.marrac-srl.com/" },
  { src: pronto, link: "https://prontoelectrica.com.ar/" },
  { src: golf, link: "https://www.instagram.com/oxigenogolfexperience/" },
  { src: proyectoabismal, link: "https://www.instagram.com/proyectoabismal/" },
  { src: pirca, link: "https://pircaproducciones.com/" },
  { src: cruzando, link: "https://www.cruzandoelcharco.com.ar/" },

];

*/

const logosClientes = [
  { src: reason, link: "https://www.instagram.com/reason_prod/" },
  { src: purafrutta, link: "https://purafrutta.com/" },
  { src: plantBasedFood, link: "https://vegabundancia.com/" },
  { src: thermo, link: "https://thermoquality.cl/" },
  { src: westMall, link: "https://www.instagram.com/somoswestmall/" },
  { src: poolGroup, link: "https://www.instagram.com/poolgroup.piscinas/" },
  { src: apdeca, link: "https://www.apdeca.org/" },
  { src: dakotta, link: "https://www.apdeca.org/" },
  { src: hurling, link: "https://www.instagram.com/materialesdakotta/" },
  { src: golf, link: "https://www.instagram.com/oxigenogolfexperience/" },
  { src: proyectoabismal, link: "https://www.instagram.com/proyectoabismal/" },
  { src: pirca, link: "https://pircaproducciones.com/" },
  { src: pronto, link: "https://prontoelectrica.com.ar/" },
  { src: marrac, link: "https://www.marrac-srl.com/" },
  { src: cruzando, link: "https://www.cruzandoelcharco.com.ar/" },
  { src: bcno, link: "https://www.grupobnco.com/" },

];

const MarqueeCarousel = () => {
  return (
    <div className="marquee-container">
      <div className="marquee-content slow-marquee">
        {[...logosClientes, ...logosClientes].map((logo, index) => (
          <a key={index} href={logo.link} target="_blank" rel="noopener noreferrer">
            <img 
              src={logo.src} 
              alt={`Cliente ${index + 1}`} 
              className="w-24 h-24 rounded-full shadow-md hover:scale-105 transition-transform" 
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default MarqueeCarousel;
