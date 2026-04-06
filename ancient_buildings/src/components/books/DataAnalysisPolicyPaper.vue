<template>
  <div class="gujian-policy-paper" role="region" aria-label="国家政策文摘">
    <div class="gujian-policy-paper__sheet">
      <header class="gujian-policy-paper__masthead">
        <div class="gujian-policy-paper__masthead-top">
          <span class="gujian-policy-paper__motto" aria-hidden="true">赓续中华文脉 · 守护遗产瑰宝 · 法治护航传承</span>
        </div>
        <div class="gujian-policy-paper__banner">
          <h1 class="gujian-policy-paper__title">文脉时报</h1>
          <p class="gujian-policy-paper__subtitle">中国古建筑保护政策文献摘编</p>
        </div>
        <div class="gujian-policy-paper__rule" aria-hidden="true" />
        <p class="gujian-policy-paper__lead">
          本版内容来源于典籍库政策数据，系统梳理我国文化遗产保护法治历程，展现保护为主、传承发展的时代强音。
        </p>
      </header>

      <div class="gujian-policy-paper__toolbar">
        <button type="button" class="gujian-policy-paper__back" @click="emit('close')">
          返回选书
        </button>
      </div>

      <p v-if="loadError" class="gujian-policy-paper__err">{{ loadError }}</p>

      <div v-else-if="!hasContent" class="gujian-policy-paper__empty">
        暂无政策条文。请将 policy.xlsx 置于「数据分析」目录后运行
        <code>python build_database.py</code> 生成 <code>gujian_policies.json</code>。
      </div>

      <!-- 多列表格型 Excel：每条为一则「要闻」 -->
      <div v-else-if="isMultiColumn" class="gujian-policy-paper__multi">
        <article
          v-for="(art, idx) in articles"
          :key="idx"
          class="gujian-policy-paper__article"
        >
          <h2 class="gujian-policy-paper__headline">{{ art.title || '政策摘录' }}</h2>
          <dl class="gujian-policy-paper__kv">
            <template v-for="f in art.fields" :key="f.label">
              <dt>{{ f.label }}</dt>
              <dd>{{ f.value }}</dd>
            </template>
          </dl>
        </article>
      </div>

      <!-- 单列长文型：按章节与条目排版 -->
      <div v-else class="gujian-policy-paper__columns">
        <template v-for="(blk, i) in blocks" :key="i">
          <h2 v-if="blk.kind === 'h2'" class="gujian-policy-paper__section">{{ blk.text }}</h2>
          <p v-else-if="blk.kind === 'th'" class="gujian-policy-paper__table-h">{{ blk.text }}</p>
          <p v-else class="gujian-policy-paper__para">{{ blk.text }}</p>
        </template>
      </div>

      <footer class="gujian-policy-paper__footer">
        <span>数据来源：国家政策典籍库 · 仅供学习参阅</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  policies: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  loadError: { type: String, default: '' },
})

const emit = defineEmits(['close'])

function firstNonEmptyCell(row) {
  if (!row || !props.columns.length) return ''
  for (const c of props.columns) {
    const v = row[c]
    if (v != null && String(v).trim()) return String(v).trim()
  }
  return ''
}

const isMultiColumn = computed(() => props.columns.length > 1)

const blocks = computed(() => {
  const out = []
  for (const row of props.policies) {
    const text = firstNonEmptyCell(row)
    if (!text) continue
    if (/^[一二三四五六七八九十百零〇]+、/.test(text)) {
      out.push({ kind: 'h2', text })
    } else if (/时间\s*文件/.test(text) && text.includes('主要内容')) {
      out.push({ kind: 'th', text })
    } else {
      out.push({ kind: 'p', text })
    }
  }
  return out
})

const TITLE_KEYS = new Set(['标题', '题目', '名称', '政策名称', '文件名称'])

const articles = computed(() => {
  if (!isMultiColumn.value) return []
  let titleCol = props.columns.find((c) => TITLE_KEYS.has(c))
  if (!titleCol) titleCol = props.columns[0]
  return props.policies
    .map((row) => {
      const title = String(row[titleCol] ?? '').trim()
      const fields = props.columns
        .filter((c) => c !== titleCol)
        .map((c) => ({ label: c, value: String(row[c] ?? '').trim() }))
        .filter((f) => f.value)
      return { title, fields }
    })
    .filter((a) => a.title || a.fields.length)
})

const hasContent = computed(() => {
  if (isMultiColumn.value) return articles.value.length > 0
  return blocks.value.length > 0
})
</script>

<style scoped>
.gujian-policy-paper {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 8px 28px;
  box-sizing: border-box;
  overflow-x: hidden;
  min-height: min(72vh, 640px);
}

.gujian-policy-paper__sheet {
  background: linear-gradient(180deg, #fffef9 0%, #faf6ee 48%, #f5f0e6 100%);
  border: 1px solid rgba(180, 0, 15, 0.22);
  box-shadow:
    0 4px 0 rgba(180, 0, 15, 0.06),
    0 18px 40px rgba(40, 12, 8, 0.12);
  border-radius: 2px;
  overflow-x: hidden;
  max-width: 100%;
}

.gujian-policy-paper__masthead {
  background: linear-gradient(180deg, #b4000f 0%, #8b0007 55%, #6a0005 100%);
  color: #fff8f0;
  padding: 14px 18px 16px;
  text-align: center;
  position: relative;
}

.gujian-policy-paper__masthead::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, #e8c547, #f5e6a8, #e8c547, transparent);
  opacity: 0.95;
}

.gujian-policy-paper__masthead-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  opacity: 0.95;
  margin-bottom: 10px;
}

.gujian-policy-paper__motto {
  font-weight: 600;
  color: #ffe8a8;
}

.gujian-policy-paper__banner {
  padding: 6px 0 4px;
}

.gujian-policy-paper__title {
  margin: 0;
  font-family: 'SimHei', 'Microsoft YaHei', 'PingFang SC', sans-serif;
  font-size: clamp(1.85rem, 5vw, 2.45rem);
  font-weight: 900;
  letter-spacing: 0.35em;
  text-indent: 0.35em;
  line-height: 1.15;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.gujian-policy-paper__subtitle {
  margin: 8px 0 0;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.28em;
  color: #ffd88a;
  opacity: 0.98;
}

.gujian-policy-paper__rule {
  height: 1px;
  margin: 12px auto 10px;
  max-width: 92%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
}

.gujian-policy-paper__lead {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.65;
  color: rgba(255, 245, 230, 0.92);
  max-width: 42em;
  margin-inline: auto;
  text-align: justify;
  text-justify: inter-ideograph;
}

.gujian-policy-paper__toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 10px 14px 0;
  background: #fdfbf7;
}

.gujian-policy-paper__back {
  padding: 6px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #6a0005;
  background: linear-gradient(180deg, #fff 0%, #f5ebe0 100%);
  border: 1px solid rgba(180, 0, 15, 0.35);
  border-radius: 2px;
  cursor: pointer;
  font-family: inherit;
}

.gujian-policy-paper__back:hover {
  background: #fff;
  border-color: #b4000f;
}

.gujian-policy-paper__err {
  margin: 12px 18px;
  padding: 12px;
  background: #fff5f5;
  border: 1px solid #f0c0c0;
  color: #8b2323;
  font-size: 0.88rem;
}

.gujian-policy-paper__empty {
  margin: 20px 18px 24px;
  padding: 20px;
  text-align: center;
  color: #5c4033;
  font-size: 0.9rem;
  line-height: 1.7;
}

.gujian-policy-paper__empty code {
  font-size: 0.82em;
  background: rgba(180, 0, 15, 0.06);
  padding: 2px 6px;
  border-radius: 3px;
}

.gujian-policy-paper__columns {
  padding: 16px 20px 32px;
  column-count: 2;
  column-gap: 28px;
  column-rule: 1px solid rgba(180, 0, 15, 0.12);
  font-family: 'FangSong', 'SimSun', 'STSong', serif;
  color: #1a1a1a;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

@media (max-width: 720px) {
  .gujian-policy-paper__columns {
    column-count: 1;
    column-rule: none;
  }
}

.gujian-policy-paper__section {
  break-after: avoid;
  margin: 14px 0 10px;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  font-size: 1.02rem;
  font-weight: 800;
  color: #8b0007;
  letter-spacing: 0.06em;
  border-left: 4px solid #b4000f;
  padding-left: 10px;
  line-height: 1.4;
  overflow-wrap: break-word;
  word-break: break-word;
}

.gujian-policy-paper__section:first-child {
  margin-top: 0;
}

.gujian-policy-paper__table-h {
  break-after: avoid;
  margin: 8px 0 6px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #5c2a18;
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.2), transparent);
  padding: 6px 8px;
  border-radius: 2px;
  overflow-wrap: break-word;
  word-break: break-word;
}

.gujian-policy-paper__para {
  margin: 0 0 0.55em;
  font-size: 0.84rem;
  line-height: 1.75;
  text-align: justify;
  text-justify: inter-ideograph;
  text-indent: 2em;
  overflow-wrap: break-word;
  word-break: break-word;
}

.gujian-policy-paper__para:first-of-type {
  font-weight: 600;
  color: #2a1810;
}

.gujian-policy-paper__multi {
  padding: 14px 18px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.gujian-policy-paper__article {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(180, 0, 15, 0.12);
  border-radius: 2px;
  box-shadow: 0 1px 0 rgba(180, 0, 15, 0.06);
}

.gujian-policy-paper__headline {
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 800;
  color: #8b0007;
  letter-spacing: 0.04em;
  line-height: 1.45;
}

.gujian-policy-paper__kv {
  margin: 0;
  display: grid;
  grid-template-columns: minmax(5em, 28%) 1fr;
  gap: 6px 12px;
  font-size: 0.86rem;
  line-height: 1.65;
}

.gujian-policy-paper__kv dt {
  margin: 0;
  font-weight: 700;
  color: #6b3a28;
}

.gujian-policy-paper__kv dd {
  margin: 0;
  color: #1a1a1a;
}

.gujian-policy-paper__footer {
  padding: 12px 16px 14px;
  text-align: center;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  color: #7a6a5a;
  background: linear-gradient(180deg, rgba(180, 0, 15, 0.04), transparent);
  border-top: 1px solid rgba(180, 0, 15, 0.1);
}
</style>
