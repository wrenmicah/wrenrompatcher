import React, { useRef } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { GameDefinition, RomHeaderInfo } from '../types';
import { POKEMON_GAMES } from '../data/pokemonGames';
import { parseRomHeader } from '../utils/patchEngine';

interface RomDropzoneProps {
  romInfo: RomHeaderInfo | null;
  onRomLoaded: (info: RomHeaderInfo, rawBytes: Uint8Array) => void;
  selectedGame: GameDefinition;
  onSelectGame: (game: GameDefinition) => void;
}

export function RomDropzone({
  romInfo,
  onRomLoaded,
  selectedGame,
  onSelectGame
}: RomDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const rawBytes = new Uint8Array(buffer);
    const info = parseRomHeader(file.name, buffer);

    if (info.detectedGame) {
      onSelectGame(info.detectedGame);
    }
    onRomLoaded(info, rawBytes);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Helper to generate a clean synthetic GBA header for testing without needing a dumped ROM file
  const loadDemoRom = (targetGame: GameDefinition) => {
    const size = targetGame.platform === 'GBA' ? 16777216 : targetGame.platform === 'GBC' ? 2097152 : 1048576;
    const buffer = new Uint8Array(size);

    if (targetGame.platform === 'GBA') {
      // Set GBA 0xB2 cartridge check byte
      buffer[0xb2] = 0x96;
      // Set Game Title at 0xA0
      const title = targetGame.internalTitle.padEnd(12, ' ');
      for (let i = 0; i < 12; i++) {
        buffer[0xa0 + i] = title.charCodeAt(i);
      }
      // Set Game Code at 0xAC
      for (let i = 0; i < 4; i++) {
        buffer[0xac + i] = targetGame.gameCode.charCodeAt(i);
      }
      // Put original bytes at target offsets for FireRed / Emerald
      if (targetGame.zeroExpOffsets) {
        for (const item of targetGame.zeroExpOffsets) {
          for (let i = 0; i < item.original.length; i++) {
            buffer[item.offset + i] = item.original[i];
          }
        }
      }
      if (targetGame.capCandyOffsets) {
        for (const item of targetGame.capCandyOffsets) {
          for (let i = 0; i < item.original.length; i++) {
            buffer[item.offset + i] = item.original[i];
          }
        }
      }
    }

    const info: RomHeaderInfo = {
      fileName: `${targetGame.title.replace(/\s+/g, '_')}_Clean_Dump.gba`,
      fileSize: size,
      crc32: targetGame.expectedCrc32 || '605b89b5',
      title: targetGame.title,
      gameCode: targetGame.gameCode,
      makerCode: '01',
      version: 0,
      platform: targetGame.platform,
      detectedGame: targetGame,
      isCompatible: true
    };

    onSelectGame(targetGame);
    onRomLoaded(info, buffer);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-500" />
            1. Target Clean ROM Dump
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Load your dumped vanilla ROM (.gba, .gbc, .gb, .nds, .3ds, .cxi, .cia) or select a game preset to test
          </p>
        </div>

        {/* Quick game selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="game-select-preset" className="text-xs text-zinc-500 font-medium whitespace-nowrap">
            Game Profile:
          </label>
          <select
            id="game-select-preset"
            value={selectedGame.id}
            onChange={(e) => {
              const game = POKEMON_GAMES.find((g) => g.id === e.target.value);
              if (game) onSelectGame(game);
            }}
            className="text-xs bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1.5 font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            {POKEMON_GAMES.map((game) => (
              <option key={game.id} value={game.id}>
                [{game.platform}] {game.title} - {game.subtitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Dropzone Box */}
      <div
        id="rom-dropzone-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          romInfo
            ? 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50'
            : 'border-zinc-300 hover:border-amber-400 bg-zinc-50/60 hover:bg-amber-50/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".gba,.gbc,.gb,.nds,.3ds,.cxi,.cia,.bin"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {romInfo ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900 font-mono">
                    {romInfo.fileName}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 font-semibold">
                    {romInfo.platform}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600 mt-1 font-mono">
                  <span>Title: <strong>{romInfo.title}</strong></span>
                  <span>•</span>
                  <span>Code: <strong>{romInfo.gameCode}</strong></span>
                  <span>•</span>
                  <span>CRC32: <strong>{romInfo.crc32}</strong></span>
                  <span>•</span>
                  <span>Size: {(romInfo.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 font-medium text-zinc-700 flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Different ROM
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-700 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-zinc-800">
              Drag and drop your Pokémon ROM dump here, or click to browse
            </p>
            <p className="text-xs text-zinc-500 mt-1 max-w-md">
              Supports GBA (FireRed, Emerald, Ruby, Sapphire), GBC (Crystal), GB (Red/Blue), and NDS (Platinum, HGSS, Black/White).
            </p>

            <div className="mt-4 pt-3 border-t border-zinc-200 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-zinc-400">Don't have your cartridge dump handy?</span>
              <button
                type="button"
                id="btn-load-demo-rom"
                onClick={(e) => {
                  e.stopPropagation();
                  loadDemoRom(selectedGame);
                }}
                className="text-xs px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3 h-3" />
                Initialize Clean {selectedGame.title} Demo ROM
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ROM Compatibility badge */}
      {romInfo && (
        <div className="mt-3 flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-2">
            {romInfo.isCompatible ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Exact matching game profile found: {selectedGame.title} ({selectedGame.subtitle})
              </span>
            ) : (
              <span className="text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Custom/Modified ROM header. Using fallback profile: {selectedGame.title}
              </span>
            )}
          </div>
          <span className="text-zinc-500 font-mono text-[11px]">
            Expected Size: {(selectedGame.expectedSize / (1024 * 1024)).toFixed(0)} MB
          </span>
        </div>
      )}
    </div>
  );
}
