// calendar.js - 日历功能

let calendar = null;
let calendarInitialized = false; // 防止重复初始化

function initCalendar() {
    // 如果已经初始化过，直接返回
    if (calendarInitialized) {
        console.log('日历已初始化，跳过');
        return;
    }

    const calendarEl = document.getElementById('calendar');

    if (!calendarEl) {
        console.error('找不到日历容器元素');
        return;
    }

    // 检查FullCalendar是否已加载
    if (typeof FullCalendar === 'undefined') {
        console.error('FullCalendar库未加载，无法初始化日历');
        calendarEl.innerHTML = '<div style="padding: 20px; color: red; text-align: center;">FullCalendar加载失败，请刷新页面重试</div>';
        return;
    }

    console.log('开始初始化FullCalendar...');

    try {
        // 初始化FullCalendar
        calendar = new FullCalendar.Calendar(calendarEl, {
            // 只使用月视图
            initialView: 'dayGridMonth',

            // 中文本地化
            locale: 'zh-cn',

            // 顶部工具栏
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: ''
            },

            // 按钮文字
            buttonText: {
                prev: '上月',
                next: '下月'
            },

            // 日历高度
            height: '100%',
            expandRows: true,
            dayMaxEvents: false,
            dayMaxEventRows: false,

            // 显示周末
            weekends: true,

            // 星期从周日开始
            firstDay: 0,

            // 日期格式
            dayHeaderFormat: { weekday: 'short' },

            // 是否显示非当前月的日期
            fixedWeekCount: false,
            showNonCurrentDates: true,

            // 点击日期事件
            dateClick: function(info) {
                console.log('点击日期:', info.dateStr);
                window.app.selectedDate = info.dateStr;

                // 切换到日志视图并筛选该日期
                switchToLogsView(info.dateStr);
            },

            // 日历渲染完成后加载事件标记
            datesSet: function(info) {
                console.log('日历渲染完成，当前月份:', info.view.title);
                // 只在第一次渲染时加载事件
                if (!calendarInitialized) {
                    loadCalendarEvents();
                }
            }
        });

        // 渲染日历
        calendar.render();

        // 标记为已初始化
        calendarInitialized = true;

        console.log('✅ FullCalendar 日历初始化完成');
        console.log('今天是:', new Date().toLocaleDateString('zh-CN'));

    } catch (error) {
        console.error('❌ 日历初始化失败:', error);
        calendarEl.innerHTML = '<div style="padding: 20px; color: red; text-align: center;">日历初始化失败: ' + error.message + '</div>';
    }
}

// 加载日历事件（哪些日期有日志）
async function loadCalendarEvents() {
    if (!calendar) {
        console.warn('日历未初始化，无法加载事件');
        return;
    }

    try {
        const data = await apiRequest('/api/calendar/events');

        if (data.success && data.events) {
            // 清除现有事件
            calendar.removeAllEvents();

            // 为有日志的日期添加背景标记
            const events = data.events.map(date => ({
                start: date,
                display: 'background',
                backgroundColor: '#d4edda', // 浅绿色背景
                classNames: ['has-logs']
            }));

            calendar.addEventSource(events);
            console.log(`✅ 加载了 ${events.length} 个有日志的日期:`, data.events);
        }
    } catch (error) {
        console.error('❌ 加载日历事件失败:', error);
    }
}

// 切换到日志视图并筛选日期
function switchToLogsView(date) {
    console.log('切换到日志视图，日期:', date);

    // 点击日志按钮
    const btnLogs = document.getElementById('btn-logs');
    if (btnLogs) {
        btnLogs.click();
    }

    // 设置日期筛选
    const dateFilter = document.getElementById('log-date-filter');
    if (dateFilter) {
        dateFilter.value = date;
    }

    // 加载该日期的日志
    if (typeof loadLogs === 'function') {
        loadLogs(date);
    }
}

// 更新日历尺寸
function updateCalendarSize() {
    if (calendar) {
        calendar.updateSize();
        console.log('日历尺寸已更新');
    }
}