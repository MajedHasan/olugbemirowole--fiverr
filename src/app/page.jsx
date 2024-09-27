"use client";
// pages/landing.jsx
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("dcPortal-user");
    if (user) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("dcPortal-user");
    setIsLoggedIn(false);
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg fixed w-full z-10 transition duration-300">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">Your Brand</h1>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Image
                  src="/images/user-circle.png"
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
        <h2 className="text-6xl font-extrabold mb-4 animate-bounce">
          Transform Your Ideas Into Reality
        </h2>
        <p className="text-xl mb-6 max-w-xl">
          We provide innovative solutions to elevate your business with
          creativity and technology.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full shadow-lg hover:bg-gray-200 transition transform hover:-translate-y-1">
          Get Started
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center bg-white rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105 hover:shadow-xl">
            <h3 className="text-2xl font-semibold">Who We Are</h3>
            <p className="mt-2 text-gray-700">
              Our mission is to deliver cutting-edge solutions tailored to your
              business needs. We prioritize innovation, quality, and customer
              satisfaction.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://plus.unsplash.com/premium_photo-1682145288913-979906a9ebc8?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="About Us"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Consulting", "Marketing", "Software Development"].map(
              (service, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <h3 className="text-2xl font-semibold">{service}</h3>
                  <p className="mt-2 text-gray-600">
                    Comprehensive solutions tailored to your specific needs.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">What Our Clients Say</h2>
          <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-4 md:mb-0 transition-transform transform hover:scale-105 hover:shadow-xl">
              <p className="italic">
                "The team exceeded our expectations! Our project was delivered
                on time and on budget."
              </p>
              <p className="mt-4 font-semibold">— Client One</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-4 md:mb-0 transition-transform transform hover:scale-105 hover:shadow-xl">
              <p className="italic">
                "Professional, reliable, and innovative. We couldn't have asked
                for a better partner."
              </p>
              <p className="mt-4 font-semibold">— Client Two</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="mb-8">
            Have any questions? We'd love to hear from you.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition">
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} Your Brand. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
