import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import Footer from "./Footer";
import MarqueeCarousel from '../components/CarruselClientes';

const ServicioDetalle = () => {
  const { servicioId } = useParams();
  const { t } = useTranslation();

  const serviciosData = {
    "gestion-notarial-digital": {
      title: t("detallesServicios.gestion-notarial-digital.title"),
      image: digital,
      description: t("detallesServicios.gestion-notarial-digital.description"),
    },
    "compraventa-inmuebles": {
      title: t("detallesServicios.compraventa-inmuebles.title"),
      image: imagenGenerica,
      description: t("detallesServicios.compraventa-inmuebles.description"),
    },
    "constitucion-sociedades": {
      title: t("detallesServicios.constitucion-sociedades.title"),
      image: sociedades,
      description: t("detallesServicios.constitucion-sociedades.description"),
    },
    "fideicomisos": {
      title: t("detallesServicios.fideicomisos.title"),
      image: fideicomisos,
      description: t("detallesServicios.fideicomisos.description"),
    },
    "planificacion-patrimonial": {
      title: t("detallesServicios.planificacion-patrimonial.title"),
      image: patrimonio,
      description: t("detallesServicios.planificacion-patrimonial.description"),
    },
    "actas-notariales": {
      title: t("detallesServicios.actas-notariales.title"),
      image: actas,
      description: t("detallesServicios.actas-notariales.description"),
    },
    "poderes-notariales": {
      title: t("detallesServicios.poderes-notariales.title"),
      image: poderes,
      description: t("detallesServicios.poderes-notariales.description"),
    },
    "contratos-privados": {
      title: t("detallesServicios.contratos-privados.title"),
      image: contratos,
      description: t("detallesServicios.contratos-privados.description"),
    },
    "autorizaciones-permisos": {
      title: t("detallesServicios.autorizaciones-permisos.title"),
      image: autorizaciones,
      description: t("detallesServicios.autorizaciones-permisos.description"),
    },
    "certificaciones-notariales": {
      title: t("detallesServicios.certificaciones-notariales.title"),
      image: certificaciones,
      description: t("detallesServicios.certificaciones-notariales.description"),
    },
  };

  const servicio = serviciosData[servicioId];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!servicio)
    return (
      <h2 className="text-center text-gray-700 text-3xl mt-10">
        {t("servicio_detalle.servicio_no_encontrado")}
      </h2>
    );

  return (
    <div className="relative w-full min-h-screen bg-[#F5F1EB] flex flex-col items-center">
      <div className="relative w-full h-[50vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noplaybackrate"
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="/inicio.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative w-full max-w-4xl bg-[#F5F1EB] p-6 md:p-20 mt-[-80px] shadow-lg rounded-lg z-10 text-center">
        <h1 className="text-4xl font-bold mb-2">{servicio.title}</h1>
        <span className="block w-64 h-1 bg-[#D1AE85] mt-2 mx-auto mb-12"></span>
        <p className="text-lg text-gray-700 mb-12 text-justify">{servicio.description}</p>
        <img
          src={servicio.image}
          alt={servicio.title}
          className="w-full max-w-lg mx-auto rounded-lg mb-4 object-cover"
        />

        <a
          href="https://calendar.app.google/RVYL9DbfX7FAB7BB7"
          className="text-white bg-[#D1AE85] hover:bg-[#A67C52] transition font-bold py-2 px-4 rounded-lg block w-full max-w-lg mx-auto mb-4 text-center"
        >
          {t("servicio_detalle.agendar_turno")}
        </a>
        <Link
          to="/"
          className="text-[#F5F1EB] bg-[#A89E97] hover:bg-[#F5F1EB] hover:text-[#A89E97] border-2 border-[#A89E97] transition font-bold py-2 px-4 rounded-lg block w-full max-w-lg mx-auto text-center"
        >
          {t("servicio_detalle.volver_inicio")}
        </Link>
      </div>

      {/* Contenedor centrado del nuevo contenido */}
      <div className="w-full flex flex-col items-center mt-12 p-6 md:p-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{t("trust.title")}</h2>
          <span className="block w-72 h-1 bg-[#D1AE85] mt-2 mx-auto mb-6"></span>
          <p className="text-lg text-gray-700 text-justify max-w-4xl mx-auto mb-12">
            {t("trust.description")}
          </p>
        </div>
        <MarqueeCarousel />
      </div>
    </div>
  );
};

export default ServicioDetalle;
