export const Objects = {
  shadow: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Objects/Shadow/${i + 1}.png`),
  tiles: Array.from({ length: 64 }, (_, i) => 
    `/assets/sprites/Tiles/FieldsTile_${String(i + 1).padStart(2, "0")}.png`
  ),
  flag: {
    front: {
      frames: 6,
      sprites: Array.from({ length: 6 }, (_, i) => 
        `/assets/sprites/Objects/Animated/1 Flag/front/front_${i}.png`
      ),
    },
    back: {
      frames: 6,
      sprites: Array.from({ length: 6 }, (_, i) => 
        `/assets/sprites/Objects/Animated/1 Flag/back/back_${i}.png`
      ),
    },
    left: {
      frames: 6,
      sprites: Array.from({ length: 6 }, (_, i) => 
        `/assets/sprites/Objects/Animated/1 Flag/left/left_${i}.png`
      ),
    },
    right: {
      frames: 6,
      sprites: Array.from({ length: 6 }, (_, i) => 
        `/assets/sprites/Objects/Animated/1 Flag/right/right_${i}.png`
      ),
    },
    front_left: {
      frames: 6,
      sprites: Array.from({ length: 6 }, (_, i) => 
        `/assets/sprites/Objects/Animated/1 Flag/front_left/front_left_${i}.png`
      ),
    },
    front_right: {
      frames: 6,
      sprites: Array.from({ length: 6 }, (_, i) => 
        `/assets/sprites/Objects/Animated/1 Flag/front_right/front_right_${i}.png`
      ),
    },
    back_left: {
      frames: 6,
      sprites: Array.from({ length: 6 }, (_, i) => 
        `/assets/sprites/Objects/Animated/1 Flag/back_left/back_left_${i}.png`
      ),
    },
    back_right: {
      frames: 6,
      sprites: Array.from({ length: 6 }, (_, i) => 
        `/assets/sprites/Objects/Animated/1 Flag/back_right/back_right_${i}.png`
      ),
    },
  },
  campfire_on: {
    frames: 6,
    sprites: Array.from({ length: 6 }, (_, i) => 
      `/assets/sprites/Objects/Animated/2 Campfire/camp_on/camp_fire_on_${i}.png`
    ),
  },
  campfire_off: {
    frames: 6,
    sprites: Array.from({ length: 6 }, (_, i) => 
      `/assets/sprites/Objects/Animated/2 Campfire/camp_off/camp_fire_off_${i}.png`
    ),
  },
  bush: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Objects/Idle/Bush/${i + 1}.png`),
  
  flower: Array.from({ length: 12 }, (_, i) => `/assets/sprites/Objects/Idle/Flower/${i + 1}.png`),
  
  stone: Array.from({ length: 16 }, (_, i) => `/assets/sprites/Objects/Idle/Stone/${i + 1}.png`),
  
  box: Array.from({ length: 4 }, (_, i) => `/assets/sprites/Objects/Idle/Decor/Box${i + 1}.png`),
  
  dirt: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Objects/Idle/Decor/Dirt${i + 1}.png`),
  
  lamp: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Objects/Idle/Decor/Lamp${i + 1}.png`),
  
  log: Array.from({ length: 4 }, (_, i) => `/assets/sprites/Objects/Idle/Decor/Log${i + 1}.png`),
  
  tree: Array.from({ length: 2 }, (_, i) => `/assets/sprites/Objects/Idle/Decor/Tree${i + 1}.png`),
  
  camp: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Objects/Idle/Camp/${i + 1}.png`),
  
  fence: Array.from({ length: 10 }, (_, i) => `/assets/sprites/Objects/Idle/Fence/${i + 1}.png`),
  
  grass: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Objects/Idle/Grass/${i + 1}.png`),
  
  pointer: Array.from({ length: 6 }, (_, i) => `/assets/sprites/Objects/Idle/Pointer/${i + 1}.png`),
};