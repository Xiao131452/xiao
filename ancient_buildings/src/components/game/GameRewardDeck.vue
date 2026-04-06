<template>
  <section class="game-reward-deck" aria-label="通关奖励古建筑卡牌">
    <h3 class="game-reward-deck__heading">
      <span class="game-reward-deck__heading-mark" aria-hidden="true" />
      通关奖励 · 古建筑卡牌
    </h3>
    <p class="game-reward-deck__hint">
      每完成一款小游戏并结束会话，可获得对应卡牌并解锁下方收集栏。
    </p>
    <div class="game-reward-deck__row">
      <article
        v-for="(slot, i) in GAME_REWARD_SLOTS"
        :key="slot.id"
        class="game-reward-card"
        :class="{ 'game-reward-card--locked': !unlocked[i] }"
      >
        <div class="game-reward-card__frame">
          <img
            class="game-reward-card__img"
            :src="gameRewardImage(slot.victoryImage)"
            :alt="slot.name"
            loading="lazy"
            decoding="async"
          />
          <div v-if="!unlocked[i]" class="game-reward-card__veil" aria-hidden="true">
            <span>未获得</span>
          </div>
        </div>
        <p class="game-reward-card__game">{{ slot.miniGameLabel }}</p>
        <p class="game-reward-card__name">{{ slot.name }}</p>
        <p class="game-reward-card__meta">{{ slot.era }} · {{ slot.features }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { GAME_REWARD_SLOTS, gameRewardImage } from '../../data/gameRewardCards.js'
import { gameCollectUnlocked } from '../../composables/gameCollectibleState.js'

const unlocked = gameCollectUnlocked
</script>

<style scoped>
.game-reward-deck {
  margin: 22px 0 0;
  padding: 16px 18px 20px;
  border-radius: 10px;
  background: rgba(10, 8, 6, 0.55);
  border: 1px solid rgba(200, 165, 75, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 248, 220, 0.05);
}

.game-reward-deck__heading {
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255, 250, 240, 0.96);
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'STKaiti', 'KaiTi', serif;
}

.game-reward-deck__heading-mark {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #f0d78c, #b8860b);
  transform: rotate(45deg);
  flex-shrink: 0;
}

.game-reward-deck__hint {
  margin: 0 0 16px;
  font-size: 0.78rem;
  line-height: 1.55;
  color: rgba(220, 200, 170, 0.72);
  letter-spacing: 0.04em;
}

.game-reward-deck__row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(10px, 2vw, 18px);
}

.game-reward-card {
  min-width: 0;
  text-align: center;
}

.game-reward-card__frame {
  position: relative;
  margin: 0 auto;
  max-width: 200px;
  aspect-ratio: 3 / 5;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid rgba(212, 175, 55, 0.45);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 10px 28px rgba(0, 0, 0, 0.35),
    inset 0 0 0 1px rgba(255, 248, 220, 0.08);
  background: #1a1512;
}

.game-reward-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 42%;
  display: block;
  transform: scale(1.08);
}

.game-reward-card--locked .game-reward-card__img {
  filter: grayscale(0.85) brightness(0.45) contrast(1.05);
}

.game-reward-card__veil {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 6, 4, 0.55);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255, 248, 235, 0.88);
}

.game-reward-card__game {
  margin: 10px 0 4px;
  font-size: 0.68rem;
  color: rgba(212, 175, 55, 0.8);
  letter-spacing: 0.06em;
  line-height: 1.35;
}

.game-reward-card__name {
  margin: 0 0 4px;
  font-size: 0.88rem;
  font-weight: 700;
  color: rgba(255, 252, 245, 0.95);
  letter-spacing: 0.14em;
  font-family: 'Source Han Serif SC', 'Noto Serif SC', 'STKaiti', serif;
}

.game-reward-card__meta {
  margin: 0;
  font-size: 0.65rem;
  line-height: 1.45;
  color: rgba(200, 190, 175, 0.75);
  padding: 0 4px;
}

@media (max-width: 960px) {
  .game-reward-deck__row {
    grid-template-columns: 1fr;
  }

  .game-reward-card__frame {
    max-width: 240px;
  }
}
</style>
