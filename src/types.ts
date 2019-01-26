export interface Item {
  id: string
  type: string
}

export enum ItemTypes {
  Feeds = 'feeds',
}

export enum Units {
  Millilitres = 'ml',
  FluidOz = 'fl oz',
}

export interface Feed extends Item {
  type: ItemTypes.Feeds
  amount: number
  unit: Units
  time?: string
  note?: string
}

export type Items = Feed
