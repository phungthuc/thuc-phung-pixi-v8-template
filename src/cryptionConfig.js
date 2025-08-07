// Cryption configuration for asset encryption
// This file is referenced in assetConfig.json

export const cryptionConfig = {
    // Encryption settings
    enabled: false,
    key: "your-secret-key-here",
    algorithm: "aes-256-cbc",
    
    // File patterns to encrypt
    patterns: [
        "*.json",
        "*.atlas",
        "*.png",
        "*.jpg",
        "*.webp"
    ],
    
    // Exclude patterns
    exclude: [
        "manifest.json",
        "*.html",
        "*.css"
    ]
};

export default cryptionConfig; 