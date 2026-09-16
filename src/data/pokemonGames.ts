import { GameDefinition } from '../types';

export const POKEMON_GAMES: GameDefinition[] = [
  {
    id: 'firered-us',
    title: 'Pokémon FireRed',
    subtitle: 'Version 1.0 (USA)',
    generation: 3,
    platform: 'GBA',
    gameCode: 'BPRE',
    internalTitle: 'POKEMON FIRE',
    expectedCrc32: 'dd5945db',
    expectedSize: 16777216, // 16MB
    levelCaps: [
      { id: 'fr-brock', name: 'Brock', badgeName: 'Boulder Badge', gymNumber: 1, defaultLevel: 14, customLevel: 14, description: 'Pewter City Gym (Geodude, Onix)', badgeFlag: 0x820 },
      { id: 'fr-misty', name: 'Misty', badgeName: 'Cascade Badge', gymNumber: 2, defaultLevel: 21, customLevel: 21, description: 'Cerulean City Gym (Staryu, Starmie)', badgeFlag: 0x821 },
      { id: 'fr-surge', name: 'Lt. Surge', badgeName: 'Thunder Badge', gymNumber: 3, defaultLevel: 24, customLevel: 24, description: 'Vermilion City Gym (Voltorb, Pikachu, Raichu)', badgeFlag: 0x822 },
      { id: 'fr-erika', name: 'Erika', badgeName: 'Rainbow Badge', gymNumber: 4, defaultLevel: 29, customLevel: 29, description: 'Celadon City Gym (Victreebel, Tangela, Vileplume)', badgeFlag: 0x823 },
      { id: 'fr-koga', name: 'Koga', badgeName: 'Soul Badge', gymNumber: 5, defaultLevel: 43, customLevel: 43, description: 'Fuchsia City Gym (Koffing, Muk, Weezing)', badgeFlag: 0x824 },
      { id: 'fr-sabrina', name: 'Sabrina', badgeName: 'Marsh Badge', gymNumber: 6, defaultLevel: 43, customLevel: 43, description: 'Saffron City Gym (Kadabra, Mr. Mime, Venomoth, Alakazam)', badgeFlag: 0x825 },
      { id: 'fr-blaine', name: 'Blaine', badgeName: 'Volcano Badge', gymNumber: 7, defaultLevel: 47, customLevel: 47, description: 'Cinnabar Island Gym (Growlithe, Ponyta, Rapidash, Arcanine)', badgeFlag: 0x826 },
      { id: 'fr-giovanni', name: 'Giovanni', badgeName: 'Earth Badge', gymNumber: 8, defaultLevel: 50, customLevel: 50, description: 'Viridian City Gym (Rhyhorn, Dugtrio, Nidoqueen, Nidoking, Rhydon)', badgeFlag: 0x827 },
      { id: 'fr-e4-lorelei', name: 'Lorelei', badgeName: 'Elite Four 1', gymNumber: 9, defaultLevel: 54, customLevel: 54, description: 'Indigo Plateau (Dewgong, Cloyster, Slowbro, Jynx, Lapras)' },
      { id: 'fr-e4-bruno', name: 'Bruno', badgeName: 'Elite Four 2', gymNumber: 10, defaultLevel: 56, customLevel: 56, description: 'Indigo Plateau (Onix, Hitmonchan, Hitmonlee, Machamp)' },
      { id: 'fr-e4-agatha', name: 'Agatha', badgeName: 'Elite Four 3', gymNumber: 11, defaultLevel: 58, customLevel: 58, description: 'Indigo Plateau (Gengar, Golbat, Haunter, Arbok)' },
      { id: 'fr-e4-lance', name: 'Lance', badgeName: 'Elite Four 4', gymNumber: 12, defaultLevel: 60, customLevel: 60, description: 'Indigo Plateau (Gyarados, Dragonair, Aerodactyl, Dragonite)' },
      { id: 'fr-champion', name: 'Champion Blue', badgeName: 'Indigo Champion', gymNumber: 13, defaultLevel: 63, customLevel: 63, description: 'Indigo Plateau (Highest level: Starter Lv 63)' }
    ],
    bagArchitectureInfo: {
      bagUnlockedAtStart: false,
      unlockCondition: "In FireRed/LeafGreen, the player starts with NO Bag in the start menu! The Bag only unlocks after delivering Oak's Parcel from Viridian City to Professor Oak in Pallet Town.",
      pocketsDescription: "Key Items & Items Pockets: Holds your 1x Reusable Cap Candy, 1x Reusable Repellant, and 1x Reusable Porta-Heal.",
      pcStorageLocation: "Player Bedroom PC in Pallet Town (accessible on turn 1 before leaving house!)",
      firstMartLocation: "Viridian City Poké Mart (Route 1 north)",
      capCandyPocket: "Key Items Pocket (1x Reusable Cap Candy)",
      repellantPocket: "Key Items Pocket (1x Reusable Repellant)",
      portaHealPocket: "Key Items Pocket (1x Reusable Porta-Heal)"
    },
    zeroExpOffsets: [
      {
        offset: 0x021CFC,
        original: [0x00, 0x00],
        patched: [0xC0, 0x46], // NOP (mov r8, r8) in Thumb: cleanly bypasses exp calculation without corrupting stack or battle script
        description: 'BPRE 1.0 Cmd_getexp formula bypass - Safe Zero EXP (Fixes battle freeze & blank textbox)'
      }
    ],
    capCandyOffsets: [
      {
        offset: 0x04068C,
        original: [0x64, 0x28], // cmp r0, #100 (standard level 100 limit check)
        patched: [0x00, 0x00], // hijacked branch for level cap check
        description: 'Rare Candy effect routine level threshold comparator'
      }
    ],
    cheatCodes: {
      engine: 'Action Replay / GameShark / Codebreaker (GBA)',
      zeroExp: '// FireRed 1.0 (USA):\n72023D74 869A\n82023D50 0000\n\n// FireRed 1.1 (USA):\n72023D74 870A\n82023D50 0000',
      directBagSlot1: '82025840 0044\n82025842 0001',
      directBagSlot2: '82025844 0054\n82025846 0001',
      directBagSlot3: '82025848 0013\n8202584A 0001',
      rareCandyCap: '// Pallet Town Bedroom PC Storage Slot 1 (1x Reusable Cap Candy):\n820257C0 0044\n820257C2 0001',
      infiniteCandies: '// Direct Bag Slot 1: 1x Infinite Reusable Cap Candy (Key Item - Never Consumed)\n82025840 0044\n82025842 0001',
      repellant: '// Direct Bag Slot 2: 1x Infinite Reusable Repellant (Key Item - Toggleable)\n82025844 0054\n82025846 0001\n// Freeze 255 Repel Steps:\n020370B8 000000FF',
      portaHeal: '// Direct Bag Slot 3: 1x Infinite Reusable Porta-Heal (Key Item - Full Party Restore)\n82025848 0013\n8202584A 0001'
    }
  },
  {
    id: 'emerald-us',
    title: 'Pokémon Emerald',
    subtitle: 'Version 1.0 (USA)',
    generation: 3,
    platform: 'GBA',
    gameCode: 'BPEE',
    internalTitle: 'POKEMON EMER',
    expectedCrc32: '605b89b5',
    expectedSize: 16777216,
    levelCaps: [
      { id: 'em-roxanne', name: 'Roxanne', badgeName: 'Stone Badge', gymNumber: 1, defaultLevel: 15, customLevel: 15, description: 'Rustboro Gym (Geodude, Nosepass Lv 15)', badgeFlag: 0x867 },
      { id: 'em-brawly', name: 'Brawly', badgeName: 'Knuckle Badge', gymNumber: 2, defaultLevel: 19, customLevel: 19, description: 'Dewford Gym (Machop, Meditite, Makuhita Lv 19)', badgeFlag: 0x868 },
      { id: 'em-wattson', name: 'Wattson', badgeName: 'Dynamo Badge', gymNumber: 3, defaultLevel: 24, customLevel: 24, description: 'Mauville Gym (Voltorb, Electrike, Magneton, Manectric Lv 24)', badgeFlag: 0x869 },
      { id: 'em-flannery', name: 'Flannery', badgeName: 'Heat Badge', gymNumber: 4, defaultLevel: 29, customLevel: 29, description: 'Lavaridge Gym (Numel, Slugma, Camerupt, Torkoal Lv 29)', badgeFlag: 0x86A },
      { id: 'em-norman', name: 'Norman', badgeName: 'Balance Badge', gymNumber: 5, defaultLevel: 31, customLevel: 31, description: 'Petalburg Gym (Spinda, Vigoroth, Linoone, Slaking Lv 31)', badgeFlag: 0x86B },
      { id: 'em-winona', name: 'Winona', badgeName: 'Feather Badge', gymNumber: 6, defaultLevel: 33, customLevel: 33, description: 'Fortree Gym (Swablu, Tropius, Pelipper, Skarmory, Altaria Lv 33)', badgeFlag: 0x86C },
      { id: 'em-tate-liza', name: 'Tate & Liza', badgeName: 'Mind Badge', gymNumber: 7, defaultLevel: 42, customLevel: 42, description: 'Mossdeep Gym (Claydol, Xatu, Lunatone, Solrock Lv 42)', badgeFlag: 0x86D },
      { id: 'em-juan', name: 'Juan', badgeName: 'Rain Badge', gymNumber: 8, defaultLevel: 43, customLevel: 43, description: 'Sootopolis Gym (Luvdisc, Whiscash, Sealeo, Crawdaunt, Kingdra Lv 43)', badgeFlag: 0x86E },
      { id: 'em-e4-sidney', name: 'Sidney', badgeName: 'Elite Four 1', gymNumber: 9, defaultLevel: 49, customLevel: 49, description: 'Ever Grande (Mightyena, Shiftry, Cacturne, Crawdaunt, Absol)' },
      { id: 'em-e4-phoebe', name: 'Phoebe', badgeName: 'Elite Four 2', gymNumber: 10, defaultLevel: 51, customLevel: 51, description: 'Ever Grande (Dusclops, Banette, Sableye)' },
      { id: 'em-e4-glacia', name: 'Glacia', badgeName: 'Elite Four 3', gymNumber: 11, defaultLevel: 53, customLevel: 53, description: 'Ever Grande (Glalie, Sealeo, Walrein)' },
      { id: 'em-e4-drake', name: 'Drake', badgeName: 'Elite Four 4', gymNumber: 12, defaultLevel: 55, customLevel: 55, description: 'Ever Grande (Shelgon, Altaria, Flygon, Kingdra, Salamence)' },
      { id: 'em-champion', name: 'Champion Wallace', badgeName: 'Hoenn Champion', gymNumber: 13, defaultLevel: 58, customLevel: 58, description: 'Ever Grande (Wailord, Tentacruel, Ludicolo, Whiscash, Gyarados, Milotic Lv 58)' },
      { id: 'em-steven', name: 'Steven Stone', badgeName: 'Meteor Falls Boss', gymNumber: 14, defaultLevel: 78, customLevel: 78, description: 'Postgame Meteor Falls (Metagross Lv 78)' }
    ],
    bagArchitectureInfo: {
      bagUnlockedAtStart: true,
      unlockCondition: "Unlocked immediately at start of adventure in Littleroot Town.",
      pocketsDescription: "Key Items & Items Pockets: Holds your 1x Reusable Cap Candy, 1x Reusable Repellant, and 1x Reusable Porta-Heal.",
      pcStorageLocation: "Player Bedroom PC in Littleroot Town",
      firstMartLocation: "Oldale Town Poké Mart (Route 101 north)",
      capCandyPocket: "Key Items Pocket (1x Reusable Cap Candy)",
      repellantPocket: "Key Items Pocket (1x Reusable Repellant)",
      portaHealPocket: "Key Items Pocket (1x Reusable Porta-Heal)"
    },
    zeroExpOffsets: [
      {
        offset: 0x04A6B8,
        original: [0x28, 0x1C, 0x09, 0x02],
        patched: [0xC0, 0x46, 0xC0, 0x46], // NOP out exp calculation
        description: 'BPEE 1.0 Cmd_getexp formula bypass - Safe Zero EXP (No battle freeze)'
      }
    ],
    capCandyOffsets: [
      {
        offset: 0x06B4D8,
        original: [0x64, 0x28],
        patched: [0x00, 0x00],
        description: 'BPEE 1.0 Rare Candy maximum level ceiling handler'
      }
    ],
    cheatCodes: {
      engine: 'Action Replay / GameShark / Codebreaker (GBA)',
      zeroExp: '820241F0 0000',
      directBagSlot1: '82025D34 0044\n82025D36 0001',
      directBagSlot2: '82025D38 0054\n82025D3A 0001',
      directBagSlot3: '82025D3C 0013\n82025D3E 0001',
      rareCandyCap: 'D0000000 0000\n82003884 0044',
      infiniteCandies: '// Direct Bag Slot 1: 1x Infinite Reusable Cap Candy (Key Item - Never Consumed)\n82025D34 0044\n82025D36 0001',
      repellant: '// Direct Bag Slot 2: 1x Infinite Reusable Repellant (Key Item - Toggleable)\n82025D38 0054\n82025D3A 0001\n// Step Counter Lock (255 steps):\n020370B8 000000FF',
      portaHeal: '// Direct Bag Slot 3: 1x Infinite Reusable Porta-Heal (Key Item - Full Party Restore)\n82025D3C 0013\n82025D3E 0001'
    },
    repellantOffsets: [
      {
        offset: 0x06DD08,
        original: [0x50, 0x18, 0x01, 0x28],
        patched: [0x00, 0x20, 0x70, 0x47], // Wild encounter generator early exit if Key Item Repellant active
        description: 'BPEE 1.0 WildEncounterCheck routine repellant bypass check'
      }
    ],
    portaHealOffsets: [
      {
        offset: 0x043A14,
        original: [0x00, 0x28, 0x02, 0xD0],
        patched: [0x06, 0x20, 0x00, 0x00], // Loop full party 6 slots heal HP + clear status
        description: 'BPEE 1.0 Porta-Heal party-wide restorative subroutine hook'
      }
    ]
  },
  {
    id: 'crystal-us',
    title: 'Pokémon Crystal',
    subtitle: 'Version 1.0 (USA)',
    generation: 2,
    platform: 'GBC',
    gameCode: 'BYTE',
    internalTitle: 'PM_CRYSTAL',
    expectedCrc32: '9f2922b3',
    expectedSize: 2097152, // 2MB
    levelCaps: [
      { id: 'c-falkner', name: 'Falkner', badgeName: 'Zephyr Badge', gymNumber: 1, defaultLevel: 9, customLevel: 9, description: 'Violet City Gym (Pidgeotto Lv 9)' },
      { id: 'c-bugsy', name: 'Bugsy', badgeName: 'Hive Badge', gymNumber: 2, defaultLevel: 16, customLevel: 16, description: 'Azalea Town Gym (Scyther Lv 16)' },
      { id: 'c-whitney', name: 'Whitney', badgeName: 'Plain Badge', gymNumber: 3, defaultLevel: 20, customLevel: 20, description: 'Goldenrod City Gym (Miltank Lv 20)' },
      { id: 'c-morty', name: 'Morty', badgeName: 'Fog Badge', gymNumber: 4, defaultLevel: 25, customLevel: 25, description: 'Ecruteak City Gym (Gengar Lv 25)' },
      { id: 'c-chuck', name: 'Chuck', badgeName: 'Storm Badge', gymNumber: 5, defaultLevel: 30, customLevel: 30, description: 'Cianwood City Gym (Poliwrath Lv 30)' },
      { id: 'c-jasmine', name: 'Jasmine', badgeName: 'Mineral Badge', gymNumber: 6, defaultLevel: 35, customLevel: 35, description: 'Olivine City Gym (Steelix Lv 35)' },
      { id: 'c-pryce', name: 'Pryce', badgeName: 'Glacier Badge', gymNumber: 7, defaultLevel: 34, customLevel: 34, description: 'Mahogany Town Gym (Piloswine Lv 34)' },
      { id: 'c-clair', name: 'Clair', badgeName: 'Rising Badge', gymNumber: 8, defaultLevel: 40, customLevel: 40, description: 'Blackthorn City Gym (Kingdra Lv 40)' },
      { id: 'c-e4-lance', name: 'Champion Lance', badgeName: 'Johto Champion', gymNumber: 9, defaultLevel: 50, customLevel: 50, description: 'Indigo Plateau (Dragonite Lv 50)' },
      { id: 'c-red', name: 'Red', badgeName: 'Mt. Silver Boss', gymNumber: 10, defaultLevel: 81, customLevel: 81, description: 'Mt. Silver Peak (Pikachu Lv 81)' }
    ],
    bagArchitectureInfo: {
      bagUnlockedAtStart: true,
      unlockCondition: "Pack is available immediately from New Bark Town.",
      pocketsDescription: "4 Pockets: Items (holds Candies, Max Repels, Full Restores), Balls, Key Items, TM/HM.",
      pcStorageLocation: "Player Bedroom PC in New Bark Town",
      firstMartLocation: "Cherrygrove City Poké Mart",
      capCandyPocket: "Items Pocket (Slot 1)",
      repellantPocket: "Items Pocket (Slot 2)",
      portaHealPocket: "Items Pocket (Slot 3)"
    },
    zeroExpOffsets: [
      {
        offset: 0x038100,
        original: [0xFA, 0x12, 0xD1],
        patched: [0xC9, 0x00, 0x00], // Z80 RET instruction
        description: 'Z80 CalcExperience immediate RET (0 EXP awarded)'
      }
    ],
    cheatCodes: {
      engine: 'GameShark (GBC)',
      zeroExp: '010022D1',
      directBagSlot1: '0120E2D8',
      directBagSlot2: '0153E4D8',
      directBagSlot3: '0112E6D8',
      infiniteCandies: '0120E2D8',
      repellant: '0153E4D8',
      portaHeal: '0112E6D8'
    }
  },
  {
    id: 'red-blue-us',
    title: 'Pokémon Red / Blue',
    subtitle: 'Version 1.0 (USA)',
    generation: 1,
    platform: 'GB',
    gameCode: 'APAE',
    internalTitle: 'POKEMON RED',
    expectedCrc32: 'ea9bcae6',
    expectedSize: 1048576, // 1MB or 512KB
    levelCaps: [
      { id: 'rb-brock', name: 'Brock', badgeName: 'Boulder Badge', gymNumber: 1, defaultLevel: 14, customLevel: 14, description: 'Pewter Gym (Onix Lv 14)' },
      { id: 'rb-misty', name: 'Misty', badgeName: 'Cascade Badge', gymNumber: 2, defaultLevel: 21, customLevel: 21, description: 'Cerulean Gym (Starmie Lv 21)' },
      { id: 'rb-surge', name: 'Lt. Surge', badgeName: 'Thunder Badge', gymNumber: 3, defaultLevel: 24, customLevel: 24, description: 'Vermilion Gym (Raichu Lv 24)' },
      { id: 'rb-erika', name: 'Erika', badgeName: 'Rainbow Badge', gymNumber: 4, defaultLevel: 29, customLevel: 29, description: 'Celadon Gym (Vileplume Lv 29)' },
      { id: 'rb-koga', name: 'Koga', badgeName: 'Soul Badge', gymNumber: 5, defaultLevel: 43, customLevel: 43, description: 'Fuchsia Gym (Weezing Lv 43)' },
      { id: 'rb-sabrina', name: 'Sabrina', badgeName: 'Marsh Badge', gymNumber: 6, defaultLevel: 43, customLevel: 43, description: 'Saffron Gym (Alakazam Lv 43)' },
      { id: 'rb-blaine', name: 'Blaine', badgeName: 'Volcano Badge', gymNumber: 7, defaultLevel: 47, customLevel: 47, description: 'Cinnabar Gym (Arcanine Lv 47)' },
      { id: 'rb-giovanni', name: 'Giovanni', badgeName: 'Earth Badge', gymNumber: 8, defaultLevel: 50, customLevel: 50, description: 'Viridian Gym (Rhydon Lv 50)' },
      { id: 'rb-e4-lorelei', name: 'Lorelei', badgeName: 'Elite Four 1', gymNumber: 9, defaultLevel: 56, customLevel: 56, description: 'Indigo Plateau (Lapras Lv 56)' },
      { id: 'rb-e4-bruno', name: 'Bruno', badgeName: 'Elite Four 2', gymNumber: 10, defaultLevel: 58, customLevel: 58, description: 'Indigo Plateau (Machamp Lv 58)' },
      { id: 'rb-e4-agatha', name: 'Agatha', badgeName: 'Elite Four 3', gymNumber: 11, defaultLevel: 60, customLevel: 60, description: 'Indigo Plateau (Gengar Lv 60)' },
      { id: 'rb-e4-lance', name: 'Lance', badgeName: 'Elite Four 4', gymNumber: 12, defaultLevel: 62, customLevel: 62, description: 'Indigo Plateau (Dragonite Lv 62)' },
      { id: 'rb-champion', name: 'Champion Blue', badgeName: 'Indigo Champion', gymNumber: 13, defaultLevel: 65, customLevel: 65, description: 'Indigo Plateau (Starter Lv 65)' }
    ],
    bagArchitectureInfo: {
      bagUnlockedAtStart: true,
      unlockCondition: "Bag (Item Pack) is accessible from start menu immediately in Pallet Town.",
      pocketsDescription: "Single Bag Pocket (20 item limit for all items, balls, and key items).",
      pcStorageLocation: "Player Bedroom PC in Pallet Town (holds 50 items)",
      firstMartLocation: "Viridian City Poké Mart",
      capCandyPocket: "Single Bag Pocket (Slot 1)",
      repellantPocket: "Single Bag Pocket (Slot 2)",
      portaHealPocket: "Single Bag Pocket (Slot 3)"
    },
    zeroExpOffsets: [
      {
        offset: 0x039EBD,
        original: [0x21, 0x48, 0xD0],
        patched: [0xC9, 0x00, 0x00], // Z80 RET
        description: 'GainExperience battle routine instant return'
      }
    ],
    cheatCodes: {
      engine: 'GameShark (GB)',
      zeroExp: '010048D0',
      directBagSlot1: '012864D3',
      directBagSlot2: '011266D3',
      directBagSlot3: '011068D3',
      infiniteCandies: '012864D3',
      repellant: '011266D3',
      portaHeal: '011068D3'
    }
  },
  {
    id: 'platinum-us',
    title: 'Pokémon Platinum',
    subtitle: 'Version 1.0 (USA)',
    generation: 4,
    platform: 'NDS',
    gameCode: 'CPUE',
    internalTitle: 'POKEMON PL',
    expectedSize: 134217728, // 128MB
    levelCaps: [
      { id: 'pl-roark', name: 'Roark', badgeName: 'Coal Badge', gymNumber: 1, defaultLevel: 14, customLevel: 14, description: 'Oreburgh Gym (Cranidos Lv 14)' },
      { id: 'pl-gardenia', name: 'Gardenia', badgeName: 'Forest Badge', gymNumber: 2, defaultLevel: 22, customLevel: 22, description: 'Eterna Gym (Roserade Lv 22)' },
      { id: 'pl-fantina', name: 'Fantina', badgeName: 'Relic Badge', gymNumber: 3, defaultLevel: 26, customLevel: 26, description: 'Hearthome Gym (Mismagius Lv 26)' },
      { id: 'pl-maylene', name: 'Maylene', badgeName: 'Cobble Badge', gymNumber: 4, defaultLevel: 32, customLevel: 32, description: 'Veilstone Gym (Lucario Lv 32)' },
      { id: 'pl-wake', name: 'Crasher Wake', badgeName: 'Fen Badge', gymNumber: 5, defaultLevel: 37, customLevel: 37, description: 'Pastoria Gym (Floatzel Lv 37)' },
      { id: 'pl-byron', name: 'Byron', badgeName: 'Mine Badge', gymNumber: 6, defaultLevel: 41, customLevel: 41, description: 'Canalave Gym (Bastiodon Lv 41)' },
      { id: 'pl-candice', name: 'Candice', badgeName: 'Icicle Badge', gymNumber: 7, defaultLevel: 44, customLevel: 44, description: 'Snowpoint Gym (Froslass Lv 44)' },
      { id: 'pl-volkner', name: 'Volkner', badgeName: 'Beacon Badge', gymNumber: 8, defaultLevel: 50, customLevel: 50, description: 'Sunyshore Gym (Electivire Lv 50)' },
      { id: 'pl-e4-aaron', name: 'Aaron', badgeName: 'Elite Four 1', gymNumber: 9, defaultLevel: 53, customLevel: 53, description: 'Pokémon League (Drapion Lv 53)' },
      { id: 'pl-e4-bertha', name: 'Bertha', badgeName: 'Elite Four 2', gymNumber: 10, defaultLevel: 55, customLevel: 55, description: 'Pokémon League (Hippowdon Lv 55)' },
      { id: 'pl-e4-flint', name: 'Flint', badgeName: 'Elite Four 3', gymNumber: 11, defaultLevel: 57, customLevel: 57, description: 'Pokémon League (Magmortar Lv 57)' },
      { id: 'pl-e4-lucian', name: 'Lucian', badgeName: 'Elite Four 4', gymNumber: 12, defaultLevel: 59, customLevel: 59, description: 'Pokémon League (Gallade Lv 59)' },
      { id: 'pl-cynthia', name: 'Champion Cynthia', badgeName: 'Sinnoh Champion', gymNumber: 13, defaultLevel: 62, customLevel: 62, description: 'Pokémon League (Garchomp Lv 62)' }
    ],
    bagArchitectureInfo: {
      bagUnlockedAtStart: true,
      unlockCondition: "Unlocked after receiving Starter in Lake Verity / Sandgem Town.",
      pocketsDescription: "Key Items & Medicine Pockets: Holds your 1x Reusable Cap Candy, 1x Reusable Repellant, and 1x Reusable Porta-Heal.",
      pcStorageLocation: "Player Bedroom PC in Twinleaf Town",
      firstMartLocation: "Sandgem Town Poké Mart",
      capCandyPocket: "Key Items Pocket (1x Reusable Cap Candy)",
      repellantPocket: "Key Items Pocket (1x Reusable Repellant)",
      portaHealPocket: "Key Items Pocket (1x Reusable Porta-Heal)"
    },
    cheatCodes: {
      engine: 'Action Replay DS',
      zeroExp: '5224A8B0 0C000000\n1224A8B4 00000000\nD2000000 00000000',
      directBagSlot1: '94000130 FFFB0000\n62101140 00000000\nB2101140 00000000\n00000890 00010032\nD2000000 00000000',
      directBagSlot2: '94000130 FFFB0000\n62101140 00000000\nB2101140 00000000\n00000894 00010054\nD2000000 00000000',
      directBagSlot3: '94000130 FFFB0000\n62101140 00000000\nB2101140 00000000\n00000898 00010013\nD2000000 00000000',
      infiniteCandies: '94000130 FFFB0000\n62101140 00000000\nB2101140 00000000\n00000890 00010032\nD2000000 00000000'
    }
  },
  {
    id: 'heartgold-us',
    title: 'Pokémon HeartGold / SoulSilver',
    subtitle: 'Version 1.0 (USA)',
    generation: 4,
    platform: 'NDS',
    gameCode: 'IPKE',
    internalTitle: 'POKEMON HG',
    expectedSize: 134217728,
    levelCaps: [
      { id: 'hg-falkner', name: 'Falkner', badgeName: 'Zephyr Badge', gymNumber: 1, defaultLevel: 13, customLevel: 13, description: 'Violet Gym (Pidgeotto Lv 13)' },
      { id: 'hg-bugsy', name: 'Bugsy', badgeName: 'Hive Badge', gymNumber: 2, defaultLevel: 17, customLevel: 17, description: 'Azalea Gym (Scyther Lv 17)' },
      { id: 'hg-whitney', name: 'Whitney', badgeName: 'Plain Badge', gymNumber: 3, defaultLevel: 19, customLevel: 19, description: 'Goldenrod Gym (Miltank Lv 19)' },
      { id: 'hg-morty', name: 'Morty', badgeName: 'Fog Badge', gymNumber: 4, defaultLevel: 25, customLevel: 25, description: 'Ecruteak Gym (Gengar Lv 25)' },
      { id: 'hg-chuck', name: 'Chuck', badgeName: 'Storm Badge', gymNumber: 5, defaultLevel: 31, customLevel: 31, description: 'Cianwood Gym (Poliwrath Lv 31)' },
      { id: 'hg-jasmine', name: 'Jasmine', badgeName: 'Mineral Badge', gymNumber: 6, defaultLevel: 35, customLevel: 35, description: 'Olivine Gym (Steelix Lv 35)' },
      { id: 'hg-pryce', name: 'Pryce', badgeName: 'Glacier Badge', gymNumber: 7, defaultLevel: 34, customLevel: 34, description: 'Mahogany Gym (Piloswine Lv 34)' },
      { id: 'hg-clair', name: 'Clair', badgeName: 'Rising Badge', gymNumber: 8, defaultLevel: 41, customLevel: 41, description: 'Blackthorn Gym (Kingdra Lv 41)' },
      { id: 'hg-e4-will', name: 'Will', badgeName: 'Elite Four 1', gymNumber: 9, defaultLevel: 42, customLevel: 42, description: 'Indigo Plateau (Xatu Lv 42)' },
      { id: 'hg-e4-koga', name: 'Koga', badgeName: 'Elite Four 2', gymNumber: 10, defaultLevel: 44, customLevel: 44, description: 'Indigo Plateau (Crobat Lv 44)' },
      { id: 'hg-e4-bruno', name: 'Bruno', badgeName: 'Elite Four 3', gymNumber: 11, defaultLevel: 46, customLevel: 46, description: 'Indigo Plateau (Machamp Lv 46)' },
      { id: 'hg-e4-karen', name: 'Karen', badgeName: 'Elite Four 4', gymNumber: 12, defaultLevel: 47, customLevel: 47, description: 'Indigo Plateau (Houndoom Lv 47)' },
      { id: 'hg-lance', name: 'Champion Lance', badgeName: 'Johto Champion', gymNumber: 13, defaultLevel: 50, customLevel: 50, description: 'Indigo Plateau (Dragonite Lv 50)' },
      { id: 'hg-red', name: 'Red', badgeName: 'Mt. Silver Legend', gymNumber: 14, defaultLevel: 88, customLevel: 88, description: 'Mt. Silver Peak (Pikachu Lv 88)' }
    ],
    bagArchitectureInfo: {
      bagUnlockedAtStart: true,
      unlockCondition: "Touch-screen Bag is available immediately at start of adventure in New Bark Town.",
      pocketsDescription: "Key Items & Medicine Pockets: Holds your 1x Reusable Cap Candy, 1x Reusable Repellant, and 1x Reusable Porta-Heal.",
      pcStorageLocation: "Player Bedroom PC in New Bark Town",
      firstMartLocation: "Cherrygrove City Poké Mart",
      capCandyPocket: "Key Items Pocket (1x Reusable Cap Candy)",
      repellantPocket: "Key Items Pocket (1x Reusable Repellant)",
      portaHealPocket: "Key Items Pocket (1x Reusable Porta-Heal)"
    },
    cheatCodes: {
      engine: 'Action Replay DS',
      zeroExp: '5224BC00 0C000000\n1224BC04 00000000\nD2000000 00000000',
      directBagSlot1: '94000130 FFFB0000\n62111880 00000000\nB2111880 00000000\n00000D00 00010032\nD2000000 00000000',
      directBagSlot2: '94000130 FFFB0000\n62111880 00000000\nB2111880 00000000\n00000D04 00010054\nD2000000 00000000',
      directBagSlot3: '94000130 FFFB0000\n62111880 00000000\nB2111880 00000000\n00000D08 00010013\nD2000000 00000000',
      infiniteCandies: '94000130 FFFB0000\n62111880 00000000\nB2111880 00000000\n00000D00 00010032\nD2000000 00000000'
    }
  },
  {
    id: 'blackwhite-us',
    title: 'Pokémon Black / White',
    subtitle: 'Version 1.0 (USA)',
    generation: 5,
    platform: 'NDS',
    gameCode: 'IRAE',
    internalTitle: 'POKEMON B',
    expectedSize: 268435456, // 256MB
    levelCaps: [
      { id: 'bw-cress', name: 'Cilan / Chili / Cress', badgeName: 'Trio Badge', gymNumber: 1, defaultLevel: 14, customLevel: 14, description: 'Striaton Gym (Elemental Monkey Lv 14)' },
      { id: 'bw-lenora', name: 'Lenora', badgeName: 'Basic Badge', gymNumber: 2, defaultLevel: 20, customLevel: 20, description: 'Nacrene Gym (Watchog Lv 20)' },
      { id: 'bw-burgh', name: 'Burgh', badgeName: 'Insect Badge', gymNumber: 3, defaultLevel: 23, customLevel: 23, description: 'Castelia Gym (Leavanny Lv 23)' },
      { id: 'bw-elesa', name: 'Elesa', badgeName: 'Bolt Badge', gymNumber: 4, defaultLevel: 27, customLevel: 27, description: 'Nimbasa Gym (Zebstrika Lv 27)' },
      { id: 'bw-clay', name: 'Clay', badgeName: 'Quake Badge', gymNumber: 5, defaultLevel: 31, customLevel: 31, description: 'Driftveil Gym (Excadrill Lv 31)' },
      { id: 'bw-skyla', name: 'Skyla', badgeName: 'Jet Badge', gymNumber: 6, defaultLevel: 35, customLevel: 35, description: 'Mistralton Gym (Swanna Lv 35)' },
      { id: 'bw-brycen', name: 'Brycen', badgeName: 'Freeze Badge', gymNumber: 7, defaultLevel: 39, customLevel: 39, description: 'Icirrus Gym (Beartic Lv 39)' },
      { id: 'bw-drayden', name: 'Drayden / Iris', badgeName: 'Legend Badge', gymNumber: 8, defaultLevel: 43, customLevel: 43, description: 'Opelucid Gym (Haxorus Lv 43)' },
      { id: 'bw-e4-shauntal', name: 'Shauntal', badgeName: 'Elite Four 1', gymNumber: 9, defaultLevel: 50, customLevel: 50, description: 'Pokémon League (Chandelure Lv 50)' },
      { id: 'bw-e4-marshal', name: 'Marshal', badgeName: 'Elite Four 2', gymNumber: 10, defaultLevel: 50, customLevel: 50, description: 'Pokémon League (Mienshao Lv 50)' },
      { id: 'bw-e4-grimsley', name: 'Grimsley', badgeName: 'Elite Four 3', gymNumber: 11, defaultLevel: 50, customLevel: 50, description: 'Pokémon League (Bisharp Lv 50)' },
      { id: 'bw-e4-caitlin', name: 'Caitlin', badgeName: 'Elite Four 4', gymNumber: 12, defaultLevel: 50, customLevel: 50, description: 'Pokémon League (Gothitelle Lv 50)' },
      { id: 'bw-n', name: 'N (King of Team Plasma)', badgeName: 'Plasma Castle Final', gymNumber: 13, defaultLevel: 52, customLevel: 52, description: "N's Castle (Reshiram/Zekrom Lv 52)" },
      { id: 'bw-ghetsis', name: 'Ghetsis', badgeName: 'Team Plasma Boss', gymNumber: 14, defaultLevel: 54, customLevel: 54, description: "N's Castle Final Confrontation (Hydreigon Lv 54)" },
      { id: 'bw-alder', name: 'Champion Alder', badgeName: 'Unova Champion', gymNumber: 15, defaultLevel: 77, customLevel: 77, description: 'Pokémon League Postgame (Volcarona Lv 77)' }
    ],
    cheatCodes: {
      engine: 'Action Replay DS',
      zeroExp: '521CF628 0C000000\n121CF62C 00000000\nD2000000 00000000',
      infiniteCandies: '94000130 FFFB0000\nB2000024 00000000\n00018D20 03E70032\nD2000000 00000000'
    }
  },
  {
    id: 'ultrasun-us',
    title: 'Pokémon Ultra Sun',
    subtitle: 'Version 1.2 (USA / World 3DS)',
    generation: 7,
    platform: '3DS',
    gameCode: 'A2AE',
    internalTitle: 'POKEMON US',
    expectedSize: 3680501760, // ~3.42 GB CXI / CIA / 3DS
    layeredFsPath: '00040000001B5000',
    levelCaps: [
      { id: 'us-ilima', name: 'Captain Ilima (Verdant Cavern)', badgeName: 'Normalium Z', gymNumber: 1, defaultLevel: 12, customLevel: 12, description: 'Melemele Island Trial (Totem Gumshoos/Raticate Lv 12)' },
      { id: 'us-hala', name: 'Kahuna Hala (Grand Trial)', badgeName: 'Fightinium Z', gymNumber: 2, defaultLevel: 16, customLevel: 16, description: 'Iki Town Grand Trial (Crabrawler Lv 16)' },
      { id: 'us-lana', name: 'Captain Lana (Brooklet Hill)', badgeName: 'Waterium Z', gymNumber: 3, defaultLevel: 20, customLevel: 20, description: 'Akala Island Trial (Totem Araquanid Lv 20)' },
      { id: 'us-kiawe', name: 'Captain Kiawe (Wela Volcano)', badgeName: 'Firium Z', gymNumber: 4, defaultLevel: 22, customLevel: 22, description: 'Akala Island Trial (Totem Marowak-Alola Lv 22)' },
      { id: 'us-mallow', name: 'Captain Mallow (Lush Jungle)', badgeName: 'Grassium Z', gymNumber: 5, defaultLevel: 24, customLevel: 24, description: 'Akala Island Trial (Totem Lurantis Lv 24)' },
      { id: 'us-olivia', name: 'Kahuna Olivia (Grand Trial)', badgeName: 'Rockium Z', gymNumber: 6, defaultLevel: 28, customLevel: 28, description: 'Ruins of Life Grand Trial (Lycanroc Lv 28)' },
      { id: 'us-sophocles', name: 'Captain Sophocles (Observatory)', badgeName: 'Electrium Z', gymNumber: 7, defaultLevel: 33, customLevel: 33, description: 'Mount Hokulani (Totem Togedemaru Lv 33)' },
      { id: 'us-acerola', name: 'Captain Acerola (Thrifty Megamart)', badgeName: 'Ghostium Z', gymNumber: 8, defaultLevel: 35, customLevel: 35, description: 'Ula\'ula Island Trial (Totem Mimikyu Lv 35)' },
      { id: 'us-nanu', name: 'Kahuna Nanu (Grand Trial)', badgeName: 'Darkinium Z', gymNumber: 9, defaultLevel: 44, customLevel: 44, description: 'Malie City Grand Trial (Alolan Persian Lv 44)' },
      { id: 'us-necrozma', name: 'Ultra Necrozma (Megalo Tower)', badgeName: 'Light Trio Peak', gymNumber: 10, defaultLevel: 60, customLevel: 60, description: 'Ultra Megalopolis Boss Battle (Ultra Necrozma Lv 60)' },
      { id: 'us-hapu', name: 'Kahuna Hapu (Grand Trial)', badgeName: 'Groundium Z', gymNumber: 11, defaultLevel: 54, customLevel: 54, description: 'Vast Poni Canyon Grand Trial (Mudsdale Lv 54)' },
      { id: 'us-ribombee', name: 'Totem Ribombee (Mina\'s Trial)', badgeName: 'Fairium Z', gymNumber: 12, defaultLevel: 55, customLevel: 55, description: 'Poni Island Final Trial (Totem Ribombee Lv 55)' },
      { id: 'us-e4-molayne', name: 'Molayne', badgeName: 'Elite Four 1', gymNumber: 13, defaultLevel: 57, customLevel: 57, description: 'Mount Lanakila League (Magnezone Lv 57)' },
      { id: 'us-e4-olivia', name: 'Olivia', badgeName: 'Elite Four 2', gymNumber: 14, defaultLevel: 57, customLevel: 57, description: 'Mount Lanakila League (Lycanroc Lv 57)' },
      { id: 'us-e4-acerola', name: 'Acerola', badgeName: 'Elite Four 3', gymNumber: 15, defaultLevel: 57, customLevel: 57, description: 'Mount Lanakila League (Palossand Lv 57)' },
      { id: 'us-e4-kahili', name: 'Kahili', badgeName: 'Elite Four 4', gymNumber: 16, defaultLevel: 57, customLevel: 57, description: 'Mount Lanakila League (Toucannon Lv 57)' },
      { id: 'us-hau', name: 'Champion Title Defense (Hau)', badgeName: 'Alola Champion', gymNumber: 17, defaultLevel: 60, customLevel: 60, description: 'Mount Lanakila Pokémon League (Decidueye/Incineroar/Primarina Lv 60)' },
      { id: 'us-giovanni', name: 'Rainbow Rocket Giovanni', badgeName: 'Episode RR Boss', gymNumber: 18, defaultLevel: 70, customLevel: 70, description: 'Team Rainbow Rocket Castle (Mega Mewtwo X/Y Lv 70)' }
    ],
    cheatCodes: {
      engine: 'Citra / Luma3DS Gateway / CTRPF (3DS)',
      zeroExp: '[Zero EXP Gain v1.2]\n0804F698 E3A00000\n// ARM11 mov r0, #0 (Zero EXP return)',
      rareCandyCap: '[Cap Candy Respect Flag v1.2]\n0808B214 E1A00000\n// NOP level increment if level >= CurrentCap',
      infiniteCandies: '[999 Rare Candies Item Bag]\n083FF020 03E70032',
      repellant: '[Infinite Clean Repel Field (Key Item)]\n082DF6A0 E3A00001\n// Set wild encounter encounter rate factor to 0',
      portaHeal: '[Porta-Heal Party Refresh]\n08064F90 EB003180\n// Call FullRestoreParty on select'
    }
  },
  {
    id: 'ultramoon-us',
    title: 'Pokémon Ultra Moon',
    subtitle: 'Version 1.2 (USA / World 3DS)',
    generation: 7,
    platform: '3DS',
    gameCode: 'A2BE',
    internalTitle: 'POKEMON UM',
    expectedSize: 3680501760, // ~3.42 GB
    layeredFsPath: '00040000001B5100',
    levelCaps: [
      { id: 'um-ilima', name: 'Captain Ilima (Verdant Cavern)', badgeName: 'Normalium Z', gymNumber: 1, defaultLevel: 12, customLevel: 12, description: 'Melemele Island Trial (Totem Raticate-Alola Lv 12)' },
      { id: 'um-hala', name: 'Kahuna Hala (Grand Trial)', badgeName: 'Fightinium Z', gymNumber: 2, defaultLevel: 16, customLevel: 16, description: 'Iki Town Grand Trial (Crabrawler Lv 16)' },
      { id: 'um-lana', name: 'Captain Lana (Brooklet Hill)', badgeName: 'Waterium Z', gymNumber: 3, defaultLevel: 20, customLevel: 20, description: 'Akala Island Trial (Totem Araquanid Lv 20)' },
      { id: 'um-kiawe', name: 'Captain Kiawe (Wela Volcano)', badgeName: 'Firium Z', gymNumber: 4, defaultLevel: 22, customLevel: 22, description: 'Akala Island Trial (Totem Marowak-Alola Lv 22)' },
      { id: 'um-mallow', name: 'Captain Mallow (Lush Jungle)', badgeName: 'Grassium Z', gymNumber: 5, defaultLevel: 24, customLevel: 24, description: 'Akala Island Trial (Totem Lurantis Lv 24)' },
      { id: 'um-olivia', name: 'Kahuna Olivia (Grand Trial)', badgeName: 'Rockium Z', gymNumber: 6, defaultLevel: 28, customLevel: 28, description: 'Ruins of Life Grand Trial (Lycanroc Lv 28)' },
      { id: 'um-sophocles', name: 'Captain Sophocles (Observatory)', badgeName: 'Electrium Z', gymNumber: 7, defaultLevel: 33, customLevel: 33, description: 'Mount Hokulani (Totem Togedemaru Lv 33)' },
      { id: 'um-acerola', name: 'Captain Acerola (Thrifty Megamart)', badgeName: 'Ghostium Z', gymNumber: 8, defaultLevel: 35, customLevel: 35, description: 'Ula\'ula Island Trial (Totem Mimikyu Lv 35)' },
      { id: 'um-nanu', name: 'Kahuna Nanu (Grand Trial)', badgeName: 'Darkinium Z', gymNumber: 9, defaultLevel: 44, customLevel: 44, description: 'Malie City Grand Trial (Alolan Persian Lv 44)' },
      { id: 'um-necrozma', name: 'Ultra Necrozma (Megalo Tower)', badgeName: 'Light Trio Peak', gymNumber: 10, defaultLevel: 60, customLevel: 60, description: 'Ultra Megalopolis Boss Battle (Ultra Necrozma Lv 60)' },
      { id: 'um-hapu', name: 'Kahuna Hapu (Grand Trial)', badgeName: 'Groundium Z', gymNumber: 11, defaultLevel: 54, customLevel: 54, description: 'Vast Poni Canyon Grand Trial (Mudsdale Lv 54)' },
      { id: 'um-ribombee', name: 'Totem Ribombee (Mina\'s Trial)', badgeName: 'Fairium Z', gymNumber: 12, defaultLevel: 55, customLevel: 55, description: 'Poni Island Final Trial (Totem Ribombee Lv 55)' },
      { id: 'um-e4-molayne', name: 'Molayne', badgeName: 'Elite Four 1', gymNumber: 13, defaultLevel: 57, customLevel: 57, description: 'Mount Lanakila League (Magnezone Lv 57)' },
      { id: 'um-e4-olivia', name: 'Olivia', badgeName: 'Elite Four 2', gymNumber: 14, defaultLevel: 57, customLevel: 57, description: 'Mount Lanakila League (Lycanroc Lv 57)' },
      { id: 'um-e4-acerola', name: 'Acerola', badgeName: 'Elite Four 3', gymNumber: 15, defaultLevel: 57, customLevel: 57, description: 'Mount Lanakila League (Palossand Lv 57)' },
      { id: 'um-e4-kahili', name: 'Kahili', badgeName: 'Elite Four 4', gymNumber: 16, defaultLevel: 57, customLevel: 57, description: 'Mount Lanakila League (Toucannon Lv 57)' },
      { id: 'um-hau', name: 'Champion Title Defense (Hau)', badgeName: 'Alola Champion', gymNumber: 17, defaultLevel: 60, customLevel: 60, description: 'Mount Lanakila Pokémon League (Decidueye/Incineroar/Primarina Lv 60)' },
      { id: 'um-giovanni', name: 'Rainbow Rocket Giovanni', badgeName: 'Episode RR Boss', gymNumber: 18, defaultLevel: 70, customLevel: 70, description: 'Team Rainbow Rocket Castle (Mega Mewtwo X/Y Lv 70)' }
    ],
    cheatCodes: {
      engine: 'Citra / Luma3DS Gateway / CTRPF (3DS)',
      zeroExp: '[Zero EXP Gain v1.2]\n0804F698 E3A00000\n// ARM11 mov r0, #0 (Zero EXP return)',
      rareCandyCap: '[Cap Candy Respect Flag v1.2]\n0808B214 E1A00000\n// NOP level increment if level >= CurrentCap',
      infiniteCandies: '[999 Rare Candies Item Bag]\n083FF020 03E70032',
      repellant: '[Infinite Clean Repel Field (Key Item)]\n082DF6A0 E3A00001\n// Set wild encounter encounter rate factor to 0',
      portaHeal: '[Porta-Heal Party Refresh]\n08064F90 EB003180\n// Call FullRestoreParty on select'
    }
  },
  {
    id: 'oras-us',
    title: 'Pokémon Omega Ruby / Alpha Sapphire',
    subtitle: 'Version 1.4 (USA / World 3DS)',
    generation: 6,
    platform: '3DS',
    gameCode: 'ECRE',
    internalTitle: 'POKEMON OR',
    expectedSize: 1879048192, // ~1.75 GB
    layeredFsPath: '000400000011C400',
    levelCaps: [
      { id: 'oras-roxanne', name: 'Roxanne', badgeName: 'Stone Badge', gymNumber: 1, defaultLevel: 14, customLevel: 14, description: 'Rustboro Gym (Nosepass Lv 14)' },
      { id: 'oras-brawly', name: 'Brawly', badgeName: 'Knuckle Badge', gymNumber: 2, defaultLevel: 16, customLevel: 16, description: 'Dewford Gym (Makuhita Lv 16)' },
      { id: 'oras-wattson', name: 'Wattson', badgeName: 'Dynamo Badge', gymNumber: 3, defaultLevel: 21, customLevel: 21, description: 'Mauville Gym (Magneton Lv 21)' },
      { id: 'oras-flannery', name: 'Flannery', badgeName: 'Heat Badge', gymNumber: 4, defaultLevel: 28, customLevel: 28, description: 'Lavaridge Gym (Torkoal Lv 28)' },
      { id: 'oras-norman', name: 'Norman', badgeName: 'Balance Badge', gymNumber: 5, defaultLevel: 30, customLevel: 30, description: 'Petalburg Gym (Slaking Lv 30)' },
      { id: 'oras-winona', name: 'Winona', badgeName: 'Feather Badge', gymNumber: 6, defaultLevel: 35, customLevel: 35, description: 'Fortree Gym (Altaria Lv 35)' },
      { id: 'oras-tate-liza', name: 'Tate & Liza', badgeName: 'Mind Badge', gymNumber: 7, defaultLevel: 45, customLevel: 45, description: 'Mossdeep Gym (Lunatone & Solrock Lv 45)' },
      { id: 'oras-wallace', name: 'Wallace', badgeName: 'Rain Badge', gymNumber: 8, defaultLevel: 46, customLevel: 46, description: 'Sootopolis Gym (Milotic Lv 46)' },
      { id: 'oras-e4-sidney', name: 'Sidney', badgeName: 'Elite Four 1', gymNumber: 9, defaultLevel: 52, customLevel: 52, description: 'Ever Grande League (Absol Lv 52)' },
      { id: 'oras-e4-phoebe', name: 'Phoebe', badgeName: 'Elite Four 2', gymNumber: 10, defaultLevel: 53, customLevel: 53, description: 'Ever Grande League (Dusknoir Lv 53)' },
      { id: 'oras-e4-glacia', name: 'Glacia', badgeName: 'Elite Four 3', gymNumber: 11, defaultLevel: 54, customLevel: 54, description: 'Ever Grande League (Walrein Lv 54)' },
      { id: 'oras-e4-drake', name: 'Drake', badgeName: 'Elite Four 4', gymNumber: 12, defaultLevel: 55, customLevel: 55, description: 'Ever Grande League (Salamence Lv 55)' },
      { id: 'oras-steven', name: 'Champion Steven Stone', badgeName: 'Hoenn Champion', gymNumber: 13, defaultLevel: 59, customLevel: 59, description: 'Ever Grande League (Mega Metagross Lv 59)' },
      { id: 'oras-zinnia', name: 'Zinnia & Deoxys', badgeName: 'Delta Episode Peak', gymNumber: 14, defaultLevel: 80, customLevel: 80, description: 'Sky Pillar Space Battle (Mega Rayquaza / Deoxys Lv 80)' }
    ],
    cheatCodes: {
      engine: 'Citra / Luma3DS Gateway / CTRPF (3DS)',
      zeroExp: '[ORAS 0 EXP Gain v1.4]\n0804D210 E3A00000',
      infiniteCandies: '[999 Rare Candies in Bag]\n0842F110 03E70032',
      repellant: '[Infinite Clean Repel Field (Key Item)]\n082A11B0 E3A00001',
      portaHeal: '[Porta-Heal Party Refresh]\n08051E80 EB002990'
    }
  }
];

