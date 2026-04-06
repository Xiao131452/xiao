const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const backupFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_before_filter.json')

function parseYear(yearString) {
  if (!yearString) return null
  
  const cleanYear = yearString.replace(/[^0-9\-]/g, '')
  
  if (cleanYear.includes('-')) {
    const parts = cleanYear.split('-')
    return parseInt(parts[0]) * -1
  }
  
  return parseInt(cleanYear)
}

function isTempleOrPagoda(name) {
  const excludeKeywords = ['庙', '寺', '塔', '观', '祠', '庵', '宫', '殿', '阁', '楼', '台']
  return excludeKeywords.some(keyword => name.includes(keyword))
}

function main() {
  console.log('开始筛选古建筑数据...\n')
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`✓ 原始数据已备份到: ${backupFile}`)
  
  const filteredData = data.filter(building => {
    const year = parseYear(building.year)
    
    if (year === null || year >= 1911) {
      return false
    }
    
    if (isTempleOrPagoda(building.name)) {
      return false
    }
    
    return true
  })
  
  fs.writeFileSync(dataFile, JSON.stringify(filteredData, null, 2), 'utf-8')
  console.log(`✓ 筛选后的数据已保存到: ${dataFile}`)
  
  console.log(`\n筛选统计:`)
  console.log(`原始建筑数: ${data.length}`)
  console.log(`保留建筑数: ${filteredData.length}`)
  console.log(`删除建筑数: ${data.length - filteredData.length}`)
  console.log(`保留率: ${(filteredData.length / data.length * 100).toFixed(1)}%`)
  
  const dynastyStats = {}
  filteredData.forEach(building => {
    const dynasty = building.dynasty || '未知'
    dynastyStats[dynasty] = (dynastyStats[dynasty] || 0) + 1
  })
  
  console.log(`\n按朝代统计（前15）:`)
  Object.entries(dynastyStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([dynasty, count]) => {
      console.log(`  ${dynasty}: ${count} 个`)
    })
  
  console.log('\n筛选完成！')
}

main()