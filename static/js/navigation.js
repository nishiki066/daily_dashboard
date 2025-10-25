// navigation.js - 修改后的版本

function initNavigation() {
    const btnClock = document.getElementById('btn-clock');
    const btnCalendar = document.getElementById('btn-calendar');
    const btnLogs = document.getElementById('btn-logs');

    const clockView = document.getElementById('clock-view');
    const calendarView = document.getElementById('calendar-view');
    const logsView = document.getElementById('logs-view');

    // 切换到时钟视图
    btnClock.addEventListener('click', function() {
        // 更新按钮状态
        btnClock.classList.add('active');
        btnCalendar.classList.remove('active');
        btnLogs.classList.remove('active');

        // 切换视图 - 只显示时钟
        clockView.style.display = 'block';
        calendarView.style.display = 'none';
        logsView.style.display = 'none';

        window.app.currentView = 'clock';
        console.log('切换到时钟视图');
    });

    // 切换到日历视图
    btnCalendar.addEventListener('click', function() {
        // 更新按钮状态
        btnCalendar.classList.add('active');
        btnClock.classList.remove('active');
        btnLogs.classList.remove('active');

        // 切换视图 - 只显示日历
        clockView.style.display = 'none';
        calendarView.style.display = 'block';
        logsView.style.display = 'none';

        window.app.currentView = 'calendar';

        // 👇 添加这段：延迟更新日历尺寸
        setTimeout(() => {
            if (typeof updateCalendarSize === 'function') {
                updateCalendarSize();
            }
        }, 50);

        console.log('切换到日历视图');
    });

    // 切换到日志视图
    btnLogs.addEventListener('click', function() {
        // 更新按钮状态
        btnLogs.classList.add('active');
        btnClock.classList.remove('active');
        btnCalendar.classList.remove('active');

        // 切换视图 - 只显示日志
        clockView.style.display = 'none';
        calendarView.style.display = 'none';
        logsView.style.display = 'block';

        window.app.currentView = 'logs';

        if (typeof loadLogs === 'function') {
            loadLogs();
        }

        console.log('切换到日志视图');
    });

    console.log('导航初始化完成');
}