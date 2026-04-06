const fs = require('fs')
const path = require('path')

const originalFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const timelineFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_timeline.json')

const PRIORITY_KEYWORDS = [
  '故宫', '天坛', '颐和园', '长城', '布达拉宫', '大雁塔', '小雁塔', '应县木塔',
  '赵州桥', '都江堰', '兵马俑', '白马寺', '少林寺', '寒山寺', '灵隐寺', '法门寺',
  '乐山大佛', '云冈石窟', '龙门石窟', '莫高窟', '拙政园', '留园', '网师园', '狮子林',
  '豫园', '晋祠', '孔庙', '孔府', '孔林', '武侯祠', '杜甫草堂', '岳阳楼', '黄鹤楼',
  '滕王阁', '钟鼓楼', '天一阁', '平遥古城', '丽江古城', '凤凰古城',
  '周庄', '乌镇', '西塘', '同里', '宏村', '西递',
  '永宁寺塔', '嵩岳寺塔', '登封观星台', '开封铁塔', '料敌塔',
  '白鹿洞书院', '岳麓书院', '应天府书院', '嵩阳书院',
  '曲阜三孔', '明孝陵', '北京十三陵', '明十三陵',
  '永乐宫', '南禅寺', '佛光寺', '华严寺', '善化寺',
  '保国寺', '天台山国清寺', '大明寺', '隆兴寺', '独乐寺', '安阳文峰塔',
  '稷益庙', '平遥文庙', '晋城玉皇庙', '高平开化寺', '镇国寺',
  '五台山', '峨眉山', '普陀山', '九华山', '武当山', '青城山', '齐云山',
  '三清山', '武夷山', '庐山', '黄山', '泰山', '华山', '衡山', '恒山', '嵩山',
  '昭君墓', '苏武墓', '张骞墓', '班固墓', '司马迁墓', '霍去病墓',
  '岳阳楼', '藤王阁', '鹳雀楼', '蓬莱阁', '大观楼',
  '避暑山庄', '圆明园', '清东陵', '清西陵', '明显陵', '成吉思汗陵',
  '阿房宫', '未央宫', '大明宫', '太极宫', '兴庆宫',
  '西安城墙', '南京城墙', '平遥城墙', '丽江古城墙', '凤凰古城墙',
  '赵城', '凤阳古城', '南京古城', '西安古城', '平遥古城', '大理古城',
  '吐鲁番', '高昌故城', '交河故城', '楼兰古城', '龟兹古城',
  '永泰公主墓', '懿德太子墓', '章怀太子墓', '乾陵', '昭陵', '茂陵',
  '辽阳壁画墓', '马王堆汉墓', '南海西沙水下文化遗产',
  '福建土楼', '开平碉楼', '哈尼梯田', '红河哈尼梯田',
  '丝绸之路', '大运河', '茶马古道',
  '大三巴', '妈阁庙', '郑家大屋', '圣索菲亚教堂', '中央大街',
  '古琴台', '琴台', '俞伯牙钟子期',
  '黄鹤楼', '晴川阁', '古琴台', '木兰山', '道教圣地',
  '道教', '佛教', '伊斯兰教', '基督教', '天主教',
  '清真寺', '教堂', '寺庙', '道观', '宫观',
  '南禅寺', '佛光寺', '广仁寺', '大昭寺', '小昭寺', '布达拉宫', '罗布林卡',
  '大慈寺', '文殊院', '宝光寺', '昭觉寺', '草堂寺',
  '金山寺', '普济寺', '法雨寺', '慧济寺', '南海禅寺',
  '悬空寺', '恒山悬空寺', '应县净土寺', '永安寺', '崇福寺',
  '兰州黄河桥梁', '黄河铁桥', '中山桥',
  '古代', '近代', '民国', '清代', '明代', '元代', '宋代', '唐代', '隋代', '南北朝'
]

const PREFERRED_TYPES = [
  '宫殿', '寺庙', '古塔', '园林', '石窟', '古桥', '城墙', '古墓', '书院', '祠堂', '楼阁', '古街', '古城'
]

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

function getScore(building) {
  let score = 0
  const name = building.name || ''
  const type = building.type || ''
  
  PRIORITY_KEYWORDS.forEach(keyword => {
    if (name.includes(keyword)) {
      score += 100
      if (name === keyword) score += 50
    }
  })
  
  PREFERRED_TYPES.forEach(t => {
    if (type.includes(t)) score += 20
  })
  
  if (building.description && building.description.length > 50) {
    score += 10
  }
  
  const year = parseYear(building.year)
  if (year < 0) score += 30
  else if (year < 500) score += 20
  else if (year < 1000) score += 15
  else if (year < 1500) score += 10
  
  return score
}

function main() {
  console.log('开始筛选代表性古建筑...\n')
  
  const data = JSON.parse(fs.readFileSync(originalFile, 'utf-8'))
  console.log(`原始建筑数: ${data.length}`)
  
  const candidates = data
    .filter(b => {
      const year = parseYear(b.year)
      return year > 0 && year < 1911
    })
    .map(b => ({ ...b, score: getScore(b) }))
    .filter(b => b.score > 0)
    .sort((a, b) => b.score - a.score)
  
  const selected = []
  const usedNames = new Set()
  
  for (const building of candidates) {
    if (selected.length >= 60) break
    
    const name = building.name
    let isDuplicate = false
    
    for (const used of usedNames) {
      if (name.includes(used) || used.includes(name)) {
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
    const yearA = parseYear(a.year)
    const yearB = parseYear(b.year)
    return yearA - yearB
  })
  
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
    console.log(`${index + 1}. ${building.name} | ${building.dynasty} | ${building.year} | ${building.province} | ${building.type}`)
  })
}

main()