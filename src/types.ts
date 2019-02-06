export type ValueOf<T> = T[keyof T]

export interface Item {
  id: string
  type: ItemTypes
  time?: string
  note?: string
}

export enum ItemTypes {
  Feed = 'feed',
  Nappy = 'nappy',
}

export enum Units {
  Millilitres = 'ml',
  FluidOz = 'fl oz',
}

export interface Feed extends Item {
  type: ItemTypes.Feed
  amount: string
  unit: Units
}

export interface Nappy extends Item {
  type: ItemTypes.Nappy
  isPoop: boolean
  isWee: boolean
}

export type Items = Feed | Nappy
