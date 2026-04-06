const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', '文保等数据')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')

const files = [
  '2020年全国重点文保单位空间分布数据\\2020全国文保单位.xlsx',
  '中国世界文化遗产名录​​.xlsx',
  '中国历史文化名镇名单​​.xlsx',
  '中国历史文化名村名单​​.xlsx',
  '中国历史文化名城名单​​.xlsx',
  '中国历史文化名街名单​​.xlsx'
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

function parseAddress(address) {
  const result = {
    province: '未知',
    city: '未知'
  }
  
  if (!address) return result
  
  const provinceMatch = address.match(/(北京|天津|上海|重庆|河北|山西|辽宁|吉林|黑龙江|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|海南|四川|贵州|云南|陕西|甘肃|青海|台湾|内蒙古|广西|西藏|宁夏|新疆|香港|澳门)(省|市|自治区|特别行政区)/)
  if (provinceMatch) {
    result.province = provinceMatch[1] + (provinceMatch[2] || '')
  }
  
  const cityMatch = address.match(/(.*?省|.*?自治区|.*?特别行政区)(.*?市|.*?县|.*?区)/)
  if (cityMatch) {
    result.city = cityMatch[2]
  }
  
  return result
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

function extractBuildingInfo(data, fileName, existingBuildingsMap) {
  const buildings = []
  
  data.forEach((row, index) => {
    let name = null
    let province = null
    let city = null
    let dynasty = null
    let type = null
    let year = null
    let yearNum = null
    let description = null
    let coordinates = [0, 0]
    
    Object.keys(row).forEach(key => {
      const value = row[key]
      if (!value) return
      
      const keyLower = key.toLowerCase()
      
      if (keyLower.includes('名称') || keyLower.includes('名') || keyLower.includes('遗产地') || keyLower.includes('收藏单位') || key === 'name') {
        name = String(value).trim()
      } else if (keyLower.includes('省')) {
        province = String(value).trim()
      } else if (keyLower.includes('市') || keyLower.includes('县') || keyLower.includes('区')) {
        city = String(value).trim()
      } else if (keyLower.includes('朝代') || keyLower.includes('年代') || keyLower.includes('时期') || key === 'age') {
        dynasty = String(value).trim()
        yearNum = parseYear(String(value))
        if (yearNum) {
          year = `${yearNum < 0 ? '公元前' + Math.abs(yearNum) : yearNum}年`
        }
      } else if (keyLower.includes('类型') || keyLower.includes('类别') || keyLower.includes('性质') || key === 'type') {
        type = String(value).trim()
      } else if (keyLower.includes('年') || keyLower.includes('时间') || keyLower.includes('列入时间')) {
        if (!yearNum) {
          yearNum = parseYear(String(value))
          if (yearNum) {
            year = `${yearNum < 0 ? '公元前' + Math.abs(yearNum) : yearNum}年`
          }
        }
      } else if (keyLower.includes('描述') || keyLower.includes('简介') || keyLower.includes('说明') || key === 'remark') {
        description = String(value).trim()
      } else if ((keyLower.includes('经度') && !keyLower.includes('纬度')) || key === '经度84') {
        coordinates[0] = parseFloat(value)
      } else if (keyLower.includes('纬度') || key === '纬度84') {
        coordinates[1] = parseFloat(value)
      } else if (key === 'add') {
        const addressInfo = parseAddress(String(value))
        if (!province) province = addressInfo.province
        if (!city) city = addressInfo.city
      }
    })
    
    if (!name) return
    
    if (existingBuildingsMap.has(name)) {
      const existing = existingBuildingsMap.get(name)
      dynasty = existing.dynasty
      year = existing.year
      yearNum = existing.yearNum
      type = existing.type
    }
    
    if (!yearNum) {
      yearNum = 1900
      year = '清代'
    }
    
    if (!dynasty) {
      dynasty = '清'
    }
    
    if (!type) {
      if (fileName.includes('名镇')) {
        type = '古镇'
      } else if (fileName.includes('名村')) {
        type = '古村'
      } else if (fileName.includes('名城')) {
        type = '古城'
      } else if (fileName.includes('名街')) {
        type = '古街'
      } else if (fileName.includes('世界文化遗产')) {
        type = '世界文化遗产'
      } else {
        type = '古建筑'
      }
    }
    
    buildings.push({
      id: buildings.length + 1,
      name: name,
      province: province || '未知',
      city: city || '未知',
      dynasty: dynasty,
      type: type,
      year: year,
      yearNum: yearNum,
      coordinates: coordinates,
      status: '保存完好',
      description: description || '古建筑',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
      source: fileName
    })
  })
  
  return buildings
}

async function main() {
  console.log('开始处理文保数据文件...')
  console.log('数据目录:', dataDir)
  
  let allBuildings = []
  
  const existingFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
  let existingBuildings = []
  let existingBuildingsMap = new Map()
  
  if (fs.existsSync(existingFile)) {
    try {
      const existingData = fs.readFileSync(existingFile, 'utf-8')
      existingBuildings = JSON.parse(existingData)
      console.log(`\n现有数据库中有 ${existingBuildings.length} 个建筑`)
      
      existingBuildings.forEach(building => {
        existingBuildingsMap.set(building.name, building)
      })
    } catch (error) {
      console.error('读取现有数据库失败:', error.message)
    }
  }
  
  files.forEach(file => {
    const filePath = path.join(dataDir, file)
    console.log(`\n处理文件: ${file}`)
    
    if (fs.existsSync(filePath)) {
      const data = readExcelFile(filePath)
      console.log(`  读取到 ${data.length} 条记录`)
      
      const buildings = extractBuildingInfo(data, file, existingBuildingsMap)
      console.log(`  提取出建筑: ${buildings.length} 条`)
      
      allBuildings = allBuildings.concat(buildings)
    } else {
      console.log(`  文件不存在，跳过`)
    }
  })
  
  console.log(`\n总共提取出 ${allBuildings.length} 个古建筑`)
  
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
    
    const byType = {}
    uniqueBuildings.forEach(b => {
      if (!byType[b.type]) byType[b.type] = 0
      byType[b.type]++
    })
    console.log(`\n按类型统计:`)
    Object.keys(byType).forEach(type => {
      console.log(`  ${type}: ${byType[type]} 个`)
    })
    
  } catch (error) {
    console.error('保存文件失败:', error.message)
  }
}

main().catch(error => {
  console.error('处理失败:', error)
  process.exit(1)
})