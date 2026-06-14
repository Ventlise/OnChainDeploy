// scripts/gen-og-image.js
const fs = require("fs")
const path = require("path")

// Check if sharp is installed, if not tell user
let sharp
try {
  sharp = require("sharp")
} catch {
  console.error("\n❌ 'sharp' is not installed. Run this first:\n")
  console.error("   npm install sharp --save-dev\n")
  process.exit(1)
}

const svgPath = path.join(__dirname, "..", "public", "og-image.svg")
const pngPath = path.join(__dirname, "..", "public", "og-image.png")

const svgBuffer = fs.readFileSync(svgPath)

sharp(svgBuffer)
  .resize(1200, 630)
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log("✅ public/og-image.png created successfully (1200×630)")
  })
  .catch((err) => {
    console.error("❌ Failed to convert:", err)
  })