export interface IgamesObjects {
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  description: string;
}
export interface IgamesObjectsForDb {
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
  description: string;
  type: 'digital' | 'physical';
}
export const gamesArray: IgamesObjects[] = [
  {
    name: 'PUBG: Battlegrounds',
    price: 25,
    stock: 10,
    category: 'Battle Royale',
    imageUrl:
      'https://static.ivory.getloconow.com/games/0aee9f18-58fd-41c9-9c24-35266aa22262/square_cover/94929c57-6130-4108-ac1d-42274fec2092.png',
    description:
      'Play PUBG: BATTLEGROUNDS for free. Land strategically, loot weapons and supplies, and survive to make your team the last one standing across various battlegrounds.',
  },
  {
    name: 'Black Myth: Wukong',
    price: 19,
    stock: 10,
    category: 'Action RPG',
    imageUrl:
      'https://sm.ign.com/t/ign_ap/cover/b/black-myth/black-myth-wukong_fmws.300.jpg',
    description:
      'Black Myth: Wukong is an action RPG inspired by Chinese mythology. Embark on a perilous journey filled with dangers and wonders to uncover the hidden truth behind a glorious past legend.',
  },
  {
    name: 'Dota 2',
    price: 21,
    stock: 10,
    category: 'MOBA',
    imageUrl:
      'https://static.getloconow.com/onboarding-categories-images/DOTA-2.png',
    description:
      "Join millions of players in Dota 2 and battle with over a hundred heroes. No matter if it's your tenth hour or thousandth, there's always something new to discover.",
  },
  {
    name: 'Naraka: Bladepoint',
    price: 20,
    stock: 10,
    category: 'Action Battle Royale',
    imageUrl:
      'https://i0.wp.com/achievementunlocker.com/wp-content/uploads/2022/08/1837410971.png',
    description:
      'NARAKA: BLADEPOINT offers a combat experience for up to 60 players, featuring martial arts-inspired melee combat, gravity-defying moves, and customizable heroes with epic abilities.',
  },
  {
    name: 'Apex Legends',
    price: 28,
    stock: 10,
    category: 'Battle Royale',
    imageUrl:
      'https://www.clavecd.es/wp-content/uploads/buy-apex-legends-loba-edition-cd-key-compare-prices.png',
    description:
      'Apex Legends is a free-to-play first-person action game by Respawn Entertainment. Master an ever-growing cast of powerful legends in squad-based strategic gameplay.',
  },
  {
    name: 'Destiny 2',
    price: 18,
    stock: 10,
    category: 'Action MMO',
    imageUrl:
      'https://data.xxlgamer.com/bundle-products/4900/FMm4JQuJq0OGHb.png',
    description:
      'Destiny 2 is a free-to-play action MMO with a dynamic world. Join friends anytime, anywhere in a unique, ever-evolving world.',
  },
  {
    name: 'Warframe',
    price: 14,
    stock: 10,
    category: 'Action MMO',
    imageUrl:
      'https://www.zonammorpg.com/wp-content/uploads/2023/11/warframe-300x300.png',
    description:
      'Awaken as an unstoppable warrior and fight alongside friends in this free-to-play online action game driven by a story.',
  },
  {
    name: 'Counter-Strike 2',
    price: 16,
    stock: 10,
    category: 'FPS',
    imageUrl:
      'https://sm.ign.com/t/ign_fr/game/c/counter-st/counter-strike-2_7kag.300.png',
    description:
      'For two decades, Counter-Strike has provided top-tier competitive experiences. Counter-Strike 2 marks the next chapter in this global phenomenon.',
  },
  {
    name: 'Silent Hill 2',
    price: 17,
    stock: 10,
    category: 'Survival Horror',
    imageUrl:
      'https://sm.ign.com/t/ign_es/cover/s/silent-hil/silent-hill-2-remake_ktez.300.jpg',
    description:
      'Enjoy a masterclass in psychological horror. Widely regarded as the best in the series, discover terrifying imagery and visceral sound on the latest hardware.',
  },
  {
    name: 'Throne And Liberty',
    price: 20,
    stock: 10,
    category: 'MMORPG',
    imageUrl:
      'https://img.xboxachievements.com/images/2024/09/26/icon/106e47839e800bacc7b0dec003499296-l.png',
    description:
      'This is THRONE AND LIBERTY, a free-to-play multiplayer online RPG for multiple platforms. Explore evolving environments, engage in large-scale PvPvE battles, and transform into creatures to fight by land, sea, and air.',
  },
  {
    name: 'The Legend of Zelda: Breath of the Wild',
    price: 50,
    stock: 10,
    category: 'Action-Adventure',
    imageUrl:
      'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58',
    description:
      'Explore a vast open world where you can do anything you imagine, with the iconic Link as the protagonist.',
  },
  {
    name: 'Super Mario Odyssey',
    price: 40,
    stock: 12,
    category: 'Platformer',
    imageUrl:
      'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000001130/c42553b4fd0312c31e70ec7468c6c9bccd739f340152925b9600631f2d29f8b5',
    description:
      'Join Mario on a giant 3D adventure around the world, collecting moons to power your ship and rescue Princess Peach.',
  },
  {
    name: 'Minecraft',
    price: 25,
    stock: 20,
    category: 'Sandbox',
    imageUrl:
      'https://store-images.s-microsoft.com/image/apps.8049.14635563885955208.3111e5ec-659e-41be-beec-f0dfb16dd9f1.b41d9c8a-6c92-4e0e-bb7a-1554fb94fa0b?q=90&w=480&h=270',
    description:
      'Create and explore your own worlds where the only limit is your imagination. Build, explore, and survive in this hit sandbox game.',
  },
  {
    name: 'Fortnite',
    price: 0,
    stock: 15,
    category: 'Battle Royale',
    imageUrl: 'https://m.media-amazon.com/images/I/61Rz3yF7mrL._SL1000_.jpg',
    description:
      "Enter Fortnite's massive free-to-play multiplayer battle. Build, shoot, and survive in this competitive action game.",
  },
  {
    name: 'Call of Duty: Modern Warfare II',
    price: 60,
    stock: 8,
    category: 'FPS',
    imageUrl:
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1962660/capsule_616x353.jpg?t=1710969334',
    description:
      'Engage in tactical operations in the new chapter of the Modern Warfare series, offering realistic first-person combat.',
  },
  {
    name: 'Grand Theft Auto V',
    price: 30,
    stock: 20,
    category: 'Action-Adventure',
    imageUrl: 'https://m.media-amazon.com/images/I/81w4gTRlSeL._SL1500_.jpg',
    description:
      'Explore the city of Los Santos in this epic sandbox by Rockstar, filled with activities, missions, and chaos in an open world.',
  },
  {
    name: 'Sekiro: Shadows Die Twice',
    price: 45,
    stock: 5,
    category: 'Action RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/81QGePML9XL._SL1500_.jpg',
    description:
      'A brutally challenging action-adventure game where you play as a ninja seeking revenge in a dangerous, feudal Japan.',
  },
  {
    name: 'God of War',
    price: 40,
    stock: 10,
    category: 'Action-Adventure',
    imageUrl: 'https://m.media-amazon.com/images/I/81dq5nIO4GL._SL1500_.jpg',
    description:
      'Join Kratos and his son Atreus on an epic journey to face the gods and monsters of Norse mythology.',
  },
  {
    name: 'Horizon Forbidden West',
    price: 60,
    stock: 10,
    category: 'Action RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/81C6tNW6EBL._SL1500_.jpg',
    description:
      'Aloy returns to face new threats in the Forbidden West, exploring a vast world full of robotic creatures.',
  },
  {
    name: 'Monster Hunter: World',
    price: 35,
    stock: 7,
    category: 'Action RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/81dMKVm7+pL._SL1500_.jpg',
    description:
      'Hunt colossal monsters in a vast open world full of adventure. Challenge massive creatures and gather resources to upgrade your gear.',
  },
  {
    name: 'Cyberpunk 2077',
    price: 40,
    stock: 9,
    category: 'RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/91sJOFN7DPL._SL1500_.jpg',
    description:
      'Explore the open world of Night City as a mercenary in this action RPG. Make choices that shape the world around you in a futuristic dystopia.',
  },
  {
    name: 'Red Dead Redemption 2',
    price: 50,
    stock: 7,
    category: 'Action-Adventure',
    imageUrl: 'https://m.media-amazon.com/images/I/81VVnUyBpsL._SL1500_.jpg',
    description:
      "Experience the wild west in this open-world epic from Rockstar Games, where choices and consequences shape your character's fate.",
  },
  {
    name: 'The Witcher 3: Wild Hunt',
    price: 30,
    stock: 6,
    category: 'Action RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/71OIbEceZQL._SL1500_.jpg',
    description:
      'Become Geralt of Rivia, a monster hunter, as you explore a vast world filled with quests, monsters, and moral dilemmas.',
  },
  {
    name: 'Resident Evil Village',
    price: 55,
    stock: 10,
    category: 'Survival Horror',
    imageUrl: 'https://m.media-amazon.com/images/I/91zZTlMtfxL._SL1500_.jpg',
    description:
      'Survive the horrors of a mysterious village in this first-person survival game, filled with terrifying creatures and secrets to uncover.',
  },
  {
    name: 'Halo Infinite',
    price: 60,
    stock: 5,
    category: 'FPS',
    imageUrl: 'https://m.media-amazon.com/images/I/81CnQgmThyL._SL1500_.jpg',
    description:
      'Step into the boots of the Master Chief in this new chapter of the Halo saga, featuring both an open-world campaign and multiplayer modes.',
  },
  {
    name: 'Far Cry 6',
    price: 50,
    stock: 8,
    category: 'FPS',
    imageUrl: 'https://m.media-amazon.com/images/I/81XtYX-4DoL._SL1500_.jpg',
    description:
      'Liberate the island of Yara from a tyrannical regime in this explosive open-world shooter.',
  },
  {
    name: "Assassin's Creed Valhalla",
    price: 45,
    stock: 7,
    category: 'Action RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/81OvbSYBoFL._SL1500_.jpg',
    description:
      'Lead a Viking invasion of England, raiding villages, building settlements, and engaging in epic battles in this open-world RPG.',
  },
  {
    name: 'Elden Ring',
    price: 60,
    stock: 6,
    category: 'Action RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/81QkpzHK3qL._SL1500_.jpg',
    description:
      'From the minds of Hidetaka Miyazaki and George R.R. Martin comes a vast open-world fantasy RPG filled with danger and discovery.',
  },
  {
    name: 'Forza Horizon 5',
    price: 55,
    stock: 10,
    category: 'Racing',
    imageUrl: 'https://m.media-amazon.com/images/I/81alOjHfU6L._SL1500_.jpg',
    description:
      'Race through beautiful, diverse landscapes in Mexico in the latest entry of the popular open-world racing series.',
  },
  {
    name: 'Battlefield 2042',
    price: 60,
    stock: 5,
    category: 'FPS',
    imageUrl: 'https://m.media-amazon.com/images/I/81wJ3j+WpGL._SL1500_.jpg',
    description:
      'Experience all-out warfare in massive 128-player battles, featuring modern and futuristic military technology.',
  },
  {
    name: 'Splatoon 3',
    price: 50,
    stock: 12,
    category: 'Shooter',
    imageUrl: 'https://m.media-amazon.com/images/I/81iLLP4qRLL._SL1500_.jpg',
    description:
      'Paint your way to victory in the chaotic and colorful multiplayer battles of Splatoon 3.',
  },
  {
    name: 'Pokémon Legends: Arceus',
    price: 55,
    stock: 8,
    category: 'RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/71P4PgyD8qL._SL1500_.jpg',
    description:
      'Set in a bygone era of the Pokémon world, explore vast wildernesses and discover the secrets of Arceus in this open-world RPG.',
  },
  {
    name: 'Super Smash Bros. Ultimate',
    price: 60,
    stock: 10,
    category: 'Fighting',
    imageUrl: 'https://m.media-amazon.com/images/I/81I0AfwRJuL._SL1500_.jpg',
    description:
      'Fight with your favorite Nintendo characters in this massive brawler, featuring everyone from Mario to Cloud.',
  },
  {
    name: 'Diablo II: Resurrected',
    price: 40,
    stock: 6,
    category: 'Action RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/81sHZml-v1L._SL1500_.jpg',
    description:
      'Return to the hellish world of Sanctuary in this remaster of the classic action RPG, filled with monsters and loot.',
  },
  {
    name: 'Deathloop',
    price: 60,
    stock: 4,
    category: 'FPS',
    imageUrl: 'https://m.media-amazon.com/images/I/81GmU-qJ41L._SL1500_.jpg',
    description:
      'Break the loop or be trapped in it forever in this time-bending shooter, where your choices affect the outcome.',
  },
  {
    name: 'Metroid Dread',
    price: 60,
    stock: 5,
    category: 'Action-Adventure',
    imageUrl: 'https://m.media-amazon.com/images/I/81PbGb9woTL._SL1500_.jpg',
    description:
      'Samus returns in a new adventure, battling alien creatures and uncovering mysteries in a dangerous, unexplored world.',
  },
  {
    name: 'Ghost of Tsushima',
    price: 50,
    stock: 8,
    category: 'Action-Adventure',
    imageUrl: 'https://m.media-amazon.com/images/I/71GsnMCmjBL._SL1500_.jpg',
    description:
      'Defend feudal Japan from invaders as a skilled samurai, or embrace the way of the ghost in this open-world epic.',
  },
  {
    name: "Marvel's Spider-Man: Miles Morales",
    price: 40,
    stock: 10,
    category: 'Action-Adventure',
    imageUrl: 'https://m.media-amazon.com/images/I/81MX7VpuUtL._SL1500_.jpg',
    description:
      'Swing through New York City as Miles Morales in this action-packed superhero adventure.',
  },
  {
    name: 'Hades',
    price: 25,
    stock: 10,
    category: 'Roguelike',
    imageUrl: 'https://m.media-amazon.com/images/I/81B6rGueOwL._SL1500_.jpg',
    description:
      'Battle through the underworld in this critically acclaimed roguelike, where you play as the immortal son of Hades.',
  },
  {
    name: 'Ratchet & Clank: Rift Apart',
    price: 60,
    stock: 5,
    category: 'Platformer',
    imageUrl: 'https://m.media-amazon.com/images/I/81SWK+H8zXL._SL1500_.jpg',
    description:
      'Travel across dimensions in this visually stunning platformer, packed with action and humor.',
  },
  {
    name: 'The Last of Us Part II',
    price: 45,
    stock: 6,
    category: 'Action-Adventure',
    imageUrl: 'https://m.media-amazon.com/images/I/81EXHlZGZyL._SL1500_.jpg',
    description:
      'Experience the emotional journey of Ellie as she seeks revenge in this post-apocalyptic action game.',
  },
  {
    name: "Demon's Souls",
    price: 70,
    stock: 4,
    category: 'Action RPG',
    imageUrl: 'https://m.media-amazon.com/images/I/81Hq4pLSqXL._SL1500_.jpg',
    description:
      'Return to Boletaria in this stunning remake of the classic action RPG, filled with challenging combat and dark lore.',
  },
];

export const categoriesArray = [
  { name: 'battle royale' },
  { name: 'action rpg' },
  { name: 'moba' },
  { name: 'action battle royale' },
  { name: 'action mmo' },
  { name: 'fps' },
  { name: 'survival horror' },
  { name: 'mmorpg' },
  { name: 'action-adventure' },
  { name: 'platformer' },
  { name: 'sandbox' },
  { name: 'rpg' },
  { name: 'racing' },
  { name: 'shooter' },
  { name: 'fighting' },
  { name: 'roguelike' },
];
