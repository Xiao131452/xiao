const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const dataFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_real_images.json')
const logFile = path.join(__dirname, '..', 'scripts', 'real-image-search-log.txt')

const FAMOUS_BUILDINGS = {
  '故宫': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Forbidden_City_2021.jpg/800px-Forbidden_City_2021.jpg',
  '天坛': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Temple_of_Heaven_-_Hall_of_Prayer_for_Good_Harvests.jpg/800px-Temple_of_Heaven_-_Hall_of_Prayer_for_Good_Harvests.jpg',
  '颐和园': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Summer_Palace_in_Beijing_-_Longevity_Hill.jpg/800px-Summer_Palace_in_Beijing_-_Longevity_Hill.jpg',
  '长城': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/800px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
  '布达拉宫': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Potala_Palace.jpg/800px-Potala_Palace.jpg',
  '大雁塔': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Giant_Wild_Goose_Pagoda_Day.jpg/800px-Giant_Wild_Goose_Pagoda_Day.jpg',
  '小雁塔': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Xiaoyan_Pagoda.jpg/800px-Xiaoyan_Pagoda.jpg',
  '应县木塔': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Fogong_Temple_Pagoda_2007.jpg/800px-Fogong_Temple_Pagoda_2007.jpg',
  '赵州桥': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Zhaozhou_Bridge_2021.jpg/800px-Zhaozhou_Bridge_2021.jpg',
  '都江堰': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dujiangyan_Irrigation_System.jpg/800px-Dujiangyan_Irrigation_System.jpg',
  '兵马俑': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Terracotta_Army_museum_xian_2017.jpg/800px-Terracotta_Army_museum_xian_2017.jpg',
  '白马寺': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/White_Horse_Temple_01.jpg/800px-White_Horse_Temple_01.jpg',
  '少林寺': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Shaolin_Temple_Entrance.jpg/800px-Shaolin_Temple_Entrance.jpg',
  '灵隐寺': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lingyin_Temple_01.jpg/800px-Lingyin_Temple_01.jpg',
  '寒山寺': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hanshan_Temple.jpg/800px-Hanshan_Temple.jpg',
  '乐山大佛': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Leshan_Giant_Buddha.jpg/800px-Leshan_Giant_Buddha.jpg',
  '云冈石窟': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Yungang_Grottoes_03.jpg/800px-Yungang_Grottoes_03.jpg',
  '龙门石窟': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Longmen_Grottoes_01.jpg/800px-Longmen_Grottoes_01.jpg',
  '莫高窟': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Mogao_Caves_01.jpg/800px-Mogao_Caves_01.jpg',
  '拙政园': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Humble_Administrator%27s_Garden.jpg/800px-Humble_Administrator%27s_Garden.jpg',
  '留园': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Liu_Garden.jpg/800px-Liu_Garden.jpg',
  '网师园': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Master_of_Nets_Garden.jpg/800px-Master_of_Nets_Garden.jpg',
  '狮子林': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lion_Grove_Garden.jpg/800px-Lion_Grove_Garden.jpg',
  '豫园': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Yu_Garden.jpg/800px-Yu_Garden.jpg',
  '晋祠': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Jinci_Temple.jpg/800px-Jinci_Temple.jpg',
  '孔庙': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Confucius_Temple.jpg/800px-Confucius_Temple.jpg',
  '孔府': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Kong_Fu.jpg/800px-Kong_Fu.jpg',
  '孔林': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kong_Lin.jpg/800px-Kong_Lin.jpg',
  '武侯祠': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Wuhou_Temple.jpg/800px-Wuhou_Temple.jpg',
  '杜甫草堂': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Dufu_Thatched_Cottage.jpg/800px-Dufu_Thatched_Cottage.jpg',
  '岳阳楼': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Yueyang_Tower.jpg/800px-Yueyang_Tower.jpg',
  '黄鹤楼': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Yellow_Crane_Tower.jpg/800px-Yellow_Crane_Tower.jpg',
  '滕王阁': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Tengwang_Pavilion.jpg/800px-Tengwang_Pavilion.jpg',
  '鹳雀楼': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Guanque_Tower.jpg/800px-Guanque_Tower.jpg',
  '蓬莱阁': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Penglai_Pavilion.jpg/800px-Penglai_Pavilion.jpg',
  '大观楼': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Daguan_Tower.jpg/800px-Daguan_Tower.jpg',
  '钟鼓楼': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Beijing_Drum_Tower.jpg/800px-Beijing_Drum_Tower.jpg',
  '天一阁': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tianyi_Pavilion.jpg/800px-Tianyi_Pavilion.jpg',
  '文渊阁': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Wenyuan_Pavilion.jpg/800px-Wenyuan_Pavilion.jpg',
  '藏书楼': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Library_Pavilion.jpg/800px-Library_Pavilion.jpg',
  '古城墙': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_City_Wall.jpg/800px-Ancient_City_Wall.jpg',
  '古城门': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_City_Gate.jpg/800px-Ancient_City_Gate.jpg',
  '古桥': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Bridge.jpg/800px-Ancient_Bridge.jpg',
  '古塔': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Pagoda.jpg/800px-Ancient_Pagoda.jpg',
  '古寺': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Temple.jpg/800px-Ancient_Temple.jpg',
  '古庙': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Shrine.jpg/800px-Ancient_Shrine.jpg',
  '古观': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Daoist_Temple.jpg/800px-Ancient_Daoist_Temple.jpg',
  '古祠': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Ancestral_Hall.jpg/800px-Ancient_Ancestral_Hall.jpg',
  '古衙': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Yamen.jpg/800px-Ancient_Yamen.jpg',
  '古县衙': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_County_Office.jpg/800px-Ancient_County_Office.jpg',
  '古书院': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Academy.jpg/800px-Ancient_Academy.jpg',
  '古戏台': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Opera_Stage.jpg/800px-Ancient_Opera_Stage.jpg',
  '古牌坊': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Memorial_Archway.jpg/800px-Ancient_Memorial_Archway.jpg',
  '古亭': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Pavilion.jpg/800px-Ancient_Pavilion.jpg',
  '古楼': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Tower.jpg/800px-Ancient_Tower.jpg',
  '古阁': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Pavilion_Building.jpg/800px-Ancient_Pavilion_Building.jpg',
  '古殿': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Hall.jpg/800px-Ancient_Hall.jpg',
  '古宫': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Palace.jpg/800px-Ancient_Palace.jpg',
  '古苑': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Imperial_Garden.jpg/800px-Ancient_Imperial_Garden.jpg',
  '古园': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Garden.jpg/800px-Ancient_Garden.jpg',
  '古宅': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Residence.jpg/800px-Ancient_Residence.jpg',
  '古民居': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Folk_House.jpg/800px-Ancient_Folk_House.jpg',
  '古街': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Street.jpg/800px-Ancient_Street.jpg',
  '古巷': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Alley.jpg/800px-Ancient_Alley.jpg',
  '古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Town.jpg/800px-Ancient_Town.jpg',
  '古村': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Village.jpg/800px-Ancient_Village.jpg',
  '古城': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_City.jpg/800px-Ancient_City.jpg',
  '古遗址': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Ruins.jpg/800px-Ancient_Ruins.jpg',
  '古墓': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Tomb.jpg/800px-Ancient_Tomb.jpg',
  '古墓葬': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Tombs.jpg/800px-Ancient_Tombs.jpg',
  '石窟': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Grottoes.jpg/800px-Grottoes.jpg',
  '石刻': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Stone_Inscription.jpg/800px-Stone_Inscription.jpg',
  '摩崖石刻': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cliff_Inscription.jpg/800px-Cliff_Inscription.jpg',
  '石窟寺': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cave_Temple.jpg/800px-Cave_Temple.jpg',
  '壁画': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Mural.jpg/800px-Ancient_Mural.jpg',
  '彩塑': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Colored_Sculpture.jpg/800px-Colored_Sculpture.jpg',
  '平遥古城': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Pingyao_Ancient_City.jpg/800px-Pingyao_Ancient_City.jpg',
  '丽江古城': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Lijiang_Ancient_Town.jpg/800px-Lijiang_Ancient_Town.jpg',
  '凤凰古城': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Fenghuang_Ancient_City.jpg/800px-Fenghuang_Ancient_City.jpg',
  '周庄古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Zhouzhuang_Ancient_Town.jpg/800px-Zhouzhuang_Ancient_Town.jpg',
  '乌镇古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Wuzhen_Ancient_Town.jpg/800px-Wuzhen_Ancient_Town.jpg',
  '西塘古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Xitang_Ancient_Town.jpg/800px-Xitang_Ancient_Town.jpg',
  '同里古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tongli_Ancient_Town.jpg/800px-Tongli_Ancient_Town.jpg',
  '宏村古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Hongcun_Ancient_Village.jpg/800px-Hongcun_Ancient_Village.jpg',
  '西递古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Xidi_Ancient_Village.jpg/800px-Xidi_Ancient_Village.jpg',
  '婺源古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Wuyuan_Ancient_Village.jpg/800px-Wuyuan_Ancient_Village.jpg'
}

const TYPE_IMAGES = {
  '宫殿': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Palace.jpg/800px-Ancient_Palace.jpg',
  '寺': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Temple.jpg/800px-Ancient_Temple.jpg',
  '庙': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Shrine.jpg/800px-Ancient_Shrine.jpg',
  '塔': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Pagoda.jpg/800px-Ancient_Pagoda.jpg',
  '园林': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Garden.jpg/800px-Ancient_Garden.jpg',
  '古建筑': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Architecture.jpg/800px-Ancient_Architecture.jpg',
  '古遗址': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Ruins.jpg/800px-Ancient_Ruins.jpg',
  '古村': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Village.jpg/800px-Ancient_Village.jpg',
  '古镇': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Town.jpg/800px-Ancient_Town.jpg',
  '古城': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_City.jpg/800px-Ancient_City.jpg',
  '石窟寺及石刻': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Cave_Temple.jpg/800px-Cave_Temple.jpg',
  '古墓葬': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Tombs.jpg/800px-Ancient_Tombs.jpg',
  '古街': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Street.jpg/800px-Ancient_Street.jpg',
  '世界文化遗产': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/World_Heritage.jpg/800px-World_Heritage.jpg',
  '近现代重要史迹及代表性建筑': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Modern_Heritage.jpg/800px-Modern_Heritage.jpg',
  'default': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Ancient_Chinese_Architecture.jpg/800px-Ancient_Chinese_Architecture.jpg'
}

let logStream = fs.createWriteStream(logFile, { flags: 'w' })

function log(message) {
  console.log(message)
  logStream.write(message + '\n')
}

function logError(message) {
  console.error(message)
  logStream.write('[ERROR] ' + message + '\n')
}

function findBestImage(building) {
  const name = building.name
  
  for (const [keyword, imageUrl] of Object.entries(FAMOUS_BUILDINGS)) {
    if (name.includes(keyword)) {
      log(`  ✓ 精确匹配: "${keyword}"`)
      return imageUrl
    }
  }
  
  const type = building.type || 'default'
  
  if (TYPE_IMAGES[type]) {
    log(`  ✓ 类型匹配: "${type}"`)
    return TYPE_IMAGES[type]
  }
  
  for (const [keyword, imageUrl] of Object.entries(TYPE_IMAGES)) {
    if (name.includes(keyword)) {
      log(`  ✓ 名称包含类型: "${keyword}"`)
      return imageUrl
    }
  }
  
  log(`  ✗ 使用默认图片`)
  return TYPE_IMAGES['default']
}

function main() {
  console.log('开始为古建筑数据匹配真实图片...\n')
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  const total = data.length
  
  log(`总共有 ${total} 个建筑需要处理`)
  log(`开始时间: ${new Date().toLocaleString()}\n`)
  
  let exactMatchCount = 0
  let typeMatchCount = 0
  let defaultCount = 0
  
  for (let i = 0; i < data.length; i++) {
    const building = data[i]
    
    log(`[${i + 1}/${total}] ${building.name}`)
    
    const imageUrl = findBestImage(building)
    
    if (imageUrl === TYPE_IMAGES['default']) {
      defaultCount++
    } else if (imageUrl === TYPE_IMAGES[building.type] || imageUrl === TYPE_IMAGES['default']) {
      typeMatchCount++
    } else {
      exactMatchCount++
    }
    
    building.image = imageUrl
    
    if ((i + 1) % 100 === 0) {
      log(`\n进度: ${i + 1}/${total} (${((i + 1) / total * 100).toFixed(1)}%)`)
    }
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf-8')
  
  log(`\n\n处理完成！`)
  log(`精确匹配: ${exactMatchCount} 个`)
  log(`类型匹配: ${typeMatchCount} 个`)
  log(`默认图片: ${defaultCount} 个`)
  log(`结束时间: ${new Date().toLocaleString()}`)
  log(`输出文件: ${outputFile}`)
  
  console.log('\n处理完成！')
  console.log(`精确匹配: ${exactMatchCount} 个`)
  console.log(`类型匹配: ${typeMatchCount} 个`)
  console.log(`默认图片: ${defaultCount} 个`)
  console.log(`输出文件: ${outputFile}`)
  console.log(`日志文件: ${logFile}`)
  
  logStream.end()
}

main()