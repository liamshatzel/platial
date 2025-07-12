"use client"
import { useState } from "react";
import HeaderComponent from "./components/header";
import Sidebar from "./components/sidebar";
import MapDraw from "@/app/components/map-draw";

export default function Home() {
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedDrawType, setSelectedDrawType] = useState<string>("Polygon");

  const handleHomeClick = () => {
    setIsHomeActive(!isHomeActive);
    console.log("Home state changed to:", !isHomeActive);
  };

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleDrawTypeChange = (type: string) => {
    setSelectedDrawType(type);
  };

  const handleHomeReset = () => {
    setIsHomeActive(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <HeaderComponent
        onHomeClick={handleHomeClick}
        isHomeActive={isHomeActive}
        onSidebarToggle={handleSidebarToggle}
      />
      <div className="flex flex-row h-full">
        <Sidebar
          isVisible={isSidebarVisible}
          onToggle={handleSidebarToggle}
          selectedDrawType={selectedDrawType}
          onDrawTypeChange={handleDrawTypeChange}
        />
        <div className={`flex flex-col items-center justify-center h-full transition-all duration-300 ease-in-out ${isSidebarVisible ? 'w-[calc(100%-20rem)]' : 'w-full'
          }`}>
          <MapDraw drawType={selectedDrawType} isHomeActive={isHomeActive} onHomeReset={handleHomeReset} />
        </div>
      </div>
    </div>
  )
}

