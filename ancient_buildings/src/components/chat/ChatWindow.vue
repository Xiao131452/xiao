<template>
  <div class="chat-container">
    <!-- 装饰背景 -->
    <div class="decorative-bg">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    
    <!-- 卡通形象按钮 -->
    <div 
      class="mascot-button" 
      ref="mascotButtonRef"
      @click.stop.prevent="toggleChat"
      :class="{ 'active': isOpen, 'thinking': isTyping }"
    >
      <div class="mascot-glow"></div>
      <div class="mascot">
        <img src="/images/znt.png" alt="智能助手" class="mascot-image" />
        
        <!-- 对话气泡 -->
        <div class="speech-bubble" v-if="isOpen && !isTyping">
          <span>🏛️ 有什么可以帮您？</span>
        </div>
        
        <!-- 思考气泡 -->
        <div class="thinking-bubble" v-if="isTyping">
          <span>🤔</span>
        </div>
      </div>
      
      <!-- 提示点 -->
      <div class="notification-dot" v-if="!isOpen && messages.length <= 1"></div>
    </div>
    
    <!-- 聊天窗口 -->
    <transition name="slide-up">
      <div 
        class="chat-window" 
        v-if="isOpen"
        ref="chatWindowRef"
      >
        
        <!-- 窗口装饰 -->
        <div class="window-decoration">
          <div class="decoration-line decoration-line-1"></div>
          <div class="decoration-line decoration-line-2"></div>
        </div>
        
        <div class="chat-header" @mousedown="startDrag($event)">
          <div class="header-content">
            <div class="mascot-mini">
              <img src="/images/znt.png" alt="智能助手" class="mascot-mini-img" />
            </div>
            <div>
              <div class="chat-title">古建筑小博士</div>
              <div class="chat-subtitle">
                <span class="status-dot"></span>
                在线
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click.stop="toggleVoice" :title="isVoiceEnabled ? '关闭语音' : '开启语音'">
              {{ isVoiceEnabled ? '🔊' : '🔇' }}
            </button>
            <button class="action-btn" @click.stop="clearChat" title="清空对话">
              🗑️
            </button>
            <button class="close-btn" @click.stop="toggleChat" title="关闭">
              ✕
            </button>
          </div>
        </div>
        
        <div class="chat-body">
          <div class="messages-container" ref="messagesRef">
            <!-- 欢迎消息 -->
            <div class="welcome-message" v-if="messages.length <= 1">
              <div class="welcome-icon">🏯</div>
              <div class="welcome-text">
                <h3>欢迎来到古建筑智能问答</h3>
                <p>我是您的古建筑小博士，可以为您介绍中国传统建筑、榫卯结构、建筑历史等知识</p>
              </div>
              <div class="quick-questions">
                <div class="quick-question" @click="askQuestion('什么是榫卯结构？')">
                  <span>🔨</span> 什么是榫卯结构？
                </div>
                <div class="quick-question" @click="askQuestion('中国古代建筑有什么特点？')">
                  <span>🏛️</span> 中国古代建筑特点
                </div>
                <div class="quick-question" @click="askQuestion('请介绍一下斗拱')">
                  <span>🪵</span> 斗拱的作用
                </div>
              </div>
            </div>
            
            <div 
              v-for="(message, index) in messages" 
              :key="index"
              class="message"
              :class="message.role"
              :style="{ animationDelay: index * 0.1 + 's' }"
            >
              <div class="message-avatar" v-if="message.role === 'assistant'">
                <img src="/images/znt.png" alt="智能助手" class="message-avatar-img" />
              </div>
              <div class="message-content-wrapper">
                <div class="message-content">
                  <TypewriterText 
                    v-if="message.role === 'assistant'" 
                    :text="message.content" 
                    @complete="onTypewriterComplete(message)"
                  />
                  <span v-else>{{ message.content }}</span>
                </div>
                <div class="message-actions" v-if="message.role === 'assistant'">
                  <button class="voice-btn" @click="speak(message.content)" title="语音播报">
                    🔊
                  </button>
                </div>
                <div class="message-time">
                  {{ formatTime(message.time) }}
                </div>
              </div>
            </div>
            
            <!-- 相关问题 -->
            <div class="related-questions" v-if="lastAssistantMessage && showRelatedQuestions">
              <div class="related-title">相关问题</div>
              <div class="related-list">
                <div 
                  v-for="(question, idx) in relatedQuestions" 
                  :key="idx"
                  class="related-item"
                  @click="askQuestion(question)"
                >
                  <span>💡</span> {{ question }}
                </div>
              </div>
            </div>
            
            <div v-if="isTyping" class="message assistant typing">
              <div class="message-avatar">
                <img src="/images/znt.png" alt="智能助手" class="message-avatar-img" />
              </div>
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          
          <div class="chat-input">
            <div class="input-wrapper">
              <input 
                v-model="inputText" 
                @keyup.enter="sendMessage"
                placeholder="请输入您的问题..."
                :disabled="isTyping"
              />
              <button class="emoji-btn" @click="toggleEmoji" title="表情">
                😊
              </button>
            </div>
            <button class="send-btn" @click="sendMessage" :disabled="!inputText || isTyping">
              <svg viewBox="0 0 24 24" v-if="!isTyping">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
              </svg>
              <span v-else>...</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, computed, onMounted, onUnmounted, defineExpose } from 'vue'
import TypewriterText from '../TypewriterText.vue'
import { useAIChat } from '../../composables/useAIChat'

const { messages, isTyping, sendMessage: sendAI } = useAIChat()

const isOpen = ref(false)
const inputText = ref('')
const messagesRef = ref(null)
const chatWindowRef = ref(null)
const mascotButtonRef = ref(null)
const isVoiceEnabled = ref(true)
const showRelatedQuestions = ref(false)

// 相关问题
const relatedQuestions = ref([])

const lastAssistantMessage = computed(() => {
  const assistantMessages = messages.value.filter(m => m.role === 'assistant')
  return assistantMessages.length > 0 ? assistantMessages[assistantMessages.length - 1] : null
})

const toggleChat = () => {
  console.log('[ChatWindow] toggleChat clicked, before isOpen=', isOpen.value)
  isOpen.value = !isOpen.value
  console.log('[ChatWindow] toggleChat updated, after isOpen=', isOpen.value)
}

const askQuestion = (question) => {
  inputText.value = question
  sendMessage()
}

const clearChat = () => {
  messages.value = [
    {
      role: 'assistant',
      content: '您好！我是古建筑智能助手，可以为您介绍中国传统建筑、榫卯结构等相关知识。请问有什么可以帮您？',
      time: new Date()
    }
  ]
  showRelatedQuestions.value = false
}

const toggleEmoji = () => {
  inputText.value += '🏛️'
}

const toggleVoice = () => {
  isVoiceEnabled.value = !isVoiceEnabled.value
}

// 语音播报
const speak = (text) => {
  if (!isVoiceEnabled.value || !window.speechSynthesis) return
  
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 1
  utterance.pitch = 1
  
  window.speechSynthesis.speak(utterance)
}

const onTypewriterComplete = (message) => {
  if (message.role === 'assistant' && isVoiceEnabled.value) {
    speak(message.content)
  }
  
  // 生成相关问题
  generateRelatedQuestions(message.content)
}

// 生成相关问题
const generateRelatedQuestions = (content) => {
  const questionMap = {
    '榫卯': [
      '榫卯结构有哪些类型？',
      '榫卯结构的优缺点是什么？',
      '榫卯结构在现代建筑中的应用'
    ],
    '斗拱': [
      '斗拱的作用是什么？',
      '斗拱的结构组成',
      '斗拱在不同朝代的变化'
    ],
    '建筑': [
      '中国古代建筑的特点',
      '中国传统建筑的屋顶形式',
      '中国古代建筑的色彩运用'
    ],
    '历史': [
      '中国古代建筑的发展历程',
      '明清建筑的特点',
      '唐代建筑的风格特点'
    ]
  }
  
  for (const [key, questions] of Object.entries(questionMap)) {
    if (content.includes(key)) {
      relatedQuestions.value = questions.slice(0, 3)
      showRelatedQuestions.value = true
      return
    }
  }
  
  // 默认相关问题
  relatedQuestions.value = [
    '什么是榫卯结构？',
    '中国古代建筑有什么特点？',
    '请介绍一下斗拱'
  ]
  showRelatedQuestions.value = true
}

const sendMessage = async () => {
  if (!inputText.value.trim()) return
  
  const question = inputText.value
  inputText.value = ''
  showRelatedQuestions.value = false
  
  await sendAI(question)
  
  await nextTick()
  scrollToBottom()
}

const formatTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  return date.toLocaleDateString()
}

const scrollToBottom = () => {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

onMounted(() => {
  // 只记录第一次全局点击，用于判断“到底有没有点到 mascot 按钮区域”
  const handler = (e) => {
    const el = mascotButtonRef.value
    if (el) {
      const r = el.getBoundingClientRect()
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      console.log('[ChatWindow debug] first click', { inside, clientX: e.clientX, clientY: e.clientY, rect: r })
    } else {
      console.log('[ChatWindow debug] first click but mascotButtonRef is null', { clientX: e.clientX, clientY: e.clientY })
    }
  }

  window.addEventListener('click', handler, { once: true })
})

onUnmounted(() => {
  window.speechSynthesis.cancel()
})

defineExpose({
  openAndAsk(prompt) {
    if (!prompt || !String(prompt).trim()) return
    isOpen.value = true
    nextTick(async () => {
      inputText.value = String(prompt).trim()
      await sendMessage()
    })
  }
})
</script>

<style scoped>
.chat-container {
  position: fixed;
  right: 30px;
  bottom: 30px;
  /* 提高层级，避免被地图画布/其它浮层盖住导致点击无效 */
  z-index: 999999;
  pointer-events: auto;
}

.decorative-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: pulse-circle 4s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -50px;
  right: -50px;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -30px;
  left: -30px;
  animation-delay: 1s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: -20px;
  animation-delay: 2s;
}

@keyframes pulse-circle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.15;
  }
}

.mascot-button {
  position: relative;
  width: 140px;
  height: 140px;
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

.mascot-button:hover {
  transform: scale(1.1);
}

.mascot-button.active {
  animation: float 3s ease-in-out infinite;
  transform: scale(1);
  opacity: 1;
  z-index: 100;
}

.mascot-button.thinking {
  animation: thinking 0.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes thinking {
  0%, 100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-5px) rotate(2deg);
  }
}

.mascot-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.mascot-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
  animation: mascot-breathe 3s ease-in-out infinite;
}

/* 呼吸动画 - 让形象自然呼吸 */
@keyframes mascot-breathe {
  0%, 100% {
    transform: scale(1) translateY(0);
  }
  25% {
    transform: scale(1.02) translateY(-2px);
  }
  50% {
    transform: scale(1) translateY(-4px);
  }
  75% {
    transform: scale(0.98) translateY(-2px);
  }
}

/* 悬停时更明显的动画 */
.mascot-button:hover .mascot-image {
  animation: mascot-welcome 0.6s ease-in-out;
}

@keyframes mascot-welcome {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  50% {
    transform: scale(1.15) rotate(0deg);
  }
  75% {
    transform: scale(1.1) rotate(5deg);
  }
}

/* 思考时的动画 */
.mascot-button.thinking .mascot-image {
  animation: mascot-thinking 0.8s ease-in-out infinite;
}

@keyframes mascot-thinking {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-8px) rotate(-5deg) scale(1.05);
  }
  50% {
    transform: translateY(-4px) rotate(5deg) scale(1.02);
  }
  75% {
    transform: translateY(-8px) rotate(-3deg) scale(1.05);
  }
}

.speech-bubble {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px 24px;
  border-radius: 25px;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
  white-space: nowrap;
  font-size: 14px;
  color: white;
  animation: pop-in 0.3s ease;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #764ba2;
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
}

.thinking-bubble {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 10px 18px;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  font-size: 24px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.15);
  }
}

.notification-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
  border-radius: 50%;
  border: 3px solid white;
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.chat-window {
  position: absolute;
  bottom: 100px;
  right: -5px;
  width: 480px;
  height: 560px;
  background: rgba(135, 206, 250, 0.15);
  border-radius: 60px;
  box-shadow: 
    0 0 0 6px rgba(135, 206, 250, 0.6),
    0 0 0 12px rgba(173, 216, 230, 0.4),
    0 20px 60px rgba(70, 130, 180, 0.25),
    0 5px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  overflow: visible;
  position: relative;
  /* 给顶部斗笠留出空间 */
  padding-top: 50px;
}

/* 顶部斗笠装饰 */
.chat-window::before {
  content: '';
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 50px;
  background: linear-gradient(180deg, #f5deb3 0%, #deb887 100%);
  border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.chat-window::after {
  content: '';
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 25px;
  background: linear-gradient(180deg, #87ceeb 0%, #b0e0e6 100%);
  border-radius: 50% 50% 0 0;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  z-index: 11;
}

.window-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.decoration-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  height: 1px;
  width: 100%;
}

.decoration-line-1 {
  top: 30%;
}

.decoration-line-2 {
  top: 70%;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.chat-header {
  display: none;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mascot-mini-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.chat-title {
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.5px;
}

.chat-subtitle {
  font-size: 12px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: status-pulse 2s infinite;
}

@keyframes status-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn,
.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.action-btn:hover,
.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.close-btn:hover {
  transform: rotate(90deg);
}

.chat-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  position: relative;
  z-index: 1;
  padding: 20px 30px 20px 30px;
  background: #faf8f5;
  border-radius: 50px;
  margin: 12px;
  margin-top: 25px;
}

/* 横线背景装饰 */
.chat-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    transparent,
    transparent 48px,
    #add8e6 48px,
    #add8e6 50px
  );
  opacity: 0.2;
  pointer-events: none;
  z-index: 0;
}

/* 底部古建筑装饰 */
.chat-body::after {
  content: '🏛️ 🏯';
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 28px;
  opacity: 0.2;
  pointer-events: none;
  z-index: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 10px;
  background: transparent;
  min-height: 0;
  position: relative;
  z-index: 1;
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #87ceeb 0%, #4682b4 100%);
  border-radius: 3px;
}

.welcome-message {
  text-align: center;
  padding: 30px 20px;
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: bounce-icon 2s ease-in-out infinite;
}

@keyframes bounce-icon {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.welcome-text h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.welcome-text p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 24px;
}

.quick-question {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid #87ceeb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #4682b4;
  text-align: left;
}

.quick-question:hover {
  border-color: #4682b4;
  background: rgba(135, 206, 250, 0.15);
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(70, 130, 180, 0.15);
}

.quick-question span {
  font-size: 18px;
}

.message {
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  animation: message-enter 0.4s ease;
  position: relative;
  z-index: 1;
}

@keyframes message-enter {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #87ceeb 0%, #4682b4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(70, 130, 180, 0.3);
  border: 3px solid #faf8f5;
}

.message-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.message-content-wrapper {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-content {
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.6;
  font-size: 14px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: linear-gradient(135deg, #87ceeb 0%, #4682b4 100%);
  color: #ffffff;
  border-radius: 16px 16px 4px 16px;
  box-shadow: 0 4px 12px rgba(70, 130, 180, 0.3);
  border: 2px solid #5cacee;
}

.message.assistant .message-content {
  background: #ffffff;
  color: #4a5568;
  border-radius: 16px 16px 16px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 2px solid #d1e7f0;
}

.message-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.voice-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #faf8f5;
  background: linear-gradient(135deg, #87ceeb 0%, #4682b4 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(70, 130, 180, 0.3);
}

.voice-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(70, 130, 180, 0.4);
}

.message-time {
  font-size: 11px;
  color: #999;
  padding: 0 4px;
}

.message.user .message-time {
  text-align: right;
}

.related-questions {
  margin-top: 20px;
  padding: 16px;
  background: rgba(135, 206, 250, 0.1);
  border-radius: 16px;
  border: 2px solid #add8e6;
  animation: fade-in 0.5s ease;
}

.related-title {
  font-size: 13px;
  font-weight: 600;
  color: #4682b4;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  color: #4682b4;
  border: 1px solid #add8e6;
}

.related-item:hover {
  background: rgba(135, 206, 250, 0.15);
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(70, 130, 180, 0.15);
}

.related-item span {
  font-size: 16px;
}

.typing-indicator {
  display: flex;
  gap: 5px;
  padding: 14px 18px;
  background: #ffffff;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 2px solid #d1e7f0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #87ceeb 0%, #4682b4 100%);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-12px);
  }
}

.chat-input {
  display: flex;
  gap: 12px;
  padding: 18px 20px;
  background: transparent;
  border-top: 2px solid #add8e6;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 28px;
  border: 2px solid #add8e6;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  background: #ffffff;
  border-color: #4682b4;
  box-shadow: 0 0 0 4px rgba(70, 130, 180, 0.15);
}

.chat-input input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #5a3d5c;
}

.chat-input input::placeholder {
  color: #999;
}

.emoji-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  transform: scale(1.2);
}

.send-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid #faf8f5;
  background: linear-gradient(135deg, #87ceeb 0%, #4682b4 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(70, 130, 180, 0.4);
}

.send-btn svg {
  width: 24px;
  height: 24px;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(70, 130, 180, 0.5);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .chat-container {
    right: 20px;
    bottom: 20px;
  }
  
  .mascot-button {
    width: 100px;
    height: 100px;
  }
  
  .chat-window {
    width: calc(100vw - 40px) !important;
    height: 450px !important;
    bottom: 120px;
    right: 20px;
  }
  
  .quick-questions {
    gap: 8px;
  }
  
  .quick-question {
    padding: 12px 14px;
    font-size: 13px;
  }
}
</style>