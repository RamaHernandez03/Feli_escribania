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
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-8xl text-[#F5F1EB] font-semibold font-serif tracking-wide">
          {t("hero.title")}
        </h1>
        <h2 className="text-2xl sm:text-3xl font-serif md:text-5xl lg:text-5xl text-[#D1AE85] tracking-wider mt-2 sm:mt-4">
          {t("hero.subtitle")}
        </h2>
      </div>
    </div>
  );
};

export default Hero;
