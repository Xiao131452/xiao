r"""
项目主URL配置

:file: Game/config/urls.py
:author: 大师
:time: 2026-01-03
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("pages.urls")),
]