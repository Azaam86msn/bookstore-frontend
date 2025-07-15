import React from 'react'

import { FaFacebook, FaInstagram, FaTwitter ,FaGithub } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      {/* Top Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Side - Logo and Nav */}
        <div className="w-full">
         
          <ul className="flex flex-col md:flex-row gap-80">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li><a href="https://www.instagram.com/woodlandpublishinglk/" className="hover:text-primary">Services</a></li>
            <li><a href="https://www.instagram.com/woodlandpublishinglk/" className="hover:text-primary">About Us</a></li>
            <li><a href="https://www.instagram.com/woodlandpublishinglk/" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>

        {/* Right Side - Newsletter */}

      </div>

      {/* Bottom Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-10 border-t border-gray-700 pt-6">
        <div className="flex gap-80">
          <a href="https://www.facebook.com/ma.adhilahamed" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaFacebook size={30} />
          </a>
          <a href="https://www.instagram.com/heartaphobic/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaTwitter size={30} />
          </a>
          <a href="https://www.instagram.com/woodlandpublishinglk/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaInstagram size={30} />
          </a>
          <a href="https://github.com/AadhilAnsar" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaGithub size={30} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer