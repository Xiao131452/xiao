const fs = require('fs')
const path = require('path')

const originalFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const timelineFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_timeline.json')

function main() {
  console.log('开始筛选世界文化遗产...\n')
  
  const data = JSON.parse(fs.readFileSync(originalFile, 'utf-8'))
  
  const worldHeritage = data.filter(building => {
    return building.type === '世界文化遗产'
  })
  
  worldHeritage.sort((a, b) => {
    const yearA = parseYear(a.year)
    const yearB = parseYear(b.year)
    return yearA - yearB
  })
  
  fs.writeFileSync(timelineFile, JSON.stringify(worldHeritage, null, 2), 'utf-8')
  
  console.log('筛选完成！')
  console.log(`原始建筑数: ${data.length}`)
  console.log(`世界文化遗产数: ${worldHeritage.length}`)
  console.log(`输出文件: ${timelineFile}`)
  
  console.log('\n世界文化遗产列表:')
  worldHeritage.forEach((building, index) => {
    console.log(`${index + 1}. ${building.name} - ${building.dynasty} - ${building.year}`)
  })
}

function parseYear(yearStr) {
  if (!yearStr) return 0
  
  let year = yearStr.replace(/[^0-9\-]/g, '')
  
  if (year.startsWith('-')) {
    return parseInt(year)
  }
  
  if (year.includes('-')) {
    const parts = year.split('-')
    year = parts[0]
  }
  
  return parseInt(year) || 0
}

main()