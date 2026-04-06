r"""
游戏页面视图模块

处理游戏各页面的渲染和API接口
进度仅在内存/会话中临时保存，不持久化
仅保存历史最高分记录

:file: Game/pages/views.py
:author: 大师
:time: 2026-01-05
"""

import json
from datetime import datetime
from typing import Any

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.clickjacking import xframe_options_exempt


def sync_hzh_embed_session(request: HttpRequest) -> None:
    """本站 iframe 加载 /start/?embed=1 时标记嵌入模式，供后续 /main/ 等页跳过竖屏遮罩。"""
    v = request.GET.get("embed")
    if v == "1":
        request.session["hzh_embed"] = True
        request.session.modified = True
    elif v == "0":
        request.session["hzh_embed"] = False
        request.session.modified = True


def hzh_embed_ui(request: HttpRequest) -> bool:
    return bool(request.session.get("hzh_embed"))


def get_default_progress() -> dict[str, Any]:
    r"""
    获取默认的游戏进度（临时进度，不持久化）

    :return dict: 包含默认游戏进度的字典
    """
    return {
        "stage": "intro",
        "boss": "",
        "defeated_bosses": [],
        "repaired_gucuo": [],
        "relics": [],
        "start_time": None,
        "is_playing": False,
    }


def get_progress(request: HttpRequest) -> dict[str, Any]:
    r"""
    从Session获取游戏进度

    :param request: HTTP请求对象
    :return dict[str, Any]: 当前进度数据
    """
    progress = request.session.get("game_progress")
    if progress is None:
        progress = get_default_progress()
        request.session["game_progress"] = progress
    return progress


def get_best_record(request: HttpRequest) -> dict[str, Any] | None:
    r"""
    获取最佳通关记录

    :param request: HTTP请求对象
    :return dict | None: 最佳记录或None
    """
    return request.session.get("best_record")


def save_progress(request: HttpRequest, progress: dict[str, Any]) -> None:
    r"""
    保存游戏进度到Session（临时）

    :param request: HTTP请求对象
    :param progress: 进度数据
    :return None: 无返回值
    """
    request.session["game_progress"] = progress
    request.session.modified = True


def save_best_record(request: HttpRequest, record: dict[str, Any]) -> None:
    r"""
    保存最佳通关记录

    :param request: HTTP请求对象
    :param record: 记录数据
    :return None: 无返回值
    """
    current_best = request.session.get("best_record")
    if current_best is None or record["duration"] < current_best["duration"]:
        request.session["best_record"] = record
        request.session.modified = True


def build_progress_response(progress: dict[str, Any], best_record: dict[str, Any] | None = None) -> dict[str, Any]:
    r"""
    构建进度响应数据

    :param progress: 原始进度数据
    :param best_record: 最佳记录
    :return dict[str, Any]: API响应格式的进度数据
    """
    return {
        "stage": progress.get("stage", "intro"),
        "boss": progress.get("boss", ""),
        "defeated_bosses": progress.get("defeated_bosses", []),
        "repaired_gucuo": progress.get("repaired_gucuo", []),
        "relics": progress.get("relics", []),
        "is_playing": progress.get("is_playing", False),
        "best_record": best_record,
    }


@require_GET
def index_view(request: HttpRequest) -> HttpResponse:
    r"""
    首页视图 - 重定向到开始页面

    :param request: HTTP请求对象
    :return HttpResponse: 重定向响应
    """
    return redirect("start")


@xframe_options_exempt
@require_GET
def start_view(request: HttpRequest) -> HttpResponse:
    r"""
    开始页面视图 - 重置游戏进度

    :param request: HTTP请求对象
    :return HttpResponse: 渲染后的开始页面
    """
    sync_hzh_embed_session(request)
    request.session["game_progress"] = get_default_progress()
    request.session.modified = True

    best_record = get_best_record(request)
    return render(
        request,
        "start.html",
        {
            "best_record": json.dumps(best_record),
            "embed": hzh_embed_ui(request),
        },
    )


@xframe_options_exempt
@require_GET
def main_view(request: HttpRequest) -> HttpResponse:
    r"""
    主流程页面视图

    :param request: HTTP请求对象
    :return HttpResponse: 渲染后的主流程页面
    """
    progress = get_progress(request)
    if not progress.get("is_playing"):
        progress["is_playing"] = True
        progress["start_time"] = datetime.now().isoformat()
        save_progress(request, progress)
    
    best_record = get_best_record(request)
    return render(
        request,
        "main.html",
        {
            "progress": json.dumps(build_progress_response(progress, best_record)),
            "embed": hzh_embed_ui(request),
        },
    )


@xframe_options_exempt
@require_GET
def fight_view(request: HttpRequest) -> HttpResponse:
    r"""
    战斗页面视图

    :param request: HTTP请求对象
    :return HttpResponse: 渲染后的战斗页面
    """
    progress = get_progress(request)
    return render(
        request,
        "fight.html",
        {
            "progress": json.dumps(build_progress_response(progress)),
            "embed": hzh_embed_ui(request),
        },
    )


@xframe_options_exempt
@require_GET
def fix_view(request: HttpRequest) -> HttpResponse:
    r"""
    修复页面视图

    :param request: HTTP请求对象
    :return HttpResponse: 渲染后的修复页面
    """
    progress = get_progress(request)
    return render(
        request,
        "fix.html",
        {
            "progress": json.dumps(build_progress_response(progress)),
            "embed": hzh_embed_ui(request),
        },
    )


@xframe_options_exempt
@require_GET
def story_view(request: HttpRequest) -> HttpResponse:
    r"""
    插画页面视图

    :param request: HTTP请求对象
    :return HttpResponse: 渲染后的插画页面
    """
    progress = get_progress(request)
    return render(
        request,
        "story.html",
        {
            "progress": json.dumps(build_progress_response(progress)),
            "embed": hzh_embed_ui(request),
        },
    )


@require_GET
def api_progress_get(request: HttpRequest) -> JsonResponse:
    r"""
    获取游戏进度API

    :param request: HTTP请求对象
    :return JsonResponse: 当前进度数据
    """
    progress = get_progress(request)
    best_record = get_best_record(request)
    return JsonResponse(build_progress_response(progress, best_record))


@csrf_exempt
@require_POST
def api_progress_advance(request: HttpRequest) -> JsonResponse:
    r"""
    推进游戏进度API

    :param request: HTTP请求对象
    :return JsonResponse: 更新后的进度数据
    """
    try:
        body = json.loads(request.body)
        action = body.get("action", "")
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({"error": "Invalid request body"}, status=400)

    progress = get_progress(request)

    match action:
        case "start_game":
            progress = get_default_progress()
            progress["is_playing"] = True
            progress["start_time"] = datetime.now().isoformat()

        case "set_stage":
            stage = body.get("stage", "")
            if stage:
                progress["stage"] = stage

        case "set_boss":
            boss = body.get("boss", "")
            if boss:
                progress["boss"] = boss

        case "boss_defeat":
            boss = body.get("boss", "")
            if boss and boss not in progress.get("defeated_bosses", []):
                progress["defeated_bosses"].append(boss)

        case "repair_complete":
            gucuo_id = body.get("gucuo_id", "")
            if gucuo_id and gucuo_id not in progress.get("repaired_gucuo", []):
                progress["repaired_gucuo"].append(gucuo_id)
            
            relic = body.get("relic", "")
            if relic and relic not in progress.get("relics", []):
                progress["relics"].append(relic)

        case "game_complete":
            if progress.get("start_time"):
                start = datetime.fromisoformat(progress["start_time"])
                end = datetime.now()
                duration = int((end - start).total_seconds())
                record = {
                    "time": end.isoformat(),
                    "duration": duration,
                }
                save_best_record(request, record)

        case "reset":
            progress = get_default_progress()

        case _:
            return JsonResponse({"error": f"Unknown action: {action}"}, status=400)

    save_progress(request, progress)
    best_record = get_best_record(request)
    return JsonResponse(build_progress_response(progress, best_record))


@require_GET
def api_clear_records(request: HttpRequest) -> JsonResponse:
    r"""
    获取最佳记录API

    :param request: HTTP请求对象
    :return JsonResponse: 最佳记录
    """
    best_record = get_best_record(request)
    return JsonResponse({"best_record": best_record})