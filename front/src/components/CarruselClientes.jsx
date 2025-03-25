import React from "react";
import "./MarqueeCarousel.css";

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
