const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_enhanced.json')
const progressFile = path.join(__dirname, '..', 'scripts', 'enhancement-progress.json')

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

function createSearchQuery(building) {
  const location = building.province !== '未知' ? building.province : ''
  const city = building.city !== '未知' ? building.city : ''
  
  let query = building.name
  if (location) {
    query += ` ${location}`
  }
  if (city && city !== location) {
    query += ` ${city}`
  }
  
  return query
}

function needsEnhancement(building) {
  return !building.dynasty || 
         building.dynasty === '未知' || 
         !building.year || 
         building.year === '清代' || 
         !building.description || 
         building.description === '古建筑'
}

function enhanceBuildingFromSearchResult(building, searchResults) {
  const enhanced = { ...building }
  
  if (searchResults && searchResults.length > 0) {
    const firstResult = searchResults[0]
    
    if (!enhanced.dynasty || enhanced.dynasty === '未知') {
      const dynasty = parseDynastyFromText(firstResult.snippet || firstResult.title || '')
      if (dynasty) {
        enhanced.dynasty = dynasty
      }
    }
    
    if (!enhanced.year || enhanced.year === '清代') {
      const year = parseYearFromText(firstResult.snippet || firstResult.title || '')
      if (year) {
        enhanced.year = `${year < 0 ? '公元前' + Math.abs(year) : year}年`
        enhanced.yearNum = year
      }
    }
    
    if (!enhanced.description || enhanced.description === '古建筑') {
      const description = extractDescriptionFromText(firstResult.snippet || '')
      if (description) {
        enhanced.description = description
      }
    }
    
    enhanced.searchResults = searchResults
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

function createManualEnhancementGuide(buildings) {
  const guide = `# 古建筑信息补充指南

## 需要手动补充的建筑列表

总共有 ${buildings.length} 个建筑需要补充信息。

### 使用方法

对于每个建筑，请搜索以下信息并补充：

1. **朝代/年代**：建筑建造或始建的历史时期
2. **年份**：具体的建造年份（如果有的话）
3. **描述**：建筑的历史背景、特点、价值等

### 搜索建议

对于每个建筑，使用以下搜索关键词：
\`\`\`
建筑名称 + 省份 + 古建筑 历史 朝代
\`\`\`

例如：
- 故宫 北京 古建筑 历史 朝代
- 崇圣寺三塔 云南 古建筑 历史 朝代

### 建筑列表

${buildings.map((b, i) => `
#### ${i + 1}. ${b.name}

**当前信息：**
- 朝代：${b.dynasty || '未知'}
- 年份：${b.year || '未知'}
- 描述：${b.description || '未知'}
- 省份：${b.province}
- 城市：${b.city}

**建议搜索：** ${createSearchQuery(b)}

---

`).join('')}

### 批量处理建议

1. 可以使用Excel打开此文档，批量搜索
2. 或者使用Python脚本调用搜索API
3. 也可以使用浏览器扩展工具批量处理

### 数据格式

补充后的数据格式：
\`\`\`json
{
  "name": "建筑名称",
  "dynasty": "朝代",
  "year": "年份",
  "description": "详细描述",
  "province": "省份",
  "city": "城市"
}
\`\`\`
`

  const guidePath = path.join(__dirname, '..', 'scripts', 'MANUAL_ENHANCEMENT_GUIDE.md')
  fs.writeFileSync(guidePath, guide, 'utf-8')
  console.log(`✓ 手动补充指南已生成: ${guidePath}`)
}

function main() {
  console.log('开始增强古建筑数据...\n')
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  console.log(`总共 ${data.length} 个古建筑\n`)
  
  const buildingsToEnhance = data.filter(needsEnhancement)
  console.log(`需要补充信息的建筑: ${buildingsToEnhance.length} 个`)
  console.log(`信息完整的建筑: ${data.length - buildingsToEnhance.length} 个\n`)
  
  const progress = loadProgress()
  console.log(`已处理: ${progress.processed} 个`)
  console.log(`已增强: ${progress.enhanced} 个`)
  console.log(`失败: ${progress.failed} 个\n`)
  
  createManualEnhancementGuide(buildingsToEnhance.slice(0, 50))
  
  console.log('\n下一步操作：')
  console.log('1. 查看 MANUAL_ENHANCEMENT_GUIDE.md 了解需要补充的建筑')
  console.log('2. 使用网络搜索或百科网站查找建筑信息')
  console.log('3. 补充朝代、年份、描述等信息')
  console.log('4. 运行更新脚本将补充的信息合并到数据库')
  
  const sampleEnhanced = buildingsToEnhance.slice(0, 5).map(b => ({
    name: b.name,
    current: {
      dynasty: b.dynasty,
      year: b.year,
      description: b.description
    },
    searchQuery: createSearchQuery(b)
  }))
  
  console.log('\n示例建筑（前5个）：')
  sampleEnhanced.forEach((b, i) => {
    console.log(`\n${i + 1}. ${b.name}`)
    console.log(`   搜索: ${b.searchQuery}`)
    console.log(`   当前朝代: ${b.current.dynasty}`)
    console.log(`   当前年份: ${b.current.year}`)
  })
}

main()