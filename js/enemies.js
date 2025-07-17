export const Enemies = {
  goblin: {
    name: "Goblin",
    description: "The first enemy you encounter",
    health: 100,
    speed: 0.5,
    size: 35,
    reward: 25,
    frames: 6,
    sprites: {
      r_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Goblin/Walk/R_walk_${i}.png`),
      l_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Goblin/Walk/L_walk_${i}.png`),
      d_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Goblin/Walk/D_walk_${i}.png`),
      u_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Goblin/Walk/U_walk_${i}.png`),
      r_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Goblin/Death/R_death_${i}.png`),
      l_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Goblin/Death/L_death_${i}.png`),
      d_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Goblin/Death/D_death_${i}.png`),
      u_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Goblin/Death/U_death_${i}.png`)
    }
  },

  wolf: {
    name: "Wolf",
    description: "The second enemy you encounter",
    health: 50,
    speed: 1.5,
    size: 35,
    reward: 50,
    frames: 6,
    sprites: {
      r_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Wolf/Walk/R_walk_${i}.png`),
      l_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Wolf/Walk/L_walk_${i}.png`),
      d_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Wolf/Walk/D_walk_${i}.png`),
      u_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Wolf/Walk/U_walk_${i}.png`),
      r_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Wolf/Death/R_death_${i}.png`),
      l_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Wolf/Death/L_death_${i}.png`),
      d_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Wolf/Death/D_death_${i}.png`),
      u_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Wolf/Death/U_death_${i}.png`)
    }
  },

  slime: {
    name: "Slime",
    description: "The third enemy you encounter",
    health: 150,
    speed: 0.7,
    size: 35,
    reward: 50,
    frames: 6,
    sprites: {
      r_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/R_Walk${i}.png`),
      l_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/L_Walk${i}.png`),
      d_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/D_Walk${i}.png`),
      u_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/U_Walk${i}.png`),
      r_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/R_Death${i}.png`),
      l_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/L_Death${i}.png`),
      d_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/D_Death${i}.png`),
      u_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/U_Death${i}.png`),
      r_Special: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/R_Special${i}.png`),
      l_Special: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/L_Special${i}.png`),
      d_Special: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/D_Special${i}.png`),
      u_Special: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/U_Special${i}.png`)
    }
  },

  smallSlime: {
    name: "Small Slime", 
    description: "The slime split into two small slimes",
    health: 50,
    speed: 1.0,
    size: 25,
    reward: 25,
    frames: 6,
    sprites: {
      r_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/Small/R_Walk${i}.png`),
      l_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/Small/L_Walk${i}.png`),
      d_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/Small/D_Walk${i}.png`),
      u_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/Small/U_Walk${i}.png`),
      r_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/Small/R_Death${i}.png`),
      l_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/Small/L_Death${i}.png`),
      d_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/Small/D_Death${i}.png`),
      u_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Slime/Small/U_Death${i}.png`)
    }
  },

  bee: {
    name: "Bee",
    description: "The fourth enemy you encounter",
    health: 300,
    speed: 0.3,
    size: 35,
    reward: 300,
    frames: 6,
    sprites: {
      r_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Bee/Walk/R_walk_${i}.png`),
      l_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Bee/Walk/L_walk_${i}.png`),
      d_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Bee/Walk/D_walk_${i}.png`),
      u_Walk: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Bee/Walk/U_walk_${i}.png`),
      r_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Bee/Death/R_death_${i}.png`),
      l_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Bee/Death/L_death_${i}.png`),
      d_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Bee/Death/D_death_${i}.png`),
      u_Death: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Enemies/Bee/Death/U_death_${i}.png`)
    }
  }
};
