import { Shield, Sparkles, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: 'patcher' | 'architecture' | 'caps' | 'cheats';
  setActiveTab: (tab: 'patcher' | 'architecture' | 'caps' | 'cheats') => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">
                  Pokémon ROM Patcher
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  Client-Side Engine
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Zero EXP Gain & Dynamic Gym Cap Candies for clean cartridge dumps
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-medium text-zinc-600 border border-zinc-200/80">
            <button
              id="nav-tab-patcher"
              onClick={() => setActiveTab('patcher')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'patcher'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              ROM Patcher & Studio
            </button>
            <button
              id="nav-tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              Technical Options & Decomp Guide
            </button>
            <button
              id="nav-tab-caps"
              onClick={() => setActiveTab('caps')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'caps'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              Boss Level Cap Tables
            </button>
            <button
              id="nav-tab-cheats"
              onClick={() => setActiveTab('cheats')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'cheats'
                  ? 'bg-white text-zinc-900 shadow-xs font-semibold'
                  : 'hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              Action Replay Codes
            </button>
          </nav>
        </div>
      </div>
      
      {/* Privacy banner */}
      <div className="bg-zinc-50 border-t border-zinc-200/60 py-1.5 px-4 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-emerald-600 inline" />
        <span>100% In-Browser & Private. No ROM files or game copyrighted data are uploaded to any server.</span>
        <span className="text-zinc-300">•</span>
        <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-600">
          <Cpu className="w-3 h-3 text-zinc-400" />
          Supports GB, GBC, GBA (Emerald/FireRed), NDS (Platinum/HGSS), & 3DS (Ultra Sun/Moon/ORAS)
        </span>
      </div>
    </header>
  );
}
