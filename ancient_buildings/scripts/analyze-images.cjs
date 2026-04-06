const data = require('../src/data/building_coords.json')

const sources = {}
const types = {}

data.forEach(b => {
  if (b.image) {
    const url = b.image
    if (url.includes('unsplash')) {
      sources['Unsplash'] = (sources['Unsplash'] || 0) + 1
    } else {
      sources['其他'] = (sources['其他'] || 0) + 1
    }
  }
  
  if (b.type) {
    types[b.type] = (types[b.type] || 0) + 1
  }
})

console.log('=== 图片来源统计 ===')
Object.entries(sources).forEach(([source, count]) => {
  console.log(`  ${source}: ${count} 个 (${(count/data.length*100).toFixed(1)}%)`)
})

console.log('\n=== 建筑类型统计（前15）===')
Object.entries(types)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .forEach(([type, count]) => {
    console.log(`  ${type}: ${count} 个`)
  })

console.log('\n=== 图片质量检查 ===')
const highQuality = data.filter(b => b.image && b.image.includes('w=800')).length
const mediumQuality = data.filter(b => b.image && b.image.includes('w=400')).length
console.log(`  高质量图片 (800px): ${highQuality} 个`)
console.log(`  中等质量图片 (400px): ${mediumQuality} 个`)
console.log(`  总图片数: ${data.length} 个`)