import { Room } from './room';

export interface Dungeon {
  name: string;
  slug: string;
  image?: string;
  entrances: number[];
  rooms: Room[];
}
