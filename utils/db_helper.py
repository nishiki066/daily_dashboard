# utils/db_helper.py - 数据库操作

import pymysql
import sys
import os

# 添加父目录到路径，以便导入 config
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import config


def get_db_connection():
    """
    获取数据库连接

    Returns:
        connection: 数据库连接对象
        None: 连接失败时返回 None
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


def get_latest_report():
    """
    获取最新的报告记录

    Returns:
        dict: 报告数据字典，包含以下字段：
            - id: 报告ID
            - arkcn_execution_id: 中国区执行ID
            - arkjp_execution_id: 日本区执行ID
            - report_content: 报告内容（markdown格式）
            - status: 状态 (generating/completed/failed)
            - created_at: 创建时间
            - api_info: API余额信息字典
                - is_available: 是否可用
                - currency: 货币类型
                - total_balance: 总余额
                - granted_balance: 赠送余额
                - topped_up_balance: 充值余额
        None: 查询失败或无数据时返回 None
    """
    connection = get_db_connection()
    if not connection:
        return None

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = """
                SELECT 
                    id,
                    arkcn_execution_id,
                    arkjp_execution_id,
                    report_content,
                    status,
                    created_at,
                    api_is_available,
                    api_currency,
                    api_total_balance,
                    api_granted_balance,
                    api_topped_up_balance
                FROM ai_reports 
                ORDER BY created_at DESC 
                LIMIT 1
            """
            cursor.execute(sql)
            result = cursor.fetchone()

            if result:
                # 组织返回数据结构
                report = {
                    'id': result['id'],
                    'arkcn_execution_id': result['arkcn_execution_id'],
                    'arkjp_execution_id': result['arkjp_execution_id'],
                    'report_content': result['report_content'],
                    'status': result['status'],
                    'created_at': str(result['created_at']),
                    'api_info': {
                        'is_available': result['api_is_available'],
                        'currency': result['api_currency'],
                        'total_balance': float(result['api_total_balance']) if result['api_total_balance'] else 0.0,
                        'granted_balance': float(result['api_granted_balance']) if result[
                            'api_granted_balance'] else 0.0,
                        'topped_up_balance': float(result['api_topped_up_balance']) if result[
                            'api_topped_up_balance'] else 0.0
                    }
                }
                return report
            else:
                return None

    except Exception as e:
        print(f"查询报告失败: {e}")
        return None
    finally:
        connection.close()


def get_report_by_id(report_id):
    """
    根据ID获取指定报告

    Args:
        report_id: 报告ID

    Returns:
        dict: 报告数据字典（结构同 get_latest_report）
        None: 查询失败或无数据时返回 None
    """
    connection = get_db_connection()
    if not connection:
        return None

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = """
                SELECT 
                    id,
                    arkcn_execution_id,
                    arkjp_execution_id,
                    report_content,
                    status,
                    created_at,
                    api_is_available,
                    api_currency,
                    api_total_balance,
                    api_granted_balance,
                    api_topped_up_balance
                FROM ai_reports 
                WHERE id = %s
            """
            cursor.execute(sql, (report_id,))
            result = cursor.fetchone()

            if result:
                report = {
                    'id': result['id'],
                    'arkcn_execution_id': result['arkcn_execution_id'],
                    'arkjp_execution_id': result['arkjp_execution_id'],
                    'report_content': result['report_content'],
                    'status': result['status'],
                    'created_at': str(result['created_at']),
                    'api_info': {
                        'is_available': result['api_is_available'],
                        'currency': result['api_currency'],
                        'total_balance': float(result['api_total_balance']) if result['api_total_balance'] else 0.0,
                        'granted_balance': float(result['api_granted_balance']) if result[
                            'api_granted_balance'] else 0.0,
                        'topped_up_balance': float(result['api_topped_up_balance']) if result[
                            'api_topped_up_balance'] else 0.0
                    }
                }
                return report
            else:
                return None

    except Exception as e:
        print(f"查询报告失败: {e}")
        return None
    finally:
        connection.close()


def check_generating_status():
    """
    检查是否有正在生成中的报告

    Returns:
        bool: True 表示有报告正在生成中，False 表示没有
    """
    connection = get_db_connection()
    if not connection:
        return False

    try:
        with connection.cursor() as cursor:
            sql = """
                SELECT COUNT(*) as count
                FROM ai_reports 
                WHERE status = 'generating'
            """
            cursor.execute(sql)
            result = cursor.fetchone()
            return result[0] > 0

    except Exception as e:
        print(f"检查生成状态失败: {e}")
        return False
    finally:
        connection.close()