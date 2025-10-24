// environment.js - 环境信息功能（暂时占位）

function initEnvironment() {
    console.log('环境信息功能初始化（占位）');

    // 立即加载一次
    loadEnvironment();

    // 每10分钟更新一次
    setInterval(loadEnvironment, 10 * 60 * 1000);
}

async function loadEnvironment() {
    try {
        const data = await apiRequest('/api/environment');

        if (data.success) {
            updateEnvironmentDisplay(data);
        }
    } catch (error) {
        console.error('加载环境信息失败:', error);
    }
}

function updateEnvironmentDisplay(data) {
    // 更新温度
    const tempEl = document.getElementById('env-temperature');
    if (tempEl) {
        tempEl.textContent = data.temperature !== '--' ? data.temperature.toFixed(1) : '--';
    }

    // 更新湿度
    const humidityEl = document.getElementById('env-humidity');
    if (humidityEl) {
        humidityEl.textContent = data.humidity !== '--' ? data.humidity : '--';
    }

    // 更新天气
    const weatherEl = document.getElementById('env-weather');
    if (weatherEl) {
        weatherEl.textContent = data.weather || '--';
    }

    // 更新时间
    const timeEl = document.getElementById('env-update-time');
    if (timeEl) {
        if (data.update_time) {
            // 提取时间部分 HH:MM
            let timeStr = data.update_time;
            if (timeStr.includes(' ')) {
                // 格式: "2025-10-24 23:00:00" -> "23:00"
                timeStr = timeStr.split(' ')[1].substring(0, 5);
            } else if (timeStr.includes('T')) {
                // 格式: "2025-10-24T23:00" -> "23:00"
                timeStr = timeStr.split('T')[1].substring(0, 5);
            }
            timeEl.textContent = timeStr;
        } else {
            timeEl.textContent = '--:--';
        }
    }

    console.log('环境信息已更新:', data);
}