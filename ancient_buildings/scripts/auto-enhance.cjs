const axios = require('axios')
const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_enhanced.json')
const progressFile = path.join(__dirname, '..', 'scripts', 'enhancement-progress.json')

const BAIKE_API = 'https://baike.baidu.com/api/openapi/BaikeLemmaCardApi'

function parseYearFromText(text) {
  if (!text) return null
  
  const patterns = [
    /(\d+)年/,
    /(\d+)世纪/,
    /公元前(\d+)年/,
    /公元(\d+)年/,
    /建于(\d+)/,
    /始建于(\d+)/,
    /(\d+)年代/
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      let year = parseInt(match[1])
      if (text.includes('公元前')) {
        year = -year
      }
      return year
    }
  }
  
  return null
}

function parseDynastyFromText(text) {
  if (!text) return null
  
  const dynasties = [
    '夏', '商', '周', '西周', '东周', '春秋', '战国', '秦', '汉', '西汉', '东汉', '三国', '晋', '西晋', '东晋', 
    '南北朝', '南朝', '北朝', '隋', '唐', '五代十国', '五代', '十国', '宋', '北宋', '南宋', '辽', '金', '西夏', 
    '元', '明', '清', '中华民国', '民国'
  ]
  
  for (const dynasty of dynasties) {
    if (text.includes(dynasty)) {
      return dynasty
    }
  }
  
  return null
}

function extractDescriptionFromText(text) {
  if (!text) return null
  
  const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 10)
  
  if (sentences.length > 0) {
    return sentences[0].trim()
  }
  
  return text.substring(0, 100)
}

async function searchBaike(keyword) {
  try {
    const response = await axios.get(BAIKE_API, {
      params: {
        scope: 103,
        format: 'json',
       appid: 379020,
        bk_key: keyword,
        bk_length: 600
      },
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (response.data && response.data.data) {
      return {
        title: response.data.data.title || '',
        summary: response.data.data.summary || '',
        card: response.data.data.card || []
      }
    }
    
    return null
  } catch (error) {
    console.log(`  搜索失败: ${error.message}`)
    return null
  }
}

async function enhanceBuilding(building, index, total) {
  const enhanced = { ...building }
  
  console.log(`\n[${index + 1}/${total}] 处理: ${building.name}`)
  
  const needsInfo = 
    !building.dynasty || 
    building.dynasty === '未知' || 
    !building.year || 
    building.year === '清代' || 
    !building.description || 
    building.description === '古建筑'
  
  if (!needsInfo) {
    console.log('  信息完整，跳过')
    return enhanced
  }
  
  console.log('  搜索百度百科...')
  const baikeResult = await searchBaike(building.name)
  
  if (baikeResult) {
    console.log('  找到百度百科信息')
    
    if (!enhanced.dynasty || enhanced.dynasty === '未知') {
      const dynasty = parseDynastyFromText(baikeResult.summary || baikeResult.title || '')
      if (dynasty) {
        enhanced.dynasty = dynasty
        console.log(`  朝代: ${dynasty}`)
      }
    }
    
    if (!enhanced.year || enhanced.year === '清代') {
      const year = parseYearFromText(baikeResult.summary || baikeResult.title || '')
      if (year) {
        enhanced.year = `${year < 0 ? '公元前' + Math.abs(year) : year}年`
        enhanced.yearNum = year
        console.log(`  年份: ${enhanced.year}`)
      }
    }
    
    if (!enhanced.description || enhanced.description === '古建筑') {
      const description = extractDescriptionFromText(baikeResult.summary || '')
      if (description) {
        enhanced.description = description
        console.log(`  描述: ${description.substring(0, 50)}...`)
      }
    }
    
    enhanced.baikeData = baikeResult
  } else {
    console.log('  未找到百度百科信息')
  }
  
  return enhanced
}

function loadProgress() {
  if (fs.existsSync(progressFile)) {
    try {
      const progress = JSON.parse(fs.readFileSync(progressFile, 'utf-8'))
      return progress
    } catch (error) {
      console.error('读取进度文件失败:', error.message)
    }
  }
  return { processed: 0, enhanced: 0, failed: 0, errors: [] }
}

function saveProgress(progress) {
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2), 'utf-8')
}

function saveEnhancedData(data) {
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf-8')
}

async function main() {
  console.log('开始增强古建筑数据...\n')
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  console.log(`总共 ${data.length} 个古建筑\n`)
  
  const progress = loadProgress()
  console.log(`已处理: ${progress.processed} 个`)
  console.log(`已增强: ${progress.enhanced} 个`)
  console.log(`失败: ${progress.failed} 个\n`)
  
  const buildingsToEnhance = data.filter(b => 
    !b.dynasty || 
    b.dynasty === '未知' || 
    !b.year || 
    b.year === '清代' || 
    !b.description || 
    b.description === '古建筑'
  )
  
  console.log(`需要补充信息的建筑: ${buildingsToEnhance.length} 个`)
  console.log(`信息完整的建筑: ${data.length - buildingsToEnhance.length} 个\n`)
  
  const startIndex = progress.processed
  const batchSize = 10
  const buildingsToProcess = buildingsToEnhance.slice(startIndex, startIndex + batchSize)
  
  console.log(`本次处理: ${buildingsToProcess.length} 个建筑 (从第 ${startIndex + 1} 个开始)\n`)
  
  let enhancedCount = 0
  let failedCount = 0
  
  for (let i = 0; i < buildingsToProcess.length; i++) {
    try {
      const building = buildingsToProcess[i]
      const enhanced = await enhanceBuilding(building, startIndex + i, buildingsToEnhance.length)
      
      if (enhanced.dynasty && enhanced.dynasty !== '未知') {
        enhancedCount++
      }
      
      data[startIndex + i] = enhanced
      
      progress.processed = startIndex + i + 1
      progress.enhanced += enhancedCount
      progress.failed += failedCount
      
      saveProgress(progress)
      saveEnhancedData(data)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.log(`  处理失败: ${error.message}`)
      failedCount++
      progress.errors.push({
        name: buildingsToProcess[i].name,
        error: error.message
      })
    }
  }
  
  console.log(`\n本次处理完成！`)
  console.log(`增强: ${enhancedCount} 个`)
  console.log(`失败: ${failedCount} 个`)
  console.log(`累计处理: ${progress.processed}/${buildingsToEnhance.length} 个`)
  
  if (progress.processed < buildingsToEnhance.length) {
    console.log(`\n还有 ${buildingsToEnhance.length - progress.processed} 个建筑需要处理`)
    console.log('请再次运行此脚本继续处理')
  } else {
    console.log('\n所有建筑处理完成！')
  }
}

main().catch(error => {
  console.error('处理失败:', error)
  process.exit(1)
})