import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const slides = [
    {
      title: "Feel the joy of every cake crumb with Chara cakes.",
      subtitle: "Your dream cakes made real",
      image: "/images/hero-cake.jpg"
    },
    {
      title: "Crafted with love, baked to perfection",
      subtitle: "Experience the magic of handmade cakes",
      image: "/images/black-forest.jpg"
    },
    {
      title: "Custom cakes for special moments",
      subtitle: "Make your celebration unforgettable",
      image: "/images/caramel-cake.jpg"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`hero-content ${index === currentSlide ? 'active' : ''}`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              <div className="hero-text">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to="/order" className="order-button">
                  Order Now
                </Link>
              </div>
              <div className="hero-image">
                <img src={slide.image} alt="Delicious cake" />
              </div>
            </div>
          ))}
          <div className="slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cakes Section */}
      <section className="cakes-section">
        <h2>Popular Cakes</h2>
        <div className="cakes-grid">
          <div className="cake-card">
            <img src="/images/black-forest.jpg" alt="Black Forest Gateau" />
            <h3>Black Forest Gateau</h3>
          </div>
          <div className="cake-card">
            <img src="/images/caramel-cake.jpg" alt="Caramel Cake" />
            <h3>Caramel Cake</h3>
          </div>
        </div>
      </section>

      {/* Signature Cakes Section */}
      <section className="cakes-section">
        <h2>Signature Cakes</h2>
        <div className="cakes-grid">
          <div className="cake-card">
            <img src="/images/choco-shock.jpg" alt="Choco Shock Cake" />
            <h3>Choco Shock Cake</h3>
          </div>
          <div className="cake-card">
            <img src="/images/birthday-rose.jpg" alt="Birthday Rose" />
            <h3>Birthday Rose</h3>
          </div>
        </div>
      </section>

      {/* Customize Section */}
      <section className="customize-section">
        <Link to="/customize" className="customize-button">
          Customize Your Cake
        </Link>
      </section>
    </div>
  );
};

export default Home;
