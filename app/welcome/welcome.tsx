export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-12 min-h-0">
        <header className="flex flex-col items-center gap-8">
          {/* PlantMe Title with Gradient and Cursor Effect */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <h1 className="text-7xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent plantme-gradient plantme-text-glow">
                PlantMe
              </h1>
              {/* Enhanced Animated Cursor */}
              <div className="absolute -right-3 top-0 w-2 h-20 bg-gradient-to-b from-emerald-400 to-green-500 plantme-cursor rounded-full shadow-lg shadow-emerald-400/50"></div>
            </div>
            
            <p className="text-xl text-white/95 text-center max-w-md font-medium tracking-wide plantme-hover-scale">
              Your AI-powered plant care assistant
            </p>
          </div>
        </header>
        
        <div className="max-w-[450px] w-full space-y-6 px-4">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-md border border-emerald-300/30 p-8 space-y-6 shadow-2xl shadow-emerald-500/10 plantme-hover-scale">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent mb-3 plantme-text-glow">
                🌱 Plant Disease Detection
              </h2>
              <p className="text-white/90 leading-relaxed font-medium">
                Upload photos of your plants to get instant AI-powered disease diagnosis and care recommendations.
              </p>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4 text-white/95 group hover:text-emerald-200 transition-colors duration-300 plantme-hover-scale">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50 group-hover:scale-110 transition-transform duration-300 plantme-glow"></div>
                <span className="font-medium">Instant disease identification</span>
              </div>
              <div className="flex items-center gap-4 text-white/95 group hover:text-emerald-200 transition-colors duration-300 plantme-hover-scale">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50 group-hover:scale-110 transition-transform duration-300 plantme-glow"></div>
                <span className="font-medium">Treatment recommendations</span>
              </div>
              <div className="flex items-center gap-4 text-white/95 group hover:text-emerald-200 transition-colors duration-300 plantme-hover-scale">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50 group-hover:scale-110 transition-transform duration-300 plantme-glow"></div>
                <span className="font-medium">Prevention tips</span>
              </div>
              <div className="flex items-center gap-4 text-white/95 group hover:text-emerald-200 transition-colors duration-300 plantme-hover-scale">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50 group-hover:scale-110 transition-transform duration-300 plantme-glow"></div>
                <span className="font-medium">24/7 plant care support</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Login and Sign Up Buttons */}
        <div className="max-w-[400px] w-full px-4">
          <div className="flex flex-col space-y-4">
            <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 plantme-hover-scale">
              Sign Up
            </button>
            <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 plantme-hover-scale">
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

