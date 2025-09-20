import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";

function Home() {
  return (
    <div className="flex h-screen bg-gray-100  mb-8">
      <Navbar />
      <div className="flex flex-col flex-1 mt-20">
        <main className="flex-1 p-6 overflow-y-auto mt-16 md:mt-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;