<script setup lang="ts">
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import EmailIcon from '@/components/icons/IconEmail.vue'
import PhoneIcon from '@/components/icons/IconPhone.vue'
import type { IPersonData } from '@/types/person.interface'
import { computed, ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { calculateCols } from '@/lib/utils'

const props = defineProps<{
  persons: IPersonData
  pageQueries: {
    page: number
    results: number
    seed: string
  }
  isFetching: boolean
  size: number
  isError: boolean
}>()

const size = ref(props.size)
const pageQueries = ref(props.pageQueries)
const queryClient = useQueryClient()

watch(size, () => {
  const cols = calculateCols(size.value)
  pageQueries.value.results = cols * 2
})

const gridClass = computed(() => {
  queryClient.invalidateQueries({ queryKey: ['persons'] })
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${pageQueries.value.results / 2}, minmax(0, 1fr))`,
    gap: '10px'
  }
})
</script>

<template>
  <div v-if="isFetching" :style="gridClass">
    <Card v-for="n in pageQueries.results" :key="n" class="border border-slate-200 shadow-sm">
      <CardHeader class="flex justify-center items-center">
        <Skeleton class="h-16 w-16 rounded-full" />
      </CardHeader>
      <CardContent class="flex flex-col gap-1">
        <Skeleton class="h-6 w-1/3" />
        <Skeleton class="h-6 w-1/4" />
        <Skeleton class="h-6 w-1/5" />
        <Skeleton class="h-6 w-full" />
        <Skeleton class="h-6 w-1/2" />
      </CardContent>
    </Card>
  </div>
  <div v-if="isError">Something went wrong</div>
  <div v-if="!isFetching" :style="gridClass">
    <Card
      v-for="(person, index) in persons.results"
      v-bind:key="pageQueries.page * +index"
      class="border border-slate-500 shadow-sm hover:shadow-md hover:border-slate-700 rounded-md duration-100"
    >
      <CardHeader class="w-full flex justify-center items-center">
        <img
          class="object-cover w-16 h-16 rounded-full"
          :src="person.picture.medium"
          :alt="person.name.first + person.name.last"
        />
      </CardHeader>
      <CardContent class="flex flex-col gap-1">
        <h2>{{ person.name.first + ' ' + person.name.last }}</h2>
        <h3>gender: {{ person.gender }}</h3>
        <h3>age: {{ person.dob.age }}</h3>
        <div class="flex gap-2 items-center justify-start">
          <EmailIcon class="text-black w-6 h-6" /><a
            :href="'mailto:' + person.email"
            target="_blank"
            class="underline text-muted-foreground cursor-pointer hover:text-black duration-100 hover:scale-[102%]"
            >{{ person.email }}</a
          >
        </div>
        <div class="flex gap-2 items-center">
          <PhoneIcon class="text-black w-6 h-6" /><a
            :href="'tel:' + person.phone"
            class="underline text-muted-foreground cursor-pointer hover:text-black duration-100 hover:scale-[102%]"
            >{{ person.phone }}</a
          >
        </div>
      </CardContent>
    </Card>
  </div>
</template>
