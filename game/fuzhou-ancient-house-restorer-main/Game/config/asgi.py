r"""
ASGI配置模块，用于异步服务器网关接口部署

暴露模块级变量 ``application`` 作为ASGI可调用对象

:file: config/asgi.py
:author: 大师
:time: 2025-01-03
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application: object = get_asgi_application()