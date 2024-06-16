import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'
import { throttle } from 'lodash-es'

export function useWindowSize() {
  const size = ref(window.innerWidth)

  const onResize = throttle(() => {
    size.value = window.innerWidth
  }, 1000)

  useEventListener(window, 'resize', onResize)

  return size
}
