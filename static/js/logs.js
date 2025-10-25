// logs.js - 日志（报告）功能

// 当前显示的报告
let currentReport = null;

// 轮询定时器
let pollingInterval = null;

// 生成前的报告ID（用于判断是否有新报告）
let reportIdBeforeGenerate = null;

function initLogs() {
    console.log('日志功能初始化');

    // 延迟绑定按钮事件，等待DOM完全加载
    setTimeout(() => {
        const btnGenerate = document.getElementById('btn-generate-report');
        if (btnGenerate) {
            console.log('✅ 找到生成报告按钮，绑定事件');
            btnGenerate.addEventListener('click', function() {
                console.log('🔘 生成报告按钮被点击');
                generateNewReport();
            });
        } else {
            console.warn('⚠️  未找到生成报告按钮');
        }
    }, 100);
}

/**
 * 加载最新报告
 */
async function loadLatestReport() {
    const statusBar = document.getElementById('report-status-bar');
    const summaryContainer = document.getElementById('report-summary');
    const contentContainer = document.getElementById('report-content');

    // 显示加载状态
    if (statusBar) {
        statusBar.innerHTML = '<span style="color: #ffff00;">正在加载报告...</span>';
    }
    if (summaryContainer) {
        summaryContainer.innerHTML = '';
    }
    if (contentContainer) {
        contentContainer.innerHTML = '<div style="padding: 20px; text-align: center;">加载中...</div>';
    }

    try {
        const data = await apiRequest('/api/report/latest');

        if (data.success && data.report) {
            currentReport = data.report;
            displayReport(data.report);
            console.log('✅ 报告加载成功');
        } else {
            showReportError('暂无报告数据');
        }
    } catch (error) {
        console.error('加载报告失败:', error);
        showReportError('加载报告失败: ' + error.message);
    }
}

/**
 * 显示报告
 */
function displayReport(report) {
    // 1. 显示状态条
    displayStatusBar(report);

    // 2. 显示执行摘要
    displaySummary(report);

    // 3. 显示报告内容
    displayContent(report);
}

/**
 * 显示状态条
 */
function displayStatusBar(report) {
    const statusBar = document.getElementById('report-status-bar');
    if (!statusBar) return;

    // 状态文本和样式
    const statusMap = {
        'completed': { text: '已完成', style: 'color: #00ff00;' },
        'generating': { text: '生成中...', style: 'color: #ffff00;' },
        'failed': { text: '失败', style: 'color: #ff0000;' }
    };

    const status = statusMap[report.status] || { text: report.status, style: '' };

    // API 余额
    const balance = report.api_info.total_balance;
    const currency = report.api_info.currency;

    statusBar.innerHTML = `
        <span style="color: #00ff00;">${report.created_at}</span>
        <span style="color: #00ff00; margin: 0 10px;">|</span>
        <span style="${status.style}">${status.text}</span>
        <span style="color: #00ff00; margin: 0 10px;">|</span>
        <span style="color: #00ff00;">余额: ${balance} ${currency}</span>
    `;
}

/**
 * 显示执行摘要
 */
function displaySummary(report) {
    const summaryContainer = document.getElementById('report-summary');
    if (!summaryContainer) return;

    // 从 markdown 内容中提取摘要信息
    const content = report.report_content;

    // 简单提取执行摘要部分
    const summaryMatch = content.match(/## 执行摘要([\s\S]*?)##/);
    let summaryText = '无摘要信息';

    if (summaryMatch) {
        summaryText = summaryMatch[1]
            .trim()  // 移除首尾空白
            .replace(/\*\*/g, '')  // 移除粗体
            .replace(/\*/g, '')    // 移除斜体
            .replace(/- /g, '• ')  // 替换列表标记
            .replace(/[✅❌⏳]/g, match => match + ' ') // 表情符号后加空格
            .replace(/^\n+/, '')   // 移除开头的所有换行
            .replace(/\n{3,}/g, '\n\n'); // 多个换行合并为两个
    }

    summaryContainer.innerHTML = '<div style="white-space: pre-line; line-height: 1.6;">' + summaryText + '</div>';
}

/**
 * 显示报告内容
 */
function displayContent(report) {
    const contentContainer = document.getElementById('report-content');
    if (!contentContainer) return;

    let content = report.report_content;

    // 移除代码块标记
    content = content.replace(/```markdown\n?/g, '');
    content = content.replace(/```\n?/g, '');

    // 提取各区域详情部分
    const detailsMatch = content.match(/## 各区域详情([\s\S]*)/);
    if (!detailsMatch) {
        contentContainer.innerHTML = '<div style="padding: 20px; color: #ff0000;">无详细内容</div>';
        return;
    }

    let detailsContent = detailsMatch[1];

    // 查找最后一个 ## 标题及其内容
    const sections = detailsContent.split(/(?=## )/); // 按 ## 分割，保留 ##
    let lastSection = '';
    let mainContent = '';

    if (sections.length > 1) {
        // 有多个 ## 部分
        lastSection = sections[sections.length - 1].trim();  // 最后一个部分
        mainContent = sections.slice(0, -1).join('').trim(); // 其他部分
    } else {
        // 只有一个部分
        mainContent = detailsContent.trim();
    }

    // 重新组合：最后的部分放在最前面
    let finalContent = '';
    if (lastSection) {
        finalContent = lastSection + '\n\n' + '## 各区域详情' + '\n' + mainContent;
    } else {
        finalContent = '## 各区域详情' + '\n' + mainContent;
    }

    // 强力清理空白行
    finalContent = finalContent
        .split('\n')
        .map(line => line.trim())
        .filter((line, index, arr) => {
            if (line.length > 0) return true;
            if (index > 0 && arr[index - 1].length === 0) return false;
            return true;
        })
        .join('\n')
        .replace(/^\n+/, '')
        .replace(/\n+$/, '');

    // 显示为纯文本，保留格式
    contentContainer.innerHTML = `
        <pre style="
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #00ff00;
            line-height: 1.6;
            margin: 0;
        ">${escapeHtml(finalContent)}</pre>
    `;
}

/**
 * 显示错误信息
 */
function showReportError(message) {
    const statusBar = document.getElementById('report-status-bar');
    const summaryContainer = document.getElementById('report-summary');
    const contentContainer = document.getElementById('report-content');

    if (statusBar) {
        statusBar.innerHTML = `<span style="color: #ff0000;">错误</span>`;
    }
    if (summaryContainer) {
        summaryContainer.innerHTML = '';
    }
    if (contentContainer) {
        contentContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #ff0000;">
                ${message}
            </div>
        `;
    }
}

/**
 * HTML 转义（防止 XSS）
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * 生成新报告
 */
async function generateNewReport() {
    const btnGenerate = document.getElementById('btn-generate-report');
    const statusBar = document.getElementById('report-status-bar');

    // 记录当前报告ID
    if (currentReport) {
        reportIdBeforeGenerate = currentReport.id;
        console.log('📝 生成前的报告ID:', reportIdBeforeGenerate);
    } else {
        reportIdBeforeGenerate = null;
    }

    // 禁用按钮
    if (btnGenerate) {
        btnGenerate.disabled = true;
        btnGenerate.classList.add('generating');
        btnGenerate.textContent = '生成中...';
    }

    // 更新状态提示
    if (statusBar) {
        statusBar.innerHTML = '<span style="color: #ffff00;">正在启动报告生成...</span>';
    }

    try {
        const data = await apiRequest('/api/report/generate', {
            method: 'POST'
        });

        if (data.success) {
            console.log('✅ 报告生成已启动');
            // 开始轮询检查状态
            startPolling();
        } else {
            showReportError(data.message || '启动报告生成失败');
            resetGenerateButton();
        }
    } catch (error) {
        console.error('启动报告生成失败:', error);
        showReportError('启动报告生成失败: ' + error.message);
        resetGenerateButton();
    }
}

/**
 * 开始轮询检查报告状态
 */
function startPolling() {
    console.log('开始轮询报告状态...');

    // 清除旧的轮询
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }

    // 立即检查一次
    checkReportStatus();

    // 每5秒检查一次
    pollingInterval = setInterval(checkReportStatus, 5000);
}

/**
 * 停止轮询
 */
function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        console.log('轮询已停止');
    }
}

/**
 * 检查报告状态
 */
async function checkReportStatus() {
    try {
        const data = await apiRequest('/api/report/latest');

        if (data.success && data.report) {
            const report = data.report;

            console.log(`📊 检查报告状态: ID=${report.id}, Status=${report.status}`);

            // 判断是否是新报告
            const isNewReport = reportIdBeforeGenerate === null || report.id > reportIdBeforeGenerate;

            if (report.status === 'generating') {
                // 仍在生成中
                console.log('⏳ 报告生成中...');
                updateGeneratingStatus();
            } else if (report.status === 'completed') {
                if (isNewReport) {
                    // 新报告生成完成
                    console.log('✅ 新报告生成完成！ID:', report.id);
                    stopPolling();
                    currentReport = report;
                    displayReport(report);
                    resetGenerateButton();
                    showSuccessMessage();
                } else {
                    // 这是旧报告，继续等待
                    console.log('⏳ 等待新报告生成... (当前是旧报告 ID:', report.id, ')');
                    updateGeneratingStatus();
                }
            } else if (report.status === 'failed') {
                if (isNewReport) {
                    // 新报告生成失败
                    console.log('❌ 报告生成失败');
                    stopPolling();
                    showReportError('报告生成失败');
                    resetGenerateButton();
                } else {
                    // 继续等待
                    updateGeneratingStatus();
                }
            }
        }
    } catch (error) {
        console.error('检查报告状态失败:', error);
    }
}

/**
 * 更新生成中的状态显示
 */
function updateGeneratingStatus() {
    const statusBar = document.getElementById('report-status-bar');
    if (statusBar) {
        statusBar.innerHTML = '<span style="color: #ffff00;">⏳ 报告生成中，请稍候...</span>';
    }
}

/**
 * 显示成功消息
 */
function showSuccessMessage() {
    const statusBar = document.getElementById('report-status-bar');
    if (statusBar) {
        // 暂时显示成功消息
        statusBar.innerHTML = '<span style="color: #00ff00;">✓ 新报告已生成！</span>';

        // 2秒后恢复正常状态显示
        setTimeout(() => {
            if (currentReport) {
                displayStatusBar(currentReport);
            }
        }, 2000);
    }
}

/**
 * 重置生成按钮状态
 */
function resetGenerateButton() {
    const btnGenerate = document.getElementById('btn-generate-report');
    if (btnGenerate) {
        btnGenerate.disabled = false;
        btnGenerate.classList.remove('generating');
        btnGenerate.textContent = '生成新报告';
    }
}