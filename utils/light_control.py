# utils/light_control.py - 灯控制

import requests
import config


def control_light(light_name, action):
    """
    控制灯的开关

    参数:
        light_name: 'bedroom' 或 'living_room'
        action: 'on' 或 'off'

    返回:
        {
            'success': True/False,
            'message': '操作结果消息'
        }
    """
    # 验证参数
    if light_name not in config.LIGHT_CONTROL:
        return {
            'success': False,
            'message': f'未知的灯: {light_name}'
        }

    if action not in ['on', 'off']:
        return {
            'success': False,
            'message': f'无效的操作: {action}'
        }

    # 获取URL
    light_config = config.LIGHT_CONTROL[light_name]
    url = light_config[action]
    light_display_name = light_config['name']

    action_text = '打开' if action == 'on' else '关闭'

    try:
        # 发送GET请求
        response = requests.get(url, timeout=5)

        # 检查响应状态
        if response.status_code == 200:
            return {
                'success': True,
                'message': f'{light_display_name}已{action_text}'
            }
        else:
            return {
                'success': False,
                'message': f'{light_display_name}{action_text}失败 (状态码: {response.status_code})'
            }

    except requests.exceptions.Timeout:
        return {
            'success': False,
            'message': f'{light_display_name}{action_text}超时'
        }
    except requests.exceptions.ConnectionError:
        return {
            'success': False,
            'message': f'无法连接到{light_display_name}控制器'
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'{light_display_name}{action_text}失败: {str(e)}'
        }


def get_all_lights():
    """
    获取所有灯的配置信息

    返回:
        {
            'bedroom': {'name': '卧室灯'},
            'living_room': {'name': '客厅灯'}
        }
    """
    lights = {}
    for key, value in config.LIGHT_CONTROL.items():
        lights[key] = {
            'name': value['name']
        }
    return lights