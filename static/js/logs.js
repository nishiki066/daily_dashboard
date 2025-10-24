// logs.js - 日志功能（暂时占位）

function initLogs() {
    console.log('日志功能初始化（占位）');

    // 暂时不实现，避免报错
    const btnFilter = document.getElementById('btn-filter-logs');
    const btnClear = document.getElementById('btn-clear-filter');

    if (btnFilter) {
        btnFilter.addEventListener('click', function() {
            const dateInput = document.getElementById('log-date-filter');
            if (dateInput && dateInput.value) {
                loadLogs(dateInput.value);
            }
        });
    }

    if (btnClear) {
        btnClear.addEventListener('click', function() {
            const dateInput = document.getElementById('log-date-filter');
            if (dateInput) {
                dateInput.value = '';
            }
            loadLogs();
        });
    }
}

async function loadLogs(date = null) {
    const logsContainer = document.getElementById('logs-container');

    if (!logsContainer) return;

    logsContainer.innerHTML = '<div class="log-loading">正在加载日志...</div>';

    try {
        let url = '/api/logs';
        if (date) {
            url += `?date=${date}`;
        }

        const data = await apiRequest(url);

        if (data.success && data.logs) {
            displayLogs(data.logs);
        } else {
            logsContainer.innerHTML = '<div class="log-loading">无日志数据</div>';
        }
    } catch (error) {
        logsContainer.innerHTML = '<div class="log-loading">加载日志失败</div>';
        console.error('加载日志失败:', error);
    }
}

function displayLogs(logs) {
    const logsContainer = document.getElementById('logs-container');

    if (!logsContainer) return;

    if (logs.length === 0) {
        logsContainer.innerHTML = '<div class="log-loading">暂无日志</div>';
        return;
    }

    let html = '';
    logs.forEach(log => {
        html += `
            <div class="log-item">
                <span class="log-time">[${log.timestamp}]</span>
                <span class="log-level ${log.level}">${log.level}</span>
                <span class="log-message">${log.message}</span>
            </div>
        `;
    });

    logsContainer.innerHTML = html;
}