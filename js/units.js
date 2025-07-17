export const Units = {
  archer: {
    name: "archer",
    projectileType: "arrow",
    speed: 4,
    sprites: [1, 2, 3].map(level => ({
      idle: {
        frames: 4,
        D: Array.from({ length: 4 }, (_, i) => 
          `/assets/sprites/Units/${level}/idle/D_Idle/D_idle_${i}.png`
        ),
        L: Array.from({ length: 4 }, (_, i) => 
          `/assets/sprites/Units/${level}/idle/L_Idle/L_idle_${i}.png`
        ),
        R: Array.from({ length: 4 }, (_, i) => 
          `/assets/sprites/Units/${level}/idle/R_Idle/R_idle_${i}.png`
        ),
        U: Array.from({ length: 4 }, (_, i) => 
          `/assets/sprites/Units/${level}/idle/U_Idle/U_idle_${i}.png`
        ),
      },
      attack: {
        frames: 6,
        D: Array.from({ length: 6 }, (_, i) => 
          `/assets/sprites/Units/${level}/attack/D_Attack/D_attack_${i}.png`
        ),
        L: Array.from({ length: 6 }, (_, i) => 
          `/assets/sprites/Units/${level}/attack/L_Attack/L_attack_${i}.png`
        ),
        R: Array.from({ length: 6 }, (_, i) => 
          `/assets/sprites/Units/${level}/attack/R_Attack/R_attack_${i}.png`
        ),
        U: Array.from({ length: 6 }, (_, i) => 
          `/assets/sprites/Units/${level}/attack/U_Attack/U_attack_${i}.png`
        ),
      },
      preAttack: {
        frames: 1,
        D: [`/assets/sprites/Units/${level}/pre_attack/D_Preattack.png`],
        L: [`/assets/sprites/Units/${level}/pre_attack/L_Preattack.png`],
        R: [`/assets/sprites/Units/${level}/pre_attack/R_Preattack.png`],
        U: [`/assets/sprites/Units/${level}/pre_attack/U_Preattack.png`],
      },
    })),
  },

  projectile: Array.from(
    { length: 48 },
    (_, i) => `/assets/sprites/Units/Arrow/near/${String(i + 1)}.png`
  ),
};