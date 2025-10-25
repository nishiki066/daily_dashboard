// main.js - 主逻辑和初始化

// 全局变量
window.app = {
    currentView: 'calendar',
    selectedDate: null
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('日历日志查看器初始化中...');

    // 初始化时钟
    initClock();

    // 初始化时钟视图
    if (typeof initClockView === 'function') {
        initClockView();
    }

    // 初始化刷新按钮
    initRefreshButton();

    // 初始化导航
    if (typeof initNavigation === 'function') {
        initNavigation();
    }

    // 初始化日历
    if (typeof initCalendar === 'function') {
        initCalendar();
    }

    // 初始化日志
    if (typeof initLogs === 'function') {
        initLogs();
    }

    // 初始化灯控制
    if (typeof initLightControl === 'function') {
        initLightControl();
    }

    // 初始化环境信息
    if (typeof initEnvironment === 'function') {
        initEnvironment();
    }

    console.log('初始化完成！');
});

// 初始化刷新按钮
function initRefreshButton() {
    const btnRefresh = document.getElementById('btn-refresh');
    if (btnRefresh) {
        btnRefresh.addEventListener('click', function() {
            console.log('刷新页面');
            location.reload();
        });
    }
}

// 初始化时钟
function initClock() {
    updateClock();
    // 每秒更新一次时钟
    setInterval(updateClock, 1000);
}

// 更新时钟显示
function updateClock() {
    const now = new Date();
    const timeString = formatDateTime(now);
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// 格式化日期时间
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 工具函数：显示提示消息
function showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // 可以添加更友好的提示UI
    if (type === 'error') {
        alert('错误: ' + message);
    }
}

// 工具函数：API请求封装
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '请求失败');
        }

        return data;
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
}