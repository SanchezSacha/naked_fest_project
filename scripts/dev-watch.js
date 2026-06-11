#!/usr/bin/env node
// Script qui relance next dev quand .env est modifié

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ENV_FILE = path.join(__dirname, "..", ".env");

let nextProcess = null;
let isRestarting = false;

function startNextDev() {
  console.log("🚀 Démarrage de Next.js dev server...");

  if (nextProcess) {
    nextProcess.kill();
  }

  nextProcess = spawn("npx", ["next", "dev"], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  nextProcess.on("exit", (code) => {
    if (!isRestarting && code !== 0) {
      console.log(`\n⚠️ Next.js s'est arrêté avec le code ${code}`);
    }
  });
}

function restartNextDev() {
  if (isRestarting) return;
  isRestarting = true;

  console.log("\n📝 .env modifié - Redémarrage du serveur...\n");

  if (nextProcess) {
    nextProcess.removeAllListeners("exit");
    nextProcess.on("exit", () => {
      isRestarting = false;
      startNextDev();
    });
    nextProcess.kill("SIGTERM");
  } else {
    isRestarting = false;
    startNextDev();
  }
}

// Vérifier que .env existe
if (!fs.existsSync(ENV_FILE)) {
  console.log("⚠️ .env non trouvé, création d'un fichier vide...");
  fs.writeFileSync(ENV_FILE, "", "utf8");
}

// Surveiller .env
fs.watchFile(ENV_FILE, { interval: 1000 }, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    restartNextDev();
  }
});

console.log("👀 Surveillance de .env activée");
console.log("   Modifiez .env pour redémarrer automatiquement\n");

// Lancer Next.js
startNextDev();

// Gérer l'arrêt propre
process.on("SIGINT", () => {
  console.log("\n🛑 Arrêt...");
  if (nextProcess) {
    nextProcess.kill("SIGTERM");
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  if (nextProcess) {
    nextProcess.kill("SIGTERM");
  }
  process.exit(0);
});
