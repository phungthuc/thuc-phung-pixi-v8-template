import sharp from 'sharp';
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

class TexturePacker {
    constructor() {
        this.inputDir = 'assets/source';
        this.outputDir = 'public/assets/textures';
        this.atlasName = 'texture-atlas';
    }

    async packTextures() {
        try {
            console.log('Starting texture packing...');
            
            // Tạo thư mục output nếu chưa tồn tại
            await this.ensureOutputDir();
            
            // Tìm tất cả file ảnh trong thư mục source
            const imageFiles = await this.findImageFiles();
            
            if (imageFiles.length === 0) {
                console.log('No image files found, creating sample textures...');
                await this.createSampleTextures();
                return;
            }
            
            // Tạo texture atlas
            await this.createTextureAtlas(imageFiles);
            
            // Convert và nén từng texture riêng lẻ
            await this.processIndividualTextures(imageFiles);
            
            console.log('Texture packing completed successfully!');
        } catch (error) {
            console.error('Error during texture packing:', error);
        }
    }

    async ensureOutputDir() {
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch (error) {
            console.error('Error creating output directory:', error);
        }
    }

    async findImageFiles() {
        const patterns = [
            path.join(this.inputDir, '**/*.png'),
            path.join(this.inputDir, '**/*.jpg'),
            path.join(this.inputDir, '**/*.jpeg'),
            path.join(this.inputDir, '**/*.bmp'),
            path.join(this.inputDir, '**/*.gif')
        ];
        
        const files = [];
        for (const pattern of patterns) {
            const matches = await glob(pattern);
            files.push(...matches);
        }
        
        return files;
    }

    async createSampleTextures() {
        const sampleTextures = [
            { name: 'background', width: 800, height: 600, color: '#1099bb' },
            { name: 'button', width: 200, height: 60, color: '#4CAF50' },
            { name: 'button-hover', width: 200, height: 60, color: '#66BB6A' },
            { name: 'button-pressed', width: 200, height: 60, color: '#388E3C' }
        ];

        for (const texture of sampleTextures) {
            await this.createSampleTexture(texture);
        }
    }

    async createSampleTexture({ name, width, height, color }) {
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="${width}" height="${height}" fill="${color}"/>
                ${name === 'button' || name === 'button-hover' || name === 'button-pressed' ? 
                    `<rect width="${width}" height="${height}" fill="none" stroke="#ffffff" stroke-width="2" rx="10"/>` : ''}
            </svg>
        `;

        await sharp(Buffer.from(svg))
            .webp({ quality: 80 })
            .toFile(path.join(this.outputDir, `${name}.webp`));
        
        console.log(`Created sample texture: ${name}.webp`);
    }

    async createTextureAtlas(imageFiles) {
        if (imageFiles.length === 0) return;

        const maxAtlasSize = 2048;
        const padding = 2;
        let currentX = 0;
        let currentY = 0;
        let maxHeightInRow = 0;
        const frames = {};
        const images = [];

        // Load và tính toán layout
        for (const file of imageFiles) {
            const image = sharp(file);
            const metadata = await image.metadata();
            const name = path.basename(file, path.extname(file));
            
            if (currentX + metadata.width + padding > maxAtlasSize) {
                currentX = 0;
                currentY += maxHeightInRow + padding;
                maxHeightInRow = 0;
            }
            
            frames[name] = {
                frame: { x: currentX, y: currentY, w: metadata.width, h: metadata.height },
                rotated: false,
                trimmed: false,
                spriteSourceSize: { x: 0, y: 0, w: metadata.width, h: metadata.height },
                sourceSize: { w: metadata.width, h: metadata.height }
            };
            
            images.push({
                name,
                image,
                x: currentX,
                y: currentY,
                width: metadata.width,
                height: metadata.height
            });
            
            currentX += metadata.width + padding;
            maxHeightInRow = Math.max(maxHeightInRow, metadata.height);
        }

        // Tạo atlas image
        const atlasWidth = Math.min(maxAtlasSize, currentX);
        const atlasHeight = currentY + maxHeightInRow;
        
        const atlas = sharp({
            create: {
                width: atlasWidth,
                height: atlasHeight,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });

        // Composite tất cả images
        const composites = [];
        for (const { image, x, y } of images) {
            composites.push({
                input: await image.toBuffer(),
                left: x,
                top: y
            });
        }

        await atlas
            .composite(composites)
            .webp({ quality: 80 })
            .toFile(path.join(this.outputDir, `${this.atlasName}.webp`));

        // Tạo JSON metadata
        const atlasData = {
            frames,
            meta: {
                app: "PixiJS Texture Packer",
                version: "1.0.0",
                image: `${this.atlasName}.webp`,
                format: "RGBA8888",
                size: { w: atlasWidth, h: atlasHeight },
                scale: "1"
            }
        };

        await fs.writeFile(
            path.join(this.outputDir, `${this.atlasName}.json`),
            JSON.stringify(atlasData, null, 2)
        );

        console.log(`Created texture atlas: ${this.atlasName}.webp and ${this.atlasName}.json`);
    }

    async processIndividualTextures(imageFiles) {
        for (const file of imageFiles) {
            const name = path.basename(file, path.extname(file));
            const outputPath = path.join(this.outputDir, `${name}.webp`);
            
            try {
                await sharp(file)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                
                console.log(`Processed: ${name}.webp`);
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
            }
        }
    }
}

// Chạy texture packer
const packer = new TexturePacker();
packer.packTextures().catch(console.error); 