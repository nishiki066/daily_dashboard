// navigation.js - 页面导航切换

function initNavigation() {
    const btnCalendar = document.getElementById('btn-calendar');
    const btnLogs = document.getElementById('btn-logs');

    const calendarView = document.getElementById('calendar-view');
    const logsView = document.getElementById('logs-view');

    // 切换到日历视图
    btnCalendar.addEventListener('click', function() {
        // 更新按钮状态
        btnCalendar.classList.add('active');
        btnLogs.classList.remove('active');

        // 切换视图
        calendarView.style.display = 'block';
        logsView.style.display = 'none';

        // 更新全局状态
        window.app.currentView = 'calendar';

        console.log('切换到日历视图');
    });

    // 切换到日志视图
    btnLogs.addEventListener('click', function() {
        // 更新按钮状态
        btnLogs.classList.add('active');
        btnCalendar.classList.remove('active');

        // 切换视图
        logsView.style.display = 'block';
        calendarView.style.display = 'none';

        // 更新全局状态
        window.app.currentView = 'logs';

        // 加载日志（如果还没加载）
        if (typeof loadLogs === 'function') {
            loadLogs();
        }

        console.log('切换到日志视图');
    });

    console.log('导航初始化完成');
}