import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom"
import Header from "./Component/Header";
import Home from "./pages/Home";
import ProductDetail from "./pages/Productdetails";
import CartPage from "./pages/Cartpage";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [searchQuery, setSearchQuery] = useState(""); // 🔍 NEW

  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function load() {
      const p = await fetch("https://fakestoreapi.com/products").then(r => r.json());
      const c = await fetch("https://fakestoreapi.com/products/categories").then(r => r.json());
      setProducts(p);
      setCategories(["all", ...c]);
    }
    load();
  }, []);

  function addToCart(product, qty) {
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      if (exist) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...product, quantity: qty }];
    });
  }

  function updateQuantity(id, qty) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div>
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        searchQuery={searchQuery}                // 🔍 NEW
        onSearchChange={setSearchQuery}          // 🔍 NEW
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              selected={selectedCategory}
              searchQuery={searchQuery}          // 🔍 NEW
            />
          }
        />

        <Route
          path="/product/:id"
          element={<ProductDetail addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
      </Routes>
    </div>
  );
}