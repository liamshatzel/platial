"use client"
import { useState } from "react";
import HeaderComponent from "./components/header";
import Sidebar from "./components/sidebar";
import MapDraw from "@/app/components/map-draw";
import GeoJSON from 'ol/format/GeoJSON.js';


export default function Home() {
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedDrawType, setSelectedDrawType] = useState<string>("Polygon");
  const [file, setFile] = useState<File | null>(null);
  const [geojson, setGeojson] = useState<any>(null);

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

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content === 'string') {
          // Try to parse as GeoJSON first
          try {
            const parsedGeojson = JSON.parse(content);
            console.log('Parsed GeoJSON:', parsedGeojson);
            setGeojson(parsedGeojson);
          } catch (jsonError) {
            console.log('Not valid JSON, might be a different format');
            console.log('File content:', content);
          }
        }
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <HeaderComponent
        onHomeClick={handleHomeClick}
        isHomeActive={isHomeActive}
        onSidebarToggle={handleSidebarToggle}
        onUpload={handleUpload}
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
          <MapDraw drawType={selectedDrawType} isHomeActive={isHomeActive} onHomeReset={handleHomeReset} geojsonData={geojson} />
        </div>
      </div>
    </div>
  )
}

