const fs = require('fs')
const path = require('path')
const axios = require('axios')

const dataFile = path.join(__dirname, '..', 'src', 'data', 'building_coords.json')
const outputFile = path.join(__dirname, '..', 'src', 'data', 'building_coords_with_images.json')
const logFile = path.join(__dirname, '..', 'scripts', 'image-search-log.txt')

const DEFAULT_IMAGES = {
  '宫殿': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  '寺庙': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '塔': 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
  '园林': 'https://images.unsplash.com/photo-1528360983277-13d9b152c611?w=800',
  '古建筑': 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800',
  '古遗址': 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800',
  '古村': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '古镇': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  '古城': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '石窟寺及石刻': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  '古墓葬': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  'default': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800'
}

const PIXABAY_API_KEY = 'YOUR_PIXABAY_API_KEY'
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'

let logStream = fs.createWriteStream(logFile, { flags: 'a' })

function log(message) {
  console.log(message)
  logStream.write(message + '\n')
}

function logError(message) {
  console.error(message)
  logStream.write('[ERROR] ' + message + '\n')
}

async function searchPixabay(keyword, perPage = 5) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        q: keyword,
        image_type: 'photo',
        orientation: 'horizontal',
        min_width: 800,
        min_height: 600,
        per_page: perPage,
        safesearch: 'true'
      },
      timeout: 10000
    })
    
    if (response.data && response.data.hits && response.data.hits.length > 0) {
      return response.data.hits.map(hit => ({
        url: hit.webformatURL,
        width: hit.webformatWidth,
        height: hit.webformatHeight,
        source: 'Pixabay'
      }))
    }
    
    return []
  } catch (error) {
    logError(`Pixabay搜索失败: ${error.message}`)
    return []
  }
}

async function searchUnsplash(keyword, perPage = 5) {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: keyword,
        per_page: perPage,
        orientation: 'landscape',
        min_width: 800,
        min_height: 600
      },
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      },
      timeout: 10000
    })
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results.map(photo => ({
        url: photo.urls.regular,
        width: photo.width,
        height: photo.height,
        source: 'Unsplash'
      }))
    }
    
    return []
  } catch (error) {
    logError(`Unsplash搜索失败: ${error.message}`)
    return []
  }
}

async function searchBingImages(keyword) {
  try {
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(keyword)}&qft=+filterui:imagesize-custom_800_600+filterui:photo-photo`
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    })
    
    const imageUrls = []
    const urlRegex = /"murl":"([^"]+\.(jpg|png|webp))"/g
    let match
    
    while ((match = urlRegex.exec(response.data)) !== null && imageUrls.length < 5) {
      const url = match[1]
      if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) {
        imageUrls.push({
          url: url,
          width: 800,
          height: 600,
          source: 'Bing'
        })
      }
    }
    
    return imageUrls
  } catch (error) {
    logError(`Bing搜索失败: ${error.message}`)
    return []
  }
}

async function validateImageUrl(url) {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const contentType = response.headers['content-type'] || ''
    if (contentType.includes('image/jpeg') || contentType.includes('image/png') || contentType.includes('image/webp')) {
      return true
    }
    
    return false
  } catch (error) {
    return false
  }
}

async function searchBuildingImage(building, index, total) {
  log(`\n[${index + 1}/${total}] 搜索图片: ${building.name}`)
  
  if (building.image && building.image.startsWith('http')) {
    log('  已有图片，跳过')
    return building.image
  }
  
  const searchKeywords = [
    `${building.name} ${building.province} ${building.type} 古建筑 实拍`,
    `${building.name} ${building.province} 古建筑`,
    `${building.name} ${building.type}`,
    `${building.province} ${building.type} 古建筑 实拍`,
    `${building.type} 古建筑 实拍`
  ]
  
  let bestImage = null
  
  for (const keyword of searchKeywords) {
    log(`  搜索关键词: "${keyword}"`)
    
    const sources = [
      { name: 'Pixabay', search: () => searchPixabay(keyword) },
      { name: 'Unsplash', search: () => searchUnsplash(keyword) },
      { name: 'Bing', search: () => searchBingImages(keyword) }
    ]
    
    for (const source of sources) {
      try {
        const images = await source.search()
        
        if (images.length > 0) {
          log(`  ${source.name}找到 ${images.length} 张图片`)
          
          for (const image of images) {
            if (image.width >= 800 && image.height >= 600) {
              const isValid = await validateImageUrl(image.url)
              
              if (isValid) {
                bestImage = image
                log(`  ✓ 找到有效图片: ${image.url.substring(0, 50)}...`)
                break
              } else {
                log(`  ✗ 图片无效: ${image.url.substring(0, 50)}...`)
              }
            }
          }
          
          if (bestImage) {
            break
          }
        }
      } catch (error) {
        logError(`  ${source.name}搜索出错: ${error.message}`)
      }
      
      if (bestImage) {
        break
      }
    }
    
    if (bestImage) {
      break
    }
  }
  
  if (!bestImage) {
    log('  未找到匹配图片，使用默认图片')
    
    const defaultImage = DEFAULT_IMAGES[building.type] || DEFAULT_IMAGES['default']
    bestImage = {
      url: defaultImage,
      source: 'Default'
    }
    
    log(`  使用默认图片: ${defaultImage}`)
    log(`  [需手动补充] ${building.name} - ${building.province}`)
  }
  
  return bestImage.url
}

async function main() {
  console.log('开始为古建筑数据添加图片...\n')
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  const total = data.length
  
  log(`总共有 ${total} 个建筑需要处理`)
  log(`开始时间: ${new Date().toLocaleString()}\n`)
  
  let successCount = 0
  let defaultCount = 0
  let skippedCount = 0
  
  for (let i = 0; i < data.length; i++) {
    const building = data[i]
    
    try {
      const imageUrl = await searchBuildingImage(building, i, total)
      
      if (imageUrl !== building.image) {
        building.image = imageUrl
        successCount++
        
        if (imageUrl.startsWith('https://images.unsplash.com')) {
          defaultCount++
        }
      } else {
        skippedCount++
      }
      
      if ((i + 1) % 10 === 0) {
        log(`\n进度: ${i + 1}/${total} (${((i + 1) / total * 100).toFixed(1)}%)`)
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      logError(`处理建筑 ${building.name} 时出错: ${error.message}`)
    }
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), 'utf-8')
  
  log(`\n\n处理完成！`)
  log(`成功添加图片: ${successCount} 个`)
  log(`使用默认图片: ${defaultCount} 个`)
  log(`跳过已有图片: ${skippedCount} 个`)
  log(`结束时间: ${new Date().toLocaleString()}`)
  log(`输出文件: ${outputFile}`)
  
  console.log('\n处理完成！')
  console.log(`成功添加图片: ${successCount} 个`)
  console.log(`使用默认图片: ${defaultCount} 个`)
  console.log(`跳过已有图片: ${skippedCount} 个`)
  console.log(`输出文件: ${outputFile}`)
  console.log(`日志文件: ${logFile}`)
  
  logStream.end()
}

main().catch(error => {
  console.error('主程序出错:', error)
  logStream.end()
  process.exit(1)
})