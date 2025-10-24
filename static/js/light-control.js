// light-control.js - 灯控制功能（简化版，无弹窗提示）

function initLightControl() {
    console.log('灯控制功能初始化');

    // 卧室灯
    const btnBedroomOn = document.getElementById('btn-bedroom-on');
    const btnBedroomOff = document.getElementById('btn-bedroom-off');

    // 客厅灯
    const btnLivingOn = document.getElementById('btn-living-on');
    const btnLivingOff = document.getElementById('btn-living-off');

    // 绑定事件
    if (btnBedroomOn) {
        btnBedroomOn.addEventListener('click', () => controlLight('bedroom', 'on', btnBedroomOn));
    }
    if (btnBedroomOff) {
        btnBedroomOff.addEventListener('click', () => controlLight('bedroom', 'off', btnBedroomOff));
    }
    if (btnLivingOn) {
        btnLivingOn.addEventListener('click', () => controlLight('living_room', 'on', btnLivingOn));
    }
    if (btnLivingOff) {
        btnLivingOff.addEventListener('click', () => controlLight('living_room', 'off', btnLivingOff));
    }
}

async function controlLight(light, action, buttonElement) {
    const actionText = action === 'on' ? '开' : '关';
    const lightText = light === 'bedroom' ? '卧室灯' : '客厅灯';

    console.log(`正在${actionText}${lightText}...`);

    // 禁用按钮，防止重复点击
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.style.opacity = '0.6';
    }

    try {
        const data = await apiRequest('/api/light/control', {
            method: 'POST',
            body: JSON.stringify({ light, action })
        });

        if (data.success) {
            console.log(`✅ ${data.message}`);
            // 成功后给按钮一个简单的闪烁效果
            if (buttonElement) {
                buttonElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    buttonElement.style.transform = 'scale(1)';
                }, 150);
            }
        } else {
            console.error(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error('控制灯失败:', error);
    } finally {
        // 恢复按钮状态
        if (buttonElement) {
            setTimeout(() => {
                buttonElement.disabled = false;
                buttonElement.style.opacity = '1';
            }, 500); // 0.5秒后恢复
        }
    }
}