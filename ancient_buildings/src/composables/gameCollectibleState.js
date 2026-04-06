import { ref } from 'vue'

export const COLLECT_CARDS_STORAGE_KEY = 'ancient-buildings-collect-cards'
export const MINI_GAME_EXIT_EVENT = 'ancient-buildings-mini-game-exit'

/** 与 GameCollectibleCards / MapView 共用，三槽对应三个小游戏 */
export const gameCollectUnlocked = ref([false, false, false])

export function hydrateGameCollectUnlocked() {
  try {
    const raw = sessionStorage.getItem(COLLECT_CARDS_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length === 3) {
      gameCollectUnlocked.value = parsed.map((x) => Boolean(x))
    }
  } catch {
    /* ignore */
  }
}

export function persistGameCollectUnlocked() {
  try {
    sessionStorage.setItem(
      COLLECT_CARDS_STORAGE_KEY,
      JSON.stringify(gameCollectUnlocked.value),
    )
  } catch {
    /* ignore */
  }
}

export function unlockGameCollectSlot(index) {
  if (index < 0 || index > 2) return
  const next = [...gameCollectUnlocked.value]
  next[index] = true
  gameCollectUnlocked.value = next
  persistGameCollectUnlocked()
}
