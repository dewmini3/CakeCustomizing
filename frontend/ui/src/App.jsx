import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Cakes from './components/Cakes';
import Home from './components/Home';
import InsertProduct from './components/InsertProduct';
import Cart from './components/Cart';
import CustomizeItem from './components/CustomizeItem';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UpdateCakes from './components/UpdateCakes';
import UpdateForm from './components/UpdateForm';
import Footer from './components/Footer';
import Search from './components/Search';
import CakeDetails from './components/CakeDetails';
import InsertOption from './components/InsertOption';
import UpdateOption from './components/UpdateOption';
import FeedbackAdmin from './components/FeedbackAdmin/FeedbackAdminPage';
            

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cakes" element={<Cakes />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/customize" element={<CustomizeItem />} />
            <Route path="/insert_product" element={<InsertProduct />} />
            <Route path="/update" element={<UpdateCakes />} />
            <Route path="/update-form" element={<UpdateForm />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cake/:id" element={<CakeDetails />} />
            <Route path="/insert-option" element={<InsertOption />} />
            <Route path="/update-option" element={<UpdateOption />} />
            <Route path="/feedbackadmin" element={<FeedbackAdmin />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

