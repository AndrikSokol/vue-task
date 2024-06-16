import { getPersons } from '@/api/queries'

import { useQuery } from '@tanstack/vue-query'

export const useAllPersonsQuery = () =>
  useQuery({
    queryKey: ['all-persons'],
    queryFn: () => getPersons({}),
    refetchOnWindowFocus: false,
    retry: 3
  })
