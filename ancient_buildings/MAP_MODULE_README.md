# 古建筑地理分布可视化模块 · 项目知识卡片

> 本文档与当前代码、`building_coords.json` 最新结构及前端交互**保持一致**，便于协作与 AI 辅助开发。

## 模块概述

地图视图（`MapView` + `BuildingHeatmap`）提供全国/省级古建筑分布、筛选、详情与外链；首页顶部为**可翻动轮播**（5 张），数据与详情区图片均来自规范化后的建筑数据。

## 数据与加载

### 数据文件

- **主数据**：`src/data/building_coords.json`  
  使用仓库内**最新版** JSON 直接作为数据源；历史版本中用于测试、冗余说明类文档已从工作流中剥离，以减轻维护成本并避免误导。
- **规范化入口**：`src/utils/normalizeBuilding.js` 的 `normalizeBuildingList()`  
  `MapView` 在加载时对整表做一次规范化，保证界面字段统一，无需在组件内重复兼容旧字段。

### 最新 JSON 字段（与界面对齐）

| 字段 | 说明 |
|------|------|
| `id`, `name`, `province`, `city`, `dynasty`, `year` | 基础信息 |
| `coordinates` | `[经度, 纬度]` |
| `location` | 详细地址文案 |
| `category` | 形制分类（界面展示为「形制」） |
| `building_type` | **建筑类型**（名录/保护属性等，界面「建筑类型」） |
| `heritage_status` | 字符串数组，用于推断「保存完好 / 重建」等筛选用 `status` |
| `details.overview` | 简介正文（映射为 `description`） |
| `images` | **最多 5 张**图片 URL，用于详情轮播与列表缩略图（首张为 `image`） |
| `baike_url` | 百度百科词条链接 |
| `building_reason` | 入选/定级说明（参与「重建」等文案推断） |
| `baidu_address_url` / `.baidu_map_url`（可选） | 若存在则优先作为「百度地址」链接；否则由工具函数按地址或坐标生成检索链接 |

### 规范化后的运行时对象（常用）

- `image`：封面图（`images[0]`）
- `images`：轮播用数组（≤5）
- `type`：来自 `category`
- `description`：来自 `details.overview`
- `status`：供筛选与样式（`保存完好` / `重建`）
- `baidu_address_url`：百度地图侧打开/检索用 URL（界面「百度地址」）
- `baike_url`、`building_type`：与上表一致

## 已实现功能（与知识卡片同步）

1. **全国/省级热力与散点**  
   ECharts Geo + scatter；全国未筛选时为省份聚合旗标模式。

2. **筛选**  
   朝代、省份、`status`（由规范化逻辑推导）。

3. **首页轮播（5 张）**  
   取规范化后数据集的**前 5 条**建筑的封面图与简介；支持**自动轮播、左右箭头、指示点、触摸左右滑动**。

4. **建筑详情**  
   - **可翻动式图片轮播**：同一条记录的 `images`（最多 5 张），支持**左右按钮、指示点、触摸滑动**。  
   - 展示形制、**建筑类型**、地址、`status`。  
   - **百度地址**：`baidu_address_url`（外链，新标签打开）。  
   - **百科**：`baike_url`（外链，新标签打开）。

5. **地图悬停卡片**  
   封面图、朝代、形制、建筑类型（若有）、年代、`status`、简介摘要。

6. **列表项**  
   缩略图 + 一行 meta：`朝代 · 形制 · 建筑类型（若有）`。

## 文件结构

```
src/
├── utils/
│   └── normalizeBuilding.js    # 数据规范化（images / 外链 / status）
├── components/map/
│   └── BuildingHeatmap.vue     # 地图与悬停卡片
├── views/
│   └── MapView.vue             # 地图 Tab、轮播、详情侧栏
├── data/
│   └── building_coords.json    # 主数据（最新版）
```

另：**历史介绍**时间轴若使用 `building_coords_timeline.json`，与主数据文件独立，更新主数据后如需一致需单独同步该文件。

## 安装与运行

```bash
npm install
npm run dev
```

地图 GeoJSON 依赖外网（如阿里云 DataV 边界数据）；建筑配图多为外链 URL，需网络可达。

## 技术要点摘要

- Vue 3 + ECharts；`MapView` 内 `buildings` 一律为规范化后的数组。  
- 轮播与详情轮播均使用同一套 `images` / `image` 语义，避免单图与多图分裂。  
- 外链统一 `rel="noopener noreferrer"`、`target="_blank"`。

## 扩展与注意事项

- 新增 JSON 字段时，优先在 `normalizeBuilding.js` 聚合，再在 UI 展示。  
- 替换 `building_coords.json` 后无需改 import 路径，只要字段符合上表或通过规范化补全。  
- 地图与图片依赖外网；内网部署需替换 GeoJSON 与图床策略。

## 参考链接

- [ECharts 文档](https://echarts.apache.org/zh/index.html)  
- [Vue 3 文档](https://cn.vuejs.org/)  
- [百度百科](https://baike.baidu.com/) / [百度地图](https://map.baidu.com/)（与数据中外链域名一致）
