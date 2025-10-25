# config.py - 项目配置文件
import os
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()
# Flask配置
class Config:
    SECRET_KEY = 'your-secret-key-here'  # 用于session加密
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5678

# 天气API配置 - Open-Meteo
WEATHER_API = {
    'provider': 'open-meteo',
    'base_url': 'https://api.open-meteo.com/v1/forecast',
    'location': {
        'name': '松江市',
        'latitude': 35.484655,
        'longitude': 133.067194
    },
    'timezone': 'Asia/Tokyo',
    'current_params': 'temperature_2m,relative_humidity_2m,weather_code',
    'cache_minutes': 10  # 缓存10分钟
}

# 天气代码对照表
WEATHER_CODE_MAP = {
    0: '晴天',
    1: '晴转多云',
    2: '多云',
    3: '阴天',
    45: '雾',
    48: '雾凇',
    51: '小雨',
    53: '中雨',
    55: '大雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    77: '米雪',
    80: '阵雨',
    81: '阵雨',
    82: '大阵雨',
    85: '阵雪',
    86: '大阵雪',
    95: '雷暴',
    96: '雷暴带冰雹',
    99: '强雷暴带冰雹'
}

# 灯控制API配置
# 请根据你的实际URL修改
LIGHT_CONTROL = {
    'bedroom': {
        'name': '卧室灯',
        'on': 'http://192.168.3.165/relay1/off',   # 打开卧室灯
        'off': 'http://192.168.3.165/relay1/on'     # 关闭卧室灯
    },
    'living_room': {
        'name': '客厅灯',
        'on': 'http://192.168.3.165/relay2/off',   # 打开客厅灯
        'off': 'http://192.168.3.165/relay2/on'     # 关闭客厅灯
    }
}

# 数据库配置（MariaDB）- 后续使用
# 数据库配置（从环境变量读取）
DB_CONFIG = {
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME'),
    'charset': 'utf8mb4'
}

# 报告生成脚本配置（从环境变量读取）
REPORT_SCRIPT = {
    'python_path': os.getenv('REPORT_SCRIPT_PYTHON'),
    'script_path': os.getenv('REPORT_SCRIPT_FILE')
}
