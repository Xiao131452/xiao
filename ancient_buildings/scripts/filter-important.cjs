const fs = require('fs')
const path = require('path')

const originalFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const timelineFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_timeline.json')

const FAMOUS_BUILDINGS = [
  '故宫', '天坛', '颐和园', '圆明园', '长城', '布达拉宫', '大雁塔', '小雁塔',
  '应县木塔', '赵州桥', '都江堰', '兵马俑', '白马寺', '少林寺', '灵隐寺', '寒山寺',
  '乐山大佛', '云冈石窟', '龙门石窟', '莫高窟', '拙政园', '留园', '网师园', '狮子林',
  '豫园', '晋祠', '孔庙', '孔府', '孔林', '武侯祠', '杜甫草堂', '岳阳楼', '黄鹤楼',
  '滕王阁', '鹳雀楼', '蓬莱阁', '大观楼', '钟鼓楼', '天一阁', '平遥古城', '丽江古城',
  '凤凰古城', '周庄', '乌镇', '西塘', '同里', '宏村', '西递', '婺源',
  '永宁寺塔', '嵩岳寺塔', '登封观星台', '安阳文峰塔', '开封铁塔', '料敌塔', '景县开福寺塔',
  '崇福寺', '大善寺', '化成寺', '白鹿洞书院', '岳麓书院', '应天府书院', '嵩阳书院',
  '曲阜三孔', '南京明孝陵', '北京十三陵', '明显陵', '盛京三陵',
  '永乐宫', '永福寺', '南禅寺', '佛光寺', '华严寺', '善化寺', '大同华严寺',
  '保国寺', '宁波天童寺', '宁波阿育王寺', '武义延福寺', '天台山国清寺',
  '稷益庙', '平遥文庙', '晋城玉皇庙', '高平开化寺', 'Solution平遥镇国寺',
  '五台山', '峨眉山', '普陀山', '九华山', '武当山', '青城山', '龙虎山', '齐云山',
  '三清山', '武夷山', '庐山', '黄山', '泰山', '华山', '衡山', '恒山', '嵩山'
]

const PRIORITY_TYPES = [
  '世界文化遗产',
  '宫殿',
  '园林',
  '古塔',
  '古桥',
  '古寺',
  '古庙',
  '石窟',
  '古墓葬'
]

const PRIORITY_DYNASTIES = [
  '唐', '宋', '元', '明', '清', '隋', '汉', '秦', '周', '东汉', '辽', '金'
]

function isImportantBuilding(building) {
  if (FAMOUS_BUILDINGS.some(name => building.name.includes(name))) {
    return true
  }
  
  if (building.type && PRIORITY_TYPES.includes(building.type)) {
    return true
  }
  
  if (building.dynasty && PRIORITY_DYNASTIES.includes(building.dynasty)) {
    return true
  }
  
  if (building.description && building.description.length > 20) {
    return true
  }
  
  return false
}

function main() {
  console.log('开始筛选重要古建筑...\n')
  
  const data = JSON.parse(fs.readFileSync(originalFile, 'utf-8'))
  
  const importantBuildings = data.filter(building => {
    return isImportantBuilding(building)
  })
  
  importantBuildings.sort((a, b) => {
    const yearA = parseYear(a.year)
    const yearB = parseYear(b.year)
    return yearA - yearB
  })
  
  fs.writeFileSync(timelineFile, JSON.stringify(importantBuildings, null, 2), 'utf-8')
  
  console.log('筛选完成！')
  console.log(`原始建筑数: ${data.length}`)
  console.log(`保留重要建筑数: ${importantBuildings.length}`)
  console.log(`输出文件: ${timelineFile}`)
  
  const dynastyStats = {}
  importantBuildings.forEach(building => {
    const dynasty = building.dynasty || '未知'
    dynastyStats[dynasty] = (dynastyStats[dynasty] || 0) + 1
  })
  
  console.log(`\n按朝代统计:`)
  Object.entries(dynastyStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([dynasty, count]) => {
      console.log(`  ${dynasty}: ${count} 个`)
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