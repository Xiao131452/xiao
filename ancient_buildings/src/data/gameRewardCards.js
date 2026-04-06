/**
 * 三张小游戏的奖励卡牌：槽位 1←徽州修复、2←消消乐、3←大明总造办（game2）
 * 配图位于 public/images/game-reward/（victory-slot-1~3.png）
 */
const _base = import.meta.env.BASE_URL || '/'
const base = _base.endsWith('/') ? _base : `${_base}/`

export function gameRewardImage(name) {
  return `${base}images/game-reward/${name}`
}

export const GAME_REWARD_SLOTS = [
  {
    id: 'great_wall',
    gameSlot: 1,
    name: '万里长城',
    era: '战国至明历代修筑',
    features: '中国古代长城关隘古建筑',
    victoryImage: 'victory-slot-1.png',
    miniGameLabel: '小游戏一 · 徽州古建修复',
  },
  {
    id: 'yingxian_pagoda',
    gameSlot: 2,
    name: '佛宫寺释迦塔',
    era: '辽代（公元1056年）',
    features: '位于山西应县，现存最高木构塔式建筑，全塔榫卯叠砌、无钉无铆',
    victoryImage: 'victory-slot-2.png',
    miniGameLabel: '小游戏二 · 营造消消乐',
  },
  {
    id: 'potala',
    gameSlot: 3,
    name: '布达拉宫',
    era: '公元7世纪起',
    features: '始建于公元7世纪，是藏传佛教的圣地及历代达赖喇嘛的冬宫',
    victoryImage: 'victory-slot-3.png',
    miniGameLabel: '小游戏三 · 大明总造办：规划与营缮',
  },
]
