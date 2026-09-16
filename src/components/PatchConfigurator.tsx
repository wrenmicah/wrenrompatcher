import { Sliders, Zap, Award, Package, Info } from 'lucide-react';
import { GameDefinition, PatchConfig } from '../types';

interface PatchConfiguratorProps {
  game: GameDefinition;
  config: PatchConfig;
  onChangeConfig: (newConfig: PatchConfig) => void;
  onOpenCapEditor: () => void;
}

export function PatchConfigurator({
  game,
  config,
  onChangeConfig,
  onOpenCapEditor
}: PatchConfiguratorProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-5 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            2. Configure Modifications
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select the EXP disabling method and Cap Candy rules for {game.title}
          </p>
        </div>

        <button
          type="button"
          id="btn-open-cap-ladder"
          onClick={onOpenCapEditor}
          className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-medium transition-colors flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5 text-amber-600" />
          Edit Gym Boss Caps ({game.levelCaps.length} milestones)
        </button>
      </div>

      {/* Feature 1: Disable XP Gain */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />
          Battle Experience (XP) Gain Behavior
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Complete 0 EXP */}
          <div
            onClick={() => onChangeConfig({ ...config, expMode: 'zero_exp' })}
            className={`cursor-pointer rounded-xl border p-4 transition-all relative ${
              config.expMode === 'zero_exp'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 uppercase tracking-wider">
                  Recommended for Cap Candy
                </span>
                <h4 className="text-sm font-semibold text-zinc-900 mt-2">
                  Disable Battle XP (Safe 0-EXP Patch)
                </h4>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Safely bypasses EXP calculation without breaking the battle loop. Eliminates the blank text box / rival battle freeze when a Pokémon faints.
                </p>
              </div>
              <input
                type="radio"
                name="expMode"
                checked={config.expMode === 'zero_exp'}
                onChange={() => {}}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
            </div>
            <div className="mt-3 text-[11px] font-mono text-zinc-500 bg-zinc-100/80 px-2 py-1 rounded">
              Bypass: <code className="text-amber-800 font-semibold">NOP (C0 46)</code> @ Cmd_getexp formula (No Battle Freeze)
            </div>
          </div>

          {/* Normal EXP */}
          <div
            onClick={() => onChangeConfig({ ...config, expMode: 'none' })}
            className={`cursor-pointer rounded-xl border p-4 transition-all relative ${
              config.expMode === 'none'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 uppercase tracking-wider">
                  Vanilla Battle XP
                </span>
                <h4 className="text-sm font-semibold text-zinc-900 mt-2">
                  Keep Standard EXP Gain
                </h4>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Preserves original game battle experience formulas. You can still apply Cap Candies without disabling battle leveling.
                </p>
              </div>
              <input
                type="radio"
                name="expMode"
                checked={config.expMode === 'none'}
                onChange={() => {}}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Cap Candy & Level Limiter */}
      <div className="space-y-3 pt-4 border-t border-zinc-100">
        <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          Cap Candy & Level Limit Enforcement
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Respect Boss Cap */}
          <div
            onClick={() => onChangeConfig({ ...config, candyMode: 'respect_cap' })}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              config.candyMode === 'respect_cap'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-zinc-900">
                Gym Level Cap Clamp
              </span>
              <input
                type="radio"
                name="candyMode"
                checked={config.candyMode === 'respect_cap'}
                onChange={() => {}}
                className="text-amber-600 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Rare Candy will refuse to level Pokémon past the next Gym Leader or Boss battle highest Pokémon level.
            </p>
          </div>

          {/* Auto Level to Cap */}
          <div
            onClick={() => onChangeConfig({ ...config, candyMode: 'auto_level_to_cap' })}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              config.candyMode === 'auto_level_to_cap'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-zinc-900">
                Instant Auto-Cap Candy
              </span>
              <input
                type="radio"
                name="candyMode"
                checked={config.candyMode === 'auto_level_to_cap'}
                onChange={() => {}}
                className="text-amber-600 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Using a single candy immediately brings the chosen Pokémon up to the upcoming gym leader cap level.
            </p>
          </div>

          {/* Vanilla Candy */}
          <div
            onClick={() => onChangeConfig({ ...config, candyMode: 'none' })}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              config.candyMode === 'none'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-zinc-900">
                Standard Candy (+1)
              </span>
              <input
                type="radio"
                name="candyMode"
                checked={config.candyMode === 'none'}
                onChange={() => {}}
                className="text-amber-600 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Leaves item effect untouched (+1 level up to standard level 100 limit).
            </p>
          </div>
        </div>

        {/* Refined Cap Candy Logic Checkboxes */}
        {config.candyMode !== 'none' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div
              onClick={() => onChangeConfig({ ...config, capCandyStopAtNewMove: !config.capCandyStopAtNewMove })}
              className={`cursor-pointer rounded-xl border p-3 flex items-start gap-3 transition-colors ${
                config.capCandyStopAtNewMove ? 'bg-amber-50/50 border-amber-300' : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <input
                type="checkbox"
                checked={config.capCandyStopAtNewMove}
                onChange={() => {}}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-semibold text-zinc-900 block">
                  Stop Leveling When Learning a New Move
                </span>
                <span className="text-[11px] text-zinc-600 leading-normal block mt-0.5">
                  Pauses the Cap Candy level-up sequence as soon as the Pokémon reaches a level that prompts a move learn screen, preventing move overwrite accidents.
                </span>
              </div>
            </div>

            <div
              onClick={() => onChangeConfig({ ...config, capCandyFailIfAtCap: !config.capCandyFailIfAtCap })}
              className={`cursor-pointer rounded-xl border p-3 flex items-start gap-3 transition-colors ${
                config.capCandyFailIfAtCap ? 'bg-amber-50/50 border-amber-300' : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <input
                type="checkbox"
                checked={config.capCandyFailIfAtCap}
                onChange={() => {}}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-semibold text-zinc-900 block">
                  Fail If Already At or Above Level Cap
                </span>
                <span className="text-[11px] text-zinc-600 leading-normal block mt-0.5">
                  Item consumption is blocked with "It won't have any effect!" if the targeted Pokémon is already at or above the next Gym Leader's cap.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature 3: Custom Quality-of-Life Items (Repellant & Porta-Heal) */}
      <div className="space-y-3 pt-4 border-t border-zinc-100">
        <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-600" />
          Custom Quality-of-Life Items (Reusable Key Item Mechanics)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Repellant Toggle */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 flex items-start justify-between">
            <div className="pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Reusable Key Item
                </span>
                <h4 className="text-sm font-semibold text-zinc-900">
                  "Repellant" (Infinite Toggle Key Item)
                </h4>
              </div>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Functions like an on/off Key Item switch. You receive 1 item that toggles wild Pokémon encounters without expiring by steps or ever reducing in quantity.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={config.enableRepellant}
                onChange={(e) => onChangeConfig({ ...config, enableRepellant: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Porta Heal Toggle */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 flex items-start justify-between">
            <div className="pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                  Reusable Key Item
                </span>
                <h4 className="text-sm font-semibold text-zinc-900">
                  "Porta Heal" (Field Center Key Item)
                </h4>
              </div>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Functions like a portable Pokémon Center Key Item. You receive 1 reusable item that restores full HP, PP, and cures status conditions for your entire party without being consumed.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={config.enablePortaHeal}
                onChange={(e) => onChangeConfig({ ...config, enablePortaHeal: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Feature 4: Infinite Reusable Key Items Convenience */}
      <div className="pt-4 border-t border-zinc-100">
        <div className="flex items-start justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-zinc-900">
                  Provide 1x Infinite Reusable Cap Candy & Repellant (Key Item Mode)
                </h4>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                  Key Item Standard
                </span>
              </div>
              <p className="text-xs text-zinc-600 mt-1">
                Delivers 1x permanent Cap Candy and 1x Repellant. Like Key Items, you only ever carry one copy, and using them never depletes or decreases the count.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              checked={config.giveInfiniteCandies}
              onChange={(e) => onChangeConfig({ ...config, giveInfiniteCandies: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>
      </div>

      {/* Feature 5: Game-Specific Item Delivery Method & Bag Architecture */}
      <div className="pt-4 border-t border-zinc-100 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-600" />
            Game Item Delivery & Bag Architecture Method
          </label>
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
            {game.platform} Item System
          </span>
        </div>

        {game.bagArchitectureInfo && (
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{game.title} Bag Architecture Notice</span>
            </div>
            <p className="leading-relaxed">
              {game.bagArchitectureInfo.unlockCondition}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="bg-amber-100/60 p-2 rounded">
                <strong>Pockets:</strong> {game.bagArchitectureInfo.pocketsDescription}
              </div>
              <div className="bg-amber-100/60 p-2 rounded">
                <strong>Turn 1 PC:</strong> {game.bagArchitectureInfo.pcStorageLocation}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* PC Storage Delivery */}
          <div
            onClick={() => onChangeConfig({ ...config, itemDeliveryMethod: 'pc_storage' })}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              config.itemDeliveryMethod === 'pc_storage'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-zinc-900">
                Bedroom PC Storage
              </span>
              <input
                type="radio"
                name="itemDeliveryMethod"
                checked={config.itemDeliveryMethod === 'pc_storage'}
                onChange={() => {}}
                className="text-amber-600 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Injects 1x Reusable Cap Candy and 1x Reusable Repellant (Key Item style) into bedroom PC storage on Turn 1 before leaving the starting house.
            </p>
          </div>

          {/* First Mart Stocking */}
          <div
            onClick={() => onChangeConfig({ ...config, itemDeliveryMethod: 'first_mart' })}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              config.itemDeliveryMethod === 'first_mart'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-zinc-900">
                Free Early Mart (0₽)
              </span>
              <input
                type="radio"
                name="itemDeliveryMethod"
                checked={config.itemDeliveryMethod === 'first_mart'}
                onChange={() => {}}
                className="text-amber-600 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Available as 1x Reusable Key Items at the first Poké Mart ({game.bagArchitectureInfo?.firstMartLocation || 'Poké Mart'}) for 0 PokéDollars.
            </p>
          </div>

          {/* Direct Bag Memory Cheats */}
          <div
            onClick={() => onChangeConfig({ ...config, itemDeliveryMethod: 'direct_cheats' })}
            className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
              config.itemDeliveryMethod === 'direct_cheats'
                ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                : 'border-zinc-200 hover:border-zinc-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-zinc-900">
                Direct Bag Cheats
              </span>
              <input
                type="radio"
                name="itemDeliveryMethod"
                checked={config.itemDeliveryMethod === 'direct_cheats'}
                onChange={() => {}}
                className="text-amber-600 focus:ring-amber-500"
              />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Injects 1x Reusable Key Items directly into Bag Slots 1, 2, and 3 via 1-click Action Replay codes in Delta or mGBA.
            </p>
          </div>
        </div>
      </div>

      {/* Helper note */}
      <div className="flex items-start gap-2 text-xs text-zinc-500 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span>
            When combining <strong>0-EXP Gain</strong> with <strong>Cap Candies</strong>, your Pokémon will only gain levels when you intentionally feed them candies. This gives you exact, tournament-grade control over IVs, movesets, and level discipline.
          </span>
        </div>
      </div>
    </div>
  );
}
