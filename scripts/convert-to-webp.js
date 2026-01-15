const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Image extensions to convert
const imageExtensions = ['.png', '.jpg', '.jpeg'];

// Directories to process
const dirsToProcess = [
    publicDir,
    path.join(publicDir, 'merch'),
    path.join(publicDir, 'speakers'),
    path.join(publicDir, 'sponsors'),
];

async function convertToWebP(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (!imageExtensions.includes(ext)) {
        return;
    }

    const fileName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const webpPath = path.join(dirName, `${fileName}.webp`);

    // Skip if WebP already exists
    if (fs.existsSync(webpPath)) {
        console.log(`⏭️  Skipping ${path.relative(publicDir, filePath)} (WebP exists)`);
        return;
    }

    try {
        await sharp(filePath)
            .webp({ quality: 85 })
            .toFile(webpPath);

        const originalSize = fs.statSync(filePath).size;
        const webpSize = fs.statSync(webpPath).size;
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

        console.log(`✅ ${path.relative(publicDir, filePath)} → ${fileName}.webp (${savings}% smaller)`);
    } catch (error) {
        console.error(`❌ Error converting ${filePath}:`, error.message);
    }
}

async function processDirectory(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            await convertToWebP(filePath);
        }
    }
}

async function main() {
    console.log('🖼️  Converting images to WebP format...\n');

    for (const dir of dirsToProcess) {
        console.log(`\n📁 Processing: ${path.relative(publicDir, dir) || 'root'}`);
        await processDirectory(dir);
    }

    console.log('\n✨ Conversion complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update image imports to use .webp extension');
    console.log('   2. Consider removing original PNG/JPG files if no longer needed');
    console.log('   3. Test images on the website');
}

main().catch(console.error);
