const fs = require('fs')
const path = require('path')

const originalFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const timelineFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_timeline.json')

function parseYearValue(yearStr) {
  if (!yearStr) return null
  
  const bcMatch = yearStr.match(/前(\d+)年/)
  if (bcMatch) {
    return -parseInt(bcMatch[1])
  }
  
  const adMatch = yearStr.match(/^(\d+)年$/)
  if (adMatch) {
    const year = parseInt(adMatch[1])
    if (year > 0 && year < 1911) {
      return year
    }
  }
  
  return null
}

const PRIORITY_NAMES = [
  '故宫', '天坛', '颐和园', '布达拉宫', '长城', '八达岭', '山海关', '嘉峪关', '金山岭',
  '大雁塔', '小雁塔', '应县木塔', '嵩岳寺塔', '永宁寺塔', '开封铁塔', '料敌塔',
  '赵州桥', '安济桥', '卢沟桥', '宝带桥',
  '都江堰', '灵渠',
  '莫高窟', '云冈石窟', '龙门石窟', '大足石刻', '麦积山石窟',
  '乐山大佛', '南禅寺', '佛光寺', '华严寺',
  '白马寺', '少林寺', '灵隐寺', '寒山寺', '法门寺', '大昭寺',
  '拙政园', '留园', '网师园', '狮子林', '豫园', '个园', '何园', '瘦西湖',
  '孔庙', '孔府', '孔林', '孟庙',
  '武侯祠', '杜甫草堂', '三苏祠',
  '岳阳楼', '黄鹤楼', '滕王阁', '鹳雀楼', '蓬莱阁', '大观楼',
  '晋祠',
  '平遥古城', '平遥城墙', '平遥文庙', '镇国寺', '双林寺',
  '丽江古城', '凤凰古城', '周庄', '同里', '西塘', '乌镇', '宏村', '西递',
  '天一阁', '岳麓书院', '白鹿洞书院', '嵩阳书院',
  '明孝陵', '明十三陵', '清东陵', '清西陵', '明显陵',
  '永乐宫',
  '武当山建筑群', '青城山', '五台山', '峨眉山', '普陀山', '九华山', '三清山',
  '泰山', '华山', '衡山', '恒山', '嵩山', '黄山', '庐山', '武夷山',
  '承德避暑山庄', '圆明园', '恭王府',
  '西安城墙', '南京城墙', '开封城墙', '平遥城墙'
]

function getPriority(name) {
  for (let i = 0; i < PRIORITY_NAMES.length; i++) {
    if (name.includes(PRIORITY_NAMES[i])) {
      return 1000 - i
    }
  }
  return 0
}

function main() {
  console.log('开始筛选有准确年份的代表性古建筑...\n')
  
  const data = JSON.parse(fs.readFileSync(originalFile, 'utf-8'))
  console.log(`原始建筑数: ${data.length}`)
  
  const candidates = data
    .map(b => {
      const parsedYear = parseYearValue(b.year)
      return {
        ...b,
        parsedYear
      }
    })
    .filter(b => {
      return b.parsedYear !== null
    })
    .map(b => ({ ...b, priority: getPriority(b.name) }))
    .filter(b => b.priority > 0 || (b.dynasty && b.dynasty !== '清' && b.dynasty !== '未知'))
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      const yearA = a.parsedYear || 9999
      const yearB = b.parsedYear || 9999
      return yearA - yearB
    })
  
  console.log(`有准确年份的候选建筑: ${candidates.length}`)
  
  const selected = []
  const usedNames = new Set()
  
  for (const building of candidates) {
    if (selected.length >= 60) break
    
    const name = building.name
    let isDuplicate = false
    
    for (const used of usedNames) {
      if (name === used || (name.includes(used) && used.length > 2)) {
        isDuplicate = true
        break
      }
    }
    
    if (!isDuplicate) {
      selected.push(building)
      usedNames.add(name)
    }
  }
  
  selected.sort((a, b) => {
    const yearA = a.parsedYear || 9999
    const yearB = b.parsedYear || 9999
    return yearA - yearB
  })
  
  const output = selected.map(b => ({
    id: b.id,
    name: b.name,
    province: b.province,
    city: b.city || '',
    dynasty: b.dynasty,
    type: b.type,
    year: b.year,
    coordinates: b.coordinates,
    status: b.status,
    description: b.description,
    image: b.image
  }))
  
  fs.writeFileSync(timelineFile, JSON.stringify(output, null, 2), 'utf-8')
  
  console.log(`\n筛选完成！`)
  console.log(`代表性建筑数: ${selected.length}`)
  
  const decadeStats = {}
  selected.forEach(building => {
    const year = building.parsedYear
    let decade = ''
    if (year < 0) {
      decade = `前${Math.abs(year)}年`
    } else if (year < 1000) {
      decade = `${year}年代`
    } else {
      decade = `${Math.floor(year/100)*100}年代`
    }
    decadeStats[decade] = (decadeStats[decade] || 0) + 1
  })
  
  console.log(`\n按时期统计:`)
  Object.keys(decadeStats).forEach(decade => {
    console.log(`  ${decade}: ${decadeStats[decade]} 个`)
  })
  
  console.log('\n代表性建筑列表:')
  selected.forEach((building, index) => {
    const year = building.parsedYear
    const yearDisplay = year !== null ? (year < 0 ? `前${Math.abs(year)}年` : `${year}年`) : building.year
    console.log(`${index + 1}. ${building.name} | ${building.dynasty} | ${yearDisplay} | ${building.province}`)
  })
}

main()