r"""
Django项目设置模块

包含数据库、模板、中间件等核心配置
游戏仅使用Django进行页面推送和进度管理，复杂逻辑在前端实现

:file: config/settings.py
:author: 大师
:time: 2026-01-03
"""

from pathlib import Path

BASE_DIR: Path = Path(__file__).resolve().parent.parent

SECRET_KEY: str = "django-insecure-vl$&8=h4g@23lt#(bd4pwe&j5e3_b58ki(qx9+67o7!8cgemwx"

DEBUG: bool = True

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "b5b95842.natappfree.cc",
]


INSTALLED_APPS: list[str] = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "pages",
]

MIDDLEWARE: list[str] = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF: str = "config.urls"

TEMPLATES: list[dict] = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION: str = "config.wsgi.application"

DATABASES: dict = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS: list[dict] = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE: str = "zh-hans"

TIME_ZONE: str = "Asia/Shanghai"

USE_I18N: bool = True

USE_TZ: bool = True

STATIC_URL: str = "/static/"

STATICFILES_DIRS: list[Path] = [
    BASE_DIR.parent / "Assets",
]

DEFAULT_AUTO_FIELD: str = "django.db.models.BigAutoField"