import { Gender } from '@/enums/gender.enum'
import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', {
  state: () => ({ minAge: 0, maxAge: 0, gender: '' as Gender }),
  getters: {
    filters: (state) => state
  },
  actions: {
    setFilter(filters: { minAge?: number; maxAge?: number; gender?: Gender }) {
      if (filters.minAge) {
        this.minAge = filters.minAge
      }
      if (filters.maxAge) {
        this.maxAge = filters.maxAge
      }
      if (filters.gender) {
        this.gender = filters.gender
      }
    },

    resetFilter() {
      this.minAge = 0
      this.maxAge = 0
      this.gender = '' as Gender
    }
  }
})
