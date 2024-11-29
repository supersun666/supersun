// 创建随机闪烁的星星
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // 为每颗星星设置随机的动画参数
        const duration = 2 + Math.random() * 4; // 2-6秒的随机持续时间
        const delay = Math.random() * 5; // 0-5秒的随机延迟
        
        star.style.animation = `randomTwinkle ${duration}s infinite ${delay}s`;
        
        // 随机设置星星大小
        const size = 1 + Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        starsContainer.appendChild(star);
    }
}

// 处理卡片3D效果
function handleCardEffect() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(1.05)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
        });
    });
}

// 音频播放控制
function handleAudio() {
    const cards = document.querySelectorAll('.card');
    const player = document.querySelector('.player');
    const playBtn = player.querySelector('.play-btn');
    const progressBar = player.querySelector('.progress');
    const currentTime = player.querySelector('.current');
    const duration = player.querySelector('.duration');
    const nowPlaying = player.querySelector('.now-playing');
    let audio = new Audio();
    let isPlaying = false;
    let currentCard = null;

    // 更新播放按钮图标
    function updatePlayButton() {
        const icon = playBtn.querySelector('i');
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    // 格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 更新进度条
    function updateProgress() {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            currentTime.textContent = formatTime(audio.currentTime);
            duration.textContent = formatTime(audio.duration);
        }
    }

    // 添加重置函数
    function resetPlayer() {
        audio.pause();
        audio.currentTime = 0; // 重置播放进度
        isPlaying = false;
        currentCard = null; // 清除当前卡片
        updatePlayButton();
        progressBar.style.width = '0%'; // 重置进度条
        currentTime.textContent = '0:00'; // 重置时间显示
        duration.textContent = '0:00';
        nowPlaying.textContent = '正在播放：'; // 清除标题
        player.classList.remove('active'); // 收起播放器
    }

    // 修改点击空白处的处理
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.card') && !e.target.closest('.player')) {
            resetPlayer(); // 使用重置函数
        }
    });

    // 修改卡片点击事件
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            const audioSrc = card.dataset.audio;
            const title = card.querySelector('h2').textContent;
            
            // 如果点击的是当前正在播放的卡片
            if (currentCard === card) {
                if (isPlaying) {
                    audio.pause();
                    isPlaying = false;
                } else {
                    audio.play();
                    isPlaying = true;
                }
                updatePlayButton();
                return;
            }
            
            // 如果之前有播放的音频，先重置
            if (currentCard) {
                audio.pause();
                audio.currentTime = 0;
            }
            
            // 播放新的音频
            nowPlaying.textContent = `正在播放：${title}`;
            audio.src = audioSrc;
            currentCard = card;
            audio.play();
            isPlaying = true;
            player.classList.add('active');
            updatePlayButton();
        });
    });

    // 音频结束时的处理
    audio.addEventListener('ended', () => {
        resetPlayer(); // 播放结束时也重置
    });

    // 播放/暂停按钮控制
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
        updatePlayButton();
    });

    // 进度条点击控制
    const progressBarContainer = player.querySelector('.progress-bar');
    progressBarContainer.addEventListener('click', (e) => {
        const rect = progressBarContainer.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percent = clickPosition / rect.width;
        
        // 确保百分比在0-1之间
        const clampedPercent = Math.max(0, Math.min(1, percent));
        
        // 更新进度条显示
        progressBar.style.width = `${clampedPercent * 100}%`;
        
        // 设置音频时间
        if (audio.duration) {
            audio.currentTime = clampedPercent * audio.duration;
            // 更新时间显示
            currentTime.textContent = formatTime(audio.currentTime);
        }
    });

    // 添加进度条拖动功能
    let isDragging = false;

    progressBarContainer.addEventListener('mousedown', () => {
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = progressBarContainer.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            progressBar.style.width = `${percent * 100}%`;
            
            if (audio.duration) {
                audio.currentTime = percent * audio.duration;
                currentTime.textContent = formatTime(audio.currentTime);
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // 监听音频播放进度
    audio.addEventListener('timeupdate', updateProgress);

    // 阻止播放器的点击事件冒泡
    player.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// 在初始化函数中添加生成卡片的代码
function generateCards() {
    const container = document.querySelector('.card-container');
    container.innerHTML = audioConfig.podcasts.map(podcast => `
        <div class="card" data-audio="${podcast.audio}">
            <div class="card-content">
                <img src="${podcast.image}" alt="${podcast.title}">
                <div class="title-overlay">
                    <h2>${podcast.title}</h2>
                </div>
            </div>
        </div>
    `).join('');
}

// 修改初始化函数
document.addEventListener('DOMContentLoaded', () => {
    generateCards();
    createStars();
    handleCardEffect();
    handleAudio();
}); 