const data = require('../src/data/building_coords.json')

const uniqueUrls = new Set()
const urlCounts = {}
const sampleUrls = {}

data.forEach((building, index) => {
  if (building.image) {
    uniqueUrls.add(building.image)
    
    if (!urlCounts[building.image]) {
      urlCounts[building.image] = 0
      sampleUrls[building.image] = []
    }
    urlCounts[building.image]++
    
    if (sampleUrls[building.image].length < 3) {
      sampleUrls[building.image].push(building.name)
    }
  }
})

console.log('=== 图片URL统计 ===')
console.log(`总建筑数: ${data.length}`)
console.log(`唯一图片URL数: ${uniqueUrls.size}`)
console.log(`重复率: ${((1 - uniqueUrls.size/data.length) * 100).toFixed(1)}%`)

console.log('\n=== 图片URL分布（前20）===')
const sortedUrls = Object.entries(urlCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)

sortedUrls.forEach(([url, count], index) => {
  const percentage = (count/data.length * 100).toFixed(1)
  const shortUrl = url.substring(0, 60) + '...'
  console.log(`\n${index + 1}. 使用次数: ${count} (${percentage}%)`)
  console.log(`   URL: ${shortUrl}`)
  console.log(`   示例建筑: ${sampleUrls[url].join(', ')}`)
})

console.log('\n=== 问题分析 ===')
if (uniqueUrls.size < 100) {
  console.log('⚠️  严重问题：图片URL多样性不足！')
  console.log(`   只有 ${uniqueUrls.size} 个不同的图片URL，却有 ${data.length} 个建筑`)
  console.log('   这意味着很多建筑使用了相同的图片。')
} else if (uniqueUrls.size < 1000) {
  console.log('⚠️  中等问题：图片URL多样性一般')
  console.log(`   有 ${uniqueUrls.size} 个不同的图片URL，对于 ${data.length} 个建筑来说不够丰富`)
} else {
  console.log('✅ 图片URL多样性良好')
  console.log(`   有 ${uniqueUrls.size} 个不同的图片URL，覆盖 ${data.length} 个建筑`)
}