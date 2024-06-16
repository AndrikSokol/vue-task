import { getPersons } from '@/api/queries'
import type { PageQueries } from '@/types/pageQueries.type'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'

export const usePersonsQuery = (pageQueries: Ref<PageQueries>) =>
  useQuery({
    queryKey: ['persons', pageQueries.value.page, pageQueries.value.results],
    queryFn: () => getPersons(pageQueries.value),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: 1
  })
