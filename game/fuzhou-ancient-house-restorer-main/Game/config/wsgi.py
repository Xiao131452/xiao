r"""
WSGI配置模块，用于同步服务器网关接口部署

暴露模块级变量 ``application`` 作为WSGI可调用对象

:file: config/wsgi.py
:author: 大师
:time: 2025-01-03
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application: object = get_wsgi_application()