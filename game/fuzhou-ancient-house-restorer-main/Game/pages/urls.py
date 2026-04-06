r"""
游戏页面URL配置

:file: Game/pages/urls.py
:author: 大师
:time: 2026-01-03
"""

from django.urls import path

from . import views

urlpatterns = [
    path("", views.index_view, name="index"),
    path("start/", views.start_view, name="start"),
    path("main/", views.main_view, name="main"),
    path("fight/", views.fight_view, name="fight"),
    path("fix/", views.fix_view, name="fix"),
    path("story/", views.story_view, name="story"),
    path("api/progress/", views.api_progress_get, name="api_progress"),
    path("api/progress/advance/", views.api_progress_advance, name="api_progress_advance"),
    path("api/records/", views.api_clear_records, name="api_clear_records"),
]