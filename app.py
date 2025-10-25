# app.py - Flask主程序

import sys
import os

# 确保当前目录在Python路径中
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, render_template, jsonify, request
from datetime import datetime
import config
from utils import weather_api, light_control, db_helper

app = Flask(__name__)
app.config.from_object(config.Config)
# ==================== 页面路由 ====================

@app.route('/')
def index():
    """主页面"""
    return render_template('index.html')


# ==================== 报告相关API ====================

@app.route('/api/report/latest')
def get_latest_report():
    """
    获取最新报告
    返回格式: {
        'success': True,
        'report': {
            'id': 18,
            'status': 'completed',
            'created_at': '2025-10-25 19:00:13',
            'arkcn_execution_id': '20251025140000',
            'arkjp_execution_id': '20251025140003',
            'report_content': 'markdown原文...',
            'api_info': {...}
        }
    }
    """
    try:
        report = db_helper.get_latest_report()

        if report:
            return jsonify({
                'success': True,
                'report': report
            })
        else:
            return jsonify({
                'success': False,
                'message': '暂无报告数据'
            }), 404

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取报告失败: {str(e)}'
        }), 500


@app.route('/api/report/generate', methods=['POST'])
def generate_report():
    """
    触发生成新报告
    """
    import subprocess

    try:
        # 检查是否已有报告在生成中
        is_generating = db_helper.check_generating_status()

        if is_generating:
            return jsonify({
                'success': False,
                'message': '已有报告正在生成中，请稍后再试'
            }), 409

        # 获取脚本路径
        python_path = config.REPORT_SCRIPT.get('python_path')
        script_path = config.REPORT_SCRIPT.get('script_path')

        if not python_path or not script_path:
            return jsonify({
                'success': False,
                'message': '报告生成脚本配置不完整'
            }), 500

        # 启动后台进程生成报告
        subprocess.Popen(
            [python_path, script_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True
        )

        return jsonify({
            'success': True,
            'message': '报告生成已启动，请稍等...'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'启动报告生成失败: {str(e)}'
        }), 500
@app.route('/api/report/<int:report_id>')
def get_report_by_id(report_id):
    """
    获取指定ID的报告
    """
    try:
        report = db_helper.get_report_by_id(report_id)

        if report:
            return jsonify({
                'success': True,
                'report': report
            })
        else:
            return jsonify({
                'success': False,
                'message': f'未找到报告 ID={report_id}'
            }), 404

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取报告失败: {str(e)}'
        }), 500

# ==================== 日历相关API ====================

@app.route('/api/calendar/events')
def get_calendar_events():
    """
    获取日历事件（哪些日期有日志）
    返回格式: {
        'success': True,
        'events': ['2025-01-15', '2025-01-16', ...]
    }
    """
    try:
        events = db_helper.get_calendar_events()
        return jsonify({
            'success': True,
            'events': events
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取日历事件失败: {str(e)}'
        }), 500



# ==================== 灯控制API ====================

@app.route('/api/light/list')
def get_lights():
    """
    获取所有灯的列表
    """
    try:
        lights = light_control.get_all_lights()
        return jsonify({
            'success': True,
            'lights': lights
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取灯列表失败: {str(e)}'
        }), 500


@app.route('/api/light/control', methods=['POST'])
def control_light():
    """
    控制灯的开关
    请求体: {
        'light': 'bedroom' 或 'living_room',
        'action': 'on' 或 'off'
    }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': '无效的请求数据'
            }), 400

        light_name = data.get('light')
        action = data.get('action')

        if not light_name or not action:
            return jsonify({
                'success': False,
                'message': '缺少必要参数: light 和 action'
            }), 400

        # 调用灯控制函数
        result = light_control.control_light(light_name, action)

        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'控制灯失败: {str(e)}'
        }), 500


# ==================== 环境信息API ====================

@app.route('/api/environment')
def get_environment():
    """
    获取环境信息（温度、湿度、天气）
    返回格式: {
        'success': True,
        'temperature': 25.5,
        'humidity': 60,
        'weather': '晴天',
        'update_time': '2025-01-15 14:30:00'
    }
    """
    try:
        weather_data = weather_api.get_weather()

        return jsonify({
            'success': True,
            'temperature': weather_data['temperature'],
            'humidity': weather_data['humidity'],
            'weather': weather_data['weather'],
            'weather_code': weather_data['weather_code'],
            'update_time': weather_data['update_time'],
            'location': config.WEATHER_API['location']['name']
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'获取环境信息失败: {str(e)}'
        }), 500


# ==================== 系统信息API ====================

@app.route('/api/system/info')
def get_system_info():
    """
    获取系统基本信息
    """
    return jsonify({
        'success': True,
        'system': '日历日志查看器',
        'version': '1.0.0',
        'location': config.WEATHER_API['location']['name'],
        'server_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })


# ==================== 错误处理 ====================

@app.errorhandler(404)
def not_found(error):
    """404错误处理"""
    return jsonify({
        'success': False,
        'message': '请求的资源不存在'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """500错误处理"""
    return jsonify({
        'success': False,
        'message': '服务器内部错误'
    }), 500


# ==================== 启动应用 ====================

if __name__ == '__main__':
    print("=" * 60)
    print("日历日志查看器启动中...")
    print(f"访问地址: http://{config.Config.HOST}:{config.Config.PORT}")
    print(f"位置: {config.WEATHER_API['location']['name']}")
    print("=" * 60)

    app.run(
        host=config.Config.HOST,
        port=config.Config.PORT,
        debug=config.Config.DEBUG
    )