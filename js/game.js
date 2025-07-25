import { TowerTypes } from "./towers.js";
import { Enemies } from "./enemies.js";
import { Objects } from "./objects.js";
import { Units } from "./units.js";
import { Functions } from "./setlevels.js";
console.log("TowerTipes:", TowerTypes);
console.log("Enemies:", Enemies);
console.log("Objects: ", Objects);
console.log("Units: ", Units);
document.addEventListener("DOMContentLoaded", () => {
  // html caricato

  // canvas
  const backgroundCanvas = document.getElementById("background-canvas");
  const gameCanvas = document.getElementById("game-canvas");
  const towerCanvas = document.getElementById("tower-canvas");
  const topCanvas = document.getElementById("top-canvas");
  const spriteCanvas = document.getElementById("sprite-canvas");
  // ctx
  const backgroundCtx = backgroundCanvas.getContext("2d");
  const gameCtx = gameCanvas.getContext("2d");
  const towerCtx = towerCanvas.getContext("2d");
  const topCtx = topCanvas.getContext("2d");
  const spriteCtx = spriteCanvas.getContext("2d");

  // elements
  const startWaveButton = document.getElementById("start-wave");
  const moneyValueElement = document.getElementById("money-value");
  const waveValueElement = document.getElementById("wave-value");
  const livesValueElement = document.getElementById("lives-value");
  const towerOptions = document.querySelectorAll(".tower-option");
  const sound_button = document.getElementById("Audio");
  const upgradeButton = document.getElementById("tower-upgrade");
  const path = new Image(),
    grass = new Image();

  console.log("Script caricato!");

  const TILE_SIZE = 60;
  const GRID_WIDTH = Math.floor(backgroundCanvas.width / TILE_SIZE);
  const GRID_HEIGHT = Math.floor(backgroundCanvas.height / TILE_SIZE);
  let audioEnabled = true;
  let firstclick = false;
  const sounds = {};
  const imageCache = {};
  const enemyStartAngle = 0;
  let gameRunning;

  let gameState = {
    level: 1,
    difficulty: 1,
    timeSpent: 0,
    money: 1500,
    wave: 0,
    waveTime: 0,
    lives: 10,
    towers: [],
    animatedTowers: [],
    enemies: [],
    projectiles: [],
    animatedObjects: [],
    waveInProgress: false,
    selectedTowerType: null,
    selectedTower: null,
    path: [],
    // emeyPath: [];
    grid: Array(GRID_HEIGHT)
      .fill()
      .map(() => Array(GRID_WIDTH).fill(0)), // 0 = spazio vuoto, 1 = percorso, 2 = torre, 3 = oggetto
  };

  let assets = null;

  //  ============= 1 GESTIONE INPUT =============
  topCanvas.addEventListener("click", (event) => {
    if (firstclick == false) {
      playSound("backgroundMusic");
      firstclick = true;
    }
    const rect = topCanvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((event.clientY - rect.top) / TILE_SIZE);
    console.log("Cliccato su:", x, y);
    topCtx.clearRect(0, 0, topCanvas.width, topCanvas.height);
    upgradeButton.textContent = "Migliora Torre";
    try {
      if (
        gameState.grid[y][x] == 0 &&
        gameState.selectedTowerType &&
        gameState.money >= TowerTypes[gameState.selectedTowerType].lvl[0].cost
      ) {
        placeTower(TowerTypes[gameState.selectedTowerType], x, y);
        gameState.money -= TowerTypes[gameState.selectedTowerType].lvl[0].cost;
        moneyValueElement.textContent = gameState.money;
        console.log("Torre piazzata:", gameState.selectedTowerType, "a", x, y);
      } else if (gameState.grid[y][x] == 2) {
        if (gameState.selectedTowerType == null) {
          const tower = gameState.towers.find((t) => t.x == x && t.y == y);
          if (tower) {
            gameState.selectedTower = tower;
            console.log("Torre selezionata:", tower);
            topCtx.beginPath();
            topCtx.arc(
              tower.x * TILE_SIZE + TILE_SIZE / 2,
              tower.y * TILE_SIZE + TILE_SIZE / 2,
              tower.range,
              0,
              Math.PI * 2
            );
            topCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            topCtx.lineWidth = 2;
            topCtx.stroke();

            if (TowerTypes[tower.name.toLowerCase()].lvl[tower.unitLvl + 1]) {
              upgradeButton.textContent =
                "Costo Miglioria Torre: " +
                TowerTypes[tower.name.toLowerCase()].lvl[tower.unitLvl + 1]
                  .cost;
            } else {
              upgradeButton.textContent = "Torre al livello massimo";
            }
            // Aggiungi qui eventuali azioni per la torre selezionata
          } else {
            console.warn("Nessuna torre trovata in questa posizione.");
          }
        } else {
          console.log("Torre già presente in questa posizione!");
        }
      } else if (gameState.selectedTowerType == null) {
        console.log("Torre non selezionata");
      } else if (gameState.grid[y][x] == 1) {
        console.log("Percorso già presente in questa posizione!");
      } else {
        console.log("Posizione non valida per piazzare una torre!");
      }
    } catch (error) {
      console.error("Errore durante il piazzamento della torre:", error);
    }
    console.log(
      "Pixel clicato:",
      Math.floor(event.clientX - rect.left),
      Math.floor(event.clientY - rect.top)
    );
    gameState.selectedTowerType = null;
  });

  towerOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const towerType = option.getAttribute("data-tower");
      const towerCost = parseInt(option.getAttribute("data-cost"));

      console.log(`Torre selezionata: ${towerType}, costo: ${towerCost}`);
      if (gameState.money >= towerCost) {
        gameState.selectedTowerType = towerType;
      } else {
        alert("Non hai abbastanza monete per questa torre!");
      }
    });
  });

  sound_button.addEventListener("click", () => {
    toggleAudio();
  });

  startWaveButton.addEventListener("click", () => {
    startWave();
  });

  upgradeButton.addEventListener("click", () => {
    if (!gameState.selectedTower) {
      console.log("Nessuna torre selezionata per l'upgrade.");
      return;
    }
    upgradeTower(gameState.selectedTower);
  });

  // ============= 2 Disegna Griglia =============
  function drawGrid() {
    console.log("drawGrid start");
    backgroundCtx.strokeStyle = "#ddd";
    backgroundCtx.lineWidth = 1;

    // Disegna linee verticali
    for (let x = 0; x <= backgroundCanvas.width; x += TILE_SIZE) {
      backgroundCtx.beginPath();
      backgroundCtx.moveTo(x, 0);
      backgroundCtx.lineTo(x, backgroundCanvas.height);
      backgroundCtx.stroke();
    }

    // Disegna linee orizzontali
    for (let y = 0; y <= backgroundCanvas.height; y += TILE_SIZE) {
      backgroundCtx.beginPath();
      backgroundCtx.moveTo(0, y);
      backgroundCtx.lineTo(backgroundCanvas.width, y);
      backgroundCtx.stroke();
    }
    console.log("gridsize", GRID_WIDTH, GRID_HEIGHT);
    console.log("drawGrid end");
  }

  function drawPath() {
    console.log("drawPath start");
    if (TowerTypes && Enemies && path) {
      console.log("Disegno il percorso con l'immagine di path");
      gameState.path.forEach((point) => {
        backgroundCtx.drawImage(
          path,
          point.x * TILE_SIZE,
          point.y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
      });
    } else {
      backgroundCtx.fillStyle = "#795548";
      gameState.path.forEach((point) => {
        backgroundCtx.fillRect(
          point.x * TILE_SIZE,
          point.y * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
      });
    }
    console.log("drawPath end");
  }

  function drawBackground() {
    console.log("drawBackground start");
    if (TowerTypes && Enemies && grass) {
      console.log("Disegno il background con l'immagine di erba");
      // Disegna un pattern di erba
      for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          backgroundCtx.drawImage(
            grass,
            x * TILE_SIZE,
            y * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    } else {
      backgroundCtx.fillStyle = "#8BC34A";
      backgroundCtx.fillRect(
        0,
        0,
        backgroundCanvas.width,
        backgroundCanvas.height
      );
    }
    console.log("drawBackground end");
  }

  async function drawGame() {
    path.src = Objects.tiles[10]; // Percorso
    grass.src = Objects.tiles[37]; // Erba
    let imagesLoaded = 0;

    async function onImageLoad() {
      imagesLoaded++;
      if (imagesLoaded === 2) {
        backgroundCtx.clearRect(
          0,
          0,
          backgroundCanvas.width,
          backgroundCanvas.height
        );
        drawGrid();
        drawBackground();
        drawPath();
        generateDrawPath();
        switch (gameState.level) {
          case 1:
            Functions.setDrawPath_lvl1(drawPathTile, gameState);
            Functions.setDrawShadows_lvl1(drawDetail);
            Functions.setDrawMapObjects_lvl1(
              drawDetail,
              addAnimatedObject,
              TILE_SIZE
            );
            break;
          default:
            Functions.setDrawPath_lvl1(drawPathTile, gameState);
            Functions.setDrawShadows_lvl1(drawDetail, gameState);
            Functions.setDrawMapObjects_lvl1(
              drawDetail,
              addAnimatedObject,
              gameState
            );
            break;
        }

        //playSound("backgroundMusic");
        console.log("Gamestate Grid: ", gameState.grid);
      }
    }

    path.onload = onImageLoad;
    grass.onload = onImageLoad;
  }

  function generateDrawPath() {
    for (let i = 0; i < gameState.path.length; i++) {
      let tileIndex;
      do {
        tileIndex = Math.floor(Math.random() * 64);
      } while (tileIndex === 37);
      drawPathTile(gameState.path[i], Objects.tiles[tileIndex]);
    }
  }

  function drawTile(x, y, newSrc) {
    const newImage = new Image();
    newImage.src = newSrc;
    newImage.onload = () => {
      backgroundCtx.drawImage(
        newImage,
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
    };
  }

  function drawBuildingTower(x, y, newSrc) {
    const newImage = new Image();
    newImage.src = newSrc;
    newImage.onload = () => {
      backgroundCtx.drawImage(
        newImage,
        x * TILE_SIZE,
        y * TILE_SIZE - 70,
        TILE_SIZE,
        TILE_SIZE + 70
      );
    };
  }

  function drawPathTile(Array, newSrc, flag) {
    const newImage = new Image();
    newImage.src = newSrc;
    flag = flag || false;
    let x = Array.x;
    let y = Array.y;
    newImage.onload = () => {
      backgroundCtx.drawImage(
        newImage,
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
      if (flag == true || true) {
        gameState.grid[y][x] = 1;
      }
    };
  }

  function drawDetail(x, y, newSrc, flag) {
    const newImage = new Image();
    newImage.src = newSrc;
    newImage.onload = () => {
      backgroundCtx.drawImage(
        newImage,
        x,
        y,
        newImage.width || TILE_SIZE,
        newImage.height || TILE_SIZE
      );
      if (flag === true) {
        // Use Math.floor to get integer indices
        const gridX = Math.floor(x / TILE_SIZE);
        const gridY = Math.floor(y / TILE_SIZE);

        // Check if the indices are within bounds
        if (
          gridY >= 0 &&
          gridY < gameState.grid.length &&
          gridX >= 0 &&
          gridX < gameState.grid[0].length
        ) {
          gameState.grid[gridY][gridX] = 3;
        }
      }
    };
  }

  function drawTower(x, y, src) {
    const newImage = new Image();
    newImage.src = src;
    newImage.onload = () => {
      gameCtx.drawImage(
        newImage,
        x * TILE_SIZE,
        y * TILE_SIZE,
        newImage.width || TILE_SIZE,
        newImage.height || TILE_SIZE
      );
      gameState.grid[y][x] = 2;
    };
  }

  // ============= GENERAZIONE PERCORSO =============
  function generatePath() {
    let path = [];
    let flag = 0;

    let x = 0;
    let y = Math.floor(GRID_HEIGHT / 2);
    path.push({ x, y });

    let lastDirection = "right"; // direzione iniziale

    while (x < GRID_WIDTH - 1) {
      // Muovi in orizzontale (destra)
      let stepsX = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < stepsX; i++) {
        if (x < GRID_WIDTH - 1) {
          x++;
          pushIfNew(path, { x, y });
          lastDirection = "right";
        }
      }

      // Muovi in verticale (su o giù)
      let dirY = Math.random() > 0.5 ? 1 : -1;

      // Evita inversione immediata
      if (
        (dirY === 1 && lastDirection === "up") ||
        (dirY === -1 && lastDirection === "down")
      ) {
        dirY *= -1;
      }

      let stepsY = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < stepsY; i++) {
        if (y + dirY >= 0 && y + dirY < GRID_HEIGHT) {
          y += dirY;
          pushIfNew(path, { x, y });
          lastDirection = dirY === 1 ? "down" : "up";
        }
      }
    }

    // Marcare il percorso sulla griglia
    path.forEach((point) => {
      gameState.grid[point.y][point.x] = 1;
    });

    return path;
  }

  // Funzione di utilità: evita duplicati consecutivi
  function pushIfNew(path, point) {
    const last = path[path.length - 1];
    if (!last || last.x !== point.x || last.y !== point.y) {
      path.push(point);
    }
  }

  // ============= SET GAME =============

  function setGame() {
    switch (gameState.level) {
      case 1:
        gameState.path = Functions.setPath_lvl1(GRID_HEIGHT);
        break;
      default:
        gameState.path = generatePath();
    }

    gameState.difficulty = gameState.level;

    /*
    gameState.path.forEach((tile) => {
      let x = tile.x * TILE_SIZE;
      let y = tile.y * TILE_SIZE;
      gameState.enemyPath.push({ x, y });
    });*/
    console.log("Percorso generato:", gameState.path);
    gameState.path.forEach((path) => {
      gameState.grid[path.y][path.x] = 1;
    });
    moneyValueElement.textContent = gameState.money;
    livesValueElement.textContent = gameState.lives;
    waveValueElement.textContent = gameState.wave;
  }

  // ============= 3 GESTIONE GIOCO =============
  // ...existing code...

  let lastTimestamp = performance.now();

  function gameLoop(timestamp) {
    const delta = (timestamp - lastTimestamp) / 1000; // delta in secondi
    lastTimestamp = timestamp;

    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    towerCtx.clearRect(0, 0, towerCanvas.width, towerCanvas.height);

    // Passa delta alle funzioni che aggiornano lo stato
    if (gameState.animatedObjects) updateAnimatedObjects(delta);
    if (gameState.animatedTowers) updateAnimatedTowers(delta);
    if (gameState.damageNumbers) renderDamageNumbers(delta);
    if (gameState.towers.length > 0) updateUnits(delta);

    if (gameState.waveInProgress) {
      updateTowers(delta);
      updateProjectiles(delta);
      updateEnemies(delta);
      if (gameState.waveTime > 0) {
        gameState.waveTime -= delta;
 // Adatta waveTime al tempo reale
      } else if (gameState.enemies.length == 0) {
        waveEnd();
      }
    }

    requestAnimationFrame(gameLoop);
  }

  // ...existing code...
  // Sostituisci la chiamata iniziale a gameLoop con:

  // ...existing code...

  async function startWave() {
    if (gameState.waveInProgress) {
      console.log("Una onda è già in corso!");
      return;
    }
    gameState.wave++;
    waveValueElement.textContent = gameState.wave;
    gameState.waveTime = 1000;
    gameState.waveInProgress = true;
    playSound("waveStart");
    // Aggiungi nuovi nemici
    //await addEnemy("goblin"); // Aggiungi un nemico di tipo goblin

    const enemyCount = Math.floor(
      Math.pow(gameState.wave * (gameState.difficulty + 1), 2)
    );
    console.log(
      "wave: ",
      gameState.wave,
      "difficulty",
      gameState.difficulty,
      "Enemy count: ",
      enemyCount
    );

    for (let i = 0; i < enemyCount; i++) {
      await waitMs(Math.random() * (1000 - 300 + 1) + 300); // Attendi un po' tra l'aggiunta dei nemici
      const enemyType = "goblin"; //Enemies[Math.floor(Math.random() * Enemies.length)];
      addEnemy(enemyType);
    }
  }

  function waveEnd() {
    gameState.waveInProgress = false;
    console.log("Fine dell'onda!");
    playSound("game_end");
  }

  async function fireProjectile(tower, closestEnemy, unitDirection) {
    console.log(
      "fireProjectile start, torre:",
      tower.name,
      "nemico:",
      closestEnemy,
      "direzione:",
      unitDirection
    );
    const temp_spr =
      Units[tower.name.toLowerCase()].sprites[tower.unitLvl].attack[
        unitDirection
      ];
    tower.unit = null;
    await temp_spr.forEach(async (sprite, index) => {
      if (tower.unitLvl >= 0) {
        tower.unit = sprite;
      }
      if (index < temp_spr.length - 2) {
        await waitMs(100);
      }
    });
    tower.unit =
      Units[tower.name.toLowerCase()].sprites[tower.unitLvl].idle[
        unitDirection
      ];

    const projectileType = tower.projectileType || "arrow";
    // Calcola l'angolo tra la torre e il nemico (0 = alto, PI/2 = destra, PI = basso, 3PI/2 = sinistra)
    let angle = Math.atan2(
      closestEnemy.y - (tower.y * TILE_SIZE + TILE_SIZE / 2),
      closestEnemy.x - (tower.x * TILE_SIZE + TILE_SIZE / 2)
    );

    // Converti l'angolo da radianti a gradi
    let degrees = (angle * 180) / Math.PI;

    // Aggiusta l'angolo in modo che 0° punti verso l'alto e cresca in senso orario
    degrees = (degrees + 90 + 360) % 360;

    // Mappa i gradi su 48 sprite (ogni sprite copre 7.5 gradi)
    const spriteIndex = Math.floor(degrees / 7.5);

    // Assicurati che l'indice sia tra 1 e 48 (gli sprite iniziano da 1.png)
    const spriteNumber = (spriteIndex % 48) + 1;

    const projectile = {
      x: tower.x * TILE_SIZE + TILE_SIZE / 2,
      y: tower.y * TILE_SIZE + TILE_SIZE / 2,
      targetX: closestEnemy.x,
      targetY: closestEnemy.y,
      damage: tower.damage,
      type: projectileType,
      speed: Units[tower.name.toLowerCase()].speed,
      sprite: Units.projectile[spriteNumber - 1], // Sottrai 1 perché l'array parte da 0
    };

    gameState.projectiles.push(projectile);
    tower.lastFireTime = Date.now();

    // Se il proiettile è di tipo splash, aumenta il danno in base al livello
    /*
    if (projectileType === "splash" && tower.level > 1) {
      projectile.damage = tower.damage * (1 + (tower.level - 1) * 0.2);
    }*/
  }

  function updateProjectiles() {
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
      const proj = gameState.projectiles[i];

      // Muovi il proiettile
      const dx = proj.targetX - proj.x;
      const dy = proj.targetY - proj.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Se il proiettile ha raggiunto il bersaglio o è uscito dallo schermo
      if (
        distance < proj.speed ||
        proj.x < 0 ||
        proj.x > gameCanvas.width ||
        proj.y < 0 ||
        proj.y > gameCanvas.height
      ) {
        // Rimuovi il proiettile
        gameState.projectiles.splice(i, 1);
        continue;
      }

      // Normalizza la direzione
      const nx = dx / distance;
      const ny = dy / distance;

      // Aggiorna la posizione
      proj.x += nx * proj.speed;
      proj.y += ny * proj.speed;
      drawProjectile(proj);

      // Controlla le collisioni con i nemici (solo per proiettili non splash)
      if (proj.type !== "splash") {
        for (let j = gameState.enemies.length - 1; j >= 0; j--) {
          const enemy = gameState.enemies[j];
          const dx = enemy.x - proj.x;
          const dy = enemy.y - proj.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Se il proiettile colpisce il nemico
          if (distance < enemy.size / 2) {
            // Applica il danno
            enemy.health -= proj.damage;

            // Mostra il numero del danno
            createDamageNumber(enemy.x, enemy.y, proj.damage);

            // Effetto di hit
            //createEffect("hit", enemy.x, enemy.y);
            playSound("enemyHit");

            // Rimuovi il proiettile
            gameState.projectiles.splice(i, 1);

            // Se il nemico è stato ucciso
            if (enemy.health <= 0) {
              // Aggiungi monete

              // Rimuovi il nemico
              gameState.enemies.splice(j, 1);

              // Effetto morte
              //createEffect("explosion", enemy.x, enemy.y);
              enemyDeath(enemy);
              playSound("enemyDeath");
            }

            break;
          }
        }
      }
    }
  }

  function drawProjectile(projectile) {
    if (!projectile) {
      console.log("proiettile inesistente");
      return;
    }

    // Use imageCache if sprite is already loaded
    if (!imageCache[projectile.sprite]) {
      const img = new Image();
      img.src = projectile.sprite;
      imageCache[projectile.sprite] = img;
    }

    const img = imageCache[projectile.sprite];

    // Draw projectile only if image is loaded
    if (img.complete) {
      gameCtx.drawImage(
        img,
        projectile.x,
        projectile.y,
        img.width || TILE_SIZE,
        img.height || TILE_SIZE
      );
    }
  }

  // ===== 4. AGGIUNTA AUDIO =====
  // Funzioni per caricare e riprodurre audio
  function loadAudio() {
    try {
      // Effetti sonori
      sounds.towerPlace = new Audio(
        "/assets/audio/Objects/impactGeneric_light_001.ogg"
      );
      sounds.towerUpgrade = new Audio(
        "/assets/audio/Objects/tower_upgrade.ogg"
      );
      sounds.enemyHit = new Audio("/assets/audio/");
      sounds.enemyDeath = new Audio("/assets/audio/Objects/enemy_death.ogg");
      sounds.waveStart = new Audio("/assets/audio/Game/wave_start.ogg");
      sounds.gameOver = new Audio("/assets/audio/Game/game_end.ogg");
      //sounds.victory = new Audio("/assets/audio/victory.mp3");
      sounds.buttonClick = new Audio("/assets/audio/Interface/button.ogg");
      // Musica di sottofondo (loop)
      sounds.backgroundMusic = new Audio(
        "/assets/audio/Game/I_ll-die-next-summer-_no-joke_-_online-audio-converter.com_.mp3"
      );
      sounds.backgroundMusic.loop = true;
      sounds.backgroundMusic.volume = 0.5;
      sounds.buttonClick.volume = 0.1;

      console.log("Audio caricato con successo");
    } catch (error) {
      console.error("Errore nel caricamento dell'audio:", error);
      audioEnabled = false;
    }
  }

  function playSound(soundName) {
    if (audioEnabled && sounds[soundName]) {
      sounds[soundName].currentTime = 0;
      console.log("Riproduzione audio:", soundName);
      sounds[soundName].play().catch((error) => {
        console.error("Errore nella riproduzione audio:", error);
      });
    }
  }

  function toggleAudio() {
    audioEnabled = !audioEnabled;
    if (audioEnabled == true) {
      console.log("Audio abilitato");
      sound_button.style.backgroundColor = "#4CAF50"; // Access style and use backgroundColor
      sound_button.textContent = "Audio On";
    } else {
      console.log("Audio disabilitato");
      sound_button.style.backgroundColor = "rgb(160, 27, 27)"; // Access style and use backgroundColor with string value
      sound_button.textContent = "Audio OFF";
    }
    if (audioEnabled) {
      sounds.backgroundMusic.play().catch(console.error);
    } else {
      sounds.backgroundMusic.pause();
    }

    return audioEnabled;
  }

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      playSound("buttonClick");
    });
  });

  // ===== 5. GESTIONE ASSETS =====
  function loadAssets() {
    loadAudio();
    loadCache();
    loadTowerTypes();
  }

  function loadTowerTypes() {
    console.log("Caricamento tipi di torre...");
    Object.keys(TowerTypes).forEach((towerName) => {
      const towerType = TowerTypes[towerName];
      if (towerType.sprites && towerType.sprites.length > 0) {
        towerType.sprites.forEach((sprite) => {
          preloadImages(sprite);
        });
      }
      if (
        towerType.projectileType &&
        Units.projectile[towerType.projectileType]
      ) {
        preloadImages(Units.projectile[towerType.projectileType]);
      }
    });
  }

  function loadCache() {
    console.log("Caricamento cache immagini...");
    // Carica le immagini degli oggetti
    loadUnits();
    loadObjects();
  }

  function loadObjects() {
    console.log("Caricamento oggetti...");
    preloadImages(Objects.bush);
    preloadImages(Objects.flower);
    preloadImages(Objects.lamp);
    preloadImages(Objects.fence);
    preloadImages(Objects.camp);
    preloadImages(Objects.pointer);
    preloadImages(Objects.log);
    preloadImages(Objects.shadow);
  }

  function loadUnits() {
    console.log("Loading units...");

    // Load archer sprites for each level
    Units.archer.sprites.forEach((levelSprites) => {
      // Load idle sprites
      Object.values(levelSprites.idle).forEach((directionSprites) => {
        if (Array.isArray(directionSprites)) {
          preloadImages(directionSprites);
        }
      });

      // Load attack sprites
      Object.values(levelSprites.attack).forEach((directionSprites) => {
        if (Array.isArray(directionSprites)) {
          preloadImages(directionSprites);
        }
      });

      // Load preAttack sprites
      Object.values(levelSprites.preAttack).forEach((directionSprites) => {
        if (Array.isArray(directionSprites)) {
          preloadImages(directionSprites);
        }
      });
    });

    // Load projectile sprites
    preloadImages(Units.projectile);
  }

  function loadTiles() {
    for (let i = 1; i < 65; i++) {
      let directory = "/assets/sprites/Tiles/FieldsTile_";
      if (i < 10) {
        directory += "0" + i;
      } else {
        directory += i;
      }
      directory += ".png";
      Objects.tiles.push(directory);
    }
  }

  // ===== 6. GESTIONE ANIMAZIONI =====
  class SpriteAnimation {
    constructor(imagePaths, frameRate = 10) {
      this.frames = preloadImages(imagePaths);
      this.frameRate = frameRate; // numero di frame prima di cambiare immagine
      this.currentFrame = 0;
      this.counter = 0;
    }

    update() {
      this.counter++;
      if (this.counter >= this.frameRate) {
        this.counter = 0;
        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      }
    }

    draw(gameCtx, x, y, width, height) {
      gameCtx.drawImage(this.frames[this.currentFrame], x, y, width, height);
    }
  }

  function addAnimatedObject(x, y, object, speed) {
    let timage = new Image();
    timage.src = object.sprites[0];
    timage.onload = () => {
      console.log("Immagine caricata:", timage.src);
      let animatedObject = {
        objects: new SpriteAnimation(object.sprites, speed),
        x: x,
        y: y,
        height: timage.height || TILE_SIZE,
        width: timage.width || TILE_SIZE,
      };
      gameState.animatedObjects.push(animatedObject);
    };
  }

  function updateAnimatedObjects(delta) {
    try {
      gameState.animatedObjects.forEach((object) => {
        object.objects.update();
        object.objects.draw(
          gameCtx,
          object.x,
          object.y,
          object.width,
          object.height
        );
      });
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento degli oggetti animati:",
        error
      );
    }
  }

  function addAnimatedTower(x, y, towerType, speed) {
    let timage = new Image();
    timage.src = towerType.sprites[0];
    timage.onload = () => {
      console.log("Immagine caricata:", timage.src);
      let animatedTower = {
        objects: new SpriteAnimation(towerType.sprites, speed),
        height: timage.height || TILE_SIZE,
        width: TILE_SIZE,
        x: x * TILE_SIZE,
        y: y * TILE_SIZE,
      };
      animatedTower.y -= animatedTower.height - animatedTower.width;
      gameState.animatedTowers.push(animatedTower);
    };
  }

  function updateAnimatedTowers() {
    try {
      gameState.animatedTowers.forEach((object) => {
        object.objects.update();
        object.objects.draw(
          gameCtx,
          object.x,
          object.y,
          object.width,
          object.height
        );
      });
    } catch (error) {
      console.error(
        "Errore durante l'aggiornamento degli oggetti animati:",
        error
      );
    }
  }

  // ======== 7. GESTIONE TOWERS =======
  async function placeTower(towerType, x, y) {
    if (gameState.grid[y][x] != 0) {
      console.log("Posizione occupata!");
      return;
    }
    if (towerType == null) {
      console.log("Tipo di torre non valido!");
      return;
    }
    if (x < 0 || y < 0 || x >= GRID_WIDTH || y >= GRID_HEIGHT) {
      console.log("Coordinate fuori dai limiti della griglia!");
      return;
    }
    if (towerType.lvl[0] == null) {
      console.log("Torre non trovata!");
      return;
    }
    const currentTower = towerType.lvl[0];
    const towerToPlace = {
      name: towerType.name,
      level: 0,
      cost: currentTower.cost,
      range: currentTower.range,
      fireRate: currentTower.fireRate,
      damage: currentTower.damage,
      unit: Units[towerType.name.toLowerCase()].sprites[0].idle.D,
      unitLvl: 0,
      unitTimer: 0,
      unitFrame: 0,
      x: x,
      y: y,
      lastFireTime: null,
    };
    await buildTower(currentTower, x, y);
    gameState.towers.push(towerToPlace);
  }

  async function startTowerPlacemnt(towerType, x, y) {
    for (let i = 0; i < 4; i++) {
      await waitMs(400);
      drawTile(x, y, Objects.tiles[37]);
      playSound("towerPlace");
      drawBuildingTower(x, y, towerType.buildSprites[i]);
    }
    backgroundCtx.clearRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  async function buildTower(towerToBuild, x, y) {
    await startTowerPlacemnt(towerToBuild, x, y);
    addAnimatedTower(x, y, towerToBuild, 40);
    gameState.grid[y][x] = 2;
  }

  async function upgradeTower(tower) {
    if (!tower) {
      console.log("nessuna torre selezionata");
      return;
    }
    if (tower.level >= 6) {
      console.log("torre già al livello massimo");
      return;
    }
    const curretLvl = tower.level + 1;
    const type = tower.name.toLowerCase();
    const currentTower = TowerTypes[type].lvl[curretLvl];

    let towerToUpgrade = {
      name: tower.name,
      level: curretLvl,
      cost: currentTower.cost,
      range: currentTower.range,
      fireRate: currentTower.fireRate,
      damage: currentTower.damage,
      unit: Units[type].sprites[0].idle.D,
      unitLvl: currentTower.unit,
      unitTimer: 0,
      unitFrame: 0,
      x: currentTower.x,
      y: currentTower.y,
      lastFireTime: null,
    };
    let index = gameState.towers.findIndex(
      (t) => t.x === tower.x && t.y === tower.y
    );
    // Remove the animated tower as well
    let animIndex = gameState.animatedTowers.findIndex(
      (t) =>
        Math.floor(t.x / TILE_SIZE) === tower.x &&
        Math.floor(t.y / TILE_SIZE) === tower.y
    );
    if (animIndex !== -1) {
      gameState.animatedTowers.splice(animIndex, 1);
    }
    if (index !== -1) {
      gameState.towers.splice(index, 1);
    }
    await buildTower(currentTower, tower.x, tower.y);
    gameState.towers.push(towerToUpgrade);
  }

  function updateTowers() {
    gameState.towers.forEach(async (tower) => {
      const currentTime = Date.now();
      if (
        !tower.lastFireTime ||
        currentTime - tower.lastFireTime >= tower.fireRate
      ) {
        let closestEnemy = null;
        let closestRevealedEnemy = null;
        let closestDistance = Infinity;
        let unitDirection = "R"; // Default direction

        await gameState.enemies.forEach((enemy) => {
          const towerCenterX = tower.x * TILE_SIZE + TILE_SIZE / 2;
          const towerCenterY = tower.y * TILE_SIZE + TILE_SIZE / 2;
          const dx = enemy.x - towerCenterX;
          const dy = enemy.y - towerCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Calculate angle in degrees
          let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          // Convert angle to 0-360 range and adjust so 0° is up
          angle = (-angle + 90 + 360) % 360;

          // Determine direction based on 90° segments
          if (angle >= 315 || angle < 45) {
            unitDirection = "U"; // Up
          } else if (angle >= 45 && angle < 135) {
            unitDirection = "R"; // Right
          } else if (angle >= 135 && angle < 225) {
            unitDirection = "D"; // Down
          } else {
            unitDirection = "L"; // Left
          }

          if (distance <= tower.range && distance < closestDistance) {
            closestEnemy = enemy;
            closestDistance = distance;
          } else if (
            distance <= tower.range * 2 &&
            distance < closestDistance
          ) {
            closestRevealedEnemy = enemy;
            if (tower.unitLvl >= 0) {
              tower.unit =
                Units[tower.name.toLowerCase()].sprites[
                  tower.unitLvl
                ].preAttack[unitDirection];
            }
          } else {
            tower.unit =
              Units[tower.name.toLowerCase()].sprites[tower.unitLvl].idle[
                unitDirection
              ];
          }
        });

        // Fire at closest enemy
        if (closestEnemy != null) {
          fireProjectile(tower, closestEnemy, unitDirection);
        }
      }
    });
  }

  function updateUnits() {
    gameState.towers.forEach((tower) => {
      if (tower.unit && tower.unit.length > 0) {
        //console.log("Aggiornamento torre:", tower.name, "Unità:", tower.unit);
        tower.unitTimer++;
        if (tower.unitTimer >= 60) {
          tower.unitTimer = 0; // Resetta il timer dell'unità
          tower.unitFrame++;
          if (tower.unitFrame >= tower.unit.length) {
            tower.unitFrame = 0; // Resetta il frame dell'unità
          }
        }
        let spritePath = tower.unit[tower.unitFrame];

        if (!imageCache[spritePath]) {
          const img = new Image();

          img.src = spritePath;

          img.onload = () => {
            imageCache[spritePath] = img;
          };
          img.onerror = () => {
            console.error("Errore nel caricamento dell'immagine:", spritePath);
            // Handle the error appropriately, perhaps by using a placeholder or skipping the draw
          };
        }

        const img = imageCache[spritePath];
        if (!img) {
          console.error("Immagine non trovata per il percorso:", spritePath);
          return; // Esci se l'immagine non è stata caricata
        }

        gameCtx.drawImage(
          img,
          tower.x * TILE_SIZE + 6,
          tower.y * TILE_SIZE, // Sposta l'unità verso l'alto
          img.width || TILE_SIZE,
          img.height || TILE_SIZE
        );
      }
    });
  }

  // ======== 8. GESTIONE NEMICI =======
  function addEnemy(enemy) {
    if (!enemy) {
      console.log("nemico non selezionato");
      return;
    }

    /*
    const t_image = new Image();
    t_image.src = enemy.sprites.r_Walk[0];
    t_image.onload = () => {
      topCtx.drawImage(
        t_image,
        -48,
        Math.floor(Math.random() * (620 - 575 + 1)) + 575,
        t_image.width,
        t_image.height
      );
    }*/
    let enemy_to_add = {
      id: Date.now(),
      name: Enemies[enemy].name.toLowerCase(),
      health: Enemies[enemy].health,
      description: Enemies[enemy].description,
      size: Enemies[enemy].size,
      speed: Enemies[enemy].speed,
      reward: Enemies[enemy].reward,
      x: -48, // genera un numero tra 0 e -48
      y: 600,
      offset_x: null,
      offset_y: null,
      next_x: null,
      next_y: null,
      tile: 0,
      sprites: Enemies[enemy].sprites.r_Walk,
      frame: 0,
      pathIndex: 0,
      angle: enemyStartAngle,
    };

    /*
    if (enemy_to_add.x < 0) {
      enemy_to_add.next_x = enemy_to_add.x + enemy_to_add.speed;
    } else {
      enemy_to_add.next_x = enemy_to_add.x;
    }
    if (enemy_to_add.y < 0) {
      enemy_to_add.next_y = enemy_to_add.y + enemy_to_add.speed;
    } else {
      enemy_to_add.next_y = enemy_to_add.y;
    }*/
    switch (enemy_to_add.angle) {
      case 0: // Destra
        enemy_to_add.next_x = enemy_to_add.x + enemy_to_add.speed;
        enemy_to_add.next_y = enemy_to_add.y;
        break;
      case 1: // Sinistra
        enemy_to_add.next_x = enemy_to_add.x - enemy_to_add.speed;
        enemy_to_add.next_y = enemy_to_add.y;
        break;
      case 2: // Giù
        enemy_to_add.next_x = enemy_to_add.x;
        enemy_to_add.next_y = enemy_to_add.y + enemy_to_add.speed;
        break;
      case 3: // Su
        enemy_to_add.next_x = enemy_to_add.x;
        enemy_to_add.next_y = enemy_to_add.y - enemy_to_add.speed;
        break;
      default:
        console.error("Angolo non valido:", enemy_to_add.angle);
        return; // Esci se l'angolo non è valido
    }

    // Imposta offset_x e offset_y a valori casuali tra -30 e 30
    enemy_to_add.offset_x = Math.floor(Math.random() * 31) - 15;
    enemy_to_add.offset_y = Math.floor(Math.random() * 31) - 15;
    console.log("Aggiunta nemico:", enemy_to_add);
    gameState.enemies.push(enemy_to_add);
    return;
  }

  function updateEnemies() {
    gameState.enemies.forEach((enemy) => {
      if (enemy.x > gameCanvas.width || enemy.y > gameCanvas.height) {
        // Se il nemico esce dallo schermo, rimuovilo
        console.log("Nemico fuori dallo schermo:", enemy);
        const index = gameState.enemies.indexOf(enemy);
        if (index > -1) {
          gameState.enemies.splice(index, 1);
          gameState.lives -= 1; // Perdita di una vita se il nemico esce dallo schermo
          livesValueElement.textContent = gameState.lives;
          return; // Esci dalla funzione per evitare errori di accesso a un oggetto rimosso
        }
      }
      // First update current position to match next position
      enemy.x = enemy.next_x;
      enemy.y = enemy.next_y;

      // Get current target tile coordinates
      if (enemy.tile < gameState.path.length) {
        const targetX = gameState.path[enemy.tile].x * TILE_SIZE;
        const targetY = gameState.path[enemy.tile].y * TILE_SIZE;

        // Calculate distances to target
        const dx = targetX - enemy.x + enemy.offset_x;
        const dy = targetY - enemy.y + enemy.offset_y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If close enough to target, move to next tile
        if (distance < enemy.speed) {
          enemy.tile++;
          if (enemy.tile < gameState.path.length) {
            // Get next tile coordinates
            const nextX = gameState.path[enemy.tile].x * TILE_SIZE;
            const nextY = gameState.path[enemy.tile].y * TILE_SIZE;

            // Determine direction based on movement vector
            const moveX = nextX - enemy.x;
            const moveY = nextY - enemy.y;

            // Set angle and sprites based on primary direction of movement
            if (Math.abs(moveX) > Math.abs(moveY)) {
              // Horizontal movement is dominant
              if (moveX > 0) {
                enemy.angle = 0; // Right
                enemy.sprites = Enemies[enemy.name].sprites.r_Walk;
              } else {
                enemy.angle = 1; // Left
                enemy.sprites = Enemies[enemy.name].sprites.l_Walk;
              }
            } else {
              // Vertical movement is dominant
              if (moveY > 0) {
                enemy.angle = 2; // Down
                enemy.sprites = Enemies[enemy.name].sprites.d_Walk;
              } else {
                enemy.angle = 3; // Up
                enemy.sprites = Enemies[enemy.name].sprites.u_Walk;
              }
            }
          }
        }

        // Move towards current target
        if (enemy.tile < gameState.path.length) {
          const moveAngle = Math.atan2(dy, dx);
          enemy.next_x = enemy.x + Math.cos(moveAngle) * enemy.speed;
          enemy.next_y = enemy.y + Math.sin(moveAngle) * enemy.speed;
        }
      }

      drawEnemy(enemy);
    });
  }

  function drawEnemy(enemy) {
    let spritePath = enemy.sprites[Math.floor(enemy.frame)];
    /*
    gameCtx.fillStyle = "rgb(0, 0, 0)"; // Semi-transparent background
    gameCtx.fillRect(
      enemy.x,
      enemy.y,
      4,
      4
    );  */

    // Use imageCache if sprite is already loaded
    if (!imageCache[spritePath]) {
      const img = new Image();
      img.src = spritePath;
      imageCache[spritePath] = img;
    }

    const img = imageCache[spritePath];

    // Draw enemy only if image is loaded
    if (img.complete) {
      // Draw enemy sprite
      gameCtx.drawImage(
        img,
        enemy.x,
        enemy.y,
        img.width || TILE_SIZE,
        img.height || TILE_SIZE
      );

      // Draw health bar
      const healthBarWidth = img.width || TILE_SIZE;
      const maxHealth = Enemies[enemy.name].health;
      const currentHealthWidth = (enemy.health / maxHealth) * healthBarWidth;

      // Health bar background
      gameCtx.fillStyle = "#333";
      gameCtx.fillRect(enemy.x, enemy.y, healthBarWidth, 5);

      // Health bar fill
      const healthPercentage = enemy.health / maxHealth;
      gameCtx.fillStyle =
        healthPercentage > 0.6
          ? "green"
          : healthPercentage > 0.3
          ? "yellow"
          : "red";
      gameCtx.fillRect(enemy.x, enemy.y, currentHealthWidth, 5);
    }

    // Update animation frame
    enemy.frame += 0.05; // Increment frame for animation
    if (enemy.frame >= enemy.sprites.length) {
      enemy.frame = 0;
    }
  }

  function enemyDeath(real_enemy) {
    console.log("Nemico ucciso:", real_enemy);
    // Rimuovi il nemico dalla lista

    const enemy = real_enemy;
    gameState.money += enemy.reward;
    moneyValueElement.textContent = gameState.money;
    const index = gameState.enemies.indexOf(real_enemy);
    if (index > -1) {
      gameState.enemies.splice(index, 1);
    } else {
      console.error("Nemico non trovato nella lista:", enemy);
      return;
    }
    const enemyDeathSprites = Enemies[enemy.name].sprites[enemy.angle + 4];
    playSound("enemyDeath");
    enemyDeathSprites.forEach(async (sprite) => {
      const t_image = new Image();
      t_image.src = sprite;
      t_image.onload = () => {
        gameCtx.drawImage(
          t_image,
          enemy.x,
          enemy.y,
          t_image.width,
          t_image.height
        );
      };
      spriteCtx.clearRect(
        enemy.x,
        enemy.y,
        t_image.width || TILE_SIZE,
        t_image.height || TILE_SIZE
      );
      spriteCtx.drawImage(
        t_image,
        enemy.x,
        enemy.y,
        sprite.width || TILE_SIZE,
        sprite.height || TILE_SIZE
      );
      await waitMs(100);
    });
  }

  /*function drawEnemies() {
    gameState.enemies.forEach((enemy) => {
      let spritePath = enemy.sprites[Math.floor(enemy.frame)];
      
    //gameCtx.fillStyle = "rgb(0, 0, 0)"; // Semi-transparent background
    //gameCtx.fillRect(
    //  enemy.x,
    //  enemy.y,
    //  4,
    //  4
    //);  

      // Use imageCache if sprite is already loaded
      if (!imageCache[spritePath]) {
        const img = new Image();
        img.src = spritePath;
        imageCache[spritePath] = img;
      }

      const img = imageCache[spritePath];

      // Draw enemy only if image is loaded
      if (img.complete) {
        // Draw enemy sprite
        gameCtx.drawImage(
          img,
          enemy.x,
          enemy.y,
          img.width || TILE_SIZE,
          img.height || TILE_SIZE
        );

        // Draw health bar
        const healthBarWidth = img.width || TILE_SIZE;
        const maxHealth = Enemies[enemy.name].health;
        const currentHealthWidth = (enemy.health / maxHealth) * healthBarWidth;

        // Health bar background
        gameCtx.fillStyle = "#333";
        gameCtx.fillRect(enemy.x, enemy.y, healthBarWidth, 5);

        // Health bar fill
        const healthPercentage = enemy.health / maxHealth;
        gameCtx.fillStyle =
          healthPercentage > 0.6
            ? "green"
            : healthPercentage > 0.3
            ? "yellow"
            : "red";
        gameCtx.fillRect(enemy.x, enemy.y, currentHealthWidth, 5);
      }

      // Update animation frame
      enemy.frame += 0.05; // Increment frame for animation
      if (enemy.frame >= enemy.sprites.length) {
        enemy.frame = 0;
      }
    });
  }*/

  function enemyDeath(real_enemy) {
    console.log("Nemico ucciso:", real_enemy);
    // Rimuovi il nemico dalla lista

    const enemy = real_enemy;
    gameState.money += enemy.reward;
    moneyValueElement.textContent = gameState.money;
    const index = gameState.enemies.indexOf(real_enemy);
    if (index > -1) {
      gameState.enemies.splice(index, 1);
    } else {
      console.error("Nemico non trovato nella lista:", enemy);
      return;
    }
    const enemyDeathSprites = Enemies[enemy.name].sprites[enemy.angle + 4];
    playSound("enemyDeath");
    enemyDeathSprites.forEach(async (sprite) => {
      const t_image = new Image();
      t_image.src = sprite;
      t_image.onload = () => {
        gameCtx.drawImage(
          t_image,
          enemy.x,
          enemy.y,
          t_image.width,
          t_image.height
        );
      };
      spriteCtx.clearRect(
        enemy.x,
        enemy.y,
        t_image.width || TILE_SIZE,
        t_image.height || TILE_SIZE
      );
      spriteCtx.drawImage(
        t_image,
        enemy.x,
        enemy.y,
        sprite.width || TILE_SIZE,
        sprite.height || TILE_SIZE
      );
      await waitMs(100);
    });
  }

  // ===== FUNCTIONS =====
  function rotateImage(image, angle, callback) {
    // Crea un backgroundCanvas  temporaneo
    const tempCanvas = document.createElement("backgroundCanvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Imposta le dimensioni del backgroundCanvas  in base all'immagine
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;

    // Trasforma il backgroundCanvas  per ruotare l'immagine
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate(angle);
    tempCtx.drawImage(image, -image.width / 2, -image.height / 2);

    // Crea una nuova immagine dall'output del backgroundCanvas
    const rotatedImage = new Image();
    rotatedImage.src = tempCanvas.toDataURL();

    rotatedImage.onload = () => {
      callback(rotatedImage);
    };
  }

  function preloadImages(imagePaths) {
    return imagePaths.map((src) => {
      if (!imageCache[src]) {
        const img = new Image();
        img.src = src;
        imageCache[src] = img;
      }
      return imageCache[src];
    });
  }

  function waitMs(ms) {
    console.log("waiting " + ms + " milliseconds");
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function createDamageNumber(x, y, amount) {
    if (!gameState.damageNumbers) {
      gameState.damageNumbers = [];
    }
    gameState.damageNumbers.push({
      x,
      y,
      amount,
      alpha: 1,
      velocity: -0.5, // Movimento verso l'alto
      startTime: Date.now(),
    });

    // Aggiungi alla funzione gameLoop o crea una funzione separata per renderizzare
    // i numeri di danno
    renderDamageNumbers();
  }

  function renderDamageNumbers() {
    if (!gameState.damageNumbers) return;

    for (let i = gameState.damageNumbers.length - 1; i >= 0; i--) {
      const dmg = gameState.damageNumbers[i];
      const age = Date.now() - dmg.startTime;

      // Rimuovi i numeri di danno vecchi
      if (age > 1000) {
        gameState.damageNumbers.splice(i, 1);
        continue;
      }

      // Calcola l'opacità in base all'età
      dmg.alpha = 1 - age / 1000;

      // Aggiorna la posizione
      dmg.y += dmg.velocity;

      // Disegna il numero
      gameCtx.fillStyle = `rgba(255, 0, 0, ${dmg.alpha})`;
      gameCtx.font = "bold 14px Arial";
      gameCtx.textAlign = "center";
      gameCtx.fillText(`-${dmg.amount}`, dmg.x, dmg.y);
    }
  }

  // ===== End Load =====
  loadAssets();
  setGame();
  drawGame();
  requestAnimationFrame(gameLoop);
});
