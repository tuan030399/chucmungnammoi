export const COLORS = [
  '#FF0000', '#FFD700', '#FFA500', '#00FF00', '#00FFFF', '#FF00FF', '#FFFFFF'
];

export const EXPLOSION_SOUNDS = [
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/7/77/Explosion_01.ogg/Explosion_01.ogg.mp3",
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/2/23/Explosion_02.ogg/Explosion_02.ogg.mp3", 
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/87/Explosion_03.ogg/Explosion_03.ogg.mp3"
];

export const REWARDS = [
  { type: 'money', value: '5.000', weight: 40 },
  { type: 'money', value: '10.000', weight: 30 },
  { type: 'money', value: '20.000', weight: 15 },
  { type: 'money', value: '50.000', weight: 5 },
  { type: 'wish', value: 'Vạn Sự Như Ý', weight: 5 },
  { type: 'wish', value: 'An Khang Thịnh Vượng', weight: 5 }
];

export const getRandomReward = () => {
  const totalWeight = REWARDS.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;
  for (const reward of REWARDS) {
    if (random < reward.weight) return reward;
    random -= reward.weight;
  }
  return REWARDS[0];
};

export const FALLING_ITEMS = ["🏮", "🌸", "🌼", "🧧", "✨"];
