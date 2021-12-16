import { Dungeon } from '@/models';
import { reactive } from 'vue';

const dungeons = reactive<Dungeon[]>([]);

export const getAll = () => dungeons as ReadonlyArray<Dungeon>;

export const get = (slug: string) => dungeons.find(e => e.slug === slug);

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
		if (dungeons.some(e => e.slug === slug)) continue;

		const { default: dungeon } = await import(
			`@/assets/dungeons/${slug}.dungeon.json`
		);

		add(dungeon);
	}
};
