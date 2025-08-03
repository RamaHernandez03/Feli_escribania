import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./locales"; 
import Hero from "./components/Hero";
import Nav from "./components/Navbar";
import SecondNavBar from "./components/SecondNav";
import Cards from "./components/Cards";
import CardsTablet from "./components/TabletCards";
import Nosotros from "./components/Nosotros";
import Contacto from "./components/Contacto";
import Footer from "./components/Footer";
import FooterMobile from "./components/FooterMobile";
import ServicioDetalle from "./components/ServicioDetalle";
import UIFLegalForm from "./components/UIFLegalForm";
import "./i18n";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1273);
  const serviciosRef = useRef(null);

  const scrollToServicios = () => {
    serviciosRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width >= 768 && width < 1273);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <LanguageProvider>
      <Router>
        {isMobile ? <SecondNavBar /> : <Nav />}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero scrollToServicios={scrollToServicios} />
                <div ref={serviciosRef}>
                  {isTablet ? <CardsTablet /> : <Cards />}
                </div>
                <Nosotros />
                <Contacto />
                {isMobile ? <FooterMobile imgSize="large" /> : <Footer />}
              </>
            }
          />
          <Route path="/servicios/:servicioId" element={<ServicioDetalle />} />
          <Route path="/formulario" element={<UIFLegalForm />} /> {/* Nueva ruta del formulario */}
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
