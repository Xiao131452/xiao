const fs = require('fs')
const path = require('path')

const originalFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const enhancedFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_enhanced.json')
const backupFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_backup.json')

function main() {
  console.log('开始应用增强数据...\n')
  
  const originalData = JSON.parse(fs.readFileSync(originalFile, 'utf-8'))
  const enhancedData = JSON.parse(fs.readFileSync(enhancedFile, 'utf-8'))
  
  console.log(`原始数据: ${originalData.length} 个建筑`)
  console.log(`增强数据: ${enhancedData.length} 个建筑\n`)
  
  fs.writeFileSync(backupFile, JSON.stringify(originalData, null, 2), 'utf-8')
  console.log(`✓ 原始数据已备份到: ${backupFile}`)
  
  let improvedCount = 0
  const finalData = enhancedData.map((building, index) => {
    const original = originalData[index]
    
    if (original) {
      let improved = false
      
      if (building.dynasty !== original.dynasty && 
          building.dynasty !== '未知' && 
          original.dynasty === '未知') {
        improved = true
      }
      
      if (building.year !== original.year && 
          building.year !== '清代' && 
          original.year === '清代') {
        improved = true
      }
      
      if (building.description !== original.description && 
          building.description !== '古建筑' && 
          original.description === '古建筑') {
        improved = true
      }
      
      if (improved) {
        improvedCount++
      }
    }
    
    return building
  })
  
  fs.writeFileSync(originalFile, JSON.stringify(finalData, null, 2), 'utf-8')
  console.log(`✓ 增强数据已应用到: ${originalFile}`)
  console.log(`✓ 共改进 ${improvedCount} 个建筑的信息`)
  
  const stats = {
    total: finalData.length,
    improved: improvedCount,
    byDynasty: {},
    byType: {},
    completeInfo: 0
  }
  
  finalData.forEach(building => {
    if (!stats.byDynasty[building.dynasty]) stats.byDynasty[building.dynasty] = 0
    stats.byDynasty[building.dynasty]++
    
    if (!stats.byType[building.type]) stats.byType[building.type] = 0
    stats.byType[building.type]++
    
    if (building.dynasty && building.dynasty !== '未知' && 
        building.year && building.year !== '清代' && 
        building.description && building.description !== '古建筑') {
      stats.completeInfo++
    }
  })
  
  console.log(`\n信息完整的建筑: ${stats.completeInfo} 个 (${(stats.completeInfo/stats.total*100).toFixed(1)}%)`)
  console.log(`信息不完整的建筑: ${stats.total - stats.completeInfo} 个`)
  
  console.log('\n按朝代统计 (前15):')
  Object.keys(stats.byDynasty)
    .sort((a, b) => stats.byDynasty[b] - stats.byDynasty[a])
    .slice(0, 15)
    .forEach(dynasty => {
      console.log(`  ${dynasty}: ${stats.byDynasty[dynasty]} 个`)
    })
  
  console.log('\n按类型统计 (前10):')
  Object.keys(stats.byType)
    .sort((a, b) => stats.byType[b] - stats.byType[a])
    .slice(0, 10)
    .forEach(type => {
      console.log(`  ${type}: ${stats.byType[type]} 个`)
    })
  
  console.log('\n数据增强完成！')
  console.log('现在可以在Web应用中使用这些增强后的数据了。')
}

main()