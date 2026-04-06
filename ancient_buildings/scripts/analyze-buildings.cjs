const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_enhanced.json')
const logFile = path.join(__dirname, '..', 'scripts', 'enhancement-log.json')

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
    '夏', '商', '周', '秦', '汉', '三国', '晋', '南北朝', '隋', '唐', '五代十国', 
    '宋', '辽', '金', '元', '明', '清', '中华民国'
  ]
  
  for (const dynasty of dynasties) {
    if (text.includes(dynasty)) {
      return dynasty
    }
  }
  
  return null
}

function extractKeywords(name) {
  const keywords = []
  
  const typeKeywords = ['寺', '庙', '塔', '宫', '殿', '楼', '阁', '桥', '城', '墙', '陵', '墓', '祠', '观', '洞', '窟', '园', '院', '府', '衙']
  for (const keyword of typeKeywords) {
    if (name.includes(keyword)) {
      keywords.push(keyword)
    }
  }
  
  const locationKeywords = ['北京', '上海', '天津', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门']
  for (const keyword of locationKeywords) {
    if (name.includes(keyword)) {
      keywords.push(keyword)
    }
  }
  
  return keywords
}

function createSearchQuery(building) {
  const keywords = extractKeywords(building.name)
  const location = building.province !== '未知' ? building.province : ''
  
  let query = building.name
  if (location) {
    query += ` ${location}`
  }
  query += ' 古建筑 历史 朝代 年代'
  
  return query
}

function createEnhancementScript() {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  
  console.log(`总共 ${data.length} 个古建筑`)
  console.log('需要补充信息的建筑统计：')
  
  let needsEnhancement = 0
  const buildingsToEnhance = []
  
  data.forEach(building => {
    const needsInfo = 
      !building.dynasty || 
      building.dynasty === '未知' || 
      !building.year || 
      building.year === '清代' || 
      !building.description || 
      building.description === '古建筑'
    
    if (needsInfo) {
      needsEnhancement++
      buildingsToEnhance.push({
        ...building,
        searchQuery: createSearchQuery(building),
        keywords: extractKeywords(building.name)
      })
    }
  })
  
  console.log(`需要补充信息的建筑: ${needsEnhancement} 个`)
  console.log(`信息完整的建筑: ${data.length - needsEnhancement} 个`)
  
  const enhancementScript = `
// 古建筑信息增强脚本
// 使用说明：在浏览器控制台运行，或使用Node.js + axios + cheerio

const buildingsToEnhance = ${JSON.stringify(buildingsToEnhance.slice(0, 100), null, 2)};

// 示例：如何处理一个建筑
function enhanceBuilding(building) {
  console.log('搜索:', building.searchQuery);
  console.log('关键词:', building.keywords);
  console.log('当前信息:', {
    name: building.name,
    dynasty: building.dynasty,
    year: building.year,
    description: building.description
  });
  
  // TODO: 使用网络搜索API获取详细信息
  // 返回增强后的建筑信息
  return {
    ...building,
    dynasty: '从搜索结果获取',
    year: '从搜索结果获取',
    description: '从搜索结果获取'
  };
}

// 批量处理
const enhancedBuildings = buildingsToEnhance.map(enhanceBuilding);

console.log('增强后的建筑数量:', enhancedBuildings.length);
console.log('示例:', enhancedBuildings[0]);
`;

  const scriptPath = path.join(__dirname, '..', 'scripts', 'enhance-buildings.js')
  fs.writeFileSync(scriptPath, enhancementScript, 'utf-8')
  
  console.log(`\n✓ 增强脚本已生成: ${scriptPath}`)
  console.log(`✓ 包含前100个需要补充信息的建筑`)
  
  const stats = {
    total: data.length,
    needsEnhancement: needsEnhancement,
    complete: data.length - needsEnhancement,
    byDynasty: {},
    byType: {},
    byProvince: {}
  }
  
  data.forEach(building => {
    if (!stats.byDynasty[building.dynasty]) stats.byDynasty[building.dynasty] = 0
    stats.byDynasty[building.dynasty]++
    
    if (!stats.byType[building.type]) stats.byType[building.type] = 0
    stats.byType[building.type]++
    
    if (!stats.byProvince[building.province]) stats.byProvince[building.province] = 0
    stats.byProvince[building.province]++
  })
  
  fs.writeFileSync(logFile, JSON.stringify(stats, null, 2), 'utf-8')
  console.log(`\n✓ 统计信息已保存: ${logFile}`)
  
  console.log('\n按朝代统计:')
  Object.keys(stats.byDynasty).sort().forEach(dynasty => {
    console.log(`  ${dynasty}: ${stats.byDynasty[dynasty]} 个`)
  })
  
  console.log('\n按省份统计 (前10):')
  Object.keys(stats.byProvince)
    .sort((a, b) => stats.byProvince[b] - stats.byProvince[a])
    .slice(0, 10)
    .forEach(province => {
      console.log(`  ${province}: ${stats.byProvince[province]} 个`)
    })
}

function main() {
  console.log('开始分析古建筑数据...\n')
  createEnhancementScript()
}

main()