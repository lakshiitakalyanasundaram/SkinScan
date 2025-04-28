
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 md:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <img src="https://img.icons8.com/color/96/000000/dermatology.png" alt="DermaScan Logo" className="h-8 w-8 mr-2" />
              DermaScan
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced AI-powered skin disease detection and dermatology consultation platform.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <a href="#prediction" className="text-gray-400 hover:text-white transition-colors">Skin Analysis</a>
              </li>
              <li>
                <a href="#chatbot" className="text-gray-400 hover:text-white transition-colors">AI Assistant</a>
              </li>
              <li>
                <a href="#appointment" className="text-gray-400 hover:text-white transition-colors">Appointments</a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Skin Disease Detection</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Dermatologist Consultation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Treatment Plans</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Follow-up Care</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400">
                <span className="mr-2">📍</span> 
                <span>123 Health Avenue, Medical District, CA 90001</span>
              </li>
              <li className="flex items-start text-gray-400">
                <span className="mr-2">📞</span>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start text-gray-400">
                <span className="mr-2">✉️</span>
                <span>contact@dermascan.ai</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} DermaScan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
