import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Chatbot } from "../components/Chatbot";
import { useTheme } from "../contexts/ThemeContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PlantMe - AI Plant Care Assistant" },
    { name: "description", content: "AI-powered plant disease detection and care assistant" },
  ];
}

function HomeContent() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="flex h-screen">
        {/* Left side - Welcome content with background */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background Image with Blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
              filter: 'blur(2px)',
              transform: 'scale(1.1)'
            }}
          />
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full p-8">
            <div className="max-w-2xl text-center text-white">
              <Welcome />
            </div>
          </div>
        </div>
        
        {/* Right side - Chatbot */}
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl border-l border-gray-300">
          <Chatbot className="h-full" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
