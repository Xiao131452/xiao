const data = require('../src/data/building_coords_real_images.json')

const uniqueUrls = new Set()
const urlCounts = {}
const sources = {}

data.forEach((building, index) => {
  if (building.image) {
    uniqueUrls.add(building.image)
    
    if (!urlCounts[building.image]) {
      urlCounts[building.image] = 0
    }
    urlCounts[building.image]++
    
    if (building.image.includes('wikipedia')) {
      sources['Wikipedia'] = (sources['Wikipedia'] || 0) + 1
    } else if (building.image.includes('unsplash')) {
      sources['Unsplash'] = (sources['Unsplash'] || 0) + 1
    } else {
      sources['其他'] = (sources['其他'] || 0) + 1
    }
  }
})

console.log('=== 图片URL统计 ===')
console.log(`总建筑数: ${data.length}`)
console.log(`唯一图片URL数: ${uniqueUrls.size}`)
console.log(`重复率: ${((1 - uniqueUrls.size/data.length) * 100).toFixed(1)}%`)

console.log('\n=== 图片来源统计 ===')
Object.entries(sources).forEach(([source, count]) => {
  console.log(`  ${source}: ${count} 个 (${(count/data.length*100).toFixed(1)}%)`)
})

console.log('\n=== 图片URL分布（前15）===')
const sortedUrls = Object.entries(urlCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)

sortedUrls.forEach(([url, count], index) => {
  const percentage = (count/data.length * 100).toFixed(1)
  const shortUrl = url.substring(0, 70) + '...'
  console.log(`\n${index + 1}. 使用次数: ${count} (${percentage}%)`)
  console.log(`   URL: ${shortUrl}`)
})

console.log('\n=== 质量评估 ===')
if (uniqueUrls.size > 50) {
  console.log('✅ 图片多样性良好！')
  console.log(`   有 ${uniqueUrls.size} 个不同的图片URL`)
  console.log('   大部分建筑都有对应的真实图片')
} else if (uniqueUrls.size > 20) {
  console.log('⚠️  图片多样性一般')
  console.log(`   有 ${uniqueUrls.size} 个不同的图片URL`)
  console.log('   建议增加更多真实图片')
} else {
  console.log('❌ 图片多样性不足')
  console.log(`   只有 ${uniqueUrls.size} 个不同的图片URL`)
  console.log('   需要大幅增加真实图片')
}