import React from "react";

const Hero = ({ scrollToServicios }) => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center text-white px-4" id="hero">
      <video autoPlay loop muted className="absolute w-full h-full object-cover">
        <source src="/inicio.mp4" type="video/mp4" />
        Tu navegador no soporta videos.
      </video>
      <div className="absolute inset-0 bg-[#222222] opacity-70"></div>
      <div className="z-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[#F5F1EB] font-semibold tracking-wide">
          La Riva - Escribanos
        </h1>
        <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-[#D1AE85] tracking-wider mt-2 sm:mt-4">
          Escribanía
        </h2>
        <button
          onClick={scrollToServicios}
          className="mt-6 sm:mt-8 px-6 py-3 text-sm sm:text-base font-bold bg-[#D1AE85] text-[#F5F1EB] rounded-lg hover:bg-[#A67C52] transition"
        >
          Busco asesoramiento
        </button>
      </div>
    </div>
  );
};

export default Hero;
