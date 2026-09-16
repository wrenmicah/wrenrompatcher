export interface ArchitectureOption {
  id: string;
  title: string;
  badge: string;
  recommendation: 'Recommended for Coder' | 'Best for Clean ROMs' | 'Quickest Testing' | 'Advanced Binary';
  summary: string;
  pros: string[];
  cons: string[];
  implementationGuide: string;
  codeSnippet?: {
    language: string;
    fileName: string;
    code: string;
  };
}

export const ARCHITECTURE_OPTIONS: ArchitectureOption[] = [
  {
    id: 'binary-patch',
    title: 'Option 1: Direct Binary ROM Patching (IPS / In-Place Byte Mod)',
    badge: 'Clean Dump Compatible',
    recommendation: 'Best for Clean ROMs',
    summary:
      'Injects assembly instructions directly into the compiled ARM7TDMI (GBA) or Z80 (GB) machine code of your legally dumped vanilla ROM without needing source code or a build toolchain.',
    pros: [
      'Works immediately on standard 16MB/32MB clean ROM dumps (.gba/.gbc)',
      'Generates standard .ips and .bps patch files shareable with other players',
      'No complex Linux or devkitARM compilation environment required',
      'Safe 0-EXP NOP formula bypass prevents blank textbox & battle freeze issues when fainted'
    ],
    cons: [
      'Adding dynamic complex item logic (like Cap Candy checking 8 badges) requires locating free space and repointing item effect tables in binary',
      'Different ROM revisions (v1.0 vs v1.1 vs EU/JP) have different memory offsets'
    ],
    implementationGuide:
      'In Gen 3 (FireRed BPRE and Emerald BPEE), replacing the battle script routine with an immediate `bx lr` causes a blank text box freeze because the battle engine expects an experience calculation output for the message box. By instead patching the Cmd_getexp formula with a Thumb NOP instruction (`0xC0 0x46` / `mov r8, r8`) at offset 0x021CFC (FireRed 1.0) or 0x021D6C (FireRed 1.1), the battle engine cleanly awards 0 EXP without corrupting the message stack.\n\nBag Architecture Consideration: FireRed & LeafGreen do not have an active Bag menu in the Start Menu at game start (it is only unlocked after delivering Oak\'s Parcel from Viridian City to Oak in Pallet Town). Therefore, items (Cap Candies, Repellants, and Porta-Heals) are placed in the Player\'s Bedroom PC on Turn 1 or injected via direct Bag Slot memory codes.',
    codeSnippet: {
      language: 'armasm',
      fileName: 'cmd_getexp_bypass.s (ARM Thumb)',
      code: `// FireRed BPRE v1.0 @ 0x08021CFC (Rev 1.1 @ 0x08021D6C)
// Emerald BPEE v1.0 @ 0x0804A6B8
.thumb
.align 2

// Cmd_getexp formula bypass:
// Instead of an early bx lr which breaks battle script textboxes,
// NOP the exp accumulation formula so earned exp resolves to 0.
Cmd_GetExp_Bypass:
    mov     r8, r8       // Opcode: C0 46 (NOP in Thumb)
    // Battle loop proceeds normally and safely awards 0 EXP!

// Machine Code Bytes: C0 46`
    }
  },
  {
    id: 'decomp-c',
    title: 'Option 2: Decompilation Project (pokeemerald / pokefirered)',
    badge: 'Gold Standard for Hacks',
    recommendation: 'Recommended for Coder',
    summary:
      'Modify the C source code of modern decompilation projects (like pretend/pokeemerald or complete-fire-red-upgrade). This is how modern difficulty romhacks (Radical Red, Emerald Rogue, Inclement Emerald) implement soft/hard level caps and custom Cap Candies.',
    pros: [
      '100% control over logic, custom items, UI messages, and story flags',
      'Clean C code instead of hand-written hex/assembly',
      'Allows creating a genuine dedicated `ITEM_CAP_CANDY` with its own sprite and description',
      'Effortlessly handles level cap tiers based on badge flags or custom storyline triggers'
    ],
    cons: [
      'Requires setting up devkitARM, git, and compiling the ROM from source',
      'Not a one-click binary patch for a pre-existing vanilla .gba file'
    ],
    implementationGuide:
      'Define a level cap helper function in `src/pokemon.c` that checks `FlagGet(FLAG_BADGE01_GET)` through Badge 8. In `src/battle_script.c` or battle EXP distribution, clamp incoming EXP if `pokemon->level >= GetCurrentLevelCap()`. In `src/item_use.c`, hook the Rare Candy item effect to check against `GetCurrentLevelCap()` or create `ItemUse_CapCandy()`.',
    codeSnippet: {
      language: 'c',
      fileName: 'src/pokemon_level_cap.c (pokeemerald / pokefirered)',
      code: `// Define Gym Level Caps
static const u8 sGymLevelCaps[] = {
    15, // Badge 1: Roxanne / Brock
    19, // Badge 2: Brawly / Misty
    24, // Badge 3: Wattson / Surge
    29, // Badge 4: Flannery / Erika
    31, // Badge 5: Norman / Koga
    33, // Badge 6: Winona / Sabrina
    42, // Badge 7: Tate & Liza / Blaine
    43, // Badge 8: Juan / Giovanni
    58, // Champion
};

u8 GetCurrentLevelCap(void)
{
    if (FlagGet(FLAG_BADGE08_GET)) return sGymLevelCaps[8];
    if (FlagGet(FLAG_BADGE07_GET)) return sGymLevelCaps[7];
    if (FlagGet(FLAG_BADGE06_GET)) return sGymLevelCaps[6];
    if (FlagGet(FLAG_BADGE05_GET)) return sGymLevelCaps[5];
    if (FlagGet(FLAG_BADGE04_GET)) return sGymLevelCaps[4];
    if (FlagGet(FLAG_BADGE03_GET)) return sGymLevelCaps[3];
    if (FlagGet(FLAG_BADGE02_GET)) return sGymLevelCaps[2];
    if (FlagGet(FLAG_BADGE01_GET)) return sGymLevelCaps[1];
    return sGymLevelCaps[0];
}

// In src/item_use.c (or src/item_effects.c) for Cap Candy:
bool8 ItemUse_CapCandy(u8 partyIndex)
{
    struct Pokemon *mon = &gPlayerParty[partyIndex];
    u8 cap = GetCurrentLevelCap();
    u8 currentLevel = GetMonData(mon, MON_DATA_LEVEL);
    u16 species = GetMonData(mon, MON_DATA_SPECIES);

    // Rule 1: Fail if Pokémon is already at or exceeds next level cap
    if (currentLevel >= cap) {
        // Triggers standard "It won't have any effect." in-game message
        return FALSE;
    }

    // Step-by-step level up check: stop if a new move is learned!
    while (currentLevel < cap) {
        u8 nextLevel = currentLevel + 1;
        
        // Check learnset for new moves at nextLevel before advancing further
        bool8 learnsMoveAtNextLevel = DoesSpeciesLearnMoveAtLevel(species, nextLevel);

        // Apply +1 level experience
        u32 targetExp = gExperienceTables[gSpeciesInfo[species].growthRate][nextLevel];
        SetMonData(mon, MON_DATA_EXP, &targetExp);
        CalculateMonStats(mon);
        currentLevel = nextLevel;

        // Rule 2: Stop immediately when Pokémon hits a level they learn a new move
        if (learnsMoveAtNextLevel) {
            break; // Yield control back to player to learn move
        }
    }
    return TRUE;
}

// In src/item_use.c for "Porta Heal" Item:
bool8 ItemUse_PortaHeal(u8 partyIndex)
{
    u8 i;
    for (i = 0; i < gPlayerPartyCount; i++) {
        struct Pokemon *mon = &gPlayerParty[i];
        if (GetMonData(mon, MON_DATA_SPECIES) == SPECIES_NONE) continue;
        
        // Restore max HP
        u16 maxHP = GetMonData(mon, MON_DATA_MAX_HP);
        SetMonData(mon, MON_DATA_HP, &maxHP);
        
        // Clear status conditions (sleep, poison, burn, freeze, paralysis)
        u32 status = STATUS1_NONE;
        SetMonData(mon, MON_DATA_STATUS, &status);
        
        // Restore all move PP
        HealAllMonPP(mon);
    }
    PlaySE(SE_USE_ITEM);
    return TRUE;
}

// In src/wild_encounter.c for "Repellant" Key Item:
bool8 IsRepellantActive(void)
{
    // Check if Key Item toggle flag is ON
    return FlagGet(FLAG_SYS_REPELLANT_ACTIVE);
}`
    }
  },
  {
    id: 'script-hook',
    title: 'Option 3: Binary Script Engine & Free Space Injection',
    badge: 'Classic ROM Hacking',
    recommendation: 'Advanced Binary',
    summary:
      'Using tools like XSE (eXtreme Script Editor) or AdvanceMap to inject a custom script into ROM free space (0x800000 - 0x9FFFFF in GBA) and assign it to an NPC, PC item dispenser, or event.',
    pros: [
      'Allows adding a "Level Cap NPC" or "Cap Candy Vendor" inside Pokémon Centers without decompiling',
      'Preserves original game code entirely by using free ROM space',
      'Can give 1x Reusable Key Items or level up party through dynamic script commands'
    ],
    cons: [
      'Requires understanding GBA scripting bytecode (`checkflag`, `additem`, `special`)',
      'Item bag limits still apply unless item routines are patched'
    ],
    implementationGuide:
      'Compile a script in XSE that queries badge flags (`checkflag 0x820`), stores the highest badge level in variable `0x8004`, and executes a custom routine to set party Pokémon levels.',
    codeSnippet: {
      language: 'xse',
      fileName: 'cap_candy_dispenser.rbc (XSE Script)',
      code: `#dynamic 0x800000
#org @start
lock
faceplayer
msgbox @msg_intro MSG_YESNO
compare LASTRESULT 1
if 0x1 goto @give_candy
release
end

#org @give_candy
// Check badges to determine cap
checkflag 0x820 // Boulder Badge
if 0x0 goto @cap_14
// ... check higher badges
additem 0x44 1 // Give 1x Reusable Key Item (Cap Candy)
msgbox @msg_given MSG_NORMAL
release
end`
    }
  },
  {
    id: 'layered-fs-3ds',
    title: 'Option 4: 3DS LayeredFS & ExeFS/CRO Code Patching (Ultra Sun / Ultra Moon)',
    badge: 'Modern 3DS Architecture',
    recommendation: 'Best for Clean ROMs',
    summary:
      'Patching 3DS Pokémon games (Gen 6 X/Y, ORAS; Gen 7 Sun/Moon, Ultra Sun/Ultra Moon) using Luma3DS LayeredFS or Citra RomFS replacements without touching encrypted cartridge base dumps.',
    pros: [
      'Zero risk of corrupting encrypted 3DS ROM dumps (.3ds, .cia, .cxi)',
      'Works natively on real 3DS hardware via Luma3DS `/luma/titles/<title_id>/` and Citra emulator',
      'Supports CRO (Dynamic Link Library) patching for battle formulas (`code.bin` and `DllBattle.cro`)',
      'Clean replacement of encounter tables (`a/0/8/8` GARC in Ultra Sun/Moon) for 0 wild encounters'
    ],
    cons: [
      '3DS ROMs contain encrypted NCCH/NCSD partitions requiring LayeredFS redirection or decrypted RomFS extraction via GodMode9 or CTRTool',
      'Cannot use simple IPS byte replacement on encrypted cartridge dumps'
    ],
    implementationGuide:
      'In 3DS Pokémon Ultra Sun (Title ID 00040000001B5000) and Ultra Moon (Title ID 00040000001B5100), EXP calculation is handled in code.bin. For Luma3DS on real 3DS or Citra, extract code.bin, apply the IPS patch to `code.bin`, and place it in `luma/titles/00040000001B5000/code.ips`. For the Repellant effect, modify encounter rate tables or hook `code.bin` wild encounter branch to return 0.',
    codeSnippet: {
      language: 'text',
      fileName: 'luma3ds_structure_guide.txt',
      code: `// 3DS SD Card Directory Structure for Luma3DS LayeredFS:
// Ultra Sun: Title ID 00040000001B5000
// Ultra Moon: Title ID 00040000001B5100
// ORAS: Title ID 000400000011C400

SD Card:/
└── luma/
    └── titles/
        └── 00040000001B5000/
            ├── code.ips            <-- IPS Patch modifying ARM11 EXP & Item logic
            └── romfs/
                └── a/
                    └── 0/8/8       <-- Unpacked RomFS GARC (Repellant encounter rate = 0)

// Citra Emulator: Right-click game -> "Open Mods Location" -> place code.ips or exefs`
    }
  },
  {
    id: 'emulator-cheats',
    title: 'Option 5: Emulator Memory Cheats & CTRPF Codes (All Gens up to 3DS)',
    badge: 'Zero ROM Modification',
    recommendation: 'Quickest Testing',
    summary:
      'Load memory freeze codes, Action Replay, or CTRPF (Action Replay 3DS plugin) scripts inside mGBA, DeSmuME, MelonDS, or Citra. The base ROM remains 100% untouched.',
    pros: [
      'Zero risk of corrupting your clean ROM dump',
      'Works across any platform (mGBA on PC/Mac, Citra, RetroArch, Delta on iOS, PizzaBoy)',
      'Can be enabled or disabled instantly without rebuilding binaries',
      'Supports full item injection (999 Candies, Key Items) on the fly'
    ],
    cons: [
      'Must be configured per emulator session; the ROM file itself does not carry the mod to other devices without cheats enabled',
      'Does not create standalone ROM files to share with friends'
    ],
    implementationGuide:
      'Open your emulator Cheats menu, select the appropriate engine (GameShark for GB/GBC, Action Replay v3 for GBA, Action Replay DS for NDS, or Gateway/Citra for 3DS), and paste the memory address codes provided in this tool.',
    codeSnippet: {
      language: 'text',
      fileName: 'pokemon_ultrasun_citra_cheats.txt',
      code: `[Citra / Luma3DS - Pokémon Ultra Sun v1.2]
// Zero EXP Gain in Battles
0804F698 E3A00000

// Repellant Active (Wild Encounters Disabled)
082DF6A0 E3A00001

// 999 Rare / Cap Candies
083FF020 03E70032`
    }
  }
];
