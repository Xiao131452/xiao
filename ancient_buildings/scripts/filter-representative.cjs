const fs = require('fs')
const path = require('path')

const originalFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const timelineFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_timeline.json')

const FAMOUS_BUILDINGS = [
  '故宫', '天坛', '颐和园', '长城', '布达拉宫', '大雁塔', '小雁塔', '应县木塔',
  '赵州桥', '都江堰', '兵马俑', '白马寺', '少林寺', '寒山寺', '灵隐寺',
  '乐山大佛', '云冈石窟', '龙门石窟', '莫高窟', '拙政园', '留园', '网师园', '狮子林',
  '豫园', '晋祠', '孔庙', '孔府', '孔林', '武侯祠', '杜甫草堂', '岳阳楼', '黄鹤楼',
  '滕王阁', '钟鼓楼', '天一阁', '平遥古城', '丽江古城', '凤凰古城',
  '周庄', '乌镇', '西塘', '同里', '宏村', '西递',
  '永宁寺塔', '嵩岳寺塔', '登封观星台', '开封铁塔', '料敌塔',
  '白鹿洞书院', '岳麓书院', '应天府书院', '嵩阳书院',
  '曲阜三孔', '明孝陵', '北京十三陵',
  '永乐宫', '南禅寺', '佛光寺', '华严寺', '善化寺',
  '保国寺', '天台山国清寺',
  '稷益庙', '平遥文庙', '晋城玉皇庙', '高平开化寺', '镇国寺',
  '五台山', '峨眉山', '普陀山', '九华山', '武当山', '青城山',
  '三清山', '武夷山', '庐山', '黄山',
  '泰山', '华山', '衡山', '恒山', '嵩山'
]

const DYNASTY_ORDER = {
  '先秦': 1, '商': 2, '西周': 3, '东周': 4, '春秋': 5, '战国': 6,
  '秦': 7, '西汉': 8, '东汉': 9, '三国': 10, '西晋': 11, '东晋': 12,
  '南北朝': 13, '北朝': 14, '南朝': 15, '隋': 16, '唐': 17, '五代': 18,
  '北宋': 19, '南宋': 20, '辽': 21, '金': 22, '元': 23, '明': 24, '清': 25
}

function parseYear(yearStr) {
  if (!yearStr) return 0
  let year = yearStr.replace(/[^0-9\-]/g, '')
  if (year.startsWith('-')) return parseInt(year)
  if (year.includes('-')) {
    const parts = year.split('-')
    year = parts[0]
  }
  return parseInt(year) || 0
}

function getDynastyPriority(dynasty) {
  if (!dynasty) return 100
  const firstDynasty = dynasty.split(',')[0].split('、')[0].trim()
  return DYNASTY_ORDER[firstDynasty] || 50
}

function isImportantBuilding(building) {
  if (FAMOUS_BUILDINGS.some(name => building.name.includes(name))) {
    return true
  }
  
  if (building.description && building.description.length > 30) {
    return true
  }
  
  if (building.type && ['宫殿', '园林', '古塔', '古桥', '石窟', '古墓', '城墙', '寺庙', '书院'].includes(building.type)) {
    return true
  }
  
  return false
}

function main() {
  console.log('开始筛选代表性古建筑...\n')
  
  const data = JSON.parse(fs.readFileSync(originalFile, 'utf-8'))
  console.log(`原始建筑数: ${data.length}`)
  
  const allBuildings = data.filter(b => {
    const year = parseYear(b.year)
    return year > 0 && year < 1911
  })
  
  const importantBuildings = allBuildings.filter(building => {
    return isImportantBuilding(building)
  })
  
  importantBuildings.sort((a, b) => {
    const yearA = parseYear(a.year)
    const yearB = parseYear(b.year)
    if (yearA !== yearB) return yearA - yearB
    
    const dynastyA = getDynastyPriority(a.dynasty)
    const dynastyB = getDynastyPriority(b.dynasty)
    return dynastyA - dynastyB
  })
  
  const selected = []
  const usedNames = new Set()
  
  for (const building of importantBuildings) {
    if (selected.length >= 60) break
    
    const isDuplicate = usedNames.has(building.name) || 
      usedNames.has(building.name.slice(0, -1)) ||
      usedNames.has(building.name + '1')
    
    if (!isDuplicate) {
      selected.push(building)
      usedNames.add(building.name)
    }
  }
  
  fs.writeFileSync(timelineFile, JSON.stringify(selected, null, 2), 'utf-8')
  
  console.log(`\n筛选完成！`)
  console.log(`代表性建筑数: ${selected.length}`)
  console.log(`输出文件: ${timelineFile}`)
  
  const dynastyStats = {}
  selected.forEach(building => {
    const dynasty = building.dynasty || '未知'
    dynastyStats[dynasty] = (dynastyStats[dynasty] || 0) + 1
  })
  
  console.log(`\n按朝代统计:`)
  Object.entries(dynastyStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([dynasty, count]) => {
      console.log(`  ${dynasty}: ${count} 个`)
    })
  
  console.log('\n代表性建筑列表:')
  selected.forEach((building, index) => {
    console.log(`${index + 1}. ${building.name} - ${building.dynasty} - ${building.year} - ${building.province}`)
  })
}

main()