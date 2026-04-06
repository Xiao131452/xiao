import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
/** <model-viewer> 由根目录 index.html 中的 @google/model-viewer 脚本注册，此处勿重复 import，否则会重复 define 报错 */

const app = createApp(App)
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue]', info, err)
}
app.use(createPinia())
app.use(router)
app.mount('#app')
