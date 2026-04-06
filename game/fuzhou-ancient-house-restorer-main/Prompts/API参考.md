# 游戏进度 API 文档

## 概述

本API用于管理"重生之我是福州古厝修复者"游戏的进度状态。游戏分为四个阶段：开局、上下杭、朱紫坊、三坊七巷。

---

## 基础信息

| 项目 | 说明 |
|------|------|
| 基础URL | `http://localhost:8000` |
| 数据格式 | JSON |
| 认证方式 | 无（使用Session管理状态） |

---

## API 接口

### 1. 获取游戏主页

获取游戏单页应用入口页面。

**请求**

```
GET /
```

**响应**

返回 `main.html` 渲染后的 HTML 页面。

---

### 2. 获取当前进度

获取当前游戏进度状态。

**请求**

```
GET /api/progress/
```

**响应参数**

| 字段 | 类型 | 说明 |
|------|------|------|
| `chapter` | `int` | 当前章节索引（0-3，3表示已通关） |
| `chapter_name` | `string` | 当前章节名称 |
| `finished` | `boolean` | 是否已通关 |
| `fight_won` | `boolean` | 当前章节战斗是否胜利 |
| `repaired` | `boolean` | 当前章节修复是否完成 |
| `relics` | `object` | 已获得的魂器状态 |

**响应示例**

初始状态（开局）：

```json
{
    "chapter": 0,
    "chapter_name": "上下杭",
    "finished": false,
    "fight_won": false,
    "repaired": false,
    "relics": {
        "shangxiahang": false,
        "zhuzifang": false,
        "sanfangqixiang": false
    }
}
```

游戏进行中（战斗胜利后）：

```json
{
    "chapter": 0,
    "chapter_name": "上下杭",
    "finished": false,
    "fight_won": true,
    "repaired": false,
    "relics": {
        "shangxiahang": false,
        "zhuzifang": false,
        "sanfangqixiang": false
    }
}
```

第二章节进行中：

```json
{
    "chapter": 1,
    "chapter_name": "朱紫坊",
    "finished": false,
    "fight_won": false,
    "repaired": false,
    "relics": {
        "shangxiahang": true,
        "zhuzifang": false,
        "sanfangqixiang": false
    }
}
```

已通关状态：

```json
{
    "chapter": 3,
    "chapter_name": "已通关",
    "finished": true,
    "fight_won": false,
    "repaired": false,
    "relics": {
        "shangxiahang": true,
        "zhuzifang": true,
        "sanfangqixiang": true
    }
}
```

---

### 3. 推进游戏进度

推进游戏状态，包括战斗胜利、修复完成、重置游戏。

**请求**

```
POST /api/progress/advance/
Content-Type: application/json
```

**请求参数**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `action` | `string` | 是 | 操作类型 |

**action 可选值**

| 值 | 说明 | 前置条件 |
|----|------|----------|
| `fight_win` | 战斗胜利 | 无 |
| `repair_complete` | 修复完成 | 必须先 `fight_win` |
| `reset` | 重置游戏 | 无 |

---

#### 3.1 战斗胜利

**请求示例**

```json
{
    "action": "fight_win"
}
```

**成功响应** (HTTP 200)

```json
{
    "chapter": 0,
    "chapter_name": "上下杭",
    "finished": false,
    "fight_won": true,
    "repaired": false,
    "relics": {
        "shangxiahang": false,
        "zhuzifang": false,
        "sanfangqixiang": false
    }
}
```

---

#### 3.2 修复完成

**请求示例**

```json
{
    "action": "repair_complete"
}
```

**成功响应** (HTTP 200)

章节推进，获得魂器：

```json
{
    "chapter": 1,
    "chapter_name": "朱紫坊",
    "finished": false,
    "fight_won": false,
    "repaired": false,
    "relics": {
        "shangxiahang": true,
        "zhuzifang": false,
        "sanfangqixiang": false
    }
}
```

**错误响应** (HTTP 400)

未先完成战斗就尝试修复：

```
repair without win
```

---

#### 3.3 重置游戏

**请求示例**

```json
{
    "action": "reset"
}
```

**成功响应** (HTTP 200)

```json
{
    "chapter": 0,
    "chapter_name": "上下杭",
    "finished": false,
    "fight_won": false,
    "repaired": false,
    "relics": {
        "shangxiahang": false,
        "zhuzifang": false,
        "sanfangqixiang": false
    }
}
```

---

## 错误响应

| HTTP状态码 | 响应内容 | 说明 |
|------------|----------|------|
| 400 | `invalid json` | 请求体不是有效的JSON |
| 400 | `repair without win` | 未完成战斗就尝试修复 |
| 400 | `unknown action` | 未知的action值 |
| 405 | Method Not Allowed | 请求方法错误 |

---

## 游戏流程状态机

```
┌─────────────────────────────────────────────────────────┐
│                      游戏流程                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  fight_win   ┌──────────┐  repair_complete│
│  │ 章节开始  │ ──────────> │ 战斗胜利  │ ──────────────> │
│  │fight=false│             │fight=true │                │
│  └──────────┘              └──────────┘                 │
│       ▲                                                 │
│       │                    ┌──────────┐                 │
│       │    章节+1          │ 修复完成  │                 │
│       └─────────────────── │获得魂器  │ <───────────────┘
│                            └──────────┘                 │
│                                                         │
│  章节顺序: 上下杭(0) → 朱紫坊(1) → 三坊七巷(2) → 通关(3) │
│                                                         │
│  任意时刻可调用 reset 重置到初始状态                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 前端调用示例

### JavaScript Fetch API

```javascript
// 获取当前进度
async function getProgress() {
    const response = await fetch('/api/progress/');
    return await response.json();
}

// 战斗胜利
async function fightWin() {
    const response = await fetch('/api/progress/advance/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()  // Django CSRF保护
        },
        body: JSON.stringify({ action: 'fight_win' })
    });
    
    if (!response.ok) {
        throw new Error(await response.text());
    }
    return await response.json();
}

// 修复完成
async function repairComplete() {
    const response = await fetch('/api/progress/advance/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({ action: 'repair_complete' })
    });
    
    if (!response.ok) {
        throw new Error(await response.text());
    }
    return await response.json();
}

// 重置游戏
async function resetGame() {
    const response = await fetch('/api/progress/advance/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({ action: 'reset' })
    });
    return await response.json();
}

// 获取CSRF Token（从cookie中读取）
function getCsrfToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return value;
    }
    return '';
}
```

### 完整游戏流程示例

```javascript
// 模拟完整游戏流程
async function playGame() {
    // 开始游戏
    let state = await getProgress();
    console.log('初始状态:', state);
    // { chapter: 0, chapter_name: "上下杭", ... }

    // 第一章：上下杭
    state = await fightWin();
    console.log('战斗胜利:', state);
    // { chapter: 0, fight_won: true, ... }
    
    state = await repairComplete();
    console.log('修复完成:', state);
    // { chapter: 1, chapter_name: "朱紫坊", relics: { shangxiahang: true, ... } }

    // 第二章：朱紫坊
    state = await fightWin();
    state = await repairComplete();
    console.log('第二章完成:', state);
    // { chapter: 2, chapter_name: "三坊七巷", relics: { shangxiahang: true, zhuzifang: true, ... } }

    // 第三章：三坊七巷
    state = await fightWin();
    state = await repairComplete();
    console.log('通关:', state);
    // { chapter: 3, chapter_name: "已通关", finished: true, relics: { all: true } }

    // 重新开始
    state = await resetGame();
    console.log('重置:', state);
    // { chapter: 0, chapter_name: "上下杭", ... }
}
```

---

## 魂器对应关系

| 章节索引 | 章节名称 | 魂器键名 |
|----------|----------|----------|
| 0 | 上下杭 | `shangxiahang` |
| 1 | 朱紫坊 | `zhuzifang` |
| 2 | 三坊七巷 | `sanfangqixiang` |