/**
 * 将 `building_coords.json` 最新结构转为界面统一使用的建筑对象。
 * - images：最多 5 张，用于轮播；image 为封面（第一张）
 * - type：来自 category（形制分类）
 * - building_type：数据中的名录/保护类型
 * - description：来自 details.overview
 * - status：由 heritage_status / 文案推断，供筛选与样式
 * - baidu_address_url：优先数据字段，否则按地址/坐标生成百度地图检索链接
 */
export function normalizeBuilding(raw) {
  const imgs =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images.slice(0, 5)
      : raw.image
        ? [raw.image]
        : []
  const image = imgs[0] || ''
  const images = imgs.length > 0 ? imgs : image ? [image] : []

  const description =
    (raw.details && raw.details.overview) || raw.description || ''

  const type = raw.category || raw.type || ''

  let status = raw.status
  if (!status) {
    const hs = raw.heritage_status
    if (Array.isArray(hs) && hs.length) {
      status = hs.some((s) => String(s).includes('重建')) ? '重建' : '保存完好'
    }
  }
  if (!status) {
    const t = `${description}${raw.building_reason || ''}`
    status = /(?:现代)?重建|整体复建|复建为新址|复建|重新修建/.test(t)
      ? '重建'
      : '保存完好'
  }

  const lng = raw.coordinates && raw.coordinates[0]
  const lat = raw.coordinates && raw.coordinates[1]
  const place = raw.location || raw.name || ''

  const baidu_address_url =
    raw.baidu_address_url ||
    raw.baidu_map_url ||
    (typeof lng === 'number' &&
    typeof lat === 'number' &&
    !Number.isNaN(lng) &&
    !Number.isNaN(lat)
      ? `https://map.baidu.com/search?queryword=${encodeURIComponent(`${lat},${lng}`)}`
      : `https://map.baidu.com/search?queryword=${encodeURIComponent(place)}`)

  return {
    ...raw,
    image,
    images,
    type,
    status,
    description,
    baidu_address_url,
    baike_url: raw.baike_url || '',
    building_type: raw.building_type || ''
  }
}

export function normalizeBuildingList(list) {
  if (!Array.isArray(list)) return []
  return list.map(normalizeBuilding)
}
