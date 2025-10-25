// clock.js - 时钟视图功能

// 星期的中日文映射
const weekdayMap = {
    0: { cn: '星期日', jp: '日' },
    1: { cn: '星期一', jp: '月' },
    2: { cn: '星期二', jp: '火' },
    3: { cn: '星期三', jp: '水' },
    4: { cn: '星期四', jp: '木' },
    5: { cn: '星期五', jp: '金' },
    6: { cn: '星期六', jp: '土' }
};

/**
 * 初始化时钟视图
 */
function initClockView() {
    console.log('时钟视图初始化中...');

    // 立即更新一次
    updateClockView();

    // 每分钟更新一次（因为不显示秒）
    setInterval(updateClockView, 60000);

    console.log('✅ 时钟视图初始化完成');
}

/**
 * 更新时钟视图显示
 */
function updateClockView() {
    const now = new Date();

    // 更新时间
    const timeStr = formatTime(now);
    const timeEl = document.getElementById('clock-time');
    if (timeEl) {
        timeEl.textContent = timeStr;
    }

    // 更新日期
    const dateStr = formatDate(now);
    const dateEl = document.getElementById('clock-date');
    if (dateEl) {
        dateEl.textContent = dateStr;
    }

    // 更新星期
    const weekdayStr = formatWeekday(now);
    const weekdayEl = document.getElementById('clock-weekday');
    if (weekdayEl) {
        weekdayEl.textContent = weekdayStr;
    }

    console.log(`时钟更新: ${dateStr} ${weekdayStr} ${timeStr}`);
}

/**
 * 格式化时间 HH:MM
 */
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * 格式化日期 MM月DD日
 */
function formatDate(date) {
    const month = date.getMonth() + 1; // 月份从0开始
    const day = date.getDate();
    return `${month}月${day}日`;
}

/**
 * 格式化星期 星期X(日文)
 */
function formatWeekday(date) {
    const dayOfWeek = date.getDay(); // 0-6
    const weekday = weekdayMap[dayOfWeek];
    return `${weekday.cn}(${weekday.jp})`;
}