const { exec } = require('child_process');
const path = require('path');

// 获取项目根目录
const rootDir = __dirname;

// 启动 http-server
exec(`http-server "${rootDir}" -p 8080 --cors`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }
    console.log(`Server running at http://localhost:8080`);
}); 