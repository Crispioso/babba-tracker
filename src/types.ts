export interface Item {
  id: string
  type: ItemTypes
  time?: string
  note?: string
}

export enum ItemTypes {
  Feeds = 'feeds',
  Nappy = 'nappy',
}

export enum Units {
  Millilitres = 'ml',
  FluidOz = 'fl oz',
}

export interface Feed extends Item {
  type: ItemTypes.Feeds
  amount: number
  unit: Units
}

export interface Nappy extends Item {
  type: ItemTypes.Nappy
  isPoop: boolean
  isWee: boolean
}

export type Items = Feed | Nappy
