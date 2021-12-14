import { Dungeon } from '@/models';
import { reactive } from 'vue';

const dungeons = reactive<Dungeon[]>([]);

export const getAll = () => dungeons as ReadonlyArray<Dungeon>;

export const add = (dungeon: Dungeon): Dungeon => {
	dungeons.push(dungeon);
	return dungeon;
};

export const loadDefaults = async () => {
	const dungeonSlugs = [
		'dungeon-of-the-mad-mage',
		'lost-mine-of-phandelver',
		'tomb-of-annihilation'
	];

	for (const slug of dungeonSlugs) {
		const { default: dungeon } = await import(
			`@/assets/dungeons/${slug}.dungeon.json`
		);

    add(dungeon);
	}
};
