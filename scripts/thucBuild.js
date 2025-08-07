#!/usr/bin/env node

import { glob } from 'glob';
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, basename, extname } from 'path';

/**
 * ThucBuild - Asset Builder for PixiJS v8 Playable Ads Template
 * Handles texture packing, compression, and asset optimization
 */

class ThucBuild {
  constructor() {
    this.config = {
      inputDir: 'assets',
      outputDir: 'dist/assets',
      texturePacker: {
        maxSize: 2048,
        padding: 2,
        format: 'webp',
        quality: 80
      },
      compression: {
        webp: { quality: 80 },
        jpeg: { quality: 85 },
        png: { compressionLevel: 9 }
      }
    };
  }

  async init() {
    console.log('🚀 ThucBuild - Asset Builder Starting...');
    
    // Create output directory if it doesn't exist
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${this.config.outputDir}`);
    }

    return this;
  }

  async processImages() {
    console.log('🖼️  Processing images...');
    
    try {
      // Find all image files
      const imageFiles = await glob(`${this.config.inputDir}/**/*.{png,jpg,jpeg,gif,webp}`);
      
      if (imageFiles.length === 0) {
        console.log('⚠️  No image files found in assets directory');
        return;
      }

      console.log(`📸 Found ${imageFiles.length} image files`);

      for (const file of imageFiles) {
        await this.processImage(file);
      }

      console.log('✅ Image processing completed');
    } catch (error) {
      console.error('❌ Error processing images:', error);
    }
  }

  async processImage(filePath) {
    try {
      const fileName = basename(filePath, extname(filePath));
      const relativePath = filePath.replace(this.config.inputDir, '').replace(/^[\/\\]/, '');
      const outputPath = join(this.config.outputDir, relativePath);
      const outputDir = dirname(outputPath);

      // Create output directory if it doesn't exist
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      // Process based on file extension
      const ext = extname(filePath).toLowerCase();
      
      switch (ext) {
        case '.png':
          await this.compressPNG(filePath, outputPath);
          break;
        case '.jpg':
        case '.jpeg':
          await this.compressJPEG(filePath, outputPath);
          break;
        case '.webp':
          await this.optimizeWebP(filePath, outputPath);
          break;
        default:
          // Copy other formats as-is
          await this.copyFile(filePath, outputPath);
      }

      console.log(`✅ Processed: ${relativePath}`);
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  }

  async compressPNG(inputPath, outputPath) {
    const outputWebP = outputPath.replace(/\.png$/i, '.webp');
    
    await sharp(inputPath)
      .png(this.config.compression.png)
      .toFile(outputPath);
    
    // Also create WebP version
    await sharp(inputPath)
      .webp(this.config.compression.webp)
      .toFile(outputWebP);
  }

  async compressJPEG(inputPath, outputPath) {
    const outputWebP = outputPath.replace(/\.(jpg|jpeg)$/i, '.webp');
    
    await sharp(inputPath)
      .jpeg(this.config.compression.jpeg)
      .toFile(outputPath);
    
    // Also create WebP version
    await sharp(inputPath)
      .webp(this.config.compression.webp)
      .toFile(outputWebP);
  }

  async optimizeWebP(inputPath, outputPath) {
    await sharp(inputPath)
      .webp(this.config.compression.webp)
      .toFile(outputPath);
  }

  async copyFile(inputPath, outputPath) {
    await sharp(inputPath).toFile(outputPath);
  }

  async generateManifest() {
    console.log('📋 Generating asset manifest...');
    
    try {
      const manifest = {
        version: '1.0.0',
        generated: new Date().toISOString(),
        assets: {}
      };

      // Find all processed assets
      const assetFiles = await glob(`${this.config.outputDir}/**/*.{png,jpg,jpeg,webp,json,mp3,wav,ogg}`);
      
      for (const file of assetFiles) {
        const relativePath = file.replace(this.config.outputDir, '').replace(/^[\/\\]/, '');
        const ext = extname(file).toLowerCase();
        
        if (!manifest.assets[ext]) {
          manifest.assets[ext] = [];
        }
        
        manifest.assets[ext].push(relativePath);
      }

      const manifestPath = join(this.config.outputDir, 'manifest.json');
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
      console.log(`✅ Asset manifest generated: ${manifestPath}`);
    } catch (error) {
      console.error('❌ Error generating manifest:', error);
    }
  }

  async build() {
    await this.init();
    await this.processImages();
    await this.generateManifest();
    
    console.log('🎉 ThucBuild completed successfully!');
  }
}

// Run the build process
const builder = new ThucBuild();
builder.build().catch(error => {
  console.error('💥 Build failed:', error);
  process.exit(1);
}); 