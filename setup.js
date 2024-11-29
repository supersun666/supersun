const fs = require('fs');
const path = require('path');

// 创建文件夹结构
const directories = [
    'assets',
    'assets/images',
    'assets/audio'
];

// 创建目录
directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// 创建示例图片（1x1像素的base64编码）
const sampleImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const sampleImageBuffer = Buffer.from(sampleImageBase64, 'base64');

// 创建示例音频（空文件）
const imageFiles = ['logo.png', 'blog1.jpg', 'blog2.jpg', 'blog3.jpg', 'blog4.jpg'];
const audioFiles = ['music1.mp3', 'music2.mp3', 'music3.mp3', 'music4.mp3'];

// 创建示例图片文件
imageFiles.forEach(file => {
    const filePath = path.join('assets/images', file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, sampleImageBuffer);
        console.log(`Created sample image: ${filePath}`);
    }
});

// 创建示例音频文件
audioFiles.forEach(file => {
    const filePath = path.join('assets/audio', file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        console.log(`Created sample audio: ${filePath}`);
    }
});

console.log('Setup completed successfully!'); 