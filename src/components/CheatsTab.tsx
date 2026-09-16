import { useState } from 'react';
import { Terminal, Copy, Check, HelpCircle } from 'lucide-react';
import { POKEMON_GAMES } from '../data/pokemonGames';

export function CheatsTab() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-5 space-y-6">
      <div className="pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-semibold text-zinc-900">
            Action Replay & GameShark Cheat Engine Codes
          </h2>
        </div>
        <p className="text-xs text-zinc-500 mt-1 max-w-3xl leading-relaxed">
          Zero-risk memory freeze codes. Apply these directly inside mGBA, Delta, RetroArch, or DeSmuME to disable battle EXP and gain 1x Reusable Key Items without altering your base ROM dump file.
        </p>
      </div>

      {/* Key Item Architecture Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-semibold text-amber-900 block">
            Key Item Mechanics (Single Quantity, Non-Depleting)
          </span>
          <p className="text-zinc-700">
            Unlike standard consumable medicine, these QoL items are delivered as <strong>1x reusable Key Items</strong> (quantity = 1). Using them never reduces your inventory count, so you have infinite, non-cluttering access throughout your entire run.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {POKEMON_GAMES.map((game) => (
          <div
            key={game.id}
            className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/50 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-zinc-900">
                  {game.title}
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">
                  {game.cheatCodes.engine}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                Code: {game.gameCode} ({game.platform})
              </p>
            </div>

            {/* Zero EXP code block */}
            <div className="bg-zinc-900 rounded-lg p-3 text-xs font-mono text-zinc-200 space-y-2 border border-zinc-800">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span>Zero EXP Gain:</span>
                <button
                  type="button"
                  onClick={() => copy(game.cheatCodes.zeroExp, `${game.id}-exp`)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  {copiedId === `${game.id}-exp` ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="text-amber-300 font-semibold">{game.cheatCodes.zeroExp}</pre>

              {game.cheatCodes.infiniteCandies && (
                <>
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-2 border-t border-zinc-800">
                    <span>1x Reusable Cap Candy (Key Item - Never Consumed):</span>
                    <button
                      type="button"
                      onClick={() => copy(game.cheatCodes.infiniteCandies!, `${game.id}-candies`)}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                    >
                      {copiedId === `${game.id}-candies` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-emerald-300 font-semibold">{game.cheatCodes.infiniteCandies}</pre>
                </>
              )}

              {game.cheatCodes.directBagSlot1 && (
                <>
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-2 border-t border-zinc-800">
                    <span className="text-amber-400 font-medium">Direct Bag Slot 1 (1x Reusable Cap Candy):</span>
                    <button
                      type="button"
                      onClick={() => copy(game.cheatCodes.directBagSlot1!, `${game.id}-bag1`)}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                    >
                      {copiedId === `${game.id}-bag1` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-amber-200 font-semibold">{game.cheatCodes.directBagSlot1}</pre>
                </>
              )}

              {game.cheatCodes.directBagSlot2 && (
                <>
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-2 border-t border-zinc-800">
                    <span className="text-emerald-400 font-medium">Direct Bag Slot 2 (1x Reusable Repellant):</span>
                    <button
                      type="button"
                      onClick={() => copy(game.cheatCodes.directBagSlot2!, `${game.id}-bag2`)}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                    >
                      {copiedId === `${game.id}-bag2` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-emerald-200 font-semibold">{game.cheatCodes.directBagSlot2}</pre>
                </>
              )}

              {game.cheatCodes.directBagSlot3 && (
                <>
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-2 border-t border-zinc-800">
                    <span className="text-blue-400 font-medium">Direct Bag Slot 3 (1x Reusable Porta-Heal):</span>
                    <button
                      type="button"
                      onClick={() => copy(game.cheatCodes.directBagSlot3!, `${game.id}-bag3`)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      {copiedId === `${game.id}-bag3` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-blue-200 font-semibold">{game.cheatCodes.directBagSlot3}</pre>
                </>
              )}

              {game.cheatCodes.repellant && (
                <>
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-2 border-t border-zinc-800">
                    <span>"Repellant" Key Item Toggle (No Wild Encounters):</span>
                    <button
                      type="button"
                      onClick={() => copy(game.cheatCodes.repellant!, `${game.id}-repel`)}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                    >
                      {copiedId === `${game.id}-repel` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-teal-300 font-semibold">{game.cheatCodes.repellant}</pre>
                </>
              )}

              {game.cheatCodes.portaHeal && (
                <>
                  <div className="flex items-center justify-between text-zinc-400 text-[11px] pt-2 border-t border-zinc-800">
                    <span>"Porta Heal" Key Item (Party Full Restore):</span>
                    <button
                      type="button"
                      onClick={() => copy(game.cheatCodes.portaHeal!, `${game.id}-porta`)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      {copiedId === `${game.id}-porta` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-cyan-300 font-semibold">{game.cheatCodes.portaHeal}</pre>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Guide on how to use */}
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold">
          <HelpCircle className="w-4 h-4 text-amber-700" />
          How to enter cheats in modern emulators:
        </div>
        <p className="leading-relaxed">
          <strong>In mGBA:</strong> Click <em>Tools → Cheats → Add new cheat...</em>. Select "GameShark / Action Replay v3" and paste the code above.
          <br />
          <strong>In Delta (iOS):</strong> Tap the Menu button, select <em>Cheat Codes → New Cheat</em>, set type to "Action Replay", and paste.
          <br />
          <strong>In RetroArch:</strong> Open Quick Menu → Cheats → Add New Cheat → Set Cheat Type to Code.
        </p>
      </div>
    </div>
  );
}
