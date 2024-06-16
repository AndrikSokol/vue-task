import type { Gender } from '@/enums/gender.enum'
import type { IPersonData } from '@/types/person.interface'
import { instance } from './axios'
import { RESULTS } from '@/constants/api'

export const getPersons = async ({
  page,
  results = RESULTS,
  seed
}: {
  page?: number
  results?: number
  seed?: string
}): Promise<IPersonData> => {
  const { data } = await instance.get('/', {
    params: {
      page: page,
      results: results,
      seed: seed
    }
  })
  return data
}

export const getPersonsByGender = async (gender: Gender): Promise<IPersonData> => {
  const { data } = await instance.get('/', { params: { results: RESULTS, gender } })
  return data
}
