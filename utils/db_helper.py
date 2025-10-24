# utils/db_helper.py - 数据库操作

import pymysql
import config


def get_db_connection():
    """
    获取数据库连接
    后续实现
    """
    try:
        connection = pymysql.connect(
            host=config.DB_CONFIG['host'],
            port=config.DB_CONFIG['port'],
            user=config.DB_CONFIG['user'],
            password=config.DB_CONFIG['password'],
            database=config.DB_CONFIG['database'],
            charset=config.DB_CONFIG['charset']
        )
        return connection
    except Exception as e:
        print(f"数据库连接失败: {e}")
        return None


def get_logs(date=None, limit=50):
    """
    获取日志数据

    参数:
        date: 日期字符串 'YYYY-MM-DD'，为None则获取所有
        limit: 返回的最大记录数

    返回:
        日志列表

    TODO: 后续实现
    """
    # 暂时返回假数据用于测试
    fake_logs = [
        {
            'id': 1,
            'timestamp': '2025-01-15 10:30:00',
            'level': 'INFO',
            'message': '系统启动成功'
        },
        {
            'id': 2,
            'timestamp': '2025-01-15 11:00:00',
            'level': 'INFO',
            'message': '用户登录'
        },
        {
            'id': 3,
            'timestamp': '2025-01-15 14:20:00',
            'level': 'WARNING',
            'message': '温度偏高警告'
        },
        {
            'id': 4,
            'timestamp': '2025-01-15 15:00:00',
            'level': 'INFO',
            'message': '数据同步完成'
        },
    ]

    # 如果指定了日期，筛选该日期的日志
    if date:
        fake_logs = [log for log in fake_logs if log['timestamp'].startswith(date)]

    return fake_logs[:limit]


def get_calendar_events():
    """
    获取日历事件（哪些日期有日志）

    返回:
        日期列表，格式: ['2025-01-15', '2025-01-16', ...]

    TODO: 后续实现
    """
    # 暂时返回假数据
    return [
        '2025-01-15',
        '2025-01-16',
        '2025-01-17',
        '2025-01-20'
    ]