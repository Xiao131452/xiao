import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGraphStore = defineStore('graph', () => {
  const nodes = ref([
    { id: 1, label: '榫卯结构', type: 'root', x: 400, y: 300 },
    { id: 2, label: '直榫', type: 'child', x: 250, y: 200 },
    { id: 3, label: '燕尾榫', type: 'child', x: 550, y: 200 },
    { id: 4, label: '透榫', type: 'child', x: 250, y: 400 },
    { id: 5, label: '暗榫', type: 'child', x: 550, y: 400 }
  ])

  const edges = ref([
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 1, to: 5 }
  ])

  const activeNode = ref(null)

  const setActiveNode = (nodeId) => {
    activeNode.value = nodeId
  }

  const getNodeInfo = (nodeId) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (!node) return null

    const infoMap = {
      1: '榫卯结构是中国古代建筑的核心技术，通过构件之间的凹凸结合实现连接，无需钉子和胶水。',
      2: '直榫是最简单的榫卯形式，榫头和卯眼都是直的，常用于框架结构的连接。',
      3: '燕尾榫呈梯形，连接牢固，常用于需要承受拉力的部位，如梁柱连接。',
      4: '透榫的榫头穿过卯眼，从另一侧露出，连接更加稳固。',
      5: '暗榫的榫头不穿过卯眼，外观更加整洁，常用于装饰性连接。'
    }

    return {
      ...node,
      description: infoMap[nodeId] || ''
    }
  }

  const highlightNodes = (nodeIds) => {
    nodes.value.forEach(node => {
      node.highlighted = nodeIds.includes(node.id)
    })
  }

  return {
    nodes,
    edges,
    activeNode,
    setActiveNode,
    getNodeInfo,
    highlightNodes
  }
})