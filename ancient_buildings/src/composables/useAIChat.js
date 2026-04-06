import { ref, watch } from 'vue'
import axios from 'axios'

const STORAGE_KEY = 'ancient_buildings_chat_history'
/** 含配置提示的旧版欢迎/报错文案，升级后不再当作历史恢复，避免「明明已配 key 仍显示未配置」 */
const LEGACY_CONFIG_HINT = '当前未配置对话密钥'

const DEFAULT_API_URL = 'https://api.deepseek.com/chat/completions'
const DEFAULT_MODEL = 'deepseek-chat'

function getApiUrl() {
  const u = import.meta.env.VITE_AI_API_URL
  return u && String(u).trim() ? String(u).trim() : DEFAULT_API_URL
}

function getModel() {
  const m = import.meta.env.VITE_AI_MODEL
  return m && String(m).trim() ? String(m).trim() : DEFAULT_MODEL
}

function getApiKey() {
  const k = import.meta.env.VITE_AI_API_KEY
  return k && String(k).trim() ? String(k).trim() : ''
}

/** 清理 AI 返回的 Markdown 格式符号，转为纯文本显示 */
function cleanMarkdown(text) {
  if (!text) return ''
  return (
    text
      // 移除加粗符号 ** 或 __
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      // 移除斜体符号 * 或 _
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      // 移除标题符号 #
      .replace(/^#+\s+/gm, '')
      // 移除水平线 --- 或 ***
      .replace(/^[-*]{3,}$/gm, '')
      // 移除列表符号
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // 移除代码块符号 ```
      .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, '').trim())
      // 移除行内代码符号 `
      .replace(/`(.+?)`/g, '$1')
      // 移除引用符号 >
      .replace(/^>\s+/gm, '')
      // 移除多余空行（保留单个换行）
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

export function useAIChat() {
  const messages = ref(loadChatHistory())
  const isTyping = ref(false)

  function loadChatHistory() {
    // 每次刷新/打开新对话，不恢复历史
    return [
      {
        role: 'assistant',
        content:
          '您好！我是古建筑智能助手，可以为您介绍中国传统建筑、榫卯结构等相关知识。请问有什么可以帮您？',
      },
    ]
  }

  function saveChatHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
    } catch (error) {
      console.error('保存聊天历史失败:', error)
    }
  }

  watch(
    messages,
    () => {
      saveChatHistory()
    },
    { deep: true },
  )

  const sendMessage = async (question) => {
    messages.value.push({
      role: 'user',
      content: question,
    })

    isTyping.value = true

    const apiKey = getApiKey()
    if (!apiKey) {
      console.error('[useAIChat] 未配置 VITE_AI_API_KEY（DeepSeek 的 sk- 密钥）')
      messages.value.push({
        role: 'assistant',
        content:
          '当前未配置对话密钥：请在项目根目录 `.env` 中设置 `VITE_AI_API_KEY` 为你的 DeepSeek API Key（在 https://platform.deepseek.com 申请，一般为 sk- 开头）。注意勿与高德地图的 key 混淆。',
      })
      isTyping.value = false
      return
    }

    const apiUrl = getApiUrl()
    const model = getModel()

    try {
      const response = await axios.post(
        apiUrl,
        {
          model,
          messages: [
            {
              role: 'system',
              content:
                '你是一位中国传统古建筑专家，擅长介绍古建筑、榫卯结构、建筑历史、地域特色与保护知识。回答要准确、简洁，使用现代汉语。若问题与古建筑无关，可简短引导用户回到古建筑相关话题。',
            },
            ...messages.value.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 120000,
        },
      )

      const choice = response.data?.choices?.[0]
      const answer = choice?.message?.content
      if (!answer) {
        throw new Error('响应中无有效正文')
      }
      messages.value.push({
        role: 'assistant',
        content: cleanMarkdown(answer),
      })
    } catch (error) {
      console.error('AI请求失败:', error)
      const errMsg =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        ''
      const hint = errMsg ? `（${errMsg}）` : ''
      messages.value.push({
        role: 'assistant',
        content: `抱歉，暂时无法接通智能服务${hint}。请检查：1）.env 中 VITE_AI_API_KEY 是否为 DeepSeek 的 sk- 密钥；2）VITE_AI_API_URL 是否为 ${DEFAULT_API_URL}；3）网络能否访问 api.deepseek.com。`,
      })
    } finally {
      isTyping.value = false
    }
  }

  return {
    messages,
    isTyping,
    sendMessage,
  }
}
