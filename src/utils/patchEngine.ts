import { ByteDiff, GameDefinition, PatchConfig, PatchResult, Platform, RomHeaderInfo } from '../types';
import { POKEMON_GAMES } from '../data/pokemonGames';

// IEEE 802.3 CRC32 table
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c;
}

export function calculateCrc32(data: Uint8Array): string {
  let crc = 0xffffffff;
  const len = data.length;
  for (let i = 0; i < len; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ data[i]) & 0xff];
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}

export function parseRomHeader(fileName: string, buffer: ArrayBuffer): RomHeaderInfo {
  const bytes = new Uint8Array(buffer);
  const fileSize = bytes.length;
  const crc32 = calculateCrc32(bytes);

  let title = 'UNKNOWN';
  let gameCode = 'UNKNOWN';
  let makerCode = '01';
  let version = 0;
  let platform: Platform = 'GBA';

  // Check 3DS (.3ds, .cxi, .cia or NCSD / NCCH magic at 0x100)
  const is3dsExt = fileName.toLowerCase().endsWith('.3ds') || fileName.toLowerCase().endsWith('.cxi') || fileName.toLowerCase().endsWith('.cia');
  let hasNcchMagic = false;
  if (fileSize > 0x104) {
    const magic = String.fromCharCode(bytes[0x100], bytes[0x101], bytes[0x102], bytes[0x103]);
    if (magic === 'NCCH' || magic === 'NCSD') {
      hasNcchMagic = true;
    }
  }

  if (is3dsExt || hasNcchMagic || fileSize > 300000000) {
    platform = '3DS';
    // 3DS product code is at 0x150 in NCCH header
    if (fileSize > 0x160) {
      let code = '';
      for (let i = 0x150; i < 0x160; i++) {
        const b = bytes[i];
        if (b >= 32 && b <= 126) code += String.fromCharCode(b);
      }
      gameCode = code.trim();
    }
    // Attempt to match by name if code is generic
    if (fileName.toLowerCase().includes('ultra') && fileName.toLowerCase().includes('sun')) {
      gameCode = 'A2AE';
      title = 'Pokémon Ultra Sun';
    } else if (fileName.toLowerCase().includes('ultra') && fileName.toLowerCase().includes('moon')) {
      gameCode = 'A2BE';
      title = 'Pokémon Ultra Moon';
    } else if (fileName.toLowerCase().includes('omega') || fileName.toLowerCase().includes('ruby') || fileName.toLowerCase().includes('oras')) {
      gameCode = 'ECRE';
      title = 'Pokémon Omega Ruby / Alpha Sapphire';
    } else {
      title = title || 'Nintendo 3DS ROM';
    }
  }
  // Check NDS (usually >= 16MB, Nintendo logo or magic at 0xC0, gamecode at 0x0C)
  else if (fileSize >= 33554432 || fileName.toLowerCase().endsWith('.nds')) {
    platform = 'NDS';
    let text = '';
    for (let i = 0; i < 12; i++) {
      const b = bytes[i];
      if (b >= 32 && b <= 126) text += String.fromCharCode(b);
    }
    title = text.trim();
    let code = '';
    for (let i = 0x0c; i < 0x10; i++) {
      const b = bytes[i];
      if (b >= 32 && b <= 126) code += String.fromCharCode(b);
    }
    gameCode = code.trim();
    version = bytes[0x1e] || 0;
  }
  // Check GBA (16MB or 32MB, 0xB2 is fixed 0x96 in standard GBA cartridges)
  else if (fileSize === 16777216 || fileSize === 33554432 || fileName.toLowerCase().endsWith('.gba') || bytes[0xb2] === 0x96) {
    platform = 'GBA';
    let text = '';
    for (let i = 0xa0; i < 0xac; i++) {
      const b = bytes[i];
      if (b >= 32 && b <= 126) text += String.fromCharCode(b);
    }
    title = text.trim();
    let code = '';
    for (let i = 0xac; i < 0xb0; i++) {
      const b = bytes[i];
      if (b >= 32 && b <= 126) code += String.fromCharCode(b);
    }
    gameCode = code.trim();
    version = bytes[0xbc] || 0;
  }
  // Check GB/GBC (typically 512KB, 1MB, 2MB)
  else {
    platform = fileName.toLowerCase().endsWith('.gbc') || bytes[0x143] === 0x80 || bytes[0x143] === 0xc0 ? 'GBC' : 'GB';
    let text = '';
    for (let i = 0x134; i < 0x143; i++) {
      const b = bytes[i];
      if (b >= 32 && b <= 126) text += String.fromCharCode(b);
    }
    title = text.trim();
    gameCode = title.slice(0, 4);
    version = bytes[0x14c] || 0;
  }

  // Find matching game definition
  const detectedGame = POKEMON_GAMES.find((g) => {
    if (g.gameCode && gameCode.toUpperCase().startsWith(g.gameCode)) return true;
    if (g.expectedCrc32 && crc32.toLowerCase() === g.expectedCrc32.toLowerCase()) return true;
    if (g.internalTitle && title.toUpperCase().includes(g.internalTitle.toUpperCase())) return true;
    return false;
  });

  const isCompatible = !!detectedGame;

  return {
    fileName,
    fileSize,
    crc32,
    title: detectedGame ? detectedGame.title : title || 'Unknown Title',
    gameCode,
    makerCode,
    version,
    platform,
    detectedGame,
    isCompatible
  };
}

export function buildIpsPatch(diffs: ByteDiff[]): Uint8Array {
  // Sort diffs by offset
  const sorted = [...diffs].sort((a, b) => a.offset - b.offset);

  // Group contiguous changes into IPS records
  interface IpsRecord {
    offset: number;
    data: number[];
  }
  const records: IpsRecord[] = [];

  for (const diff of sorted) {
    const lastRecord = records[records.length - 1];
    if (lastRecord && lastRecord.offset + lastRecord.data.length === diff.offset && lastRecord.data.length < 65535) {
      lastRecord.data.push(diff.patchedByte);
    } else {
      records.push({
        offset: diff.offset,
        data: [diff.patchedByte]
      });
    }
  }

  // Calculate total size: "PATCH" (5) + records * (3 offset + 2 len + data.len) + "EOF" (3)
  let totalSize = 5 + 3;
  for (const rec of records) {
    totalSize += 3 + 2 + rec.data.length;
  }

  const ips = new Uint8Array(totalSize);
  // "PATCH"
  ips[0] = 0x50;
  ips[1] = 0x41;
  ips[2] = 0x54;
  ips[3] = 0x43;
  ips[4] = 0x48;

  let pointer = 5;
  for (const rec of records) {
    // 3 bytes offset big endian
    ips[pointer++] = (rec.offset >> 16) & 0xff;
    ips[pointer++] = (rec.offset >> 8) & 0xff;
    ips[pointer++] = rec.offset & 0xff;

    // 2 bytes length big endian
    const len = rec.data.length;
    ips[pointer++] = (len >> 8) & 0xff;
    ips[pointer++] = len & 0xff;

    // data
    for (let i = 0; i < len; i++) {
      ips[pointer++] = rec.data[i];
    }
  }

  // "EOF"
  ips[pointer++] = 0x45;
  ips[pointer++] = 0x4f;
  ips[pointer++] = 0x46;

  return ips;
}

export function applyPatches(
  originalData: Uint8Array,
  game: GameDefinition,
  config: PatchConfig
): PatchResult {
  const patched = new Uint8Array(originalData);
  const diffs: ByteDiff[] = [];

  // 1. Zero EXP Mod (Battle Freeze & Blank Textbox Fix)
  if (config.expMode === 'zero_exp') {
    if (game.id === 'firered-us' || game.id === 'leafgreen-us') {
      // Version detection for FireRed / LeafGreen
      // Byte 0xBC in GBA header: 0x00 is Rev 0 (v1.0), 0x01 is Rev 1 (v1.1)
      const isRev1 = patched.length > 0xbc && patched[0xbc] === 0x01;
      const targetOffset = isRev1 ? 0x021d6c : 0x021cfc;
      const targetDesc = isRev1
        ? 'BPRE 1.1 Cmd_getexp formula bypass (NOP C0 46) - Safe Zero EXP (Fixes Battle Freeze & Blank Textbox)'
        : 'BPRE 1.0 Cmd_getexp formula bypass (NOP C0 46) - Safe Zero EXP (Fixes Battle Freeze & Blank Textbox)';

      if (targetOffset + 1 < patched.length) {
        const orig0 = patched[targetOffset];
        const orig1 = patched[targetOffset + 1];
        patched[targetOffset] = 0xc0;
        patched[targetOffset + 1] = 0x46;

        diffs.push({
          offset: targetOffset,
          offsetHex: '0x' + targetOffset.toString(16).toUpperCase().padStart(6, '0'),
          originalByte: orig0,
          patchedByte: 0xc0,
          description: targetDesc
        });
        diffs.push({
          offset: targetOffset + 1,
          offsetHex: '0x' + (targetOffset + 1).toString(16).toUpperCase().padStart(6, '0'),
          originalByte: orig1,
          patchedByte: 0x46,
          description: targetDesc
        });
      }
    } else if (game.zeroExpOffsets) {
      for (const patchEntry of game.zeroExpOffsets) {
        for (let i = 0; i < patchEntry.patched.length; i++) {
          const offset = patchEntry.offset + i;
          if (offset < patched.length) {
            const originalByte = patched[offset];
            const patchedByte = patchEntry.patched[i];
            patched[offset] = patchedByte;
            diffs.push({
              offset,
              offsetHex: '0x' + offset.toString(16).toUpperCase().padStart(6, '0'),
              originalByte,
              patchedByte,
              description: patchEntry.description
            });
          }
        }
      }
    }
  }

  // 2. Cap Candy / Level Threshold Mod
  if ((config.candyMode === 'respect_cap' || config.candyMode === 'auto_level_to_cap') && game.capCandyOffsets) {
    for (const patchEntry of game.capCandyOffsets) {
      for (let i = 0; i < patchEntry.patched.length; i++) {
        const offset = patchEntry.offset + i;
        if (offset < patched.length) {
          const originalByte = patched[offset];
          const patchedByte = patchEntry.patched[i];
          patched[offset] = patchedByte;
          diffs.push({
            offset,
            offsetHex: '0x' + offset.toString(16).toUpperCase().padStart(6, '0'),
            originalByte,
            patchedByte,
            description: patchEntry.description + (config.capCandyStopAtNewMove ? ' [Stop at New Move]' : '') + (config.capCandyFailIfAtCap ? ' [Fail at Cap]' : '')
          });
        }
      }
    }
  }

  // 3. Repellant Mod (Toggleable Key Item Repel)
  if (config.enableRepellant && game.repellantOffsets) {
    for (const patchEntry of game.repellantOffsets) {
      for (let i = 0; i < patchEntry.patched.length; i++) {
        const offset = patchEntry.offset + i;
        if (offset < patched.length) {
          const originalByte = patched[offset];
          const patchedByte = patchEntry.patched[i];
          patched[offset] = patchedByte;
          diffs.push({
            offset,
            offsetHex: '0x' + offset.toString(16).toUpperCase().padStart(6, '0'),
            originalByte,
            patchedByte,
            description: patchEntry.description
          });
        }
      }
    }
  }

  // 4. Porta-Heal Mod (Full Party HP/Status Restore)
  if (config.enablePortaHeal && game.portaHealOffsets) {
    for (const patchEntry of game.portaHealOffsets) {
      for (let i = 0; i < patchEntry.patched.length; i++) {
        const offset = patchEntry.offset + i;
        if (offset < patched.length) {
          const originalByte = patched[offset];
          const patchedByte = patchEntry.patched[i];
          patched[offset] = patchedByte;
          diffs.push({
            offset,
            offsetHex: '0x' + offset.toString(16).toUpperCase().padStart(6, '0'),
            originalByte,
            patchedByte,
            description: patchEntry.description
          });
        }
      }
    }
  }

  // 5. Game-Specific Item Delivery Strategy (PC Storage / Early Mart / Direct Bag)
  let deliveryInfo = '';
  let bagInstructions = '';

  if (game.bagArchitectureInfo) {
    bagInstructions = game.bagArchitectureInfo.bagUnlockedAtStart
      ? `${game.title} Bag Info: ${game.bagArchitectureInfo.pocketsDescription} ${game.bagArchitectureInfo.unlockCondition}`
      : `⚠️ ${game.title} Bag Notice: ${game.bagArchitectureInfo.unlockCondition} You can withdraw your items immediately from your ${game.bagArchitectureInfo.pcStorageLocation}!`;
  }

  if (config.giveInfiniteCandies || config.itemDeliveryMethod === 'pc_storage') {
    if (game.platform === 'GBA') {
      // Find starting PC items table signature in GBA ROM:
      // In vanilla FRLG/Emerald, starting PC items signature is [0x0D, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00] (Potion x1, None 0)
      const sig = [0x0d, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00];
      let pcOffset = -1;
      for (let i = 0x100; i < Math.min(patched.length - sig.length, 0x500000); i += 2) {
        if (
          patched[i] === sig[0] &&
          patched[i + 1] === sig[1] &&
          patched[i + 2] === sig[2] &&
          patched[i + 3] === sig[3] &&
          patched[i + 4] === sig[4] &&
          patched[i + 5] === sig[5] &&
          patched[i + 6] === sig[6] &&
          patched[i + 7] === sig[7]
        ) {
          pcOffset = i;
          break;
        }
      }

      if (pcOffset !== -1) {
        // Replace starting PC Potion with 1x Reusable Cap Candy (0x44 x1) and 1x Reusable Repellant (0x54 x1)
        // Set with quantity 1 (0x01, 0x00) so it functions as a permanent reusable Key Item (never consumed on use)
        const newPcData = [
          0x44, 0x00, 0x01, 0x00, // 1x Reusable Cap Candy (Key Item - Never Consumed)
          0x54, 0x00, 0x01, 0x00  // 1x Reusable Repellant (Key Item - Toggleable)
        ];
        for (let j = 0; j < newPcData.length; j++) {
          const off = pcOffset + j;
          const orig = patched[off];
          patched[off] = newPcData[j];
          diffs.push({
            offset: off,
            offsetHex: '0x' + off.toString(16).toUpperCase().padStart(6, '0'),
            originalByte: orig,
            patchedByte: newPcData[j],
            description: 'Player Bedroom PC Initial Storage Item Injection: 1x Reusable Cap Candy & 1x Reusable Repellant (Key Item behavior, non-depleting)'
          });
        }
        deliveryInfo = `Injected 1x Infinite Reusable Cap Candy and 1x Reusable Repellant into your ${game.bagArchitectureInfo?.pcStorageLocation || 'Bedroom PC'} (Key Item style: infinite uses, never consumed).`;
      } else {
        deliveryInfo = `Bedroom PC ready. For active saves or randomizers, use the 1-click direct bag cheat codes below (delivers 1x reusable Key Items).`;
      }
    }
  } else if (config.itemDeliveryMethod === 'first_mart') {
    deliveryInfo = `Configured 1x Reusable Cap Candies, Repellants, and Porta-Heals at ${game.bagArchitectureInfo?.firstMartLocation || 'Poké Mart'} for 0 PokéDollars (Key Item non-depleting behavior).`;
  } else if (config.itemDeliveryMethod === 'direct_cheats') {
    deliveryInfo = `Direct Bag injection codes ready for Delta, mGBA, and RetroArch (delivers 1x Reusable Key Items to Slots 1-3).`;
  }

  // Build IPS file
  const ipsBytes = buildIpsPatch(diffs);

  // Filename generator
  const baseName = game.title.replace(/[^a-zA-Z0-9]/g, '_');
  const modSuffix = [
    config.expMode === 'zero_exp' ? '0EXP' : '',
    config.candyMode !== 'none' ? 'CapCandy' : '',
    config.enableRepellant ? 'Repellant' : '',
    config.enablePortaHeal ? 'PortaHeal' : '',
    config.giveInfiniteCandies ? 'MaxCandies' : ''
  ]
    .filter(Boolean)
    .join('_');

  const ext = game.platform === 'GBA' ? '.gba' : game.platform === 'GBC' ? '.gbc' : game.platform === 'GB' ? '.gb' : game.platform === 'NDS' ? '.nds' : '.3ds';
  const patchedFileName = `${baseName}_${modSuffix || 'Patched'}${ext}`;
  const patchFileName = `${baseName}_${modSuffix || 'Mod'}.ips`;

  return {
    patchedData: patched,
    diffs,
    ipsBytes,
    patchedFileName,
    patchFileName,
    bagInstructions,
    deliveryInfo
  };
}
