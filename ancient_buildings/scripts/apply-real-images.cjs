const fs = require('fs')
const path = require('path')

const originalFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const newImagesFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_real_images.json')
const backupFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_before_real_images.json')

function main() {
  console.log('开始应用真实图片...\n')
  
  const originalData = JSON.parse(fs.readFileSync(originalFile, 'utf-8'))
  const newImagesData = JSON.parse(fs.readFileSync(newImagesFile, 'utf-8'))
  
  fs.writeFileSync(backupFile, JSON.stringify(originalData, null, 2), 'utf-8')
  console.log(`✓ 原始数据已备份到: ${backupFile}`)
  
  const updatedData = originalData.map((building, index) => {
    const newBuilding = newImagesData[index]
    if (newBuilding && newBuilding.image) {
      return {
        ...building,
        image: newBuilding.image
      }
    }
    return building
  })
  
  fs.writeFileSync(originalFile, JSON.stringify(updatedData, null, 2), 'utf-8')
  console.log(`✓ 真实图片已应用到: ${originalFile}`)
  
  const uniqueUrls = new Set()
  updatedData.forEach(b => {
    if (b.image) uniqueUrls.add(b.image)
  })
  
  console.log(`\n统计信息:`)
  console.log(`总建筑数: ${updatedData.length}`)
  console.log(`唯一图片URL数: ${uniqueUrls.size}`)
  console.log(`重复率: ${((1 - uniqueUrls.size/updatedData.length) * 100).toFixed(1)}%`)
  
  console.log('\n图片应用完成！')
}

main()