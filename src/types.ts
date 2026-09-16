export type Platform = 'GBA' | 'GBC' | 'GB' | 'NDS' | '3DS';

export interface LevelCapEntry {
  id: string;
  name: string;
  badgeName: string;
  gymNumber: number;
  defaultLevel: number;
  customLevel: number;
  description: string;
  badgeFlag?: number; // GBA/GB/NDS flag ID if known
}

export interface BagArchitectureInfo {
  bagUnlockedAtStart: boolean;
  unlockCondition?: string;
  pocketsDescription: string;
  pcStorageLocation: string;
  firstMartLocation: string;
  capCandyPocket: string;
  repellantPocket: string;
  portaHealPocket: string;
}

export interface GameDefinition {
  id: string;
  title: string;
  subtitle: string;
  generation: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  platform: Platform;
  gameCode: string; // e.g. "BPRE", "BPEE", "BYTE", "A2AE"
  internalTitle: string; // e.g. "POKEMON FIRE", "POKEMON US"
  expectedCrc32?: string;
  expectedSize: number; // in bytes
  levelCaps: LevelCapEntry[];
  bagArchitectureInfo?: BagArchitectureInfo;
  zeroExpOffsets?: Array<{
    offset: number;
    original: number[];
    patched: number[];
    description: string;
  }>;
  capCandyOffsets?: Array<{
    offset: number;
    original: number[];
    patched: number[];
    description: string;
  }>;
  repellantOffsets?: Array<{
    offset: number;
    original: number[];
    patched: number[];
    description: string;
  }>;
  portaHealOffsets?: Array<{
    offset: number;
    original: number[];
    patched: number[];
    description: string;
  }>;
  layeredFsPath?: string; // 3DS Luma3DS LayeredFS Title ID path e.g. 00040000001B5000
  cheatCodes: {
    engine: string;
    zeroExp: string;
    rareCandyCap?: string;
    infiniteCandies?: string;
    repellant?: string;
    portaHeal?: string;
    directBagSlot1?: string;
    directBagSlot2?: string;
    directBagSlot3?: string;
  };
}

export interface RomHeaderInfo {
  fileName: string;
  fileSize: number;
  crc32: string;
  title: string;
  gameCode: string;
  makerCode: string;
  version: number;
  platform: Platform;
  detectedGame?: GameDefinition;
  isCompatible: boolean;
}

export type ExpModMode = 'none' | 'zero_exp' | 'cap_cutoff';

export type CandyModMode = 'none' | 'respect_cap' | 'auto_level_to_cap';

export type ItemDeliveryMethod = 'pc_storage' | 'first_mart' | 'direct_cheats';

export interface PatchConfig {
  expMode: ExpModMode;
  candyMode: CandyModMode;
  giveInfiniteCandies: boolean;
  itemDeliveryMethod: ItemDeliveryMethod;
  // Refined Cap Candy Options
  capCandyStopAtNewMove: boolean; // Pause when Pokémon learns a new move during level-up
  capCandyFailIfAtCap: boolean; // Item use fails with "It won't have any effect." if already at or above cap
  // Additional Custom Items
  enableRepellant: boolean; // Toggleable infinite Repel via Key Items to avoid wild encounters
  enablePortaHeal: boolean; // Field item that restores full HP & cures all status conditions across the whole party
  activeCapPreset: 'vanilla' | 'hardcore' | 'custom';
  customCaps: Record<string, number>;
}

export interface ByteDiff {
  offset: number;
  offsetHex: string;
  originalByte: number;
  patchedByte: number;
  description: string;
}

export interface PatchResult {
  patchedData: Uint8Array;
  diffs: ByteDiff[];
  ipsBytes: Uint8Array;
  patchedFileName: string;
  patchFileName: string;
  bagInstructions?: string;
  deliveryInfo?: string;
}
