import React from "react";
import { useTranslation } from "react-i18next";

const Hero = ({ scrollToServicios }) => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center text-white px-4" id="hero">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        disablePictureInPicture 
        controlsList="nodownload nofullscreen noplaybackrate"
        className="absolute w-full h-full object-cover pointer-events-none"
      >
          <source src="/inicio.mp4" type="video/mp4" />
          {t("hero.unsupportedVideo")}
      </video>

      <div className="absolute inset-0 bg-[#222222] opacity-80"></div>
      <div className="z-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[#F5F1EB] font-semibold tracking-wide">
          {t("hero.title")}
        </h1>
        <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl text-[#D1AE85] tracking-wider mt-2 sm:mt-4">
          {t("hero.subtitle")}
        </h2>
      </div>
    </div>
  );
};

export default Hero;
