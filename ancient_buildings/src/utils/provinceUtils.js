/**
 * 省份名称标准化函数
 * 将各种格式的省份名称统一为标准格式
 */
export const normalizeProvinceName = (name) => {
  if (!name) return ''

  const cleaned = String(name).trim()
  if (!cleaned || cleaned === '未知') return ''

  // 标准化映射表 - 将所有变体都指向统一的标准名称
  const normalizeMap = {
    // 直辖市
    北京: '北京',
    北京市: '北京',
    天津: '天津',
    天津市: '天津',
    上海: '上海',
    上海市: '上海',
    重庆: '重庆',
    重庆市: '重庆',

    // 省份
    河北: '河北',
    河北省: '河北',
    山西: '山西',
    山西省: '山西',
    辽宁: '辽宁',
    辽宁省: '辽宁',
    吉林: '吉林',
    吉林省: '吉林',
    黑龙江: '黑龙江',
    黑龙江省: '黑龙江',
    江苏: '江苏',
    江苏省: '江苏',
    浙江: '浙江',
    浙江省: '浙江',
    安徽: '安徽',
    安徽省: '安徽',
    福建: '福建',
    福建省: '福建',
    江西: '江西',
    江西省: '江西',
    山东: '山东',
    山东省: '山东',
    河南: '河南',
    河南省: '河南',
    湖北: '湖北',
    湖北省: '湖北',
    湖南: '湖南',
    湖南省: '湖南',
    广东: '广东',
    广东省: '广东',
    海南: '海南',
    海南省: '海南',
    四川: '四川',
    四川省: '四川',
    贵州: '贵州',
    贵州省: '贵州',
    云南: '云南',
    云南省: '云南',
    陕西: '陕西',
    陕西省: '陕西',
    甘肃: '甘肃',
    甘肃省: '甘肃',
    青海: '青海',
    青海省: '青海',

    // 自治区
    内蒙古: '内蒙古',
    内蒙古自治区: '内蒙古',
    广西: '广西',
    广西壮族自治区: '广西',
    西藏: '西藏',
    西藏自治区: '西藏',
    宁夏: '宁夏',
    宁夏回族自治区: '宁夏',
    新疆: '新疆',
    新疆维吾尔自治区: '新疆',

    // 特别行政区
    香港: '香港',
    香港特别行政区: '香港',
    澳门: '澳门',
    澳门特别行政区: '澳门',
    台湾: '台湾',
    台湾省: '台湾'
  }

  // 先查找精确匹配
  if (normalizeMap[cleaned]) {
    return normalizeMap[cleaned]
  }

  // 如果没有精确匹配，尝试移除常见后缀
  const withoutSuffix = cleaned
    .replace(/省$/, '')
    .replace(/市$/, '')
    .replace(/自治区$/, '')
    .replace(/壮族自治区$/, '')
    .replace(/回族自治区$/, '')
    .replace(/维吾尔自治区$/, '')
    .replace(/特别行政区$/, '')

  // 再次查找
  if (normalizeMap[withoutSuffix]) {
    return normalizeMap[withoutSuffix]
  }

  // 如果还是没有，返回去除后缀后的名称
  return withoutSuffix
}

/**
 * 获取所有标准化的省份列表
 */
export const getStandardProvinces = () => {
  return [
    '北京', '天津', '河北', '山西', '内蒙古',
    '辽宁', '吉林', '黑龙江', '上海', '江苏',
    '浙江', '安徽', '福建', '江西', '山东',
    '河南', '湖北', '湖南', '广东', '广西',
    '海南', '重庆', '四川', '贵州', '云南',
    '西藏', '陕西', '甘肃', '青海', '宁夏',
    '新疆', '台湾', '香港', '澳门'
  ]
}

/**
 * 统计省份数据时使用，自动合并相同省份
 */
export const aggregateByProvince = (buildings) => {
  const map = {}

  buildings.forEach((b) => {
    const normalizedProvince = normalizeProvinceName(b.province)
    if (normalizedProvince) {
      map[normalizedProvince] = (map[normalizedProvince] || 0) + 1
    }
  })

  return map
}
