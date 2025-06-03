import React, { useState, useEffect } from "react";
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from "react-icons/fi";
import { BsStars, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./UsersHomePage.css";

export default function UsersHomePage() {
  const [products, setProducts] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
        // In a real app, you would fetch these from your backend
        setFeaturedCategories([
          { name: "Summer Collection", image: "/images/summer-banner.jpg" },
          { name: "New Arrivals", image: "/images/new-arrivals.jpg" },
          { name: "Limited Edition", image: "/images/limited-edition.jpg" },
        ]);

        setProducts([
          {
            id: 1,
            name: "Classic White Tee",
            price: 29.99,
            originalPrice: 39.99,
            image: "/images/white-tee.jpg",
            category: "tops",
            isNew: true,
          },
          // Add more sample products...
        ]);

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Elevate Your Style</h1>
          <p>Discover our premium collection of clothing for every occasion</p>
          <Link to="/shop" className="cta-button">
            Shop Now <BsArrowRight />
          </Link>
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="logo">
            FashionHub
          </Link>

          <div className="search-bar">
            <input type="text" placeholder="Search for products..." />
            <button>
              <FiSearch />
            </button>
          </div>

          <div className="nav-icons">
            <Link to="/wishlist">
              <FiHeart />
            </Link>
            <Link to="/cart">
              <FiShoppingCart />
            </Link>
            <Link to="/account">
              <FiUser />
            </Link>
          </div>
        </div>
      </nav>

      {/* Featured Categories */}
      <section className="featured-categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {featuredCategories.map((category, index) => (
            <Link
              to={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
              key={index}
              className="category-card"
            >
              <img src={category.image} alt={category.name} />
              <div className="category-overlay">
                <h3>{category.name}</h3>
                <button className="explore-button">Explore</button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals">
        <div className="section-header">
          <h2>
            New Arrivals <BsStars className="star-icon" />
          </h2>
          <Link to="/new-arrivals" className="view-all">
            View All
          </Link>
        </div>

        <div className="product-grid">
          {products
            .filter((p) => p.isNew)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="best-sellers">
        <div className="section-header">
          <h2>Best Sellers</h2>
          <Link to="/best-sellers" className="view-all">
            View All
          </Link>
        </div>

        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="special-offer">
        <div className="offer-content">
          <h2>Summer Sale - Up to 50% Off</h2>
          <p>Limited time offer on selected items</p>
          <Link to="/summer-sale" className="cta-button">
            Shop the Sale
          </Link>
        </div>
      </section>
    </div>
  );
}

// Product Card Component
const ProductCard = ({ product }) => {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          <img src={product.image} alt={product.name} />
          {product.isNew && <span className="new-badge">New</span>}
          {discount > 0 && <span className="discount-badge">-{discount}%</span>}
          <button className="quick-view">Quick View</button>
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <div className="price">
            {product.originalPrice && (
              <span className="original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="current-price">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

// export default HomePage;
