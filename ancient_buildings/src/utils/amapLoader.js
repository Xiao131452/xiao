/**
 * 动态加载高德 JSAPI 2.0 + Loca 2.0。需在 .env 配置 VITE_AMAP_KEY、VITE_AMAP_SECURITY_JS_CODE。
 * plugin 一并加载，供 DistrictSearch、MassMarks 等使用。
 */
const MAPS_PLUGINS = 'AMap.DistrictSearch,AMap.MassMarks'

export function loadScriptOnce(src, dataAttr) {
  return new Promise((resolve, reject) => {
    const existing = dataAttr ? document.querySelector(`script[data-amap="${dataAttr}"]`) : null
    if (existing) {
      if (dataAttr === 'maps' && window.AMap) {
        resolve()
        return
      }
      if (dataAttr === 'loca' && window.Loca) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.async = true
    if (dataAttr) s.dataset.amap = dataAttr
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`脚本加载失败: ${src}`))
    document.head.appendChild(s)
  })
}

let amapLoadPromise = null

/**
 * @returns {Promise<boolean>} 是否可用 AMap（Loca 失败不阻断底图）
 */
export async function ensureAmapLoaded(contextLabel = 'Amap') {
  if (window.AMap) return true

  const key = (import.meta.env.VITE_AMAP_KEY || '').trim()
  const securityJsCode = (import.meta.env.VITE_AMAP_SECURITY_JS_CODE || '').trim()

  if (!key) {
    console.warn(`[${contextLabel}] 缺少 VITE_AMAP_KEY，地图脚本未加载`)
    return !!window.AMap
  }

  if (!amapLoadPromise) {
    amapLoadPromise = (async () => {
      if (securityJsCode) {
        window._AMapSecurityConfig = { securityJsCode }
      }
      const mapsWithPluginUrl = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}&plugin=${MAPS_PLUGINS}`
      const mapsBaseUrl = `https://webapi.amap.com/maps?v=2.0&key=${encodeURIComponent(key)}`
      try {
        await loadScriptOnce(mapsWithPluginUrl, 'maps')
      } catch (e) {
        // 某些 key/环境对 plugin 参数敏感，失败时回退到基础脚本，尽量保证底图可用
        console.warn(`[${contextLabel}] 带 plugin 参数加载失败，尝试基础脚本回退`, e)
        await loadScriptOnce(mapsBaseUrl, 'maps-fallback')
      }
      try {
        await loadScriptOnce(`https://webapi.amap.com/loca?v=2.0.0&key=${encodeURIComponent(key)}`, 'loca')
      } catch (e) {
        // Loca 非必需：失败时保留底图与点位功能
        console.warn(`[${contextLabel}] Loca 加载失败，将仅显示基础地图`, e)
      }
    })().finally(() => {
      amapLoadPromise = null
    })
  }

  await amapLoadPromise
  return !!window.AMap
}
