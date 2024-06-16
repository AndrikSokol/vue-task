<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { computed, ref, watch } from 'vue'
import SearchIcon from '@/components/icons/IconSearch.vue'
import { Button } from './components/ui/button'
import { useWindowSize } from './components/hooks/useWindowSize'
import { calculateCols } from './lib/utils'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useQueryClient } from '@tanstack/vue-query'
import Catalog from '@/components/Catalog.vue'
import type { IPersonData } from './types/person.interface'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'vue-sonner'
import type { PageQueries } from './types/pageQueries.type'
import { usePersonsQuery } from './components/hooks/usePersonsQuery'
import { useAllPersonsQuery } from './components/hooks/useAllPersonsQuery'
import { useFilterStore } from './components/store/store'
import { RESULTS } from '@/constants/api'

const search = ref('')
const size = useWindowSize()
const state = useFilterStore()
const pageQueries = ref<PageQueries>({
  page: 1,
  results: calculateCols(size.value) * 2,
  seed: 'abc'
})
const queryClient = useQueryClient()

const { isFetching, isError, data: persons, error } = usePersonsQuery(pageQueries)

const {
  isFetching: isFetchingAllPersons,
  isError: isErrorAllPersons,
  data: allPersons
} = useAllPersonsQuery()

watch(size, () => {
  const cols = calculateCols(size.value)
  pageQueries.value.results = cols * 2
})

const filteredPersons = computed(() => {
  if (allPersons?.value) {
    let filtered = allPersons.value.results

    if (state.filters.minAge) {
      filtered = filtered.filter((person) => person.registered.age >= state.filters.minAge!)
    }

    if (state.filters.maxAge) {
      filtered = filtered.filter((person) => person.dob.age <= state.filters.maxAge!)
    }

    if (state.filters.gender) {
      filtered = filtered.filter((person) => person.gender === state.filters.gender)
    }

    if (search.value) {
      filtered = filtered.filter((person) => {
        const names = `${person.name.title} ${person.name.first} ${person.name.last}`
        return names.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
      })
    }

    if (filtered.length === 0) {
      toast('Oops! Nothing was found', {
        description: format(new Date(), "EEEE, MMMM d, yyyy 'at' h:mm a")
      })
    }

    return {
      results: filtered.slice(
        (pageQueries.value.page - 1) * pageQueries.value.results,
        pageQueries.value.page * pageQueries.value.results
      ),
      info: {
        page: pageQueries.value.page,
        results: filtered.length
      }
    }
  } else {
    return {} as IPersonData
  }
})

const areFiltersActive = computed(() => {
  return (
    state.filters.minAge !== undefined ||
    state.filters.maxAge !== undefined ||
    state.filters.gender !== undefined
  )
})
</script>

<template>
  <VueQueryDevtools />
  <Toaster />
  <main class="mx-auto grid grid-cols-main gap-14 h-screen">
    <Sidebar />
    <div class="flex flex-col h-full p-[10px]">
      <div class="relative flex items-center justify-center gap-2 mb-4">
        <Input
          id="search"
          type="text"
          placeholder="Search by name..."
          class="pl-10 focus:outline-none"
          v-model="search"
        />
        <span class="absolute left-0 inset-y-0 flex items-center justify-center px-2">
          <SearchIcon class="w-6 h-6 text-foreground" />
        </span>
      </div>
      <div v-if="isError">error to fetch data. Just refresh a page</div>
      <div v-if="filteredPersons?.results?.length > 0 && (search.length > 0 || areFiltersActive)">
        <Catalog
          :persons="filteredPersons"
          :is-fetching="isFetchingAllPersons"
          :page-queries="pageQueries"
          :size="size"
          :is-error="isErrorAllPersons"
        />
      </div>
      <div
        v-else-if="
          filteredPersons?.results?.length === 0 && (search.length > 0 || areFiltersActive)
        "
      >
        <div class="flex justify-center items-center flex-col">
          <div class="text-xl">Oops! Nothing was found!</div>
          <img class="object-cover w-96 h-96 rounded-md" src="/nothing.jpg" alt="nothing" />
        </div>
      </div>
      <div v-else-if="persons">
        <Catalog
          :persons="persons"
          :is-fetching="isFetching"
          :page-queries="pageQueries"
          :size="size"
          :is-error="isError"
        />
      </div>

      <Pagination
        v-slot="{ page }"
        :items-per-page="pageQueries.results"
        :total="filteredPersons?.info?.results || RESULTS"
        :sibling-count="1"
        show-edges
        :default-page="1"
        class="pt-4 flex justify-center align-bottom"
      >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
          <PaginationFirst
            @click="
              () => {
                pageQueries.page = 1
                queryClient.invalidateQueries({ queryKey: ['persons'] })
              }
            "
          />
          <PaginationPrev
            @click="
              () => {
                pageQueries.page -= 1
                queryClient.invalidateQueries({ queryKey: ['persons'] })
              }
            "
          />

          <template v-for="(item, index) in items">
            <PaginationListItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              as-child
            >
              <Button
                class="w-10 h-10 p-0"
                :variant="item.value === page ? 'default' : 'outline'"
                @click="
                  () => {
                    pageQueries.page = item.value
                    queryClient.invalidateQueries({ queryKey: ['persons'] })
                  }
                "
              >
                {{ item.value }}
              </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext
            @click="
              () => {
                pageQueries.page += 1
                queryClient.invalidateQueries({ queryKey: ['persons'] })
              }
            "
          />
          <PaginationLast
            @click="
              () => {
                pageQueries.page = filteredPersons?.info?.results || RESULTS
                queryClient.invalidateQueries({ queryKey: ['persons'] })
              }
            "
          />
        </PaginationList>
      </Pagination>
    </div>
  </main>
</template>
