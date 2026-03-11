import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { posts as initialPosts } from '@/lib/data'
import { useAuthStore } from './auth'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([...initialPosts])

  const drafts = computed(() => posts.value.filter(p => p.status === 'draft'))
  const ready = computed(() => posts.value.filter(p => p.status === 'ready'))
  const queued = computed(() => posts.value.filter(p => p.status === 'queued'))
  const posted = computed(() => posts.value.filter(p => p.status === 'posted'))
  const queueItems = computed(() => posts.value.filter(p => p.status !== 'draft'))

  const byType = (type) => posts.value.filter(p => p.type === type)

  function claimPost(postId) {
    const auth = useAuthStore()
    const post = posts.value.find(p => p.id === postId)
    if (post && post.status === 'ready') {
      post.assignedTo = auth.currentUser.id
      post.status = 'queued'
    }
  }

  return { posts, drafts, ready, queued, posted, queueItems, byType, claimPost }
})
