r"""
pages应用配置模块

:file: pages/apps.py
:author: 大师
:time: 2025-01-03
"""

from django.apps import AppConfig


class PagesConfig(AppConfig):
    r"""
    pages应用的配置类
    """

    default_auto_field: str = "django.db.models.BigAutoField"
    name: str = "pages"