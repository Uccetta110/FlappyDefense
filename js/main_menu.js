import { Objects } from "./objects.js";

document.addEventListener("DOMContentLoaded", () => {
  const start_Button = document.querySelector(".Start-button");
  const option_button = document.querySelector(".Option-button");
  const exit_button = document.querySelector(".Exit-button");
  const background = document.getElementById("background");
  const click_layer = document.getElementById("click-layer");
  const menu = document.querySelector(".main-menu");

  let menu_state = {
    width: window.innerWidth,
    height: window.innerHeight,
    levels: [],
  };

  // ======= 1. GESTIONE INPUT =========
  start_Button.addEventListener("click", () => {
    start_Button_click();
  });

  option_button.addEventListener("click", () => {
    alert("Opzioni non ancora disponibili");
  });

  exit_button.addEventListener("click", () => {
    alert("Grazie per aver giocato!");
  });

  function start_Button_click() {
    background.classList.add("focused");
    menu.classList.add("hide");
  }

  click_layer.addEventListener("click", (event) => {
    const rect = background.getBoundingClientRect();
    let x = Math.floor(event.clientX - rect.left);
    let y = Math.floor(event.clientY - rect.top);
    if (x < 0) {
      x = 0;
    }
    if (x > background.width) {
      x = background.width;
    }
    if (y < 0) {
      y = 0;
    }
    if (y > background.height) {
      y = background.height;
    }
    console.log("Cliccato su:", x, y);
  });

  // ======= 2. GESTIONE LIVELLI =======
  function zoom_on_level(lvl) {}

  function add_level(x, y, lvl) {
    if (lvl < 1) {
      const unlocked = true;
    } else {
      if (menu_state.levels[lvl - 1].completed == true) {
        const unlocked = true;
      } else {
        const unlocked = false;
      }
    }
    const name = "Livello " + lvl;
  }

  // ======
});
