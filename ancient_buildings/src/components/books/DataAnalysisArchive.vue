<template>
  <div class="gujian-data-archive" aria-label="数据分析典籍库">
    <div class="gujian-data-archive__stage" :class="{ 'gujian-data-archive__stage--disc': bookOpened }">
      <div v-if="!bookOpened" class="gujian-data-archive__landing">
        <div class="gujian-data-archive__landing-canvas">
          <div class="gujian-data-archive__landing-mist" aria-hidden="true" />
          <div class="gujian-data-archive__landing-ring-layer" aria-hidden="true">
            <svg
              class="gujian-data-archive__ink-svg"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="da-ink-feather" x="-8%" y="-8%" width="116%" height="116%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="da-ink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1a1410" stop-opacity="0.22" />
                  <stop offset="40%" stop-color="#2e2418" stop-opacity="0.5" />
                  <stop offset="100%" stop-color="#0d0a08" stop-opacity="0.35" />
                </linearGradient>
              </defs>
              <g class="gujian-data-archive__ink-rotate gujian-data-archive__ink-rotate--slow">
                <ellipse
                  class="gujian-data-archive__ink-path gujian-data-archive__ink-path--outer"
                  cx="200"
                  cy="200"
                  rx="176"
                  ry="170"
                  pathLength="1000"
                  transform="rotate(-3.8 200 200)"
                  stroke="url(#da-ink-grad)"
                  stroke-width="5"
                  fill="none"
                  filter="url(#da-ink-feather)"
                />
                <ellipse
                  class="gujian-data-archive__ink-path gujian-data-archive__ink-path--mid"
                  cx="200"
                  cy="200"
                  rx="156"
                  ry="162"
                  pathLength="1000"
                  transform="rotate(2.2 200 200)"
                  stroke="#2a2218"
                  stroke-opacity="0.4"
                  stroke-width="2.35"
                  fill="none"
                  filter="url(#da-ink-feather)"
                />
                <ellipse
                  class="gujian-data-archive__ink-path gujian-data-archive__ink-path--inner"
                  cx="200"
                  cy="200"
                  rx="136"
                  ry="132"
                  pathLength="1000"
                  transform="rotate(-1.4 200 200)"
                  stroke="#3d3228"
                  stroke-opacity="0.34"
                  stroke-width="1.25"
                  fill="none"
                />
              </g>
              <g class="gujian-data-archive__ink-rotate gujian-data-archive__ink-rotate--counter">
                <ellipse
                  class="gujian-data-archive__ink-glow"
                  cx="200"
                  cy="200"
                  rx="168"
                  ry="162"
                  stroke="#5c4033"
                  stroke-opacity="0.08"
                  stroke-width="24"
                />
              </g>
            </svg>
          </div>

          <div class="gujian-data-archive__prop gujian-data-archive__prop--bamboo" aria-hidden="true">
            <!-- 常款竹简：多片平行竖简，上下两道绳编，端正易认 -->
            <svg viewBox="0 0 100 276" class="gujian-data-archive__prop-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="da-jian-strip" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#7a6048" />
                  <stop offset="35%" stop-color="#e8dcc0" />
                  <stop offset="55%" stop-color="#f5ecd8" />
                  <stop offset="100%" stop-color="#9a7858" />
                </linearGradient>
                <linearGradient id="da-jian-cord" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#2a1810" />
                  <stop offset="50%" stop-color="#4a3428" />
                  <stop offset="100%" stop-color="#1a1008" />
                </linearGradient>
              </defs>
              <ellipse cx="50" cy="268" rx="22" ry="4" fill="#2a2018" opacity="0.1" />
              <path
                d="M50 3 L50 36"
                stroke="#3d2818"
                stroke-width="1.15"
                stroke-linecap="round"
              />
              <path
                d="M46 3 Q50 -1 54 3"
                fill="none"
                stroke="#3d2818"
                stroke-width="1"
                stroke-linecap="round"
              />
              <!-- 六片简：等宽平行 -->
              <g>
                <rect
                  x="18"
                  y="48"
                  width="7"
                  height="212"
                  rx="0.8"
                  fill="url(#da-jian-strip)"
                  stroke="#6b5038"
                  stroke-opacity="0.35"
                  stroke-width="0.35"
                />
                <path d="M20.2 58 V250" stroke="#5c4830" stroke-opacity="0.2" stroke-width="0.25" />
              </g>
              <g>
                <rect
                  x="27"
                  y="48"
                  width="7"
                  height="212"
                  rx="0.8"
                  fill="url(#da-jian-strip)"
                  stroke="#6b5038"
                  stroke-opacity="0.35"
                  stroke-width="0.35"
                />
                <path d="M29.2 58 V250" stroke="#5c4830" stroke-opacity="0.2" stroke-width="0.25" />
              </g>
              <g>
                <rect
                  x="36"
                  y="48"
                  width="7"
                  height="212"
                  rx="0.8"
                  fill="url(#da-jian-strip)"
                  stroke="#6b5038"
                  stroke-opacity="0.35"
                  stroke-width="0.35"
                />
                <path d="M38.2 58 V250" stroke="#5c4830" stroke-opacity="0.2" stroke-width="0.25" />
              </g>
              <g>
                <rect
                  x="45"
                  y="48"
                  width="7"
                  height="212"
                  rx="0.8"
                  fill="url(#da-jian-strip)"
                  stroke="#6b5038"
                  stroke-opacity="0.35"
                  stroke-width="0.35"
                />
                <path d="M47.2 58 V250" stroke="#5c4830" stroke-opacity="0.2" stroke-width="0.25" />
              </g>
              <g>
                <rect
                  x="54"
                  y="48"
                  width="7"
                  height="212"
                  rx="0.8"
                  fill="url(#da-jian-strip)"
                  stroke="#6b5038"
                  stroke-opacity="0.35"
                  stroke-width="0.35"
                />
                <path d="M56.2 58 V250" stroke="#5c4830" stroke-opacity="0.2" stroke-width="0.25" />
              </g>
              <g>
                <rect
                  x="63"
                  y="48"
                  width="7"
                  height="212"
                  rx="0.8"
                  fill="url(#da-jian-strip)"
                  stroke="#6b5038"
                  stroke-opacity="0.35"
                  stroke-width="0.35"
                />
                <path d="M65.2 58 V250" stroke="#5c4830" stroke-opacity="0.2" stroke-width="0.25" />
              </g>
              <!-- 上绳 -->
              <line
                x1="16"
                y1="56"
                x2="84"
                y2="56"
                stroke="#1a1008"
                stroke-opacity="0.2"
                stroke-width="2.4"
                stroke-linecap="round"
              />
              <line
                x1="16"
                y1="55"
                x2="84"
                y2="55"
                stroke="url(#da-jian-cord)"
                stroke-width="1.6"
                stroke-linecap="round"
              />
              <line
                x1="20"
                y1="53.5"
                x2="80"
                y2="53.5"
                stroke="#d8c8a8"
                stroke-opacity="0.4"
                stroke-width="0.45"
                stroke-linecap="round"
              />
              <!-- 下绳 -->
              <line
                x1="16"
                y1="118"
                x2="84"
                y2="118"
                stroke="#1a1008"
                stroke-opacity="0.18"
                stroke-width="2.2"
                stroke-linecap="round"
              />
              <line
                x1="16"
                y1="117"
                x2="84"
                y2="117"
                stroke="url(#da-jian-cord)"
                stroke-width="1.45"
                stroke-linecap="round"
              />
              <line
                x1="20"
                y1="115.5"
                x2="80"
                y2="115.5"
                stroke="#d8c8a8"
                stroke-opacity="0.35"
                stroke-width="0.4"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div class="gujian-data-archive__prop gujian-data-archive__prop--inkstone" aria-hidden="true">
            <svg viewBox="0 0 160 100" class="gujian-data-archive__prop-svg" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 38 L148 32 L152 68 L8 78 Z"
                fill="#1c1814"
                stroke="#3a3228"
                stroke-width="1.2"
              />
              <ellipse cx="88" cy="52" rx="38" ry="16" fill="#0a0806" opacity="0.92" />
              <ellipse cx="90" cy="50" rx="32" ry="12" fill="#1a1410" opacity="0.55" />
            </svg>
          </div>

          <div class="gujian-data-archive__prop gujian-data-archive__prop--brush" aria-hidden="true">
            <!-- 竖向绘制，与参考图一致：细直竹木杆、黑帽挂绳、根白尖浓墨；整体倾斜约倚砚 -->
            <svg
              class="gujian-data-archive__prop-svg gujian-data-archive__prop-svg--ref-brush"
              viewBox="0 0 88 336"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="da-ref-wood" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#3d2818" />
                  <stop offset="22%" stop-color="#6b4830" />
                  <stop offset="45%" stop-color="#8b6040" />
                  <stop offset="55%" stop-color="#7a5034" />
                  <stop offset="78%" stop-color="#4a3020" />
                  <stop offset="100%" stop-color="#2a1810" />
                </linearGradient>
                <linearGradient id="da-ref-wood-hi" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#000" stop-opacity="0.25" />
                  <stop offset="40%" stop-color="#fff8f0" stop-opacity="0.18" />
                  <stop offset="55%" stop-color="#fff8f0" stop-opacity="0.06" />
                  <stop offset="100%" stop-color="#000" stop-opacity="0.2" />
                </linearGradient>
                <!-- 笔头：根乳白 → 腰灰 → 尖纯墨 -->
                <linearGradient id="da-ref-hair" x1="50%" y1="0%" x2="50%" y2="100%" gradientUnits="objectBoundingBox">
                  <stop offset="0%" stop-color="#faf6ec" />
                  <stop offset="18%" stop-color="#ebe4d4" />
                  <stop offset="38%" stop-color="#b8b0a4" />
                  <stop offset="58%" stop-color="#5a5650" />
                  <stop offset="78%" stop-color="#2a2824" />
                  <stop offset="100%" stop-color="#0a0a0a" />
                </linearGradient>
                <linearGradient id="da-ref-hair-side" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#000" stop-opacity="0.12" />
                  <stop offset="35%" stop-color="#fff" stop-opacity="0.08" />
                  <stop offset="100%" stop-color="#000" stop-opacity="0.18" />
                </linearGradient>
                <clipPath id="da-ref-hair-clip">
                  <path
                    d="M30 222 C26 256 32 296 44 326 C46 330 48 332 50 326 C62 296 68 256 64 222 C58 214 50 210 44 210 C38 210 32 214 30 222Z"
                  />
                </clipPath>
              </defs>

              <ellipse cx="44" cy="334" rx="22" ry="4" fill="#2a2018" opacity="0.14" />

              <!-- 挂绳（笔顶上方） -->
              <path
                d="M44 14 Q40 6 44 2 Q48 6 44 14"
                fill="none"
                stroke="#1a1a1a"
                stroke-width="1.35"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M44 14 L44 22"
                stroke="#1a1a1a"
                stroke-width="1.1"
                stroke-linecap="round"
              />

              <!-- 黑帽 -->
              <rect x="36" y="22" width="16" height="10" rx="2" fill="#141210" stroke="#0a0a0a" stroke-width="0.35" />
              <ellipse cx="40" cy="25" rx="2" ry="1.2" fill="#fff" opacity="0.12" />

              <!-- 笔杆：上略窄、下略宽，底接笔斗 -->
              <path
                d="M38 32 L50 32 L56 196 L32 196 Z"
                fill="url(#da-ref-wood)"
              />
              <path
                d="M38 32 L50 32 L56 196 L32 196 Z"
                fill="url(#da-ref-wood-hi)"
              />
              <path
                d="M38 32 L50 32 L56 196 L32 196 Z"
                fill="none"
                stroke="#1a1008"
                stroke-opacity="0.35"
                stroke-width="0.4"
              />
              <!-- 竹节 -->
              <path
                d="M35 88 Q44 90 53 88"
                fill="none"
                stroke="#2a1810"
                stroke-opacity="0.2"
                stroke-width="0.55"
              />
              <path
                d="M34 138 Q44 140 54 138"
                fill="none"
                stroke="#2a1810"
                stroke-opacity="0.16"
                stroke-width="0.5"
              />
              <path
                d="M34 168 Q44 170 54 168"
                fill="none"
                stroke="#2a1810"
                stroke-opacity="0.14"
                stroke-width="0.48"
              />

              <!-- 深色金属笔斗（参考图） -->
              <path
                d="M32 196 L56 196 L58 210 L30 210 Z"
                fill="#1c1814"
                stroke="#0a0806"
                stroke-width="0.35"
              />
              <path
                d="M34 200 L54 200"
                stroke="#3a3430"
                stroke-opacity="0.55"
                stroke-width="0.45"
                stroke-linecap="round"
              />
              <path
                d="M36 204 L52 204"
                stroke="#fff8f0"
                stroke-opacity="0.12"
                stroke-width="0.35"
                stroke-linecap="round"
              />

              <!-- 笔头外轮廓：腰圆、锋尖（根缘接笔斗下沿） -->
              <path
                d="M30 222 C26 256 32 296 44 326 C46 330 48 332 50 326 C62 296 68 256 64 222 C58 214 50 210 44 210 C38 210 32 214 30 222Z"
                fill="url(#da-ref-hair)"
              />
              <path
                d="M30 222 C26 256 32 296 44 326 C46 330 48 332 50 326 C62 296 68 256 64 222 C58 214 50 210 44 210 C38 210 32 214 30 222Z"
                fill="url(#da-ref-hair-side)"
                opacity="0.85"
              />

              <!-- 丝缕 -->
              <g clip-path="url(#da-ref-hair-clip)" fill="none" stroke-linecap="round" opacity="0.65">
                <path d="M38 218 Q40 258 44 308" stroke="#f5f0e6" stroke-width="0.28" />
                <path d="M42 216 Q44 260 46 310" stroke="#e8e2d4" stroke-width="0.26" />
                <path d="M46 216 Q48 258 48 306" stroke="#d0c8b8" stroke-width="0.24" />
                <path d="M50 218 Q50 256 50 300" stroke="#a09888" stroke-width="0.26" />
                <path d="M34 226 Q36 266 42 312" stroke="#c8c0b0" stroke-width="0.22" />
                <path d="M58 226 Q56 266 50 312" stroke="#908878" stroke-width="0.24" />
                <path d="M40 228 Q42 276 45 318" stroke="#787068" stroke-width="0.22" />
                <path d="M48 228 Q48 276 46 318" stroke="#585048" stroke-width="0.24" />
                <path d="M44 230 Q44 280 44 324" stroke="#403838" stroke-width="0.26" />
                <path d="M36 240 Q40 286 43 320" stroke="#5a5248" stroke-width="0.2" />
                <path d="M52 240 Q48 286 45 320" stroke="#302820" stroke-width="0.22" />
              </g>

              <!-- 笔尖浓墨与蘸墨湿痕 -->
              <path
                d="M40 296 Q44 320 44 330 Q48 320 52 296 Q48 290 44 290 Q40 290 40 296Z"
                fill="#050505"
                opacity="0.92"
              />
              <ellipse cx="44" cy="306" rx="5" ry="7" fill="#000" opacity="0.35" />
              <ellipse cx="44" cy="326" rx="4" ry="2.5" fill="#0a0a0a" opacity="0.5" />
            </svg>
            <span class="gujian-data-archive__ink-fleck gujian-data-archive__ink-fleck--a" />
            <span class="gujian-data-archive__ink-fleck gujian-data-archive__ink-fleck--b" />
          </div>

          <div class="gujian-data-archive__landing-center">
            <button
              type="button"
              class="gujian-data-archive__big-book"
              aria-label="点击启卷，选择数据门类"
              @click="openBook"
            >
              <span class="gujian-data-archive__big-book-spine" aria-hidden="true" />
              <span class="gujian-data-archive__big-book-cover">
                <span class="gujian-data-archive__big-book-cover-texture" aria-hidden="true" />
                <span class="gujian-data-archive__big-book-cover-frame" aria-hidden="true" />
                <span class="gujian-data-archive__big-book-seal" aria-hidden="true">典</span>
                <span class="gujian-data-archive__big-book-title">营造法式<br>汇考</span>
                <span class="gujian-data-archive__big-book-sub">古建筑 · 数据分析</span>
                <span class="gujian-data-archive__big-book-whisper" aria-hidden="true">启卷翻翻</span>
              </span>
              <span class="gujian-data-archive__big-book-edge" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <Transition name="gujian-disc-reveal">
        <div v-if="bookOpened" class="gujian-data-archive__opened-panel">
          <div class="gujian-data-archive__category-books" role="group" aria-label="数据门类">
            <button
              type="button"
              class="gujian-data-archive__mini-book gujian-data-archive__mini-book--huazhang"
              :class="{ 'gujian-data-archive__mini-book--active': activeCategoryId === 'huazhang' }"
              @click="selectArchiveCategory('huazhang')"
            >
              <span class="gujian-data-archive__mini-book__shadow" aria-hidden="true" />
              <span class="gujian-data-archive__mini-book__tilt">
                <span class="gujian-data-archive__mini-book__spine" aria-hidden="true" />
                <span class="gujian-data-archive__mini-book__cover">
                  <span class="gujian-data-archive__mini-book__seal" aria-hidden="true">章</span>
                  <span class="gujian-data-archive__mini-book__title">栋宇华章</span>
                </span>
                <span class="gujian-data-archive__mini-book__foredge" aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              class="gujian-data-archive__mini-book gujian-data-archive__mini-book--lianggong"
              :class="{ 'gujian-data-archive__mini-book--active': activeCategoryId === 'lianggong' }"
              @click="selectArchiveCategory('lianggong')"
            >
              <span class="gujian-data-archive__mini-book__shadow" aria-hidden="true" />
              <span class="gujian-data-archive__mini-book__tilt">
                <span class="gujian-data-archive__mini-book__spine" aria-hidden="true" />
                <span class="gujian-data-archive__mini-book__cover">
                  <span class="gujian-data-archive__mini-book__seal" aria-hidden="true">工</span>
                  <span class="gujian-data-archive__mini-book__title">栋宇良工</span>
                </span>
                <span class="gujian-data-archive__mini-book__foredge" aria-hidden="true" />
              </span>
            </button>
            <button
              type="button"
              class="gujian-data-archive__mini-book gujian-data-archive__mini-book--zhengce"
              :class="{ 'gujian-data-archive__mini-book--active': activeCategoryId === 'zhengce' }"
              @click="selectArchiveCategory('zhengce')"
            >
              <span class="gujian-data-archive__mini-book__shadow" aria-hidden="true" />
              <span class="gujian-data-archive__mini-book__tilt">
                <span class="gujian-data-archive__mini-book__spine" aria-hidden="true" />
                <span class="gujian-data-archive__mini-book__cover">
                  <span class="gujian-data-archive__mini-book__seal" aria-hidden="true">政</span>
                  <span class="gujian-data-archive__mini-book__title">国家政策</span>
                </span>
                <span class="gujian-data-archive__mini-book__foredge" aria-hidden="true" />
              </span>
            </button>
          </div>
          <Transition name="gujian-pie-reveal">
            <div v-if="showPieDisc" class="gujian-data-archive__disc-wrap">
          <div class="gujian-data-archive__pie-outer">
            <div class="gujian-data-archive__pie-disc-area">
              <!-- 小朵：叠在圆盘上层 -->
              <div class="gujian-data-archive__xiangyun-top" aria-hidden="true">
                <div class="gujian-data-archive__xiangyun-inner gujian-data-archive__xiangyun-inner--top">
                  <img
                    class="gujian-data-archive__xiangyun-img gujian-data-archive__xiangyun-img--sm"
                    src="/xiangyun-cloud-sm.svg"
                    width="260"
                    height="108"
                    alt=""
                    decoding="async"
                    draggable="false"
                  />
                </div>
              </div>
              <div class="gujian-data-archive__pie-tilt">
              <svg
                class="gujian-data-archive__pie"
                viewBox="0 0 200 200"
                overflow="visible"
                role="img"
                text-rendering="geometricPrecision"
                shape-rendering="geometricPrecision"
                aria-label="古籍建筑文献分类统计圆盘，共分八等份，可点击每一块查看说明"
              >
                <defs>
                  <!-- 金色立体回纹花边（参考传统回纹 / 云雷纹带状效果） -->
                  <linearGradient id="gujian-rim-gold-line" x1="0" y1="0" x2="20" y2="28" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#fffef5" />
                    <stop offset="22%" stop-color="#f3df8a" />
                    <stop offset="48%" stop-color="#d4af37" />
                    <stop offset="72%" stop-color="#a67c1a" />
                    <stop offset="100%" stop-color="#5c4010" />
                  </linearGradient>
                  <linearGradient id="gujian-rim-gold-orbit" x1="36" y1="36" x2="164" y2="164" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#fff8dc" />
                    <stop offset="35%" stop-color="#e8c96a" />
                    <stop offset="70%" stop-color="#b8892a" />
                    <stop offset="100%" stop-color="#6a4818" />
                  </linearGradient>
                  <pattern
                    id="gujian-rim-ancient"
                    x="0"
                    y="0"
                    width="20"
                    height="40"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(-11 10 20)"
                  >
                    <rect width="20" height="40" fill="#342618" />
                    <!-- 阴刻底影 -->
                    <path
                      d="M0 10h5V5h10v10h5v-5h5M0 30h5V25h10v10h5v-5h5"
                      fill="none"
                      stroke="#1a1208"
                      stroke-width="2.65"
                      stroke-linecap="square"
                      stroke-linejoin="miter"
                      transform="translate(0.55,0.85)"
                      opacity="0.55"
                    />
                    <!-- 主回纹线（金属渐变） -->
                    <path
                      d="M0 10h5V5h10v10h5v-5h5M0 30h5V25h10v10h5v-5h5"
                      fill="none"
                      stroke="url(#gujian-rim-gold-line)"
                      stroke-width="1.75"
                      stroke-linecap="square"
                      stroke-linejoin="miter"
                    />
                    <!-- 上沿高光 -->
                    <path
                      d="M0 10h5V5h10v10h5v-5h5M0 30h5V25h10v10h5v-5h5"
                      fill="none"
                      stroke="#fffef0"
                      stroke-width="0.5"
                      stroke-linecap="square"
                      stroke-linejoin="miter"
                      transform="translate(-0.35,-0.4)"
                      opacity="0.72"
                    />
                  </pattern>
                  <mask id="gujian-rim-ring-mask" maskUnits="userSpaceOnUse">
                    <circle cx="100" cy="100" r="99.55" fill="white" />
                    <circle cx="100" cy="100" r="87.58" fill="black" />
                  </mask>
                  <!-- 扇区间凹槽描边：挖去圆心，避免八块深色描边叠成黑点 -->
                  <mask id="gujian-slice-groove-mask" maskUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="200" height="200" fill="white" />
                    <circle cx="100" cy="100" r="14" fill="black" />
                  </mask>
                  <!-- 扇区标签字：上亮下暗 + 描边，配合 CSS 阴影呈浮雕感 -->
                  <linearGradient
                    id="gujian-slice-text-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0%" stop-color="#7d6a52" />
                    <stop offset="28%" stop-color="#4d4034" />
                    <stop offset="58%" stop-color="#2e261c" />
                    <stop offset="100%" stop-color="#120e0a" />
                  </linearGradient>
                  <linearGradient
                    id="gujian-slice-text-num-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                    gradientUnits="objectBoundingBox"
                  >
                    <stop offset="0%" stop-color="#8b5228" />
                    <stop offset="30%" stop-color="#5c3618" />
                    <stop offset="65%" stop-color="#3a2210" />
                    <stop offset="100%" stop-color="#160a04" />
                  </linearGradient>
                  <linearGradient
                    v-for="slice in computedSlices"
                    :key="'lg-' + slice.id"
                    :id="'gujian-grad-' + slice.id"
                    gradientUnits="userSpaceOnUse"
                    :x1="slice.gx1"
                    :y1="slice.gy1"
                    :x2="slice.gx2"
                    :y2="slice.gy2"
                  >
                    <stop offset="0%" :stop-color="slice.colorLight" stop-opacity="1" />
                    <stop offset="42%" :stop-color="slice.color" stop-opacity="1" />
                    <stop offset="100%" :stop-color="slice.colorDark" stop-opacity="1" />
                  </linearGradient>
                </defs>

                <g class="gujian-data-archive__pie-body">
                <!-- 外圈：回纹填色带 + 内外两道实心金线（夹住花纹） -->
                <circle
                  class="gujian-data-archive__pie-rim-ancient"
                  cx="100"
                  cy="100"
                  r="99.52"
                  fill="url(#gujian-rim-ancient)"
                  mask="url(#gujian-rim-ring-mask)"
                />
                <circle class="gujian-data-archive__pie-rim-orbit-outer" cx="100" cy="100" r="99.62" fill="none" />
                <circle class="gujian-data-archive__pie-rim-orbit-outer-hi" cx="100" cy="100" r="99.38" fill="none" />
                <circle class="gujian-data-archive__pie-rim-orbit-inner" cx="100" cy="100" r="87.72" fill="none" />
                <circle class="gujian-data-archive__pie-rim-orbit-inner-hi" cx="100" cy="100" r="87.9" fill="none" />

                <g
                  v-for="slice in sortedSlicesForDraw"
                  :key="slice.id"
                  class="gujian-data-archive__slice-group"
                  :class="{ 'gujian-data-archive__slice-group--pop': hoveredId === slice.id }"
                  role="button"
                  tabindex="0"
                  :aria-label="`${slice.label}，收录 ${slice.value} 条，点击查看说明`"
                  :aria-pressed="selectedId === slice.id"
                  @click="selectSlice(slice)"
                  @mouseenter="hoveredId = slice.id"
                  @mouseleave="hoveredId = null"
                  @keydown.enter.prevent="selectSlice(slice)"
                  @keydown.space.prevent="selectSlice(slice)"
                >
                  <path
                    :d="slice.path"
                    fill="none"
                    class="gujian-data-archive__slice-path-groove"
                    mask="url(#gujian-slice-groove-mask)"
                    stroke-linejoin="round"
                  />
                  <path
                    :d="slice.path"
                    :fill="'url(#gujian-grad-' + slice.id + ')'"
                    class="gujian-data-archive__slice-path"
                    :class="{
                      'gujian-data-archive__slice-path--active': selectedId === slice.id,
                    }"
                    stroke="rgba(255,255,255,0.92)"
                    stroke-width="1.72"
                    stroke-linejoin="round"
                  />
                  <text
                    class="gujian-data-archive__slice-text"
                    :x="slice.labelX"
                    :y="slice.labelY"
                    :transform="`rotate(${slice.textRotate}, ${slice.labelX}, ${slice.labelY})`"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    pointer-events="none"
                  >
                    <tspan x="slice.labelX" dy="-0.35em" class="gujian-data-archive__slice-text-title">{{
                      slice.labelShort
                    }}</tspan>
                    <tspan x="slice.labelX" dy="1.05em" class="gujian-data-archive__slice-text-num">{{ slice.value }}</tspan>
                  </text>
                </g>
              </g>
              </svg>
              </div>
            </div>

            <!-- 两朵大云：圆盘下方 -->
            <div class="gujian-data-archive__float-clouds" aria-hidden="true">
              <div class="gujian-data-archive__xiangyun gujian-data-archive__xiangyun--bottom-left">
                <div class="gujian-data-archive__xiangyun-inner">
                  <img
                    class="gujian-data-archive__xiangyun-img"
                    src="/xiangyun-cloud.svg"
                    width="440"
                    height="176"
                    alt=""
                    decoding="async"
                    draggable="false"
                  />
                </div>
              </div>
              <div class="gujian-data-archive__xiangyun gujian-data-archive__xiangyun--bottom-right">
                <div class="gujian-data-archive__xiangyun-inner gujian-data-archive__xiangyun-inner--br">
                  <img
                    class="gujian-data-archive__xiangyun-img gujian-data-archive__xiangyun-img--flip"
                    src="/xiangyun-cloud.svg"
                    width="440"
                    height="176"
                    alt=""
                    decoding="async"
                    draggable="false"
                  />
                </div>
              </div>
            </div>
          </div>

            </div>
          </Transition>
          <Transition name="gujian-pie-reveal">
            <DataAnalysisPersonTimeline
              v-if="showPersonTimeline"
              class="gujian-data-archive__timeline-slot"
              :persons="personsRaw"
              :columns="personsColumns"
              :load-error="personsLoadError"
            />
          </Transition>
          <Transition name="gujian-pie-reveal">
            <DataAnalysisPolicyPaper
              v-if="activeCategoryId === 'zhengce'"
              class="gujian-data-archive__policy-slot"
              :policies="policiesRaw"
              :columns="policiesColumns"
              :load-error="policiesLoadError"
              @close="clearArchiveCategory"
            />
          </Transition>
        </div>
      </Transition>
    </div>

    <Teleport to="body">
      <Transition name="gujian-book-cards">
        <div
          v-if="bookOpened && selectedSlice"
          class="gujian-book-cards"
          :aria-label="`${selectedSlice.label} 书目卡片`"
          role="dialog"
          aria-modal="true"
        >
          <div class="gujian-book-cards__backdrop" @click="clearSelection" />
          <div class="gujian-book-cards__panel" @click.stop>
            <header class="gujian-book-cards__head">
              <div>
                <h3 class="gujian-book-cards__title">{{ selectedSlice.label }}</h3>
                <p class="gujian-book-cards__sub">{{ selectedSlice.detail }}</p>
              </div>
              <button type="button" class="gujian-book-cards__close" aria-label="关闭" @click="clearSelection">
                ×
              </button>
            </header>
            <p v-if="booksLoadError" class="gujian-book-cards__err">{{ booksLoadError }}</p>
            <div v-else class="gujian-book-cards__scroller">
              <div v-if="!filteredBookEntries.length" class="gujian-book-cards__empty">暂无匹配书目，请检查 data/gujian_books.json 或重新运行 build_database.py</div>
              <div v-else class="gujian-book-cards__grid">
                <button
                  v-for="(entry, idx) in filteredBookEntries"
                  :key="entry.title + idx"
                  type="button"
                  class="gujian-book-cards__card"
                  :style="{ animationDelay: `${Math.min(idx, 24) * 35}ms` }"
                  @click.stop="openBookScroll(entry)"
                >
                  <span class="gujian-book-cards__card-inner">{{ entry.title }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="gujian-book-scroll">
        <div
          v-if="selectedBookDetail"
          class="gujian-book-scroll"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gujian-book-scroll-title"
        >
          <div class="gujian-book-scroll__backdrop" @click="closeBookScroll" />
          <div class="gujian-book-scroll__stage" @click.stop>
            <div class="gujian-book-scroll__ceremony" aria-hidden="true">
              <span class="gujian-book-scroll__burst" />
              <span class="gujian-book-scroll__ring gujian-book-scroll__ring--1" />
              <span class="gujian-book-scroll__ring gujian-book-scroll__ring--2" />
              <span class="gujian-book-scroll__petal gujian-book-scroll__petal--tl" />
              <span class="gujian-book-scroll__petal gujian-book-scroll__petal--tr" />
              <span class="gujian-book-scroll__petal gujian-book-scroll__petal--bl" />
              <span class="gujian-book-scroll__petal gujian-book-scroll__petal--br" />
            </div>
            <div class="gujian-book-scroll__cord" aria-hidden="true" />
            <div class="gujian-book-scroll__frame">
              <div class="gujian-book-scroll__pole gujian-book-scroll__pole--top" aria-hidden="true">
                <span class="gujian-book-scroll__pole-end gujian-book-scroll__pole-end--left" />
                <span class="gujian-book-scroll__pole-bar" />
                <span class="gujian-book-scroll__pole-end gujian-book-scroll__pole-end--right" />
              </div>
              <div class="gujian-book-scroll__unfurl">
                <div class="gujian-book-scroll__mount gujian-book-scroll__mount--upper" aria-hidden="true" />
                <div class="gujian-book-scroll__body">
                  <div class="gujian-book-scroll__shaft gujian-book-scroll__shaft--left" aria-hidden="true">
                    <span class="gujian-book-scroll__finial" />
                  </div>
                  <div class="gujian-book-scroll__paper">
                    <div class="gujian-book-scroll__paper-texture" aria-hidden="true" />
                    <span class="gujian-book-scroll__seal" aria-hidden="true">籍</span>
                    <button type="button" class="gujian-book-scroll__close" aria-label="收起卷轴" @click="closeBookScroll">
                      合卷
                    </button>
                    <h2 id="gujian-book-scroll-title" class="gujian-book-scroll__book-title">
                      {{ selectedBookDetail.title }}
                    </h2>
                    <div v-if="!bookScrollFields.length" class="gujian-book-scroll__empty">暂无更多著录字段</div>
                    <dl v-else class="gujian-book-scroll__dl">
                      <template v-for="item in bookScrollFields" :key="item.key">
                        <dt class="gujian-book-scroll__dt">{{ item.label }}</dt>
                        <dd class="gujian-book-scroll__dd">{{ item.value }}</dd>
                      </template>
                    </dl>
                  </div>
                  <div class="gujian-book-scroll__shaft gujian-book-scroll__shaft--right" aria-hidden="true">
                    <span class="gujian-book-scroll__finial" />
                  </div>
                </div>
                <div class="gujian-book-scroll__mount gujian-book-scroll__mount--lower" aria-hidden="true" />
              </div>
              <div class="gujian-book-scroll__pole gujian-book-scroll__pole--bottom" aria-hidden="true">
                <span class="gujian-book-scroll__pole-end gujian-book-scroll__pole-end--left" />
                <span class="gujian-book-scroll__pole-bar" />
                <span class="gujian-book-scroll__pole-end gujian-book-scroll__pole-end--right" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <p v-if="bookOpened" class="gujian-data-archive__toolbar">
      <button type="button" class="gujian-data-archive__close-book" @click="closeBook">合卷收起</button>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DataAnalysisPersonTimeline from './DataAnalysisPersonTimeline.vue'
import DataAnalysisPolicyPaper from './DataAnalysisPolicyPaper.vue'

/** 圆盘扇区 id → Excel 分段标题（与 book.xlsx 导出 JSON 中 col_0 章节行一致） */
const SLICE_SECTION = {
  'official-blue': '一、官式规范类',
  'official-top': '一、官式规范类',
  garden: '二、园林与美学类',
  'craft-folk': '三、匠作与民间技术类',
  'local-tech': '四、营造与单项技术类',
  'local-building': '六、地方志中的建筑专篇类',
  'history-gazette': '五、史料与方志类',
  'water-bridge': '七、水利与桥梁专著类',
}

const booksRaw = ref([])
const booksColumns = ref([])
const booksLoadError = ref('')
const personsRaw = ref([])
const personsColumns = ref([])
const personsLoadError = ref('')
const policiesRaw = ref([])
const policiesColumns = ref([])
const policiesLoadError = ref('')
const selectedBookDetail = ref(null)

/** 按「一、…类」章节拆出完整著作行（与 build_database 导出 books 表一致） */
function booksRowsBySection(rows) {
  const sections = {}
  let cur = null
  for (const row of rows) {
    const c0 = String(row.col_0 ?? '').trim()
    if (/^[一二三四五六七八九]、/.test(c0) && c0.includes('类')) {
      cur = c0
      if (!sections[cur]) sections[cur] = []
      continue
    }
    if (!cur) continue
    if (c0 === '著作' || c0 === '书名' || c0 === '') continue
    if (c0.startsWith('《')) sections[cur].push({ ...row })
  }
  return sections
}

/** 用表头行（著作/书名）映射列 key → 展示名，对齐 Excel 首列含义 */
function headerLabelMap(rows) {
  const header = rows.find((r) => {
    const c0 = String(r.col_0 ?? '').trim()
    return c0 === '著作' || c0 === '书名'
  })
  if (!header) return {}
  const map = {}
  for (const k of Object.keys(header)) {
    if (k === 'id') continue
    const lab = String(header[k] ?? '').trim()
    if (lab) map[k] = lab
  }
  return map
}

/** 卷轴正文：除题名外的非空字段（顺序与 JSON columns 一致） */
function detailEntriesForBook(row, columns, labels) {
  if (!row || !columns.length) return []
  const out = []
  for (const key of columns) {
    if (key === 'id' || key === 'col_0') continue
    const raw = row[key]
    const s = raw == null ? '' : String(raw).trim()
    if (!s) continue
    out.push({ key, label: labels[key] || key, value: s })
  }
  return out
}

/** 八类：自右上起顺时针；扇区等分，value 仅作条数展示 */
const PIE_SLICES = [
  {
    id: 'official-blue',
    label: '官式规范类',
    labelShort: '官式规范',
    value: 5,
    color: '#aed8ea',
    detail: '官修则例、工程做法、模数权衡等官式建筑规范文献，可与殿阁大木、斗科实例互证。',
  },
  {
    id: 'garden',
    label: '园林与美学类',
    labelShort: '园林美学',
    value: 5,
    color: '#b8e6c8',
    detail: '园冶、画意与空间经营等园林营造与审美论述，侧重景境与造园技法。',
  },
  {
    id: 'craft-folk',
    label: '匠作与民间技术类',
    labelShort: '匠作民间',
    value: 4,
    color: '#f2e8a8',
    detail: '民间做法、工具器械与口传技艺相关记载，补官书所不备的乡土营造经验。',
  },
  {
    id: 'history-gazette',
    label: '史料与方志类',
    labelShort: '史料方志',
    value: 8,
    color: '#f5c4b8',
    detail: '正史、笔记、档案中涉及修造、灾异与工役的史料，以及通志中的建置沿革。',
  },
  {
    id: 'local-tech',
    label: '地方志建项技篇类',
    labelShort: '建项技篇',
    value: 8,
    color: '#d4c8e8',
    detail: '府州县志中桥梁、祠庙、城垣等单项工程的修筑纪略与碑记汇录。',
  },
  {
    id: 'local-building',
    label: '营方志单筑专篇类',
    labelShort: '单筑专篇',
    value: 8,
    color: '#f0ebe3',
    detail: '以单栋建筑或院落为纲的专篇记述，便于检索地方典型形制与修缮史。',
  },
  {
    id: 'water-bridge',
    label: '水利与桥梁专著类',
    labelShort: '水利桥梁',
    value: 9,
    color: '#e8c896',
    detail: '闸坝、堤防、梁拱石桥等水利与桥梁专著及图说，关联交通与城池水利系统。',
  },
  {
    id: 'official-top',
    label: '官式规范类',
    labelShort: '官式规范',
    value: 5,
    color: '#e5dcc8',
    detail: '与官式术语、材分、定功限相关的另一批规范与图释条目，可与前类对照阅读。',
  },
]

const CX = 100
const CY = 100
const R = 88

const bookOpened = ref(false)
/** 「栋宇华章」→ 文献分类圆盘；「栋宇良工」→ 人物横卷时间线 */
const showPieDisc = ref(false)
const showPersonTimeline = ref(false)
/** 当前选中的数据门类（用于小书选中态；与下方圆盘/时间线展示一致） */
const activeCategoryId = ref(null)
const selectedId = ref(null)
const hoveredId = ref(null)

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function mixChannel(c, target, t) {
  return Math.round(c + (target - c) * t)
}

/** t>0 偏亮，t<0 偏暗 */
function shadeHex(hex, t) {
  const { r, g, b } = hexToRgb(hex)
  const target = t >= 0 ? 255 : 0
  const k = Math.abs(t)
  return `rgb(${mixChannel(r, target, k)},${mixChannel(g, target, k)},${mixChannel(b, target, k)})`
}

/** 八等分扇区；第一块中心约在右上（-π/4） */
const computedSlices = computed(() => {
  const n = PIE_SLICES.length
  const sweep = (2 * Math.PI) / n
  const halfFirst = sweep / 2
  let current = -Math.PI / 4 - halfFirst

  return PIE_SLICES.map((item) => {
    const start = current
    const end = current + sweep
    current = end

    const path = pieSlicePath(CX, CY, R, start, end)
    const mid = start + sweep / 2
    const lr = 58
    const labelX = CX + lr * Math.cos(mid)
    const labelY = CY + lr * Math.sin(mid)
    const textRotate = (mid * 180) / Math.PI + 90

    const colorLight = shadeHex(item.color, 0.28)
    const colorDark = shadeHex(item.color, -0.38)
    const gx1 = CX + Math.cos(mid) * 16
    const gy1 = CY + Math.sin(mid) * 16
    const gx2 = CX + Math.cos(mid) * 97
    const gy2 = CY + Math.sin(mid) * 97

    return {
      ...item,
      path,
      labelX,
      labelY,
      textRotate,
      colorLight,
      colorDark,
      gx1,
      gy1,
      gx2,
      gy2,
    }
  })
})

/** 悬停中的扇区最后绘制，避免放大后被邻块压住 */
const sortedSlicesForDraw = computed(() => {
  const list = computedSlices.value
  const h = hoveredId.value
  if (!h) return list
  const i = list.findIndex((s) => s.id === h)
  if (i < 0) return list
  const next = [...list]
  const [picked] = next.splice(i, 1)
  next.push(picked)
  return next
})

const selectedSlice = computed(() => PIE_SLICES.find((s) => s.id === selectedId.value) ?? null)

const sectionBooksMap = computed(() => booksRowsBySection(booksRaw.value))

const bookColumnLabels = computed(() => headerLabelMap(booksRaw.value))

const filteredBookEntries = computed(() => {
  const slice = selectedSlice.value
  if (!slice) return []
  const sec = SLICE_SECTION[slice.id]
  const list = sec ? sectionBooksMap.value[sec] || [] : []
  const seen = new Set()
  const out = []
  for (const row of list) {
    const title = String(row.col_0 ?? '').trim()
    if (!title || seen.has(title)) continue
    seen.add(title)
    out.push({ title, row })
  }
  return out
})

const bookScrollFields = computed(() => {
  const det = selectedBookDetail.value
  if (!det?.row) return []
  return detailEntriesForBook(det.row, booksColumns.value, bookColumnLabels.value)
})

function pieSlicePath(cx, cy, r, a0, a1) {
  const x1 = cx + r * Math.cos(a0)
  const y1 = cy + r * Math.sin(a0)
  const x2 = cx + r * Math.cos(a1)
  const y2 = cy + r * Math.sin(a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
}

function openBook() {
  bookOpened.value = true
  showPieDisc.value = false
  showPersonTimeline.value = false
  activeCategoryId.value = null
  selectedId.value = null
  hoveredId.value = null
  selectedBookDetail.value = null
}

function closeBook() {
  bookOpened.value = false
  showPieDisc.value = false
  showPersonTimeline.value = false
  activeCategoryId.value = null
  selectedId.value = null
  hoveredId.value = null
  selectedBookDetail.value = null
}

function clearArchiveCategory() {
  activeCategoryId.value = null
  showPieDisc.value = false
  showPersonTimeline.value = false
  selectedId.value = null
  selectedBookDetail.value = null
}

function selectArchiveCategory(id) {
  activeCategoryId.value = id
  if (id === 'huazhang') {
    showPieDisc.value = true
    showPersonTimeline.value = false
    selectedId.value = null
    selectedBookDetail.value = null
  } else if (id === 'lianggong') {
    showPieDisc.value = false
    showPersonTimeline.value = true
    selectedId.value = null
    selectedBookDetail.value = null
  } else if (id === 'zhengce') {
    showPieDisc.value = false
    showPersonTimeline.value = false
    selectedId.value = null
    selectedBookDetail.value = null
  }
}

function selectSlice(slice) {
  selectedId.value = selectedId.value === slice.id ? null : slice.id
}

function clearSelection() {
  selectedId.value = null
  selectedBookDetail.value = null
}

function openBookScroll(entry) {
  selectedBookDetail.value = { title: entry.title, row: entry.row }
}

function closeBookScroll() {
  selectedBookDetail.value = null
}

onMounted(async () => {
  try {
    const res = await fetch('/data/gujian_books.json', { cache: 'no-store' })
    if (!res.ok) {
      booksLoadError.value = '未找到 /data/gujian_books.json，请在「数据分析」目录运行 python build_database.py'
    } else {
      const data = await res.json()
      booksRaw.value = Array.isArray(data.books) ? data.books : []
      booksColumns.value = Array.isArray(data.columns) ? data.columns : []
    }
  } catch {
    booksLoadError.value = '书目数据加载失败'
  }

  try {
    const res = await fetch('/data/gujian_persons.json', { cache: 'no-store' })
    if (!res.ok) {
      personsLoadError.value =
        '未找到 /data/gujian_persons.json，请在「数据分析」目录运行 python build_database.py'
    } else {
      const data = await res.json()
      personsRaw.value = Array.isArray(data.persons) ? data.persons : []
      personsColumns.value = Array.isArray(data.columns) ? data.columns : []
    }
  } catch {
    personsLoadError.value = '人物数据加载失败'
  }

  try {
    const res = await fetch('/data/gujian_policies.json', { cache: 'no-store' })
    if (!res.ok) {
      policiesLoadError.value =
        '未找到 /data/gujian_policies.json，请在「数据分析」目录运行 python build_database.py 并确保存在 policy.xlsx'
    } else {
      const data = await res.json()
      policiesRaw.value = Array.isArray(data.policies) ? data.policies : []
      policiesColumns.value = Array.isArray(data.columns) ? data.columns : []
    }
  } catch {
    policiesLoadError.value = '政策数据加载失败'
  }
})
</script>

<style scoped>
.gujian-data-archive {
  --da-ink: #2c241c;
  --da-brown: #5c4033;
  --da-shadow: rgba(44, 36, 28, 0.22);
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
  color: var(--da-ink);
}

.gujian-data-archive__stage {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 280px;
  padding: 12px 8px 32px;
  overflow: visible;
}

.gujian-data-archive__stage--disc {
  min-height: min(78vh, 720px);
  padding-bottom: 16px;
}

.gujian-data-archive__opened-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1100px;
  gap: clamp(20px, 4vw, 32px);
}

.gujian-data-archive__timeline-slot,
.gujian-data-archive__policy-slot {
  width: 100%;
  max-width: 1100px;
}

@keyframes gujian-mini-book-float {
  0%,
  100% {
    transform: perspective(520px) rotateY(-22deg) rotateX(5deg) translateY(0) translateZ(0);
  }
  50% {
    transform: perspective(520px) rotateY(-22deg) rotateX(5deg) translateY(-13px) translateZ(7px);
  }
}

@keyframes gujian-mini-book-shadow {
  0%,
  100% {
    opacity: 0.38;
    transform: translateX(-50%) scaleX(1);
  }
  50% {
    opacity: 0.28;
    transform: translateX(-50%) scaleX(0.88);
  }
}

.gujian-data-archive__category-books {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(42px, 8vw, 76px);
  width: 100%;
  padding: 28px 16px 14px;
  perspective: 900px;
}

.gujian-data-archive__mini-book {
  position: relative;
  flex: 0 0 auto;
  width: clamp(162px, 36vw, 200px);
  height: clamp(222px, 50vw, 262px);
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.gujian-data-archive__mini-book__shadow {
  position: absolute;
  left: 50%;
  bottom: 7px;
  width: 78%;
  height: 22px;
  border-radius: 50%;
  transform: translateX(-50%);
  filter: blur(4px);
  pointer-events: none;
  animation: gujian-mini-book-shadow 3.2s ease-in-out infinite;
  transition:
    opacity 0.38s ease,
    transform 0.38s ease,
    filter 0.38s ease,
    background 0.38s ease,
    width 0.38s ease,
    height 0.38s ease;
}

/* 地面椭圆影：三本对应 红 / 绿 / 蓝 */
.gujian-data-archive__mini-book--huazhang .gujian-data-archive__mini-book__shadow {
  background: radial-gradient(
    ellipse at center,
    rgba(130, 32, 32, 0.55) 0%,
    rgba(95, 22, 22, 0.2) 52%,
    transparent 72%
  );
}

.gujian-data-archive__mini-book--lianggong .gujian-data-archive__mini-book__shadow {
  background: radial-gradient(
    ellipse at center,
    rgba(28, 110, 82, 0.52) 0%,
    rgba(18, 78, 58, 0.19) 52%,
    transparent 72%
  );
}

.gujian-data-archive__mini-book--zhengce .gujian-data-archive__mini-book__shadow {
  background: radial-gradient(
    ellipse at center,
    rgba(38, 82, 145, 0.52) 0%,
    rgba(26, 58, 118, 0.19) 52%,
    transparent 72%
  );
}

.gujian-data-archive__mini-book:nth-child(2) .gujian-data-archive__mini-book__shadow {
  animation-delay: 0.35s;
}

.gujian-data-archive__mini-book:nth-child(3) .gujian-data-archive__mini-book__shadow {
  animation-delay: 0.7s;
}

.gujian-data-archive__mini-book__tilt {
  position: absolute;
  left: 50%;
  bottom: 28px;
  display: flex;
  align-items: stretch;
  width: 142px;
  height: 186px;
  margin-left: -71px;
  transform-origin: 50% 100%;
  transform-style: preserve-3d;
  animation: gujian-mini-book-float 3.2s ease-in-out infinite;
  transition: transform 0.38s cubic-bezier(0.34, 1.2, 0.64, 1), filter 0.38s ease;
}

.gujian-data-archive__mini-book--huazhang .gujian-data-archive__mini-book__tilt {
  filter:
    drop-shadow(5px 14px 14px rgba(110, 28, 28, 0.42))
    drop-shadow(3px 6px 10px rgba(70, 14, 14, 0.28));
}

.gujian-data-archive__mini-book--lianggong .gujian-data-archive__mini-book__tilt {
  filter:
    drop-shadow(5px 14px 14px rgba(22, 95, 72, 0.42))
    drop-shadow(3px 6px 10px rgba(14, 62, 48, 0.28));
}

.gujian-data-archive__mini-book--zhengce .gujian-data-archive__mini-book__tilt {
  filter:
    drop-shadow(5px 14px 14px rgba(32, 72, 128, 0.42))
    drop-shadow(3px 6px 10px rgba(20, 48, 92, 0.28));
}

.gujian-data-archive__mini-book:nth-child(2) .gujian-data-archive__mini-book__tilt {
  animation-delay: 0.35s;
}

.gujian-data-archive__mini-book:nth-child(3) .gujian-data-archive__mini-book__tilt {
  animation-delay: 0.7s;
}

.gujian-data-archive__mini-book__spine {
  width: 21px;
  flex-shrink: 0;
  border-radius: 3px 0 0 3px;
  box-shadow:
    inset -3px 0 6px rgba(0, 0, 0, 0.35),
    inset 2px 0 4px rgba(255, 255, 255, 0.12);
}

.gujian-data-archive__mini-book--huazhang .gujian-data-archive__mini-book__spine {
  background: linear-gradient(90deg, #3d1f1f 0%, #5c2a2a 40%, #4a2222 100%);
}

.gujian-data-archive__mini-book--lianggong .gujian-data-archive__mini-book__spine {
  background: linear-gradient(90deg, #143838 0%, #1f4d4a 45%, #183a38 100%);
}

.gujian-data-archive__mini-book--zhengce .gujian-data-archive__mini-book__spine {
  background: linear-gradient(90deg, #1a2840 0%, #2a3d5c 45%, #1f3048 100%);
}

.gujian-data-archive__mini-book__cover {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 11px;
  padding: 13px 9px;
  border-radius: 0 6px 6px 0;
  transition: box-shadow 0.38s ease;
  border: 1px solid rgba(212, 175, 55, 0.45);
  border-left: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 250, 235, 0.35),
    inset 0 -2px 8px rgba(0, 0, 0, 0.12),
    2px 0 0 rgba(0, 0, 0, 0.08);
}

.gujian-data-archive__mini-book--huazhang .gujian-data-archive__mini-book__cover {
  background: linear-gradient(145deg, #8b3a3a 0%, #6b2828 35%, #5a2228 70%, #4a1e22 100%);
}

.gujian-data-archive__mini-book--lianggong .gujian-data-archive__mini-book__cover {
  background: linear-gradient(145deg, #2d6a62 0%, #1e524c 40%, #164540 100%);
}

.gujian-data-archive__mini-book--zhengce .gujian-data-archive__mini-book__cover {
  background: linear-gradient(145deg, #3d5270 0%, #2c3e5a 45%, #243550 100%);
}

.gujian-data-archive__mini-book__seal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 2px solid rgba(212, 175, 55, 0.85);
  border-radius: 6px;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
  font-size: 23px;
  font-weight: 700;
  color: #f5e6b8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  background: radial-gradient(circle at 30% 25%, rgba(255, 240, 200, 0.2), transparent 55%),
    rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.gujian-data-archive__mini-book__title {
  font-family: 'STKaiti', 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
  font-size: clamp(1.02rem, 3.7vw, 1.2rem);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0.12em;
  color: #fdf6e3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.45);
  writing-mode: vertical-rl;
  text-orientation: upright;
  max-height: 6.6em;
}

.gujian-data-archive__mini-book__foredge {
  width: 15px;
  flex-shrink: 0;
  border-radius: 0 5px 5px 0;
  background: repeating-linear-gradient(
    90deg,
    #e8dcc4 0px,
    #e8dcc4 1px,
    #d4c4a8 1px,
    #d4c4a8 2px
  );
  box-shadow: inset 2px 0 4px rgba(255, 255, 255, 0.35), inset -2px 0 5px rgba(0, 0, 0, 0.15);
}

.gujian-data-archive__mini-book--huazhang:hover .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(560px) rotateY(-17deg) rotateX(1deg) translateY(-20px) translateZ(22px) scale(1.05);
  filter:
    drop-shadow(10px 32px 30px rgba(95, 18, 18, 0.58))
    drop-shadow(6px 18px 24px rgba(130, 35, 35, 0.45))
    drop-shadow(3px 8px 16px rgba(60, 12, 12, 0.42))
    drop-shadow(1px 2px 5px rgba(40, 8, 8, 0.35));
}

.gujian-data-archive__mini-book--lianggong:hover .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(560px) rotateY(-17deg) rotateX(1deg) translateY(-20px) translateZ(22px) scale(1.05);
  filter:
    drop-shadow(10px 32px 30px rgba(12, 72, 52, 0.55))
    drop-shadow(6px 18px 24px rgba(22, 105, 78, 0.42))
    drop-shadow(3px 8px 16px rgba(10, 52, 38, 0.4))
    drop-shadow(1px 2px 5px rgba(6, 38, 28, 0.32));
}

.gujian-data-archive__mini-book--zhengce:hover .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(560px) rotateY(-17deg) rotateX(1deg) translateY(-20px) translateZ(22px) scale(1.05);
  filter:
    drop-shadow(10px 32px 30px rgba(18, 48, 105, 0.55))
    drop-shadow(6px 18px 24px rgba(32, 78, 145, 0.42))
    drop-shadow(3px 8px 16px rgba(14, 38, 82, 0.4))
    drop-shadow(1px 2px 5px rgba(10, 28, 62, 0.32));
}

.gujian-data-archive__mini-book:hover .gujian-data-archive__mini-book__cover {
  box-shadow:
    inset 0 1px 0 rgba(255, 250, 235, 0.42),
    inset 0 -3px 12px rgba(0, 0, 0, 0.22),
    3px 2px 8px rgba(0, 0, 0, 0.18),
    2px 0 0 rgba(0, 0, 0, 0.1);
}

.gujian-data-archive__mini-book--huazhang:hover .gujian-data-archive__mini-book__shadow {
  animation: none;
  width: 90%;
  height: 30px;
  bottom: 4px;
  opacity: 1;
  filter: blur(8px);
  background: radial-gradient(
    ellipse at center,
    rgba(95, 18, 18, 0.82) 0%,
    rgba(130, 35, 35, 0.48) 40%,
    rgba(90, 25, 25, 0.18) 62%,
    transparent 76%
  );
  transform: translateX(-50%) translateY(5px) scaleX(0.96);
}

.gujian-data-archive__mini-book--lianggong:hover .gujian-data-archive__mini-book__shadow {
  animation: none;
  width: 90%;
  height: 30px;
  bottom: 4px;
  opacity: 1;
  filter: blur(8px);
  background: radial-gradient(
    ellipse at center,
    rgba(12, 78, 55, 0.78) 0%,
    rgba(22, 108, 82, 0.45) 40%,
    rgba(16, 72, 52, 0.18) 62%,
    transparent 76%
  );
  transform: translateX(-50%) translateY(5px) scaleX(0.96);
}

.gujian-data-archive__mini-book--zhengce:hover .gujian-data-archive__mini-book__shadow {
  animation: none;
  width: 90%;
  height: 30px;
  bottom: 4px;
  opacity: 1;
  filter: blur(8px);
  background: radial-gradient(
    ellipse at center,
    rgba(18, 52, 108, 0.78) 0%,
    rgba(32, 82, 148, 0.45) 40%,
    rgba(22, 58, 115, 0.18) 62%,
    transparent 76%
  );
  transform: translateX(-50%) translateY(5px) scaleX(0.96);
}

.gujian-data-archive__mini-book:active .gujian-data-archive__mini-book__tilt {
  transform: perspective(520px) rotateY(-22deg) rotateX(5deg) translateY(-6px) scale(0.98);
}

.gujian-data-archive__mini-book--huazhang.gujian-data-archive__mini-book--active .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(520px) rotateY(-20deg) rotateX(4deg) translateY(-14px) translateZ(14px);
  filter:
    drop-shadow(4px 14px 14px rgba(212, 175, 55, 0.32))
    drop-shadow(4px 12px 12px rgba(120, 28, 28, 0.38))
    drop-shadow(2px 6px 10px rgba(70, 14, 14, 0.28));
}

.gujian-data-archive__mini-book--lianggong.gujian-data-archive__mini-book--active .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(520px) rotateY(-20deg) rotateX(4deg) translateY(-14px) translateZ(14px);
  filter:
    drop-shadow(4px 14px 14px rgba(212, 175, 55, 0.32))
    drop-shadow(4px 12px 12px rgba(22, 95, 72, 0.38))
    drop-shadow(2px 6px 10px rgba(14, 62, 48, 0.28));
}

.gujian-data-archive__mini-book--zhengce.gujian-data-archive__mini-book--active .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(520px) rotateY(-20deg) rotateX(4deg) translateY(-14px) translateZ(14px);
  filter:
    drop-shadow(4px 14px 14px rgba(212, 175, 55, 0.32))
    drop-shadow(4px 12px 12px rgba(32, 78, 135, 0.38))
    drop-shadow(2px 6px 10px rgba(20, 52, 98, 0.28));
}

.gujian-data-archive__mini-book--active .gujian-data-archive__mini-book__cover {
  box-shadow:
    inset 0 1px 0 rgba(255, 250, 235, 0.45),
    inset 0 -2px 8px rgba(0, 0, 0, 0.12),
    0 0 0 2px rgba(212, 175, 55, 0.55),
    2px 0 0 rgba(0, 0, 0, 0.08);
}

.gujian-data-archive__mini-book--active .gujian-data-archive__mini-book__shadow {
  animation-play-state: paused;
  opacity: 0.36;
}

/* 已选中时再悬停：保持金边选中态，同时沿用加重彩色阴影与浮起 */
.gujian-data-archive__mini-book--huazhang.gujian-data-archive__mini-book--active:hover .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(560px) rotateY(-17deg) rotateX(1deg) translateY(-20px) translateZ(22px) scale(1.05);
  filter:
    drop-shadow(10px 32px 30px rgba(95, 18, 18, 0.58))
    drop-shadow(6px 18px 24px rgba(130, 35, 35, 0.45))
    drop-shadow(3px 8px 16px rgba(60, 12, 12, 0.42))
    drop-shadow(1px 2px 5px rgba(40, 8, 8, 0.35));
}

.gujian-data-archive__mini-book--lianggong.gujian-data-archive__mini-book--active:hover .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(560px) rotateY(-17deg) rotateX(1deg) translateY(-20px) translateZ(22px) scale(1.05);
  filter:
    drop-shadow(10px 32px 30px rgba(12, 72, 52, 0.55))
    drop-shadow(6px 18px 24px rgba(22, 105, 78, 0.42))
    drop-shadow(3px 8px 16px rgba(10, 52, 38, 0.4))
    drop-shadow(1px 2px 5px rgba(6, 38, 28, 0.32));
}

.gujian-data-archive__mini-book--zhengce.gujian-data-archive__mini-book--active:hover .gujian-data-archive__mini-book__tilt {
  animation-play-state: paused;
  transform: perspective(560px) rotateY(-17deg) rotateX(1deg) translateY(-20px) translateZ(22px) scale(1.05);
  filter:
    drop-shadow(10px 32px 30px rgba(18, 48, 105, 0.55))
    drop-shadow(6px 18px 24px rgba(32, 78, 145, 0.42))
    drop-shadow(3px 8px 16px rgba(14, 38, 82, 0.4))
    drop-shadow(1px 2px 5px rgba(10, 28, 62, 0.32));
}

.gujian-data-archive__mini-book--active:hover .gujian-data-archive__mini-book__cover {
  box-shadow:
    inset 0 1px 0 rgba(255, 250, 235, 0.45),
    inset 0 -3px 12px rgba(0, 0, 0, 0.2),
    0 0 0 2px rgba(212, 175, 55, 0.55),
    3px 2px 8px rgba(0, 0, 0, 0.16),
    2px 0 0 rgba(0, 0, 0, 0.08);
}

.gujian-data-archive__mini-book--huazhang.gujian-data-archive__mini-book--active:hover .gujian-data-archive__mini-book__shadow {
  animation: none;
  width: 90%;
  height: 30px;
  bottom: 4px;
  opacity: 1;
  filter: blur(8px);
  background: radial-gradient(
    ellipse at center,
    rgba(95, 18, 18, 0.82) 0%,
    rgba(130, 35, 35, 0.48) 40%,
    rgba(90, 25, 25, 0.18) 62%,
    transparent 76%
  );
  transform: translateX(-50%) translateY(5px) scaleX(0.96);
}

.gujian-data-archive__mini-book--lianggong.gujian-data-archive__mini-book--active:hover .gujian-data-archive__mini-book__shadow {
  animation: none;
  width: 90%;
  height: 30px;
  bottom: 4px;
  opacity: 1;
  filter: blur(8px);
  background: radial-gradient(
    ellipse at center,
    rgba(12, 78, 55, 0.78) 0%,
    rgba(22, 108, 82, 0.45) 40%,
    rgba(16, 72, 52, 0.18) 62%,
    transparent 76%
  );
  transform: translateX(-50%) translateY(5px) scaleX(0.96);
}

.gujian-data-archive__mini-book--zhengce.gujian-data-archive__mini-book--active:hover .gujian-data-archive__mini-book__shadow {
  animation: none;
  width: 90%;
  height: 30px;
  bottom: 4px;
  opacity: 1;
  filter: blur(8px);
  background: radial-gradient(
    ellipse at center,
    rgba(18, 52, 108, 0.78) 0%,
    rgba(32, 82, 148, 0.45) 40%,
    rgba(22, 58, 115, 0.18) 62%,
    transparent 76%
  );
  transform: translateX(-50%) translateY(5px) scaleX(0.96);
}

.gujian-data-archive__mini-book:focus {
  outline: none;
}

.gujian-data-archive__mini-book:focus-visible .gujian-data-archive__mini-book__cover {
  outline: 2px solid rgba(212, 175, 55, 0.85);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .gujian-data-archive__mini-book__tilt,
  .gujian-data-archive__mini-book__shadow {
    animation: none !important;
  }

  .gujian-data-archive__big-book-seal {
    animation: none !important;
  }

  .gujian-data-archive__ink-rotate,
  .gujian-data-archive__ink-path,
  .gujian-data-archive__ink-glow,
  .gujian-data-archive__prop,
  .gujian-data-archive__ink-fleck,
  .gujian-data-archive__landing-mist {
    animation: none !important;
  }

  .gujian-data-archive__ink-svg {
    transform: none !important;
  }
}

/* —— 数据分析入口：油墨圈 + 书居中 + 竹简毛笔砚（动效） —— */
.gujian-data-archive__landing {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 8px 0 28px;
}

.gujian-data-archive__landing-canvas {
  position: relative;
  width: 100%;
  max-width: min(920px, 100%);
  min-height: min(520px, 88vh);
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
}

.gujian-data-archive__landing-mist {
  position: absolute;
  inset: -12% -8% -8% -8%;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(ellipse 72% 58% at 50% 48%, rgba(255, 248, 235, 0.45) 0%, transparent 62%),
    radial-gradient(ellipse 88% 70% at 50% 52%, rgba(232, 216, 190, 0.22) 0%, transparent 68%);
  animation: gujian-landing-mist-breathe 10s ease-in-out infinite;
}

@keyframes gujian-landing-mist-breathe {
  0%,
  100% {
    opacity: 0.85;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}

.gujian-data-archive__landing-ring-layer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(104%, 640px);
  max-width: 96vw;
  aspect-ratio: 1;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gujian-data-archive__ink-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  animation: gujian-ink-svg-pulse 14s ease-in-out infinite;
}

@keyframes gujian-ink-svg-pulse {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0 transparent);
  }
  50% {
    transform: scale(1.02);
    filter: drop-shadow(0 0 28px rgba(42, 34, 24, 0.08));
  }
}

.gujian-data-archive__ink-rotate {
  transform-box: fill-box;
  transform-origin: 50% 50%;
}

.gujian-data-archive__ink-rotate--slow {
  animation: gujian-ink-orbit 100s linear infinite;
}

.gujian-data-archive__ink-rotate--counter {
  animation: gujian-ink-orbit-rev 140s linear infinite;
}

@keyframes gujian-ink-orbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes gujian-ink-orbit-rev {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

.gujian-data-archive__ink-path--outer {
  animation: gujian-ink-dash 22s ease-in-out infinite;
  stroke-dasharray: 820 180;
  stroke-dashoffset: 0;
}

.gujian-data-archive__ink-path--mid {
  animation: gujian-ink-dash-mid 18s ease-in-out infinite reverse;
  stroke-dasharray: 680 220;
  stroke-dashoffset: 60;
}

.gujian-data-archive__ink-path--inner {
  stroke-dasharray: 560 240;
  animation: gujian-ink-dash-inner 26s ease-in-out infinite;
}

@keyframes gujian-ink-dash {
  0%,
  100% {
    stroke-dashoffset: 0;
    opacity: 0.88;
  }
  50% {
    stroke-dashoffset: -220;
    opacity: 1;
  }
}

@keyframes gujian-ink-dash-mid {
  0%,
  100% {
    stroke-dashoffset: 60;
  }
  50% {
    stroke-dashoffset: -160;
  }
}

@keyframes gujian-ink-dash-inner {
  0%,
  100% {
    stroke-dashoffset: 0;
    opacity: 0.75;
  }
  50% {
    stroke-dashoffset: 140;
    opacity: 0.95;
  }
}

.gujian-data-archive__ink-glow {
  animation: gujian-ink-glow-pulse 8s ease-in-out infinite;
}

@keyframes gujian-ink-glow-pulse {
  0%,
  100% {
    stroke-opacity: 0.06;
  }
  50% {
    stroke-opacity: 0.12;
  }
}

.gujian-data-archive__landing-center {
  position: relative;
  z-index: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(12px, 3vw, 28px);
}

.gujian-data-archive__prop {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  filter: drop-shadow(4px 10px 14px rgba(44, 36, 28, 0.18));
}

.gujian-data-archive__prop-svg {
  display: block;
  width: 100%;
  height: auto;
}

/* 与参考图一致：笔尖朝下略偏右，似轻靠砚边 */
.gujian-data-archive__prop-svg--ref-brush {
  overflow: visible;
}

.gujian-data-archive__prop--bamboo {
  left: clamp(0%, 1vw, 4%);
  top: 10%;
  width: min(18%, 132px);
  animation: gujian-prop-float-a 5.5s ease-in-out infinite;
}

/* 砚在毛笔左下方：右缘让出笔宽，底缘略低于笔 */
.gujian-data-archive__prop--inkstone {
  right: min(19%, 128px);
  bottom: -10px;
  width: min(26%, 168px);
  animation: gujian-prop-float-b 6.8s ease-in-out infinite 0.4s;
  opacity: 0.95;
  z-index: 5;
}

.gujian-data-archive__prop--brush {
  right: min(24%, 132px);
  bottom: 5%;
  width: min(13%, 100px);
  transform-origin: 92% 98%;
  animation: gujian-prop-float-c 6.2s ease-in-out infinite 0.2s;
  z-index: 3;
}

@keyframes gujian-prop-float-a {
  0%,
  100% {
    transform: translateY(0) rotate(-1.5deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
  }
}

@keyframes gujian-prop-float-b {
  0%,
  100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) translateX(-4px) rotate(-1deg);
  }
}

@keyframes gujian-prop-float-c {
  0%,
  100% {
    transform: translateY(0) rotate(18deg);
  }
  50% {
    transform: translateY(-10px) rotate(14deg);
  }
}

.gujian-data-archive__ink-fleck {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(20, 16, 12, 0.55) 0%, transparent 70%);
  pointer-events: none;
}

.gujian-data-archive__ink-fleck--a {
  width: 7px;
  height: 5px;
  right: 8%;
  bottom: 38%;
  animation: gujian-fleck-fade 3.8s ease-in-out infinite;
}

.gujian-data-archive__ink-fleck--b {
  width: 5px;
  height: 4px;
  right: 22%;
  bottom: 52%;
  animation: gujian-fleck-fade 4.6s ease-in-out infinite 1.1s;
}

@keyframes gujian-fleck-fade {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.15);
  }
}

@media (max-width: 640px) {
  .gujian-data-archive__landing-canvas {
    min-height: min(480px, 82vh);
  }

  .gujian-data-archive__prop--bamboo {
    width: min(22%, 108px);
    left: 0;
    top: 8%;
    opacity: 0.94;
  }

  .gujian-data-archive__prop--inkstone {
    width: min(34%, 130px);
    right: min(22%, 92px);
    bottom: -12px;
  }

  .gujian-data-archive__prop--brush {
    width: min(16%, 78px);
    right: min(31%, 78px);
    bottom: 3%;
  }
}

/* 中间大书 */
.gujian-data-archive__big-book {
  --da-book-brown-shadow: rgba(61, 46, 38, 0.42);
  --da-book-brown-mid: rgba(92, 64, 51, 0.32);
  --da-book-brown-soft: rgba(74, 55, 40, 0.22);
  position: relative;
  display: flex;
  align-items: stretch;
  border: none;
  cursor: pointer;
  padding: 0;
  background: transparent;
  border-radius: 6px;
  /* 略歪着放，少点「供在案上」的端正感 */
  transform: translateY(0) scale(1) perspective(1000px) rotateY(0deg) rotate(-2.8deg);
  transform-style: preserve-3d;
  transition:
    transform 0.45s cubic-bezier(0.34, 1.25, 0.64, 1),
    filter 0.35s ease;
  filter: drop-shadow(6px 10px 14px var(--da-book-brown-soft)) drop-shadow(3px 6px 10px rgba(0, 0, 0, 0.1));
}

.gujian-data-archive__big-book::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%) translateZ(-1px);
  width: 72%;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    rgba(61, 46, 38, 0.38) 0%,
    rgba(92, 64, 51, 0.22) 45%,
    transparent 68%
  );
  filter: blur(5px);
  z-index: -1;
  pointer-events: none;
  transition:
    bottom 0.4s cubic-bezier(0.34, 1.15, 0.64, 1),
    width 0.4s ease,
    height 0.4s ease,
    filter 0.35s ease,
    background 0.35s ease;
}

.gujian-data-archive__big-book:hover {
  transform: translateY(-14px) scale(1.05) perspective(1000px) rotateY(-5deg) rotate(-0.8deg);
  filter: drop-shadow(16px 26px 28px var(--da-book-brown-shadow))
    drop-shadow(8px 14px 20px var(--da-book-brown-mid)) drop-shadow(4px 8px 12px var(--da-book-brown-soft))
    drop-shadow(2px 4px 6px rgba(44, 36, 28, 0.18));
}

.gujian-data-archive__big-book:hover::after {
  bottom: -22px;
  width: 88%;
  height: 22px;
  filter: blur(11px);
  background: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    rgba(61, 46, 38, 0.48) 0%,
    rgba(92, 64, 51, 0.3) 40%,
    rgba(120, 90, 65, 0.12) 62%,
    transparent 75%
  );
}

.gujian-data-archive__big-book:active {
  transform: translateY(-6px) scale(1.02) perspective(1000px) rotateY(-2deg) rotate(-2deg);
  filter: drop-shadow(10px 16px 20px var(--da-book-brown-mid));
}

.gujian-data-archive__big-book-spine {
  width: 32px;
  background:
    linear-gradient(90deg, rgba(212, 175, 90, 0.12) 0%, transparent 18%, transparent 82%, rgba(0, 0, 0, 0.15) 100%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0, 0, 0, 0.06) 3px,
      rgba(0, 0, 0, 0.06) 4px
    ),
    linear-gradient(90deg, #1e1410 0%, #3d2a22 38%, #4a3428 52%, #342218 100%);
  border-radius: 5px 0 0 5px;
  box-shadow:
    inset -5px 0 14px rgba(0, 0, 0, 0.45),
    inset 2px 0 0 rgba(255, 248, 228, 0.06);
  transition: box-shadow 0.35s ease;
}

.gujian-data-archive__big-book:hover .gujian-data-archive__big-book-spine {
  box-shadow:
    inset -7px 0 18px rgba(0, 0, 0, 0.52),
    inset 2px 0 0 rgba(255, 248, 228, 0.08),
    6px 8px 16px rgba(61, 46, 38, 0.35),
    2px 0 8px rgba(92, 64, 51, 0.25);
}

.gujian-data-archive__big-book-cover {
  position: relative;
  width: min(292px, 76vw);
  min-height: 384px;
  padding: 38px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  overflow: hidden;
  /* 更奶、更松：像随手搁在案上的笺册，少层硬框 */
  background:
    radial-gradient(ellipse 95% 70% at 18% 22%, rgba(255, 248, 230, 0.9) 0%, transparent 42%),
    radial-gradient(ellipse 60% 50% at 92% 78%, rgba(255, 220, 200, 0.14) 0%, transparent 48%),
    linear-gradient(165deg, #faf3e6 0%, #f0e4d0 35%, #e8d8c4 70%, #dec9b4 100%);
  border: none;
  border-radius: 0 14px 16px 0;
  box-shadow:
    inset 0 0 0 1px rgba(255, 252, 245, 0.9),
    inset 0 0 0 2px rgba(184, 140, 88, 0.28),
    0 2px 0 rgba(255, 255, 255, 0.5),
    0 10px 24px rgba(74, 52, 36, 0.1);
  transition: box-shadow 0.35s ease;
}

.gujian-data-archive__big-book-cover-texture {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.09;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

.gujian-data-archive__big-book-cover-frame {
  position: absolute;
  z-index: 0;
  inset: 18px 16px 20px 18px;
  pointer-events: none;
  border: 1px dashed rgba(139, 90, 48, 0.18);
  border-radius: 10px;
  opacity: 0.85;
}

.gujian-data-archive__big-book-cover > .gujian-data-archive__big-book-seal,
.gujian-data-archive__big-book-cover > .gujian-data-archive__big-book-title,
.gujian-data-archive__big-book-cover > .gujian-data-archive__big-book-sub,
.gujian-data-archive__big-book-cover > .gujian-data-archive__big-book-whisper {
  position: relative;
  z-index: 1;
}

.gujian-data-archive__big-book:hover .gujian-data-archive__big-book-cover {
  box-shadow:
    inset 0 0 0 1px rgba(255, 252, 245, 0.95),
    inset 0 0 0 2px rgba(200, 155, 95, 0.38),
    0 3px 0 rgba(255, 255, 255, 0.55),
    12px 22px 36px rgba(61, 46, 38, 0.16),
    4px 12px 18px rgba(92, 64, 51, 0.1);
}

.gujian-data-archive__big-book-seal {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'STKaiti', 'KaiTi', 'FangSong', 'SimSun', serif;
  font-size: 1.38rem;
  font-weight: 700;
  color: #fff8f2;
  letter-spacing: 0;
  /* 闲章贴纸感：圆角朱砂，不那么「庙堂」 */
  background:
    radial-gradient(circle at 30% 28%, rgba(255, 230, 220, 0.45), transparent 50%),
    linear-gradient(155deg, #d65c52 0%, #b83c38 42%, #8f2a2c 100%);
  border: 2px solid rgba(120, 40, 38, 0.55);
  border-radius: 14px;
  transform: rotate(-7deg);
  box-shadow:
    0 2px 0 rgba(0, 0, 0, 0.12),
    0 10px 20px rgba(180, 60, 52, 0.25),
    inset 0 2px 3px rgba(255, 255, 255, 0.35);
  animation: gujian-big-book-seal-sway 3.2s ease-in-out infinite;
}

@keyframes gujian-big-book-seal-sway {
  0%,
  100% {
    transform: rotate(-7deg) translateY(0);
  }
  50% {
    transform: rotate(-5deg) translateY(-2px) scale(1.03);
  }
}

.gujian-data-archive__big-book-title {
  margin: 0;
  padding-top: 2px;
  font-family: 'STKaiti', 'KaiTi', 'FangSong', 'SimSun', serif;
  font-size: clamp(1.42rem, 4vw, 1.82rem);
  font-weight: 700;
  letter-spacing: 0.22em;
  text-indent: 0.22em;
  line-height: 1.58;
  text-align: center;
  color: #2a2218;
  text-shadow:
    0 1px 0 rgba(255, 252, 245, 0.9),
    0 3px 8px rgba(92, 64, 51, 0.06);
}

.gujian-data-archive__big-book-title::before {
  content: '✿';
  display: block;
  font-size: 0.5em;
  letter-spacing: 0;
  text-indent: 0;
  margin-bottom: 0.5em;
  color: rgba(200, 120, 100, 0.55);
  text-shadow: none;
  transform: scaleX(1.1);
}

.gujian-data-archive__big-book-sub {
  margin: 0;
  padding-top: 4px;
  border-top: none;
  font-family: 'STKaiti', 'KaiTi', 'FangSong', 'SimSun', serif;
  font-size: 0.8rem;
  color: #6b5344;
  letter-spacing: 0.18em;
  text-indent: 0.18em;
  opacity: 0.88;
}

.gujian-data-archive__big-book-whisper {
  margin-top: 6px;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: rgba(139, 90, 48, 0.55);
  transform: rotate(-1.5deg);
  font-family: 'STKaiti', 'KaiTi', 'FangSong', 'SimSun', serif;
}

.gujian-data-archive__big-book-edge {
  width: 16px;
  background:
    repeating-linear-gradient(
      90deg,
      #fdf8f0 0px,
      #f0e6d4 1px,
      #faf4ea 2px,
      #ebe0d0 3px
    );
  border-radius: 0 12px 14px 0;
  box-shadow:
    inset 3px 0 8px rgba(0, 0, 0, 0.05),
    inset -1px 0 0 rgba(255, 252, 245, 0.5);
  transition: box-shadow 0.35s ease;
}

.gujian-data-archive__big-book:hover .gujian-data-archive__big-book-edge {
  box-shadow:
    inset 2px 0 6px rgba(0, 0, 0, 0.08),
    4px 10px 18px rgba(61, 46, 38, 0.18);
}

/* 可交互圆盘 */
.gujian-data-archive__disc-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 640px;
  padding: 8px 12px 12px;
  gap: 16px;
  overflow: visible;
}

.gujian-data-archive__pie-outer {
  position: relative;
  width: min(92vw, 540px);
  perspective: 980px;
  perspective-origin: 50% 42%;
  padding: 10px 12px 36px;
  overflow: visible;
}

.gujian-data-archive__pie-outer::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 10px;
  width: 78%;
  height: 22px;
  transform: translateX(-50%) scaleX(0.88);
  background: radial-gradient(ellipse at 50% 50%, rgba(44, 36, 28, 0.38) 0%, rgba(92, 64, 51, 0.12) 45%, transparent 70%);
  filter: blur(16px);
  pointer-events: none;
  z-index: 1;
}

/* 圆盘与小朵云叠放区 */
.gujian-data-archive__pie-disc-area {
  position: relative;
  width: 100%;
  z-index: 0;
}

/* 小朵：压在圆盘之上，不挡点击 */
.gujian-data-archive__xiangyun-top {
  position: absolute;
  left: 50%;
  top: 0;
  z-index: 4;
  width: min(42vw, 178px);
  transform: translate(-50%, -46%);
  pointer-events: none;
  transform-style: preserve-3d;
}

.gujian-data-archive__pie-tilt {
  position: relative;
  z-index: 2;
  overflow: visible;
  transform-style: preserve-3d;
  transform: rotateX(14deg) rotateY(-6deg) translateZ(6px);
  filter: drop-shadow(18px 28px 34px rgba(61, 46, 38, 0.3)) drop-shadow(8px 14px 22px rgba(44, 36, 28, 0.18));
}

/* 两朵大云：圆盘下方 */
.gujian-data-archive__float-clouds {
  position: relative;
  width: 100%;
  height: 148px;
  margin-top: -40px;
  margin-bottom: 12px;
  z-index: 0;
  pointer-events: none;
  perspective: 880px;
  perspective-origin: 50% 0%;
}

.gujian-data-archive__xiangyun {
  position: absolute;
  bottom: 0;
  transform-style: preserve-3d;
  transform-origin: center bottom;
}

.gujian-data-archive__xiangyun-inner {
  transform-style: preserve-3d;
  animation: gujian-xiangyun-wander 10s ease-in-out infinite;
  will-change: transform;
}

.gujian-data-archive__xiangyun-inner--top {
  animation-duration: 8.5s;
  animation-delay: -2s;
}

.gujian-data-archive__xiangyun-inner--br {
  animation-duration: 12s;
  animation-delay: -5s;
  animation-direction: reverse;
}

@keyframes gujian-xiangyun-wander {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  20% {
    transform: translate3d(18px, -14px, 8px) rotate(1.2deg);
  }
  40% {
    transform: translate3d(42px, -8px, 4px) rotate(0.4deg);
  }
  60% {
    transform: translate3d(22px, -22px, 12px) rotate(-0.8deg);
  }
  80% {
    transform: translate3d(-8px, -12px, 6px) rotate(-0.3deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .gujian-data-archive__xiangyun-inner {
    animation: none;
  }
}

.gujian-data-archive__xiangyun-img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 12px 22px rgba(148, 163, 184, 0.4)) drop-shadow(0 4px 10px rgba(100, 116, 139, 0.18));
}

.gujian-data-archive__xiangyun-img--flip {
  transform: scaleX(-1);
}

.gujian-data-archive__xiangyun-img--sm {
  filter: drop-shadow(0 8px 16px rgba(148, 163, 184, 0.45)) drop-shadow(0 2px 6px rgba(100, 116, 139, 0.2));
}

.gujian-data-archive__xiangyun--bottom-left {
  left: -7%;
  width: min(88vw, 408px);
  transform: rotateX(14deg) rotateY(2deg) rotateZ(-4deg) translateZ(-2px);
}

.gujian-data-archive__xiangyun--bottom-right {
  right: -7%;
  width: min(88vw, 408px);
  transform: rotateX(15deg) rotateZ(5deg) translateZ(-3px);
}

.gujian-data-archive__pie {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  overflow: visible;
  background:
    radial-gradient(circle at 38% 32%, rgba(255, 255, 255, 0.65) 0%, transparent 42%),
    radial-gradient(circle at 50% 50%, #faf4ea 0%, #e8dcc8 48%, #d4c4a8 78%, #c9b896 100%);
  border-radius: 50%;
  box-shadow:
    inset 0 2px 12px rgba(255, 255, 255, 0.55),
    inset 0 -8px 24px rgba(74, 55, 40, 0.12);
}

.gujian-data-archive__pie-rim-ancient {
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(40, 28, 14, 0.35));
}

.gujian-data-archive__pie-rim-orbit-outer {
  stroke: url(#gujian-rim-gold-orbit);
  stroke-width: 1.4;
  pointer-events: none;
  filter: drop-shadow(0 0.5px 0 rgba(255, 252, 235, 0.35));
}

.gujian-data-archive__pie-rim-orbit-outer-hi {
  stroke: rgba(255, 252, 240, 0.48);
  stroke-width: 0.55;
  pointer-events: none;
}

.gujian-data-archive__pie-rim-orbit-inner {
  stroke: url(#gujian-rim-gold-orbit);
  stroke-width: 1.15;
  pointer-events: none;
  opacity: 0.98;
}

.gujian-data-archive__pie-rim-orbit-inner-hi {
  stroke: rgba(255, 248, 228, 0.42);
  stroke-width: 0.48;
  pointer-events: none;
}

.gujian-data-archive__pie-body {
  overflow: visible;
}

.gujian-data-archive__slice-group {
  cursor: pointer;
  transition: transform 0.32s cubic-bezier(0.34, 1.15, 0.64, 1);
}

/* 绕圆盘中心 (100,100) 放大，不依赖扇区自身包围盒 */
.gujian-data-archive__slice-group--pop {
  transform: translate(100px, 100px) scale(1.09) translate(-100px, -100px);
}

.gujian-data-archive__slice-group:focus {
  outline: none;
}

.gujian-data-archive__slice-group:focus-visible .gujian-data-archive__slice-path {
  stroke: rgba(122, 46, 46, 0.82);
  stroke-width: 1.88;
}

.gujian-data-archive__slice-path-groove {
  pointer-events: none;
  stroke: rgba(14, 9, 5, 0.62);
  stroke-width: 3.15;
  filter: drop-shadow(0.35px 0.9px 0 rgba(0, 0, 0, 0.35));
}

.gujian-data-archive__slice-group--pop .gujian-data-archive__slice-path-groove {
  stroke: rgba(10, 6, 3, 0.68);
  stroke-width: 3.45;
  filter: drop-shadow(0.45px 1.1px 0 rgba(0, 0, 0, 0.42));
}

.gujian-data-archive__slice-path {
  paint-order: fill stroke;
  transition: stroke 0.2s ease, stroke-width 0.2s ease, filter 0.28s ease;
  filter:
    drop-shadow(1px 2.2px 3px rgba(22, 15, 8, 0.45))
    drop-shadow(0.6px 1.35px 0 rgba(0, 0, 0, 0.26))
    drop-shadow(-0.55px -0.85px 0 rgba(255, 255, 255, 0.52))
    drop-shadow(1.45px 0.45px 1.65px rgba(16, 10, 6, 0.32))
    drop-shadow(-1.4px 0.5px 1.65px rgba(16, 10, 6, 0.3));
}

.gujian-data-archive__slice-group--pop .gujian-data-archive__slice-path {
  stroke: rgba(255, 255, 255, 0.97);
  stroke-width: 1.88;
  filter:
    drop-shadow(1.15px 2.6px 3.8px rgba(22, 15, 8, 0.5))
    drop-shadow(0.7px 1.5px 0 rgba(0, 0, 0, 0.3))
    drop-shadow(-0.65px -0.95px 0 rgba(255, 255, 255, 0.58))
    drop-shadow(1.6px 0.55px 1.85px rgba(16, 10, 6, 0.38))
    drop-shadow(-1.55px 0.6px 1.85px rgba(16, 10, 6, 0.35));
}

.gujian-data-archive__slice-path--active {
  stroke: rgba(122, 46, 46, 0.75);
  stroke-width: 1.72;
}

.gujian-data-archive__slice-text {
  font-size: 9px;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
  fill: url(#gujian-slice-text-fill);
  paint-order: stroke fill;
  stroke: rgba(255, 252, 245, 0.95);
  stroke-width: 0.55px;
  pointer-events: none;
  filter:
    drop-shadow(0.5px 0.65px 0 rgba(24, 16, 10, 0.72))
    drop-shadow(-0.4px -0.5px 0 rgba(255, 254, 248, 0.55))
    drop-shadow(0 1.15px 1.6px rgba(18, 12, 8, 0.32));
}

.gujian-data-archive__slice-text-title {
  font-size: 8.25px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.gujian-data-archive__slice-text-num {
  font-size: 10.5px;
  font-weight: 700;
  fill: url(#gujian-slice-text-num-fill);
  stroke-width: 0.5px;
}

/* 说明面板 */
.gujian-data-archive__slice-panel {
  width: 100%;
  max-width: 480px;
  padding: 14px 18px 16px;
  text-align: left;
  background: linear-gradient(180deg, #fdfaf3 0%, #ebe2d2 100%);
  border: 2px solid #b99a6e;
  border-radius: 12px;
  box-shadow: 0 10px 28px var(--da-shadow);
}

.gujian-data-archive__slice-panel-title {
  margin: 0 0 8px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--da-ink);
}

.gujian-data-archive__slice-panel-count {
  margin: 0 0 10px;
  font-size: 0.9rem;
  color: var(--da-brown);
}

.gujian-data-archive__slice-panel-desc {
  margin: 0 0 12px;
  font-size: 0.88rem;
  line-height: 1.65;
  color: #3d3530;
}

.gujian-data-archive__slice-panel-close {
  border: 1px solid #a68b5b;
  background: linear-gradient(180deg, #faf3e6, #ebe0cc);
  color: var(--da-brown);
  padding: 5px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.gujian-slice-panel-enter-active,
.gujian-slice-panel-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.gujian-slice-panel-enter-from,
.gujian-slice-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.gujian-disc-reveal-enter-active {
  transition:
    opacity 0.55s ease,
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.gujian-disc-reveal-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.gujian-disc-reveal-enter-from {
  opacity: 0;
  transform: scale(0.88) translateY(24px);
}

.gujian-disc-reveal-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.gujian-disc-reveal-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

.gujian-pie-reveal-enter-active {
  transition:
    opacity 0.48s ease,
    transform 0.58s cubic-bezier(0.22, 1, 0.36, 1);
}

.gujian-pie-reveal-leave-active {
  transition: opacity 0.26s ease, transform 0.3s ease;
}

.gujian-pie-reveal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.gujian-pie-reveal-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.gujian-pie-reveal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

@media (prefers-reduced-motion: reduce) {
  .gujian-pie-reveal-enter-active,
  .gujian-pie-reveal-leave-active {
    transition-duration: 0.01ms !important;
  }

  .gujian-pie-reveal-enter-from,
  .gujian-pie-reveal-leave-to {
    transform: none;
  }
}

.gujian-data-archive__toolbar {
  margin: 0 0 8px;
  text-align: center;
}

.gujian-data-archive__close-book {
  border: 1px solid #a68b5b;
  background: linear-gradient(180deg, #faf3e6, #ebe0cc);
  color: var(--da-brown);
  padding: 6px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  box-shadow: 0 3px 10px var(--da-shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gujian-data-archive__close-book:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--da-shadow);
}

/* —— 书目浮动卡片（Teleport 至 body，与典籍库同系配色） —— */
.gujian-book-cards {
  --bc-ink: #2c241c;
  --bc-brown: #5c4033;
  --bc-paper: #fdfaf3;
  --bc-paper-mid: #ebe2d2;
  --bc-gold: #b99a6e;
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: center;
  padding: clamp(10px, 2.5vw, 22px);
  box-sizing: border-box;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
  color: var(--bc-ink);
}

.gujian-book-cards__backdrop {
  grid-area: 1 / 1;
  place-self: stretch;
  margin: calc(-1 * clamp(10px, 2.5vw, 22px));
  background: radial-gradient(ellipse 120% 80% at 50% 40%, rgba(48, 38, 28, 0.38), rgba(24, 18, 14, 0.55));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
}

.gujian-book-cards__panel {
  grid-area: 1 / 1;
  position: relative;
  z-index: 1;
  width: min(960px, 96vw);
  max-height: min(86vh, 720px);
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  transform: none;
  transform-style: preserve-3d;
  overflow: visible;
}

.gujian-book-cards__head {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 6px 18px;
  border: none;
  background: transparent;
}

.gujian-book-cards__title {
  margin: 0 0 8px;
  font-size: clamp(1.05rem, 2.2vw, 1.2rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #fff9f0;
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35),
    0 -1px 2px rgba(20, 14, 10, 0.55),
    0 3px 8px rgba(0, 0, 0, 0.45),
    0 8px 22px rgba(0, 0, 0, 0.35);
  filter: drop-shadow(0 2px 4px rgba(44, 36, 28, 0.25));
}

.gujian-book-cards__sub {
  margin: 0;
  font-size: 0.84rem;
  line-height: 1.6;
  color: rgba(255, 245, 230, 0.9);
  max-width: 42em;
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.55),
    0 2px 12px rgba(0, 0, 0, 0.35);
}

.gujian-book-cards__close {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 230, 200, 0.45);
  border-radius: 50%;
  background: rgba(40, 32, 26, 0.35);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 248, 235, 0.95);
  font-size: 1.45rem;
  line-height: 1;
  cursor: pointer;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.gujian-book-cards__close:hover {
  transform: scale(1.05);
  background: rgba(60, 48, 38, 0.5);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.gujian-book-cards__err {
  margin: 8px 6px 12px;
  font-size: 0.85rem;
  color: #ffc9c0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.gujian-book-cards__scroller {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 4px 20px;
  -webkit-overflow-scrolling: touch;
  background: transparent;
}

.gujian-book-cards__scroller::-webkit-scrollbar {
  width: 8px;
}

.gujian-book-cards__scroller::-webkit-scrollbar-thumb {
  background: rgba(185, 154, 110, 0.55);
  border-radius: 999px;
}

.gujian-book-cards__empty {
  padding: 28px 12px;
  text-align: center;
  font-size: 0.88rem;
  color: rgba(255, 240, 220, 0.88);
  line-height: 1.6;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

.gujian-book-cards__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(18px, 3vw, 28px) clamp(14px, 2.5vw, 22px);
  perspective: 1200px;
  perspective-origin: 50% 35%;
}

@media (max-width: 720px) {
  .gujian-book-cards__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 10px;
  }
}

.gujian-book-cards__card {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: inherit;
  color: inherit;
  perspective: 600px;
  animation: gujian-card-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

.gujian-book-cards__card:focus {
  outline: none;
}

.gujian-book-cards__card:focus-visible .gujian-book-cards__card-inner {
  outline: 2px solid rgba(255, 220, 180, 0.95);
  outline-offset: 6px;
  border-radius: 4px;
}

.gujian-book-cards__card-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3.2em;
  padding: 14px 10px;
  font-size: clamp(0.78rem, 1.65vw, 0.9rem);
  line-height: 1.45;
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #fffdf6;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  transform: translateY(0) rotateX(10deg) translateZ(0);
  transform-style: preserve-3d;
  transition: transform 0.32s cubic-bezier(0.34, 1.2, 0.64, 1), filter 0.32s ease;
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.42),
    0 -1px 1px rgba(24, 16, 10, 0.65),
    0 2px 4px rgba(20, 14, 10, 0.55),
    0 6px 14px rgba(0, 0, 0, 0.45),
    0 12px 28px rgba(0, 0, 0, 0.32),
    0 20px 48px rgba(0, 0, 0, 0.22);
  filter: drop-shadow(0 4px 6px rgba(44, 36, 28, 0.35));
}

.gujian-book-cards__card:hover .gujian-book-cards__card-inner {
  transform: translateY(-10px) rotateX(16deg) scale(1.06) translateZ(18px);
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.55),
    0 -1px 2px rgba(24, 16, 10, 0.5),
    0 3px 6px rgba(20, 14, 10, 0.45),
    0 10px 22px rgba(0, 0, 0, 0.5),
    0 18px 40px rgba(0, 0, 0, 0.38),
    0 28px 64px rgba(0, 0, 0, 0.28);
  filter: drop-shadow(0 12px 20px rgba(44, 36, 28, 0.45)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
}

@keyframes gujian-card-pop {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .gujian-book-cards__card-inner {
    transform: none;
    transition: none;
  }

  .gujian-book-cards__card:hover .gujian-book-cards__card-inner {
    transform: none;
  }
}

.gujian-book-cards-enter-active,
.gujian-book-cards-leave-active {
  transition: opacity 0.32s ease;
}

.gujian-book-cards-enter-active .gujian-book-cards__backdrop,
.gujian-book-cards-leave-active .gujian-book-cards__backdrop {
  transition: opacity 0.32s ease;
}

.gujian-book-cards-enter-active .gujian-book-cards__panel,
.gujian-book-cards-leave-active .gujian-book-cards__panel {
  transition: opacity 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.gujian-book-cards-enter-from,
.gujian-book-cards-leave-to {
  opacity: 0;
}

.gujian-book-cards-enter-from .gujian-book-cards__backdrop,
.gujian-book-cards-leave-to .gujian-book-cards__backdrop {
  opacity: 0;
}

.gujian-book-cards-enter-from .gujian-book-cards__panel,
.gujian-book-cards-leave-to .gujian-book-cards__panel {
  opacity: 0;
}

/* —— 书目卷轴：立轴式展开 + 裱褙、轴头、纸纹 —— */
.gujian-book-scroll {
  --scroll-ink: #2a2210;
  --scroll-brown: #5c4033;
  --scroll-paper: #ebe0c8;
  --scroll-paper-mid: #e2d4b8;
  --scroll-paper-edge: #d4c4a4;
  --scroll-mount: #c4a574;
  --scroll-wood: #3d2818;
  --scroll-wood-hi: #5c3d28;
  --scroll-jade: #6b8f7a;
  perspective: 1400px;
  position: fixed;
  inset: 0;
  z-index: 10100;
  display: grid;
  grid-template: 1fr / 1fr;
  place-items: center;
  padding: clamp(10px, 2.5vw, 24px);
  box-sizing: border-box;
  font-family: 'STKaiti', 'KaiTi', 'SimSun', 'Microsoft YaHei', serif;
  color: var(--scroll-ink);
}

.gujian-book-scroll__backdrop {
  grid-area: 1 / 1;
  place-self: stretch;
  margin: calc(-1 * clamp(10px, 2.5vw, 24px));
  background:
    radial-gradient(ellipse 95% 75% at 50% 32%, rgba(212, 175, 90, 0.14) 0%, transparent 52%),
    radial-gradient(ellipse 88% 65% at 50% 40%, rgba(255, 248, 220, 0.06) 0%, transparent 48%),
    radial-gradient(ellipse 90% 70% at 50% 38%, rgba(55, 42, 28, 0.52), rgba(12, 8, 5, 0.82));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
}

.gujian-book-scroll__stage {
  grid-area: 1 / 1;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: min(92vh, 900px);
  transform-style: preserve-3d;
  filter: drop-shadow(16px 28px 40px rgba(20, 12, 6, 0.5)) drop-shadow(0 0 48px rgba(212, 175, 90, 0.12));
}

/* 启卷仪式层：金光、扩散环、角花（仅装饰） */
.gujian-book-scroll__ceremony {
  position: absolute;
  inset: -8% -6% -10%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
}

.gujian-book-scroll__burst {
  position: absolute;
  width: 140vmax;
  height: 140vmax;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 248, 220, 0.42) 0%,
    rgba(218, 165, 55, 0.18) 28%,
    rgba(120, 80, 40, 0.06) 48%,
    transparent 62%
  );
  transform: scale(0.15);
  opacity: 0;
}

.gujian-book-scroll__ring {
  position: absolute;
  width: min(78vw, 420px);
  height: min(78vw, 420px);
  border-radius: 50%;
  border: 2px solid rgba(218, 180, 95, 0.5);
  box-shadow:
    0 0 36px rgba(212, 175, 90, 0.22),
    0 0 80px rgba(255, 236, 200, 0.08),
    inset 0 0 28px rgba(255, 252, 235, 0.06);
  opacity: 0;
}

.gujian-book-scroll__ring--2 {
  width: min(88vw, 480px);
  height: min(88vw, 480px);
  border-color: rgba(255, 236, 200, 0.38);
  box-shadow:
    0 0 48px rgba(212, 175, 90, 0.16),
    inset 0 0 36px rgba(255, 250, 230, 0.05);
}

.gujian-book-scroll__petal {
  position: absolute;
  width: clamp(56px, 14vw, 100px);
  height: clamp(56px, 14vw, 100px);
  border: 2px solid rgba(185, 154, 110, 0.45);
  border-radius: 4px;
  background: linear-gradient(
    135deg,
    rgba(255, 252, 240, 0.12) 0%,
    rgba(185, 154, 110, 0.08) 45%,
    rgba(60, 44, 30, 0.15) 100%
  );
  box-shadow:
    0 0 20px rgba(212, 175, 90, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  opacity: 0;
}

.gujian-book-scroll__petal--tl {
  top: 8%;
  left: 6%;
  transform: rotate(-12deg) scale(0.6);
}

.gujian-book-scroll__petal--tr {
  top: 8%;
  right: 6%;
  transform: rotate(12deg) scale(0.6);
}

.gujian-book-scroll__petal--bl {
  bottom: 10%;
  left: 5%;
  transform: rotate(8deg) scale(0.6);
}

.gujian-book-scroll__petal--br {
  bottom: 10%;
  right: 5%;
  transform: rotate(-8deg) scale(0.6);
}

.gujian-book-scroll-enter-active .gujian-book-scroll__burst {
  animation: gujian-scroll-burst 1.12s cubic-bezier(0.22, 1, 0.36, 1) 0.06s both;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__ring--1 {
  animation: gujian-scroll-ring-expand 1.35s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__ring--2 {
  animation: gujian-scroll-ring-expand 1.45s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__petal--tl {
  animation: gujian-scroll-petal-in-tl 0.88s cubic-bezier(0.34, 1.15, 0.64, 1) 0.32s both;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__petal--tr {
  animation: gujian-scroll-petal-in-tr 0.88s cubic-bezier(0.34, 1.15, 0.64, 1) 0.4s both;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__petal--bl {
  animation: gujian-scroll-petal-in-bl 0.88s cubic-bezier(0.34, 1.15, 0.64, 1) 0.48s both;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__petal--br {
  animation: gujian-scroll-petal-in-br 0.88s cubic-bezier(0.34, 1.15, 0.64, 1) 0.56s both;
}

@keyframes gujian-scroll-burst {
  0% {
    transform: scale(0.12);
    opacity: 0.92;
  }
  45% {
    opacity: 0.38;
  }
  100% {
    transform: scale(1.05);
    opacity: 0;
  }
}

@keyframes gujian-scroll-ring-expand {
  0% {
    transform: scale(0.38);
    opacity: 0.85;
  }
  100% {
    transform: scale(1.65);
    opacity: 0;
  }
}

@keyframes gujian-scroll-petal-in-tl {
  0% {
    opacity: 0;
    transform: rotate(-12deg) scale(0.5) translate(12px, 12px);
    filter: blur(5px);
  }
  100% {
    opacity: 0.92;
    transform: rotate(-12deg) scale(1) translate(0, 0);
    filter: blur(0);
  }
}

@keyframes gujian-scroll-petal-in-tr {
  0% {
    opacity: 0;
    transform: rotate(12deg) scale(0.5) translate(-12px, 12px);
    filter: blur(5px);
  }
  100% {
    opacity: 0.92;
    transform: rotate(12deg) scale(1) translate(0, 0);
    filter: blur(0);
  }
}

@keyframes gujian-scroll-petal-in-bl {
  0% {
    opacity: 0;
    transform: rotate(8deg) scale(0.5) translate(12px, -12px);
    filter: blur(5px);
  }
  100% {
    opacity: 0.88;
    transform: rotate(8deg) scale(1) translate(0, 0);
    filter: blur(0);
  }
}

@keyframes gujian-scroll-petal-in-br {
  0% {
    opacity: 0;
    transform: rotate(-8deg) scale(0.5) translate(-12px, -12px);
    filter: blur(5px);
  }
  100% {
    opacity: 0.88;
    transform: rotate(-8deg) scale(1) translate(0, 0);
    filter: blur(0);
  }
}

.gujian-book-scroll__cord {
  position: relative;
  z-index: 1;
  width: 4px;
  height: clamp(22px, 4.5vh, 42px);
  margin-bottom: 6px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    #1a1008 0%,
    #4a3220 22%,
    #c9a227 48%,
    #4a3220 78%,
    #1a1008 100%
  );
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 0 12px rgba(212, 175, 90, 0.25);
}

.gujian-book-scroll__frame {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: min(540px, 91vw);
  transform-origin: 50% 0%;
  transform-style: preserve-3d;
}

/* 天杆地杆 + 玉制轴头 */
.gujian-book-scroll__pole {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0;
  flex-shrink: 0;
}

.gujian-book-scroll__pole-bar {
  flex: 1;
  height: clamp(18px, 2.8vw, 24px);
  min-width: 40%;
  background:
    linear-gradient(90deg, transparent 0%, rgba(218, 180, 95, 0.22) 50%, transparent 100%),
    linear-gradient(180deg, #6a4a32 0%, var(--scroll-wood) 28%, #1a1008 100%);
  box-shadow:
    inset 0 2px 4px rgba(255, 248, 235, 0.2),
    inset 0 -5px 10px rgba(0, 0, 0, 0.55),
    0 1px 0 rgba(255, 252, 240, 0.08);
}

.gujian-book-scroll__pole-end {
  width: clamp(22px, 5vw, 34px);
  height: clamp(22px, 5vw, 34px);
  flex-shrink: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.45), transparent 42%),
    radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.35), transparent 55%),
    linear-gradient(145deg, #7daf92 0%, var(--scroll-jade) 40%, #3d5c48 100%);
  box-shadow:
    inset 0 -3px 6px rgba(0, 0, 0, 0.35),
    inset 0 2px 4px rgba(255, 255, 255, 0.25),
    2px 4px 10px rgba(0, 0, 0, 0.35);
}

.gujian-book-scroll__pole--top .gujian-book-scroll__pole-bar {
  border-radius: 4px 4px 0 0;
}

.gujian-book-scroll__pole--bottom .gujian-book-scroll__pole-bar {
  border-radius: 0 0 4px 4px;
}

/* 自水平正中央向左右两侧对称滚展 */
.gujian-book-scroll__unfurl {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  clip-path: inset(0 0 0 0 round 0);
}

.gujian-book-scroll__mount {
  height: 12px;
  flex-shrink: 0;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(80, 55, 30, 0.12) 0px,
      rgba(80, 55, 30, 0.12) 2px,
      transparent 2px,
      transparent 5px
    ),
    linear-gradient(180deg, #b8925a 0%, var(--scroll-mount) 42%, #7a5c38 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 248, 235, 0.45),
    inset 0 -1px 0 rgba(40, 28, 14, 0.2);
}

.gujian-book-scroll__mount--upper {
  border-bottom: 1px solid rgba(80, 55, 30, 0.35);
}

.gujian-book-scroll__mount--lower {
  border-top: 1px solid rgba(80, 55, 30, 0.35);
}

.gujian-book-scroll__body {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 0;
  flex: 1;
}

.gujian-book-scroll__shaft {
  position: relative;
  width: clamp(18px, 4.2vw, 26px);
  flex-shrink: 0;
  background: linear-gradient(90deg, #1a1008 0%, var(--scroll-wood) 20%, var(--scroll-wood-hi) 50%, var(--scroll-wood) 80%, #1a1008 100%);
  box-shadow: inset 4px 0 8px rgba(0, 0, 0, 0.4), inset -4px 0 8px rgba(0, 0, 0, 0.4);
}

.gujian-book-scroll__finial {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: min(120px, 28vh);
  max-height: 85%;
  border-radius: 5px;
  background: linear-gradient(90deg, #2a1810, #4a3220, #2a1810);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.gujian-book-scroll__paper {
  position: relative;
  flex: 1;
  min-width: 0;
  max-height: min(62vh, 520px);
  overflow-y: auto;
  padding: 24px clamp(18px, 3.2vw, 28px) 28px;
  border-left: 3px solid rgba(140, 48, 42, 0.38);
  border-right: 1px solid rgba(139, 105, 52, 0.25);
  background-color: var(--scroll-paper);
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 23px,
      rgba(139, 105, 52, 0.06) 23px,
      rgba(139, 105, 52, 0.06) 24px
    ),
    linear-gradient(180deg, rgba(255, 252, 245, 0.9) 0%, var(--scroll-paper-mid) 22%, var(--scroll-paper-edge) 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 252, 240, 0.55),
    inset 0 0 0 3px rgba(185, 154, 110, 0.14),
    inset 0 12px 36px rgba(139, 105, 52, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
  -webkit-overflow-scrolling: touch;
}

.gujian-book-scroll__paper-texture {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0.14;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

.gujian-book-scroll__seal {
  position: absolute;
  right: clamp(14px, 3vw, 22px);
  top: 56px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.12rem;
  font-weight: 700;
  color: rgba(100, 28, 24, 0.62);
  border: 2px solid rgba(140, 48, 42, 0.5);
  border-radius: 4px;
  transform: rotate(-8deg);
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(circle at 32% 28%, rgba(255, 240, 230, 0.35), transparent 55%);
  box-shadow:
    0 2px 8px rgba(100, 40, 32, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.gujian-book-scroll__paper::-webkit-scrollbar {
  width: 7px;
}

.gujian-book-scroll__paper::-webkit-scrollbar-thumb {
  background: rgba(120, 80, 48, 0.45);
  border-radius: 999px;
}

.gujian-book-scroll__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  padding: 5px 12px;
  border: 1px solid rgba(139, 105, 52, 0.65);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 252, 245, 0.95), rgba(235, 224, 200, 0.92));
  color: var(--scroll-brown);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(44, 36, 28, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gujian-book-scroll__close:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 36, 28, 0.22);
}

.gujian-book-scroll__book-title {
  position: relative;
  z-index: 1;
  margin: 0 100px 18px 0;
  font-size: 1.22rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.55;
  color: var(--scroll-ink);
  padding-bottom: 0;
  border-bottom: none;
  text-shadow: 0 1px 0 rgba(255, 252, 245, 0.6);
}

.gujian-book-scroll__book-title::after {
  content: '';
  display: block;
  height: 2px;
  margin-top: 14px;
  border-radius: 1px;
  background: linear-gradient(90deg, rgba(139, 105, 52, 0.72) 0%, rgba(139, 105, 52, 0.28) 72%, transparent 100%);
  transform: scaleX(0);
  transform-origin: 0 50%;
}

.gujian-book-scroll__empty {
  position: relative;
  z-index: 1;
  margin: 12px 0 0;
  font-size: 0.9rem;
  color: var(--scroll-brown);
  line-height: 1.65;
}

.gujian-book-scroll__dl {
  position: relative;
  z-index: 1;
  margin: 0;
  display: grid;
  grid-template-columns: minmax(5em, 32%) 1fr;
  gap: 12px 16px;
  align-items: start;
  font-size: 0.9rem;
  line-height: 1.75;
}

@media (max-width: 480px) {
  .gujian-book-scroll__book-title {
    margin-right: 0;
    padding-right: 4px;
  }

  .gujian-book-scroll__seal {
    display: none;
  }

  .gujian-book-scroll__dl {
    grid-template-columns: 1fr;
    gap: 4px 0;
  }

  .gujian-book-scroll__dd {
    margin-bottom: 12px;
  }
}

.gujian-book-scroll__dt {
  margin: 0;
  font-weight: 700;
  color: var(--scroll-brown);
  letter-spacing: 0.06em;
}

.gujian-book-scroll__dd {
  margin: 0;
  color: var(--scroll-ink);
  word-break: break-word;
}

/* 入场：分层节奏 — 背板 → 挂绳垂坠 → 画框落位俯仰 → 中线展卷 → 纸面浮显 → 题签/著录错峰 → 钤印钤盖 */
.gujian-book-scroll-enter-active .gujian-book-scroll__backdrop {
  transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.gujian-book-scroll-enter-active .gujian-book-scroll__cord {
  transition: transform 0.95s cubic-bezier(0.22, 1.2, 0.36, 1) 0.06s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__frame {
  transition: transform 1.12s cubic-bezier(0.16, 1, 0.3, 1) 0.02s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__unfurl {
  transition: clip-path 1.38s cubic-bezier(0.19, 1, 0.22, 1) 0.1s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__mount {
  animation: gujian-scroll-mount-gleam 2.6s ease 0.5s both;
}

@keyframes gujian-scroll-mount-gleam {
  0%,
  100% {
    filter: brightness(1) saturate(1);
  }
  28% {
    filter: brightness(1.22) saturate(1.14);
  }
  48% {
    filter: brightness(1.1) saturate(1.08);
  }
}

.gujian-book-scroll-enter-active .gujian-book-scroll__shaft {
  transition:
    opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.2s,
    filter 0.65s ease 0.18s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__paper {
  transition:
    opacity 0.72s cubic-bezier(0.19, 1, 0.22, 1) 0.46s,
    transform 0.88s cubic-bezier(0.16, 1, 0.3, 1) 0.38s,
    filter 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.34s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__book-title {
  transition:
    opacity 0.58s cubic-bezier(0.22, 1, 0.36, 1) 0.58s,
    transform 0.65s cubic-bezier(0.34, 1.15, 0.64, 1) 0.56s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__book-title::after {
  transition: transform 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.78s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__empty {
  transition: opacity 0.55s ease 0.66s, transform 0.6s cubic-bezier(0.34, 1.15, 0.64, 1) 0.64s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__dl > * {
  transition:
    opacity 0.48s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
}

.gujian-book-scroll-enter-active .gujian-book-scroll__close {
  transition:
    opacity 0.45s ease 0.92s,
    transform 0.55s cubic-bezier(0.34, 1.15, 0.64, 1) 0.9s,
    box-shadow 0.4s ease 0.92s;
}

.gujian-book-scroll-enter-active .gujian-book-scroll__seal {
  animation: gujian-scroll-seal-stamp 0.95s cubic-bezier(0.34, 1.2, 0.64, 1) 1.02s both;
}

@keyframes gujian-scroll-seal-stamp {
  0% {
    opacity: 0;
    transform: rotate(-14deg) scale(0.35);
    filter: blur(6px);
  }
  55% {
    opacity: 1;
    transform: rotate(-6deg) scale(1.08);
    filter: blur(0);
  }
  75% {
    transform: rotate(-9deg) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: rotate(-8deg) scale(1);
    filter: blur(0);
  }
}

/* 著录行错峰（dt/dd 交替，最多 24 格） */
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(1) {
  transition-delay: 0.66s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(2) {
  transition-delay: 0.7s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(3) {
  transition-delay: 0.74s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(4) {
  transition-delay: 0.78s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(5) {
  transition-delay: 0.82s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(6) {
  transition-delay: 0.86s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(7) {
  transition-delay: 0.9s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(8) {
  transition-delay: 0.94s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(9) {
  transition-delay: 0.98s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(10) {
  transition-delay: 1.02s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(11) {
  transition-delay: 1.06s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(12) {
  transition-delay: 1.1s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(13) {
  transition-delay: 1.14s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(14) {
  transition-delay: 1.18s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(15) {
  transition-delay: 1.22s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(16) {
  transition-delay: 1.26s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(17) {
  transition-delay: 1.3s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(18) {
  transition-delay: 1.34s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(19) {
  transition-delay: 1.38s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(20) {
  transition-delay: 1.42s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(21) {
  transition-delay: 1.46s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(22) {
  transition-delay: 1.5s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(23) {
  transition-delay: 1.54s;
}
.gujian-book-scroll-enter-active .gujian-book-scroll__dl > *:nth-child(24) {
  transition-delay: 1.58s;
}

.gujian-book-scroll-leave-active {
  transition: opacity 0.32s ease;
}

.gujian-book-scroll-leave-active .gujian-book-scroll__backdrop {
  transition: opacity 0.38s cubic-bezier(0.55, 0, 0.85, 0.45);
}

.gujian-book-scroll-leave-active .gujian-book-scroll__unfurl {
  transition: clip-path 0.55s cubic-bezier(0.55, 0.05, 0.85, 0.35);
}

.gujian-book-scroll-leave-active .gujian-book-scroll__frame {
  transition: transform 0.48s cubic-bezier(0.55, 0, 0.85, 0.4), opacity 0.4s ease 0.06s;
}

.gujian-book-scroll-leave-active .gujian-book-scroll__cord {
  transition: transform 0.42s cubic-bezier(0.55, 0, 0.85, 0.45);
}

.gujian-book-scroll-leave-to {
  opacity: 0;
}

.gujian-book-scroll-enter-from .gujian-book-scroll__backdrop {
  opacity: 0;
}

.gujian-book-scroll-leave-to .gujian-book-scroll__backdrop {
  opacity: 0;
}

.gujian-book-scroll-enter-from .gujian-book-scroll__cord {
  transform: translateY(-220%) scaleY(0.28);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__frame {
  transform: rotateX(24deg) translateY(-48px) scale(0.76);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__unfurl {
  clip-path: inset(0 50.5% 0 50.5% round 0);
}

.gujian-book-scroll-enter-to .gujian-book-scroll__unfurl {
  clip-path: inset(0 0 0 0 round 0);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__shaft {
  opacity: 0.28;
  filter: brightness(0.75);
}

.gujian-book-scroll-enter-to .gujian-book-scroll__shaft {
  opacity: 1;
  filter: brightness(1);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__paper {
  opacity: 0;
  transform: translateY(18px) scale(0.985);
  filter: saturate(0.88) brightness(0.94);
}

.gujian-book-scroll-enter-to .gujian-book-scroll__paper {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: saturate(1) brightness(1);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__book-title {
  opacity: 0;
  transform: translateY(12px);
}

.gujian-book-scroll-enter-to .gujian-book-scroll__book-title {
  opacity: 1;
  transform: translateY(0);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__book-title::after {
  transform: scaleX(0);
}

.gujian-book-scroll-enter-to .gujian-book-scroll__book-title::after {
  transform: scaleX(1);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__empty {
  opacity: 0;
  transform: translateY(10px);
}

.gujian-book-scroll-enter-to .gujian-book-scroll__empty {
  opacity: 1;
  transform: translateY(0);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__dl > * {
  opacity: 0;
  transform: translateY(10px);
}

.gujian-book-scroll-enter-to .gujian-book-scroll__dl > * {
  opacity: 1;
  transform: translateY(0);
}

.gujian-book-scroll-enter-from .gujian-book-scroll__close {
  opacity: 0;
  transform: translateY(-8px);
}

.gujian-book-scroll-enter-to .gujian-book-scroll__close {
  opacity: 1;
  transform: translateY(0);
}

.gujian-book-scroll-leave-from .gujian-book-scroll__unfurl {
  clip-path: inset(0 0 0 0 round 0);
}

.gujian-book-scroll-leave-to .gujian-book-scroll__unfurl {
  clip-path: inset(0 50.5% 0 50.5% round 0);
}

.gujian-book-scroll-leave-to .gujian-book-scroll__frame {
  opacity: 0;
  transform: rotateX(12deg) scale(0.92) translateY(-16px);
}

.gujian-book-scroll-leave-to .gujian-book-scroll__cord {
  transform: translateY(-40%) scaleY(0.85);
}

@media (prefers-reduced-motion: reduce) {
  .gujian-book-scroll-enter-active .gujian-book-scroll__burst,
  .gujian-book-scroll-enter-active .gujian-book-scroll__ring--1,
  .gujian-book-scroll-enter-active .gujian-book-scroll__ring--2,
  .gujian-book-scroll-enter-active .gujian-book-scroll__petal--tl,
  .gujian-book-scroll-enter-active .gujian-book-scroll__petal--tr,
  .gujian-book-scroll-enter-active .gujian-book-scroll__petal--bl,
  .gujian-book-scroll-enter-active .gujian-book-scroll__petal--br {
    animation: none !important;
  }

  .gujian-book-scroll-enter-active .gujian-book-scroll__mount {
    animation: none !important;
  }

  .gujian-book-scroll-enter-active .gujian-book-scroll__seal {
    animation: none !important;
  }

  .gujian-book-scroll__burst,
  .gujian-book-scroll__ring,
  .gujian-book-scroll__petal {
    opacity: 0 !important;
    transform: none !important;
    filter: none !important;
  }

  .gujian-book-scroll-enter-active .gujian-book-scroll__cord,
  .gujian-book-scroll-enter-active .gujian-book-scroll__frame,
  .gujian-book-scroll-enter-active .gujian-book-scroll__unfurl,
  .gujian-book-scroll-enter-active .gujian-book-scroll__paper,
  .gujian-book-scroll-enter-active .gujian-book-scroll__book-title,
  .gujian-book-scroll-enter-active .gujian-book-scroll__book-title::after,
  .gujian-book-scroll-enter-active .gujian-book-scroll__dl > *,
  .gujian-book-scroll-enter-active .gujian-book-scroll__empty,
  .gujian-book-scroll-enter-active .gujian-book-scroll__close,
  .gujian-book-scroll-enter-active .gujian-book-scroll__shaft,
  .gujian-book-scroll-leave-active .gujian-book-scroll__unfurl,
  .gujian-book-scroll-leave-active .gujian-book-scroll__frame,
  .gujian-book-scroll-leave-active .gujian-book-scroll__cord {
    transition-duration: 0.01ms !important;
    transition-delay: 0s !important;
  }

  .gujian-book-scroll-enter-active .gujian-book-scroll__dl > * {
    transition-delay: 0s !important;
  }

  .gujian-book-scroll-enter-from .gujian-book-scroll__cord {
    transform: none;
  }

  .gujian-book-scroll-enter-from .gujian-book-scroll__frame {
    transform: none;
  }

  .gujian-book-scroll-enter-from .gujian-book-scroll__unfurl {
    clip-path: inset(0 0 0 0 round 0);
  }

  .gujian-book-scroll-enter-from .gujian-book-scroll__shaft {
    opacity: 1;
    filter: none;
  }

  .gujian-book-scroll__seal {
    opacity: 1 !important;
    transform: rotate(-8deg) scale(1) !important;
    filter: none !important;
  }
}
</style>
