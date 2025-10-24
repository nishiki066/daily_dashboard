# utils/weather_api.py - 天气API调用

import requests
from datetime import datetime, timedelta
import config

# 缓存天气数据
_weather_cache = {
    'data': None,
    'timestamp': None
}


def get_weather():
    """
    获取松江市当前天气信息
    返回格式: {
        'temperature': 温度(°C),
        'humidity': 湿度(%),
        'weather': 天气状况,
        'weather_code': 天气代码,
        'update_time': 更新时间
    }
    """
    # 检查缓存是否有效
    if _weather_cache['data'] and _weather_cache['timestamp']:
        cache_age = datetime.now() - _weather_cache['timestamp']
        if cache_age < timedelta(minutes=config.WEATHER_API['cache_minutes']):
            return _weather_cache['data']

    try:
        # 构建API请求URL
        url = config.WEATHER_API['base_url']
        params = {
            'latitude': config.WEATHER_API['location']['latitude'],
            'longitude': config.WEATHER_API['location']['longitude'],
            'current': config.WEATHER_API['current_params'],
            'timezone': config.WEATHER_API['timezone']
        }

        # 发送请求
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        current = data.get('current', {})

        # 解析天气数据
        weather_code = current.get('weather_code', 0)
        weather_data = {
            'temperature': current.get('temperature_2m', '--'),
            'humidity': current.get('relative_humidity_2m', '--'),
            'weather': config.WEATHER_CODE_MAP.get(weather_code, '未知'),
            'weather_code': weather_code,
            'update_time': current.get('time', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        }

        # 更新缓存
        _weather_cache['data'] = weather_data
        _weather_cache['timestamp'] = datetime.now()

        return weather_data

    except requests.exceptions.RequestException as e:
        print(f"天气API请求失败: {e}")
        # 返回缓存数据（如果有）或默认值
        if _weather_cache['data']:
            return _weather_cache['data']
        return {
            'temperature': '--',
            'humidity': '--',
            'weather': '获取失败',
            'weather_code': 0,
            'update_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    except Exception as e:
        print(f"天气数据解析失败: {e}")
        return {
            'temperature': '--',
            'humidity': '--',
            'weather': '数据错误',
            'weather_code': 0,
            'update_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }


def clear_cache():
    """清除天气缓存"""
    global _weather_cache
    _weather_cache = {
        'data': None,
        'timestamp': None
    }