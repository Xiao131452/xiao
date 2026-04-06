const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', '..', '文保等数据')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')

const files = [
  '2020年全国重点文保单位空间分布数据\\2020全国文保单位.xlsx',
  '革命文物保护利用片区分县名单（第一批）​​.xlsx',
  '全国博物馆名录​​.xlsx',
  '中国历史文化名镇名单​​.xlsx',
  '中国历史文化名街名单​​.xlsx',
  '中国历史文化名村名单​​.xlsx',
  '中国历史文化名城名单​​.xlsx',
  '中国世界文化遗产名录​​.xlsx'
]

function parseYear(yearStr) {
  if (!yearStr) return null
  
  yearStr = yearStr.replace('年', '').replace('公元前', '-').replace('公元', '').trim()
  
  if (yearStr.includes('重建')) {
    const match = yearStr.match(/(\d+)/)
    if (match) return parseInt(match[1])
  }
  
  const year = parseInt(yearStr)
  return isNaN(year) ? null : year
}

function isBefore1911(year) {
  if (!year) return false
  return year < 1911
}

function readExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)
    return data
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error.message)
    return []
  }
}

function extractBuildingInfo(data) {
  const buildings = []
  
  data.forEach((row, index) => {
    let name = null
    let province = null
    let city = null
    let dynasty = null
    let type = null
    let year = null
    let description = null
    
    Object.keys(row).forEach(key => {
      const value = row[key]
      if (!value) return
      
      const keyLower = key.toLowerCase()
      
      if (keyLower.includes('名称') || keyLower.includes('名')) {
        name = String(value).trim()
      } else if (keyLower.includes('省')) {
        province = String(value).trim()
      } else if (keyLower.includes('市') || keyLower.includes('县') || keyLower.includes('区')) {
        city = String(value).trim()
      } else if (keyLower.includes('朝代') || keyLower.includes('年代') || keyLower.includes('时期')) {
        dynasty = String(value).trim()
      } else if (keyLower.includes('类型') || keyLower.includes('类别')) {
        type = String(value).trim()
      } else if (keyLower.includes('年') || keyLower.includes('时间')) {
        year = parseYear(String(value))
      } else if (keyLower.includes('描述') || keyLower.includes('简介') || keyLower.includes('说明')) {
        description = String(value).trim()
      }
    })
    
    if (name && year && isBefore1911(year)) {
      buildings.push({
        id: buildings.length + 1,
        name: name,
        province: province || '未知',
        city: city || '未知',
        dynasty: dynasty || '未知',
        type: type || '古建筑',
        year: `${year < 0 ? '公元前' + Math.abs(year) : year}年`,
        yearNum: year,
        coordinates: [0, 0],
        status: '保存完好',
        description: description || '古建筑',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
        source: row
      })
    }
  })
  
  return buildings
}

async function main() {
  console.log('开始处理文保数据文件...')
  console.log('数据目录:', dataDir)
  
  let allBuildings = []
  
  files.forEach(file => {
    const filePath = path.join(dataDir, file)
    console.log(`\n处理文件: ${file}`)
    
    if (fs.existsSync(filePath)) {
      const data = readExcelFile(filePath)
      console.log(`  读取到 ${data.length} 条记录`)
      
      const buildings = extractBuildingInfo(data)
      console.log(`  筛选出 1911年以前的建筑: ${buildings.length} 条`)
      
      allBuildings = allBuildings.concat(buildings)
    } else {
      console.log(`  文件不存在，跳过`)
    }
  })
  
  console.log(`\n总共筛选出 ${allBuildings.length} 个古建筑`)
  
  const existingFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
  let existingBuildings = []
  
  if (fs.existsSync(existingFile)) {
    try {
      const existingData = fs.readFileSync(existingFile, 'utf-8')
      existingBuildings = JSON.parse(existingData)
      console.log(`\n现有数据库中有 ${existingBuildings.length} 个建筑`)
    } catch (error) {
      console.error('读取现有数据库失败:', error.message)
    }
  }
  
  const mergedBuildings = [...existingBuildings, ...allBuildings]
  
  const uniqueBuildings = []
  const seenNames = new Set()
  
  mergedBuildings.forEach(building => {
    if (!seenNames.has(building.name)) {
      seenNames.add(building.name)
      uniqueBuildings.push(building)
    }
  })
  
  console.log(`\n合并后去重，共有 ${uniqueBuildings.length} 个古建筑`)
  
  const maxId = Math.max(...uniqueBuildings.map(b => b.id), 0)
  uniqueBuildings.forEach((building, index) => {
    building.id = maxId + index + 1
  })
  
  const outputData = JSON.stringify(uniqueBuildings, null, 2)
  
  try {
    fs.writeFileSync(outputFile, outputData, 'utf-8')
    console.log(`\n✓ 数据已保存到: ${outputFile}`)
    console.log(`✓ 总共 ${uniqueBuildings.length} 个古建筑`)
  } catch (error) {
    console.error('保存文件失败:', error.message)
  }
}

main().catch(error => {
  console.error('处理失败:', error)
  process.exit(1)
})