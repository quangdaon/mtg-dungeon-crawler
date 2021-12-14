import { Dungeon } from './models';

declare module '*.dungeon.json' {
	const value: Dungeon;
	export default value;
}
