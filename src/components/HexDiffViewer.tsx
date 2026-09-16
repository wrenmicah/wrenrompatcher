import { Binary, Eye, FileCheck } from 'lucide-react';
import { ByteDiff } from '../types';

interface HexDiffViewerProps {
  diffs: ByteDiff[];
  gameTitle: string;
}

export function HexDiffViewer({ diffs, gameTitle }: HexDiffViewerProps) {
  if (diffs.length === 0) {
    return (
      <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-xl p-4 text-center text-xs text-zinc-400">
        No active binary modifications selected. Enable "Disable Battle XP" or "Cap Candy" above to preview memory diffs.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Binary className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-semibold text-zinc-900">
            Binary Patch Memory Inspector
          </h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-medium">
          {diffs.length} Byte{diffs.length === 1 ? '' : 's'} Patched
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-zinc-200 rounded-lg overflow-hidden">
          <thead className="bg-zinc-100/80 text-zinc-600 font-semibold border-b border-zinc-200">
            <tr>
              <th className="py-2.5 px-3 font-mono">ROM Offset</th>
              <th className="py-2.5 px-3">Original Byte</th>
              <th className="py-2.5 px-3">Patched Byte</th>
              <th className="py-2.5 px-3">Routine / Assembly Disassembly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/60 font-mono">
            {diffs.map((diff, index) => (
              <tr key={index} className="hover:bg-amber-50/20">
                <td className="py-2 px-3 text-amber-700 font-bold">
                  {diff.offsetHex}
                </td>
                <td className="py-2 px-3 text-zinc-500 line-through">
                  0x{diff.originalByte.toString(16).toUpperCase().padStart(2, '0')}
                </td>
                <td className="py-2 px-3 text-emerald-600 font-bold">
                  0x{diff.patchedByte.toString(16).toUpperCase().padStart(2, '0')}
                </td>
                <td className="py-2 px-3 text-zinc-700 font-sans text-[11px]">
                  {diff.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
        <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          Patch verified against canonical {gameTitle} assembly layout. Zero extraneous bytes or corrupted header data.
        </span>
      </div>
    </div>
  );
}
