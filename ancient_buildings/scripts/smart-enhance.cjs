const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_enhanced.json')

const dynastyKnowledgeBase = {
  '寺': { dynasty: '唐宋明清', description: '佛教寺院，是中国古代宗教建筑的重要代表，体现了佛教文化在中国的传播和发展。' },
  '庙': { dynasty: '明清', description: '祭祀建筑，用于供奉神灵、祖先或历史人物，是中国传统建筑的重要组成部分。' },
  '塔': { dynasty: '唐宋', description: '佛教建筑，用于供奉佛舍利或经卷，是中国古代建筑艺术的杰出代表。' },
  '宫': { dynasty: '明清', description: '皇家宫殿建筑，是中国古代帝王居住和朝政的场所，体现了皇权的至高无上。' },
  '殿': { dynasty: '明清', description: '宫殿或寺庙中的主要建筑，通常用于举行重要仪式或供奉神佛。' },
  '楼': { dynasty: '明清', description: '多层建筑，常用于观景、藏书或居住，是中国传统建筑的特色之一。' },
  '阁': { dynasty: '明清', description: '类似楼阁的建筑，常用于藏书、观景或供奉神佛。' },
  '桥': { dynasty: '明清', description: '交通建筑，连接两岸，体现了中国古代工程技术的卓越成就。' },
  '城': { dynasty: '明清', description: '城市防御建筑，包括城墙、城门等，是中国古代城市的重要组成部分。' },
  '墙': { dynasty: '明清', description: '防御建筑，主要用于军事防御，是中国古代军事建筑的重要代表。' },
  '陵': { dynasty: '明清', description: '帝王陵墓建筑，体现了古代丧葬文化和建筑艺术。' },
  '墓': { dynasty: '汉唐', description: '墓葬建筑，反映了古代丧葬习俗和建筑技术。' },
  '祠': { dynasty: '明清', description: '祭祀建筑，用于供奉祖先或历史人物，体现了中国传统的宗族文化。' },
  '观': { dynasty: '明清', description: '道教建筑，用于道教修行和祭祀，体现了道教文化。' },
  '洞': { dynasty: '唐宋', description: '佛教石窟建筑，雕刻有佛像和壁画，是中国古代艺术宝库。' },
  '窟': { dynasty: '唐宋', description: '佛教石窟建筑，保存了大量精美的佛教艺术作品。' },
  '园': { dynasty: '明清', description: '园林建筑，体现了中国古代园林艺术的精髓，融合了自然景观和人文建筑。' },
  '院': { dynasty: '明清', description: '四合院建筑，是中国传统民居的代表，体现了家族聚居的生活方式。' },
  '府': { dynasty: '明清', description: '官府或贵族府邸建筑，体现了古代官僚制度和建筑艺术。' },
  '衙': { dynasty: '明清', description: '官府办公建筑，体现了古代官僚制度和建筑风格。' },
  '镇': { dynasty: '明清', description: '古镇建筑群，保存了完整的古代城镇格局和建筑风貌。' },
  '村': { dynasty: '明清', description: '古村落建筑群，体现了传统农村建筑风格和生活方式。' },
  '街': { dynasty: '明清', description: '古街道建筑群，保存了古代商业街区的风貌。' },
  '遗址': { dynasty: '新石器时代至明清', description: '古代建筑遗迹，具有重要的历史和考古价值。' },
  '石刻': { dynasty: '汉唐', description: '石刻艺术作品，包括碑刻、摩崖石刻等，体现了古代书法和雕刻艺术。' }
}

const famousBuildings = {
  '故宫': { dynasty: '明', year: '1420年', description: '明清两代的皇家宫殿，中国古代宫廷建筑之精华，世界文化遗产。' },
  '天坛': { dynasty: '明', year: '1420年', description: '明清两代皇帝祭天、祈谷的场所，世界文化遗产。' },
  '长城': { dynasty: '明', year: '明代', description: '中国古代军事防御工程，世界文化遗产，被誉为世界七大奇迹之一。' },
  '兵马俑': { dynasty: '秦', year: '秦代', description: '秦始皇陵的陪葬坑，世界第八大奇迹，世界文化遗产。' },
  '布达拉宫': { dynasty: '清', year: '1645年', description: '世界上海拔最高的宫殿，世界文化遗产。' },
  '颐和园': { dynasty: '清', year: '清代', description: '中国现存最大的皇家园林，世界文化遗产。' },
  '圆明园': { dynasty: '清', year: '清代', description: '清代皇家园林，被誉为"万园之园"。' },
  '莫高窟': { dynasty: '北魏至元', year: '北魏', description: '中国四大石窟之一，世界文化遗产，保存了大量佛教艺术珍品。' },
  '龙门石窟': { dynasty: '北魏至唐', year: '北魏', description: '中国四大石窟之一，世界文化遗产。' },
  '云冈石窟': { dynasty: '北魏至唐', year: '北魏', description: '中国四大石窟之一，世界文化遗产。' },
  '麦积山石窟': { dynasty: '后秦至清', year: '后秦', description: '中国四大石窟之一，以精美的泥塑艺术著称。' },
  '大足石刻': { dynasty: '唐宋', year: '唐代', description: '世界文化遗产，以佛教题材石刻艺术著称。' },
  '苏州园林': { dynasty: '明清', year: '明代', description: '中国古典园林的代表，世界文化遗产。' },
  '拙政园': { dynasty: '明', year: '1509年', description: '中国四大名园之一，江南古典园林的代表作品。' },
  '留园': { dynasty: '明', year: '1593年', description: '中国四大名园之一，以建筑艺术精湛著称。' },
  '豫园': { dynasty: '明', year: '明代', description: '中国四大名园之一，江南古典园林的杰出代表。' },
  '清晖园': { dynasty: '明', year: '明代', description: '中国四大名园之一，广东古典园林的代表。' },
  '孔庙': { dynasty: '明', year: '明代', description: '中国三大古建筑群之一，世界文化遗产。' },
  '孔府': { dynasty: '明', year: '明代', description: '中国最大的府邸建筑群，世界文化遗产。' },
  '孔林': { dynasty: '明', year: '明代', description: '中国最大的家族墓地，世界文化遗产。' },
  '武当山古建筑群': { dynasty: '明', year: '明代', description: '中国道教建筑的巅峰之作，世界文化遗产。' },
  '青城山古建筑群': { dynasty: '明', year: '明代', description: '中国道教名山，世界文化遗产。' },
  '峨眉山古建筑群': { dynasty: '明', year: '明代', description: '中国四大佛教名山之一，世界文化与自然双重遗产。' },
  '乐山大佛': { dynasty: '唐', year: '713年', description: '世界最大的石刻弥勒佛坐像，世界文化与自然双重遗产。' },
  '都江堰': { dynasty: '秦', year: '256年', description: '世界水利文化的鼻祖，世界文化遗产。' },
  '丽江古城': { dynasty: '宋', year: '宋代', description: '世界文化遗产，中国历史文化名城。' },
  '平遥古城': { dynasty: '明', year: '1370年', description: '中国保存最完整的明清古县城，世界文化遗产。' },
  '凤凰古城': { dynasty: '明清', year: '清代', description: '中国历史文化名城，保存了完整的古城风貌。' },
  '周庄': { dynasty: '明清', year: '明代', description: '中国第一水乡，保存了完整的江南水乡风貌。' },
  '同里': { dynasty: '明清', year: '明代', description: '江南六大古镇之一，保存了完整的古镇风貌。' },
  '甪直': { dynasty: '明清', year: '明代', description: '江南六大古镇之一，有"神州水乡第一镇"之称。' },
  '西塘': { dynasty: '明清', year: '明代', description: '江南六大古镇之一，保存了完整的古镇风貌。' },
  '乌镇': { dynasty: '明清', year: '明代', description: '江南六大古镇之一，保存了完整的古镇风貌。' },
  '南浔': { dynasty: '明清', year: '明代', description: '江南六大古镇之一，保存了完整的古镇风貌。' },
  '宏村': { dynasty: '明', year: '明代', description: '中国画里的乡村，世界文化遗产。' },
  '西递': { dynasty: '明', year: '明代', description: '世界文化遗产，保存了完整的古村落风貌。' },
  '黄鹤楼': { dynasty: '清', year: '1867年重建', description: '江南三大名楼之一，中国文化的象征。' },
  '岳阳楼': { dynasty: '清', year: '1867年重建', description: '江南三大名楼之一，因《岳阳楼记》而闻名。' },
  '滕王阁': { dynasty: '清', year: '1989年重建', description: '江南三大名楼之一，因《滕王阁序》而闻名。' },
  '大雁塔': { dynasty: '唐', year: '652年', description: '唐代佛教建筑的杰作，西安的标志性建筑。' },
  '小雁塔': { dynasty: '唐', year: '707年', description: '唐代密檐式砖塔的代表作。' },
  '应县木塔': { dynasty: '辽', year: '1056年', description: '世界上现存最古老、最高的木结构楼阁式塔。' },
  '赵州桥': { dynasty: '隋', year: '595年', description: '世界上现存最古老的石拱桥，被誉为天下第一桥。' },
  '承德避暑山庄': { dynasty: '清', year: '1703年', description: '中国现存最大的皇家园林，世界文化遗产。' },
  '晋祠': { dynasty: '宋', year: '北宋', description: '中国现存最早的皇家祭祀园林，集古代祭祀建筑、园林、雕塑、壁画、碑刻艺术为一体。' },
  '白马寺': { dynasty: '东汉', year: '68年', description: '中国第一古刹，佛教传入中国后的第一座官办寺院。' },
  '少林寺': { dynasty: '北魏', year: '495年', description: '中国佛教禅宗祖庭，少林武术的发源地。' },
  '悬空寺': { dynasty: '北魏', year: '北魏', description: '中国仅存的佛、道、儒三教合一的独特寺庙。' },
  '华清池': { dynasty: '唐', year: '唐代', description: '唐代皇家温泉行宫，因杨贵妃沐浴而闻名。' },
  '秦始皇帝陵': { dynasty: '秦', year: '秦代', description: '中国历史上第一位皇帝的陵墓，世界文化遗产。' },
  '明十三陵': { dynasty: '明', year: '明代', description: '明朝十三位皇帝的陵墓，世界文化遗产。' },
  '清东陵': { dynasty: '清', year: '清代', description: '清朝五位皇帝的陵墓，世界文化遗产。' },
  '清西陵': { dynasty: '清', year: '清代', description: '清朝四位皇帝的陵墓，世界文化遗产。' }
}

function enhanceBuilding(building) {
  const enhanced = { ...building }
  
  if (famousBuildings[building.name]) {
    const famous = famousBuildings[building.name]
    
    if (!enhanced.dynasty || enhanced.dynasty === '未知') {
      enhanced.dynasty = famous.dynasty
    }
    
    if (!enhanced.year || enhanced.year === '清代') {
      enhanced.year = famous.year
      enhanced.yearNum = parseYear(famous.year)
    }
    
    if (!enhanced.description || enhanced.description === '古建筑') {
      enhanced.description = famous.description
    }
  } else {
    for (const [keyword, info] of Object.entries(dynastyKnowledgeBase)) {
      if (building.name.includes(keyword)) {
        if (!enhanced.dynasty || enhanced.dynasty === '未知') {
          enhanced.dynasty = info.dynasty
        }
        
        if (!enhanced.description || enhanced.description === '古建筑') {
          enhanced.description = `${building.name}，${info.description}`
        }
        
        break
      }
    }
  }
  
  if (!enhanced.year || enhanced.year === '清代') {
    if (enhanced.dynasty) {
      enhanced.year = estimateYearFromDynasty(enhanced.dynasty)
      enhanced.yearNum = parseYear(enhanced.year)
    }
  }
  
  return enhanced
}

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

function estimateYearFromDynasty(dynasty) {
  const dynastyYears = {
    '夏': '约前2070年',
    '商': '约前1600年',
    '周': '约前1046年',
    '西周': '约前1046年',
    '东周': '前770年',
    '春秋': '前770年',
    '战国': '前475年',
    '秦': '前221年',
    '汉': '前202年',
    '西汉': '前202年',
    '东汉': '25年',
    '三国': '220年',
    '晋': '265年',
    '西晋': '265年',
    '东晋': '317年',
    '南北朝': '420年',
    '隋': '581年',
    '唐': '618年',
    '五代十国': '907年',
    '宋': '960年',
    '北宋': '960年',
    '南宋': '1127年',
    '辽': '916年',
    '金': '1115年',
    '西夏': '1038年',
    '元': '1271年',
    '明': '1368年',
    '清': '1644年',
    '中华民国': '1912年'
  }
  
  return dynastyYears[dynasty] || '清代'
}

function main() {
  console.log('开始智能增强古建筑数据...\n')
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  console.log(`总共 ${data.length} 个古建筑\n`)
  
  let enhancedCount = 0
  const enhancedData = data.map((building, index) => {
    const enhanced = enhanceBuilding(building)
    
    if (enhanced.dynasty !== building.dynasty || 
        enhanced.year !== building.year || 
        enhanced.description !== building.description) {
      enhancedCount++
      console.log(`[${index + 1}] ${building.name}`)
      if (enhanced.dynasty !== building.dynasty) {
        console.log(`  朝代: ${building.dynasty} → ${enhanced.dynasty}`)
      }
      if (enhanced.year !== building.year) {
        console.log(`  年份: ${building.year} → ${enhanced.year}`)
      }
      if (enhanced.description !== building.description) {
        console.log(`  描述: 已更新`)
      }
    }
    
    return enhanced
  })
  
  console.log(`\n✓ 增强完成！`)
  console.log(`✓ 共增强 ${enhancedCount} 个建筑`)
  
  fs.writeFileSync(outputFile, JSON.stringify(enhancedData, null, 2), 'utf-8')
  console.log(`✓ 数据已保存到: ${outputFile}`)
  
  const stats = {
    total: enhancedData.length,
    enhanced: enhancedCount,
    byDynasty: {},
    completeInfo: 0
  }
  
  enhancedData.forEach(building => {
    if (!stats.byDynasty[building.dynasty]) stats.byDynasty[building.dynasty] = 0
    stats.byDynasty[building.dynasty]++
    
    if (building.dynasty && building.dynasty !== '未知' && 
        building.year && building.year !== '清代' && 
        building.description && building.description !== '古建筑') {
      stats.completeInfo++
    }
  })
  
  console.log(`\n信息完整的建筑: ${stats.completeInfo} 个`)
  console.log(`信息不完整的建筑: ${stats.total - stats.completeInfo} 个`)
  
  console.log('\n按朝代统计:')
  Object.keys(stats.byDynasty)
    .sort((a, b) => stats.byDynasty[b] - stats.byDynasty[a])
    .slice(0, 15)
    .forEach(dynasty => {
      console.log(`  ${dynasty}: ${stats.byDynasty[dynasty]} 个`)
    })
}

main()