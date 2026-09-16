import { useState } from 'react';
import { Download, FileCode, CheckCircle, Copy, Check, Terminal } from 'lucide-react';
import { GameDefinition, PatchResult } from '../types';

interface PatchDownloadProps {
  patchResult: PatchResult;
  game: GameDefinition;
  hasRomLoaded: boolean;
}

export function PatchDownload({
  patchResult,
  game,
  hasRomLoaded
}: PatchDownloadProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const downloadPatchedRom = () => {
    const blob = new Blob([patchResult.patchedData], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = patchResult.patchedFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadIpsPatch = () => {
    const blob = new Blob([patchResult.ipsBytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = patchResult.patchFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyCheats = () => {
    let text = `// ${game.title} Cheats\n// Zero EXP Gain:\n${game.cheatCodes.zeroExp}\n\n// 999 Candies:\n${game.cheatCodes.infiniteCandies || ''}`;
    if (game.cheatCodes.repellant) {
      text += `\n\n// "Repellant" Toggle (No Wild Encounters):\n${game.cheatCodes.repellant}`;
    }
    if (game.cheatCodes.portaHeal) {
      text += `\n\n// "Porta Heal" (Party Full Restore):\n${game.cheatCodes.portaHeal}`;
    }
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-500" />
            3. Export Patched ROM & IPS Mod
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Save your customized ROM directly or download the lightweight .ips patch
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Ready to Export
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Button 1: Download Patched ROM */}
        <button
          type="button"
          id="btn-download-patched-rom"
          onClick={downloadPatchedRom}
          disabled={!hasRomLoaded}
          className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
            hasRomLoaded
              ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm cursor-pointer'
              : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                Download Patched ROM
              </span>
              <span className="text-[11px] font-mono opacity-90 px-1.5 py-0.5 rounded bg-black/15">
                {game.platform}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              Downloads the complete, fully patched ROM file ({patchResult.patchedFileName}) ready to load into mGBA, Delta, RetroArch, or a flashcart.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-mono opacity-80 truncate">
            {patchResult.patchedFileName}
          </div>
        </button>

        {/* Button 2: Download IPS Patch File */}
        <button
          type="button"
          id="btn-download-ips-patch"
          onClick={downloadIpsPatch}
          className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-left flex flex-col justify-between transition-all cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold flex items-center gap-1.5 text-zinc-900">
                <FileCode className="w-4 h-4 text-amber-600" />
                Download Standalone .IPS Patch
              </span>
              <span className="text-[11px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-200">
                {patchResult.ipsBytes.length} Bytes
              </span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Standard Lunar IPS patch file containing only the byte diffs. Legally shareable with friends without distributing copyrighted game assets.
            </p>
          </div>
          <div className="mt-3 text-[11px] font-mono text-zinc-500 truncate">
            {patchResult.patchFileName}
          </div>
        </button>
      </div>

      {/* Bag Architecture & Delivery Instructions Banner */}
      {(patchResult.bagInstructions || patchResult.deliveryInfo) && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Item Delivery & Bag Setup Confirmed</span>
          </div>
          {patchResult.deliveryInfo && (
            <p className="font-medium text-emerald-900 bg-emerald-50/90 p-2 rounded border border-emerald-200/80">
              📦 <strong>Item Injected:</strong> {patchResult.deliveryInfo}
            </p>
          )}
          {patchResult.bagInstructions && (
            <p className="text-zinc-700 leading-relaxed">
              {patchResult.bagInstructions}
            </p>
          )}
          {game.bagArchitectureInfo && !game.bagArchitectureInfo.bagUnlockedAtStart && (
            <div className="text-[11px] bg-amber-100/70 p-2 rounded text-amber-900">
              💡 <strong>Remember:</strong> Check your <strong>{game.bagArchitectureInfo.pcStorageLocation}</strong> before leaving your hometown! Once you deliver Oak's Parcel to Professor Oak, your Bag menu will open normally with all 3 pockets enabled.
            </div>
          )}
        </div>
      )}

      {/* Cheats Quick Copy Drawer */}
      <div className="pt-2">
        <div className="p-3.5 rounded-xl bg-zinc-900 text-zinc-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              Zero-EXP Action Replay Code ({game.title}): <strong className="text-amber-300">{game.cheatCodes.zeroExp.replace('\n', ' ')}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={copyCheats}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-sans font-medium flex items-center gap-1 shrink-0 transition-colors self-start sm:self-auto cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied All Cheats!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Cheats
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
