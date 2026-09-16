import { useState, useMemo } from 'react';
import { POKEMON_GAMES } from './data/pokemonGames';
import { GameDefinition, PatchConfig, RomHeaderInfo } from './types';
import { applyPatches } from './utils/patchEngine';
import { Header } from './components/Header';
import { RomDropzone } from './components/RomDropzone';
import { PatchConfigurator } from './components/PatchConfigurator';
import { LevelCapEditor } from './components/LevelCapEditor';
import { HexDiffViewer } from './components/HexDiffViewer';
import { PatchDownload } from './components/PatchDownload';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { CheatsTab } from './components/CheatsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<'patcher' | 'architecture' | 'caps' | 'cheats'>('patcher');
  const [selectedGame, setSelectedGame] = useState<GameDefinition>(POKEMON_GAMES[0]); // FireRed default
  const [romInfo, setRomInfo] = useState<RomHeaderInfo | null>(null);
  const [rawBytes, setRawBytes] = useState<Uint8Array | null>(null);

  const [patchConfig, setPatchConfig] = useState<PatchConfig>({
    expMode: 'zero_exp',
    candyMode: 'respect_cap',
    giveInfiniteCandies: true,
    capCandyStopAtNewMove: true,
    capCandyFailIfAtCap: true,
    enableRepellant: true,
    enablePortaHeal: true,
    activeCapPreset: 'vanilla',
    customCaps: {}
  });

  const handleRomLoaded = (info: RomHeaderInfo, bytes: Uint8Array) => {
    setRomInfo(info);
    setRawBytes(bytes);
  };

  const handleSelectGame = (game: GameDefinition) => {
    setSelectedGame(game);
    // If no real file loaded or switching profile, reset custom caps to new game defaults
    setPatchConfig((prev) => ({
      ...prev,
      customCaps: {}
    }));
  };

  // Prepare source data for patching (either loaded ROM or fallback template buffer)
  const sourceBytes = useMemo(() => {
    if (rawBytes) return rawBytes;
    // Create an empty fallback buffer for initial UI demonstration
    const size = selectedGame.expectedSize;
    const buf = new Uint8Array(size);
    if (selectedGame.platform === 'GBA') {
      buf[0xb2] = 0x96;
      for (let i = 0; i < 4; i++) {
        buf[0xac + i] = selectedGame.gameCode.charCodeAt(i);
      }
    }
    return buf;
  }, [rawBytes, selectedGame]);

  const patchResult = useMemo(() => {
    return applyPatches(sourceBytes, selectedGame, patchConfig);
  }, [sourceBytes, selectedGame, patchConfig]);

  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 font-sans flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'patcher' && (
          <div className="space-y-6">
            {/* Step 1: Dropzone */}
            <RomDropzone
              romInfo={romInfo}
              onRomLoaded={handleRomLoaded}
              selectedGame={selectedGame}
              onSelectGame={handleSelectGame}
            />

            {/* Step 2: Configurator */}
            <PatchConfigurator
              game={selectedGame}
              config={patchConfig}
              onChangeConfig={setPatchConfig}
              onOpenCapEditor={() => setActiveTab('caps')}
            />

            {/* Step 3: Hex Diffs */}
            <HexDiffViewer
              diffs={patchResult.diffs}
              gameTitle={selectedGame.title}
            />

            {/* Step 4: Export Patched ROM / IPS */}
            <PatchDownload
              patchResult={patchResult}
              game={selectedGame}
              hasRomLoaded={!!rawBytes}
            />
          </div>
        )}

        {activeTab === 'architecture' && <ArchitectureGuide />}

        {activeTab === 'caps' && (
          <LevelCapEditor
            game={selectedGame}
            config={patchConfig}
            onChangeConfig={setPatchConfig}
            onSelectGame={setSelectedGame}
            onBackToPatcher={() => setActiveTab('patcher')}
          />
        )}

        {activeTab === 'cheats' && <CheatsTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Pokémon ROM Patcher Studio • Designed for legally dumped base cartridge ROMs
          </span>
          <span className="text-zinc-400">
            Byte-accurate IPS patch engine • Zero server dependencies
          </span>
        </div>
      </footer>
    </div>
  );
}
