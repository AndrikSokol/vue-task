import type { Gender } from '@/enums/gender.enum'

type Name = {
  title: string
  first: string
  last: string
}

type PictureSize = {
  large: string
  medium: string
  small: string
}

type Info = {
  results: number
  page: number
}

export interface IPerson {
  picture: PictureSize
  name: Name
  gender: Gender
  dob: { age: number }
  email: string
  phone: string
  registered: { age: number }
}

export interface IPersonData {
  results: IPerson[]
  info: Info
}
