import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const src = path.join(publicDir, "logo.png");

const BG = { r: 9, g: 9, b: 11, alpha: 1 }; // #09090b

/**
 * Génère une icône carrée : logo centré sur fond sombre.
 * @param {number} size  Taille du canvas (px)
 * @param {number} pad   Ratio de marge (0.2 = 20% de marge totale)
 * @param {string} out   Nom du fichier de sortie
 */
async function makeIcon(size, pad, out) {
  const inner = Math.round(size * (1 - pad));
  const logo = await sharp(src)
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, out));

  console.log(`✓ ${out} (${size}x${size})`);
}

/**
 * Génère un screenshot recadré à la taille exacte demandée.
 * @param {string} input  Image source
 * @param {number} w
 * @param {number} h
 * @param {string} out
 */
async function makeScreenshot(input, w, h, out) {
  await sharp(path.join(publicDir, input))
    .resize(w, h, { fit: "cover", position: "centre" })
    .png()
    .toFile(path.join(publicDir, out));
  console.log(`✓ ${out} (${w}x${h})`);
}

await makeIcon(96, 0.18, "icon-96.png");
await makeIcon(192, 0.18, "icon-192.png");
await makeIcon(512, 0.18, "icon-512.png");
// Version maskable : plus de marge pour respecter la "safe zone" (40%)
await makeIcon(512, 0.4, "icon-512-maskable.png");
// Apple touch icon
await makeIcon(180, 0.18, "apple-touch-icon.png");

// Screenshots du manifest (tailles exactes)
await makeScreenshot("necked_fest_homepage_1.jpg", 1280, 720, "screenshot-wide.png");
await makeScreenshot("necked_fest_homepage_1.jpg", 750, 1334, "screenshot-narrow.png");

console.log("Icônes générées.");
