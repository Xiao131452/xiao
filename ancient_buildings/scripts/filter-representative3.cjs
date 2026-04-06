const fs = require('fs')
const path = require('path')

const originalFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const timelineFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_timeline.json')

const FAMOUS_NAMES = [
  '故宫', '天坛', '颐和园', '布达拉宫', '长城', '八达岭', '山海关', '嘉峪关', '金山岭',
  '大雁塔', '小雁塔', '应县木塔', '嵩岳寺塔', '永宁寺塔', '铁塔', '料敌塔', '白塔',
  '赵州桥', '安济桥', '卢沟桥', '十七孔桥', '宝带桥',
  '都江堰', '灵渠', '郑国渠',
  '莫高窟', '云冈石窟', '龙门石窟', '大足石刻', '麦积山石窟',
  '乐山大佛', '乐山大佛', '南禅寺', '佛光寺', '华严寺', '善化寺', '大同华严寺',
  '白马寺', '少林寺', '灵隐寺', '寒山寺', '法门寺', '大昭寺', '小昭寺', '布达拉宫',
  '拙政园', '留园', '网师园', '狮子林', '豫园', '个园', '何园', '瘦西湖',
  '孔庙', '孔府', '孔林', '孟庙', '孟府',
  '武侯祠', '杜甫草堂', '三苏祠', '范仲淹祠',
  '岳阳楼', '黄鹤楼', '滕王阁', '鹳雀楼', '蓬莱阁', '大观楼',
  '晋祠', '圣母殿', '献殿',
  '平遥古城', '平遥城墙', '平遥文庙', '镇国寺', '双林寺',
  '丽江古城', '凤凰古城', '周庄', '同里', '西塘', '乌镇', '宏村', '西递',
  '天一阁', '岳麓书院', '白鹿洞书院', '嵩阳书院', '应天府书院',
  '明孝陵', '明十三陵', '清东陵', '清西陵', '明显陵', '成吉思汗陵',
  '永乐宫', '永福寺',
  '武当山', '青城山', '五台山', '峨眉山', '普陀山', '九华山', '三清山',
  '泰山', '华山', '衡山', '恒山', '嵩山', '黄山', '庐山', '武夷山',
  '承德避暑山庄', '圆明园', '恭王府', '圆明园',
  '西安城墙', '南京城墙', '开封城墙', '襄阳城墙', '荆州城墙', '平遥城墙',
  '西安碑林', '石门颂', '西狭颂', '石鼓文',
  '赵城', '凤阳古城', '南京古城', '西安古城', '大理古城', '苏州古城'
]

function parseYearDirect(yearStr) {
  if (!yearStr) return 9999
  
  const match = yearStr.match(/前(\d+)年/)
  if (match) {
    return -parseInt(match[1])
  }
  
  const directMatch = yearStr.match(/(\d+)年/)
  if (directMatch) {
    return parseInt(directMatch[1])
  }
  
  return 9999
}

function getPriority(building) {
  const name = building.name || ''
  const type = building.type || ''
  let priority = 0
  
  for (let i = 0; i < FAMOUS_NAMES.length; i++) {
    if (name.includes(FAMOUS_NAMES[i])) {
      priority = 1000 - i
      break
    }
  }
  
  if (type.includes('世界文化遗产')) priority += 100
  if (type.includes('宫殿')) priority += 50
  if (type.includes('园林')) priority += 50
  if (type.includes('古塔')) priority += 30
  if (type.includes('石窟')) priority += 30
  if (type.includes('寺庙')) priority += 20
  if (type.includes('古城')) priority += 20
  
  if (building.description && building.description.length > 30) {
    priority += 10
  }
  
  return priority
}

function main() {
  console.log('开始筛选代表性古建筑...\n')
  
  const data = JSON.parse(fs.readFileSync(originalFile, 'utf-8'))
  console.log(`原始建筑数: ${data.length}`)
  
  const candidates = data
    .filter(b => {
      const year = parseYearDirect(b.year)
      return year < 1911 && year > -3000
    })
    .map(b => ({ 
      ...b, 
      parsedYear: parseYearDirect(b.year),
      priority: getPriority(b)
    }))
    .filter(b => b.priority > 0)
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      return a.parsedYear - b.parsedYear
    })
  
  const selected = []
  const usedNames = new Set()
  
  for (const building of candidates) {
    if (selected.length >= 60) break
    
    const name = building.name
    let isDuplicate = false
    
    for (const used of usedNames) {
      if (name === used || name.includes(used) || (used.length > 2 && name.includes(used.slice(0, -1)))) {
        isDuplicate = true
        break
      }
    }
    
    if (!isDuplicate) {
      selected.push(building)
      usedNames.add(name)
    }
  }
  
  selected.sort((a, b) => a.parsedYear - b.parsedYear)
  
  fs.writeFileSync(timelineFile, JSON.stringify(selected, null, 2), 'utf-8')
  
  console.log(`\n筛选完成！`)
  console.log(`代表性建筑数: ${selected.length}`)
  
  const decadeStats = {}
  selected.forEach(building => {
    const year = building.parsedYear
    let decade = ''
    if (year < 0) {
      decade = `前${Math.abs(year)}年`
    } else if (year < 1000) {
      decade = `${Math.floor(year/100)*100}年代`
    } else {
      decade = `${Math.floor(year/100)*100}-${Math.floor(year/100)*100+99}年`
    }
    decadeStats[decade] = (decadeStats[decade] || 0) + 1
  })
  
  console.log(`\n按时期统计:`)
  Object.keys(decadeStats).forEach(decade => {
    console.log(`  ${decade}: ${decadeStats[decade]} 个`)
  })
  
  console.log('\n代表性建筑列表:')
  selected.forEach((building, index) => {
    console.log(`${index + 1}. ${building.name} | ${building.dynasty || '未知'} | ${building.year} | ${building.province} | ${building.type}`)
  })
}

main()