export type ValueOf<T> = T[keyof T]

export interface Item {
  id: string
  type: ItemTypes
  time: number
  note?: string
  user?: string
  archived?: boolean
  lastEdit?: {
    email: string
    time: number
  }
}

export enum ItemTypes {
  Feed = 'feed',
  Nappy = 'nappy',
  Sleep = 'sleep',
}

export enum Units {
  Millilitres = 'ml',
  FluidOz = 'fl oz',
}

export interface Feed extends Item {
  type: ItemTypes.Feed
  amount: string
  unit: Units
  includesGripeWater?: boolean
}

export interface Nappy extends Item {
  type: ItemTypes.Nappy
  isPoop: boolean
  isWee: boolean
}

export interface Sleep extends Item {
  type: ItemTypes.Sleep
  endTime?: number
}

export type Items = Feed | Nappy | Sleep

export const babyName = 'Evelyn'
