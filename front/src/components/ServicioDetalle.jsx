import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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


const serviciosData = {
  "gestion-notarial-digital": {
    title: "Gestión Notarial Digital",
    image: digital,
    description:
      "La tecnología nos permite agilizar y simplificar trámites notariales sin perder seguridad jurídica. A través de la Plataforma creada por el Colegio de Escribanos de la Ciudad Autónoma de Buenos Aires, ofrecemos la posibilidad de gestionar documentos de forma remota, con firma digital y certificaciones electrónicas, evitando traslados innecesarios y optimizando tiempos.",
  },
  "compraventa-inmuebles": {
    title: "Compraventa de Inmuebles",
    image: imagenGenerica,
    description:
      "La compraventa de inmuebles es uno de los actos más relevantes en una Escribanía. Te brindamos un acompañamiento integral en cada etapa, asegurando que la operación se realice con total seguridad jurídica, ya sea para comprar tu primera vivienda o realizar una inversión.",
  },
  "constitucion-sociedades": {
    title: "Constitución de Sociedades",
    image: sociedades,
    description:
      "Acompañamos a emprendedores y empresas locales y extranjeras en la constitución, modificación y disolución de sociedades. Te asesoramos en la elección del tipo societario más conveniente, incluyendo S.A., S.A.S., S.R.L. y otros modelos de organización empresarial. Amplia experiencia en gestiones ante la Inspección General de Justicia y la Dirección Provincial de Personas Jurídicas de la Provincia de Buenos Aires.",
  },
  "fideicomisos": {
    title: "Fideicomisos",
    image: fideicomisos,
    description:
      "El fideicomiso es una herramienta versátil utilizada en diversos ámbitos, especialmente en el sector inmobiliario. Se emplea para la adquisición de terrenos, desarrollo de proyectos y posterior comercialización, brindando seguridad y transparencia a todas las partes involucradas.",
  },
  "planificacion-patrimonial": {
    title: "Planificación Patrimonial",
    image: patrimonio,
    description:
      "Te orientamos en la planificación de tu patrimonio, asegurando que las donaciones y testamentos se ajusten a tus deseos y necesidades familiares. Analizamos cada caso para encontrar la mejor opción legal y brindar tranquilidad a quienes más te importan.",
  },
  "actas-notariales": {
    title: "Actas Notariales",
    image: actas,
    description:
      "Las actas notariales son documentos públicos que certifican hechos presenciados por el escribano. Son fundamentales para garantizar la veracidad y autenticidad de determinadas situaciones, aportando seguridad jurídica a quien las requiera.",
  },
  "poderes-notariales": {
    title: "Poderes Notariales",
    image: poderes,
    description:
      "Un poder es un documento mediante el cual una persona (física o jurídica) autoriza a otra a actuar en su nombre. Te asesoramos en la redacción y otorgamiento de poderes generales o especiales, asegurando que se ajusten a tus necesidades.",
  },
  "contratos-privados": {
    title: "Contratos Privados",
    image: contratos,
    description:
      "Redactamos y formalizamos contratos privados para diversas situaciones, como contratos de locación, préstamos (mutuos), donaciones de dinero y contradocumentos, garantizando su validez legal.",
  },
  "autorizaciones-permisos": {
    title: "Autorizaciones y Permisos",
    image: autorizaciones,
    description:
      "Gestionamos autorizaciones para el traslado de menores dentro y fuera del país y redactamos permisos de manejo para vehículos, embarcaciones y aeronaves, permitiendo que terceros puedan conducir con la autorización legal correspondiente.",
  },
  "certificaciones-notariales": {
    title: "Certificaciones Notariales",
    image: certificaciones,
    description:
      "Realizamos certificaciones de firmas, copias y documentos, garantizando su autenticidad y validez legal. Este servicio es fundamental para trámites administrativos, comerciales y jurídicos.",
  },
};

const logosClientes = [
  { src: require("../assets/reason.png"), link: "https://www.instagram.com/reason_prod/" },
  { src: require("../assets/plant_based_food.png"), link: "https://vegabundancia.com/" },
  { src: require("../assets/thermo.png"), link: "https://thermoquality.cl/" },
  { src: require("../assets/west_mall.png"), link: "https://www.instagram.com/somoswestmall/" },
  { src: require("../assets/poolGroup.png"), link: "https://www.instagram.com/poolgroup.piscinas/" },
  { src: require("../assets/bnco.png"), link: "https://www.grupobnco.com/" },
  { src: require("../assets/apdeca.png"), link: "https://www.apdeca.org/" },
  { src: require("../assets/dakotta.png"), link: "https://www.apdeca.org/" },
  { src: require("../assets/hurling.png"), link: "https://www.instagram.com/materialesdakotta/" },
];

const ServicioDetalle = () => {
  const { servicioId } = useParams();
  const servicio = serviciosData[servicioId];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!servicio) return <h2 className="text-center text-gray-700 text-3xl mt-10">Servicio no encontrado</h2>;

  return (
    <div className="relative w-full min-h-screen bg-[#F5F1EB] flex flex-col items-center">
      <div className="relative w-full h-[50vh] overflow-hidden">
        <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover ">
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

        <a href="https://calendar.app.google/RVYL9DbfX7FAB7BB7" className="text-white bg-[#D1AE85] hover:bg-[#A67C52] transition font-bold py-2 px-4 rounded-lg block w-full max-w-lg mx-auto mb-4 text-center">
          Agendar Turno de Consulta
        </a>
        <Link to="/" className="text-[#F5F1EB] bg-[#A89E97] hover:bg-[#F5F1EB] hover:text-[#A89E97] border-2 border-[#A89E97] transition font-bold py-2 px-4 rounded-lg block w-full max-w-lg mx-auto text-center">
          Volver a la Página de Inicio
        </Link>
        <h2 className="text-3xl font-bold mt-12">Confían en nosotros</h2>
        <span className="block w-72 h-1 bg-[#D1AE85] mt-2 mx-auto mb-12"></span>
        <p className="text-lg text-gray-700 mb-12 text-justify">
          Nos enorgullece acompañar a empresas y emprendedores en su crecimiento, brindando asesoramiento notarial con profesionalismo y compromiso. A lo largo de nuestra trayectoria, hemos trabajado con distintos sectores, ofreciendo soluciones adaptadas a cada necesidad.
          Aquí compartimos algunos de los clientes que han confiado en nosotros. Cada uno de ellos es parte de nuestra historia y del valor que buscamos aportar en cada gestión.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {logosClientes.map((cliente, index) => (
            <a key={index} href={cliente.link} target="_blank" rel="noopener noreferrer">
              <img src={cliente.src} alt={`Cliente ${index + 1}`} className="w-20 h-20 rounded-full shadow-md hover:scale-105 transition-transform" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicioDetalle;
