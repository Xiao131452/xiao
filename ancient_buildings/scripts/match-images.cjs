const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_with_images.json')
const logFile = path.join(__dirname, '..', 'scripts', 'image-matching-log.txt')

const FAMOUS_BUILDING_IMAGES = {
  '故宫': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  '天坛': 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800',
  '颐和园': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '圆明园': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '长城': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  '布达拉宫': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '大雁塔': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
  '小雁塔': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
  '应县木塔': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
  '赵州桥': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',
  '都江堰': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '兵马俑': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '白马寺': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '少林寺': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '灵隐寺': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '寒山寺': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '乐山大佛': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '云冈石窟': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '龙门石窟': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '莫高窟': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '拙政园': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '留园': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '网师园': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '狮子林': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '豫园': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '晋祠': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',
  '孔庙': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '孔府': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '孔林': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '武侯祠': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '杜甫草堂': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '岳阳楼': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '黄鹤楼': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '滕王阁': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '鹳雀楼': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '蓬莱阁': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '大观楼': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '钟鼓楼': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '天一阁': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '文渊阁': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '藏书楼': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古城墙': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古城门': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古桥': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',
  '古塔': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
  '古寺': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古庙': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古观': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古祠': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古衙': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古县衙': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古书院': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古戏台': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古牌坊': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古亭': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古楼': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古阁': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古殿': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古宫': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  '古苑': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '古园': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '古宅': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古民居': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古街': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古巷': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古镇': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '古村': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '古城': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古遗址': 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800',
  '古墓': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古墓葬': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '石窟': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '石刻': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '摩崖石刻': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '石窟寺': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '壁画': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '彩塑': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
}

const TYPE_IMAGES = {
  '宫殿': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  '寺': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '庙': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '塔': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
  '园林': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '古建筑': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',
  '古遗址': 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800',
  '古村': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '古镇': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '古城': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '石窟寺及石刻': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古墓葬': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古街': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '世界文化遗产': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  '近现代重要史迹及代表性建筑': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',
  'default': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
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
  
  for (const [keyword, imageUrl] of Object.entries(FAMOUS_BUILDING_IMAGES)) {
    if (name.includes(keyword)) {
      log(`  ✓ 精确匹配: "${keyword}" -> ${imageUrl.substring(0, 50)}...`)
      return imageUrl
    }
  }
  
  const type = building.type || 'default'
  
  if (TYPE_IMAGES[type]) {
    log(`  ✓ 类型匹配: "${type}" -> ${TYPE_IMAGES[type].substring(0, 50)}...`)
    return TYPE_IMAGES[type]
  }
  
  for (const [keyword, imageUrl] of Object.entries(TYPE_IMAGES)) {
    if (name.includes(keyword)) {
      log(`  ✓ 名称包含类型: "${keyword}" -> ${imageUrl.substring(0, 50)}...`)
      return imageUrl
    }
  }
  
  log(`  ✗ 使用默认图片`)
  return TYPE_IMAGES['default']
}

function main() {
  console.log('开始为古建筑数据匹配图片...\n')
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  const total = data.length
  
  log(`总共有 ${total} 个建筑需要处理`)
  log(`开始时间: ${new Date().toLocaleString()}\n`)
  
  let exactMatchCount = 0
  let typeMatchCount = 0
  let defaultCount = 0
  let skippedCount = 0
  
  for (let i = 0; i < data.length; i++) {
    const building = data[i]
    
    log(`[${i + 1}/${total}] ${building.name}`)
    
    if (building.image && building.image.startsWith('http')) {
      log(`  已有图片，跳过`)
      skippedCount++
      continue
    }
    
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
  log(`跳过已有图片: ${skippedCount} 个`)
  log(`结束时间: ${new Date().toLocaleString()}`)
  log(`输出文件: ${outputFile}`)
  
  console.log('\n处理完成！')
  console.log(`精确匹配: ${exactMatchCount} 个`)
  console.log(`类型匹配: ${typeMatchCount} 个`)
  console.log(`默认图片: ${defaultCount} 个`)
  console.log(`跳过已有图片: ${skippedCount} 个`)
  console.log(`输出文件: ${outputFile}`)
  console.log(`日志文件: ${logFile}`)
  
  logStream.end()
}

main()