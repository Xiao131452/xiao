const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, '..', '文保等数据')

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

async function main() {
  console.log('开始检查Excel文件结构...\n')
  
  files.forEach(file => {
    const filePath = path.join(dataDir, file)
    console.log(`\n========================================`)
    console.log(`文件: ${file}`)
    console.log(`========================================`)
    
    if (fs.existsSync(filePath)) {
      const data = readExcelFile(filePath)
      console.log(`读取到 ${data.length} 条记录`)
      
      if (data.length > 0) {
        console.log(`\n第一条记录的所有字段:`)
        const firstRecord = data[0]
        Object.keys(firstRecord).forEach(key => {
          console.log(`  ${key}: ${firstRecord[key]}`)
        })
        
        console.log(`\n前3条记录预览:`)
        data.slice(0, 3).forEach((record, index) => {
          console.log(`\n记录 ${index + 1}:`)
          Object.keys(record).forEach(key => {
            const value = record[key]
            if (value && String(value).length < 50) {
              console.log(`  ${key}: ${value}`)
            } else if (value) {
              console.log(`  ${key}: ${String(value).substring(0, 50)}...`)
            }
          })
        })
      }
    } else {
      console.log('文件不存在，跳过')
    }
  })
}

main().catch(error => {
  console.error('处理失败:', error)
  process.exit(1)
})