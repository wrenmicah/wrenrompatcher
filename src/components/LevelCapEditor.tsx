import { useState, useEffect } from 'react';
import { Award, RotateCcw, ChevronUp, ChevronDown, Check, Swords, Trophy, Crown, Skull } from 'lucide-react';
import { GameDefinition, LevelCapEntry, PatchConfig } from '../types';
import { POKEMON_GAMES } from '../data/pokemonGames';

interface LevelCapEditorProps {
  game: GameDefinition;
  config: PatchConfig;
  onChangeConfig: (newConfig: PatchConfig) => void;
  onSelectGame?: (game: GameDefinition) => void;
  onBackToPatcher?: () => void;
}

export function LevelCapEditor({
  game,
  config,
  onChangeConfig,
  onSelectGame,
  onBackToPatcher
}: LevelCapEditorProps) {
  const [caps, setCaps] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const entry of game.levelCaps) {
      map[entry.id] = config.customCaps[entry.id] ?? entry.defaultLevel;
    }
    return map;
  });

  // Re-sync when game changes
  useEffect(() => {
    const map: Record<string, number> = {};
    for (const entry of game.levelCaps) {
      map[entry.id] = config.customCaps[entry.id] ?? entry.defaultLevel;
    }
    setCaps(map);
  }, [game.id, config.customCaps]);

  const updateCap = (id: string, newLevel: number) => {
    const clamped = Math.max(1, Math.min(100, newLevel));
    const updated = { ...caps, [id]: clamped };
    setCaps(updated);
    onChangeConfig({
      ...config,
      activeCapPreset: 'custom',
      customCaps: updated
    });
  };

  const applyPreset = (mode: 'vanilla' | 'hardcore' | 'relaxed') => {
    const map: Record<string, number> = {};
    for (const entry of game.levelCaps) {
      if (mode === 'vanilla') {
        map[entry.id] = entry.defaultLevel;
      } else if (mode === 'hardcore') {
        // -1 level for strict challenge
        map[entry.id] = Math.max(1, entry.defaultLevel - 1);
      } else {
        // +2 relaxed
        map[entry.id] = Math.min(100, entry.defaultLevel + 2);
      }
    }
    setCaps(map);
    onChangeConfig({
      ...config,
      activeCapPreset: mode === 'vanilla' ? 'vanilla' : 'hardcore',
      customCaps: map
    });
  };

  const getEntryBadge = (entry: LevelCapEntry) => {
    const nameLower = (entry.name + ' ' + entry.badgeName).toLowerCase();
    if (nameLower.includes('champion')) {
      return {
        label: 'Champion',
        icon: Crown,
        classes: 'bg-amber-100 text-amber-900 border-amber-300'
      };
    }
    if (nameLower.includes('elite four') || nameLower.includes('e4')) {
      return {
        label: 'Elite Four',
        icon: Trophy,
        classes: 'bg-purple-100 text-purple-900 border-purple-300'
      };
    }
    if (nameLower.includes('boss') || nameLower.includes('legend') || nameLower.includes('necrozma') || nameLower.includes('red') || nameLower.includes('steven')) {
      return {
        label: 'Boss Battle',
        icon: Skull,
        classes: 'bg-rose-100 text-rose-900 border-rose-300'
      };
    }
    return {
      label: `Gym #${entry.gymNumber}`,
      icon: Swords,
      classes: 'bg-zinc-100 text-zinc-700 border-zinc-200'
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-zinc-900">
              Boss, Gym & League Level Cap Ladder
            </h3>
            {onSelectGame && (
              <select
                value={game.id}
                onChange={(e) => {
                  const g = POKEMON_GAMES.find((item) => item.id === e.target.value);
                  if (g) onSelectGame(g);
                }}
                className="text-xs bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1 font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                {POKEMON_GAMES.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.platform}] {item.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Cap Candies enforce these exact level ceilings before each milestone battle. All Gym Leaders, Elite Four members, and Champions are configured.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => applyPreset('vanilla')}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
              config.activeCapPreset === 'vanilla'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            Canonical Vanilla
          </button>
          <button
            type="button"
            onClick={() => applyPreset('hardcore')}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
              config.activeCapPreset === 'hardcore'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            Hardcore Nuzlocke (-1)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('relaxed')}
            className="text-xs px-2.5 py-1.5 rounded-lg border bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100 font-medium transition-colors"
          >
            Casual (+2)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('vanilla')}
            title="Reset to default"
            className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg border border-zinc-200 bg-zinc-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Ladder List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {game.levelCaps.map((entry: LevelCapEntry) => {
          const currentLevel = caps[entry.id] ?? entry.defaultLevel;
          const isModified = currentLevel !== entry.defaultLevel;
          const badgeInfo = getEntryBadge(entry);
          const BadgeIcon = badgeInfo.icon;

          return (
            <div
              key={entry.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isModified
                  ? 'border-amber-400 bg-amber-50/30'
                  : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-200/80 text-zinc-800 font-bold text-xs flex items-center justify-center shrink-0">
                  #{entry.gymNumber}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-zinc-900 truncate">
                      {entry.name}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 shrink-0 ${badgeInfo.classes}`}>
                      <BadgeIcon className="w-2.5 h-2.5" />
                      {badgeInfo.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {entry.badgeName} • {entry.description}
                  </p>
                </div>
              </div>

              {/* Stepper / Level Input */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-zinc-900 font-mono">
                    Lv. {currentLevel}
                  </div>
                  {isModified && (
                    <span className="text-[10px] text-amber-700 font-medium">
                      (orig: {entry.defaultLevel})
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => updateCap(entry.id, currentLevel + 1)}
                    className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700"
                    title="Increase level"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCap(entry.id, currentLevel - 1)}
                    className="p-1 rounded bg-zinc-200 hover:bg-zinc-300 text-zinc-700"
                    title="Decrease level"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {onBackToPatcher && (
        <div className="pt-3 border-t border-zinc-100 flex justify-end">
          <button
            type="button"
            onClick={onBackToPatcher}
            className="text-xs px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Caps & Return to Patcher
          </button>
        </div>
      )}
    </div>
  );
}
