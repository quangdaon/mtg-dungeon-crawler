<template>
	<div class="home">
		<div class="dungeon-list">
			<router-link
				class="dungeon-link"
				v-for="dungeon in dungeons"
				:key="dungeon.slug"
				:to="{ name: DungeonRoute, params: { slug: dungeon.slug } }"
			>
				<div class="dungeon-card">
					<div
						v-if="dungeon.image"
						class="dungeon-card-content dungeon-card-image"
					>
						<img :src="dungeon.image" :alt="dungeon.name" />
					</div>
					<div v-else class="dungeon-card-content dungeon-card-placeholder">
						{{ dungeon.name }}
					</div>
				</div>
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { DungeonService } from '@/services';
import { Dungeon } from '@/models';
import { DungeonRoute } from '@/router';

export default defineComponent({
	name: 'Home',
	setup() {
		const dungeons = ref<ReadonlyArray<Dungeon>>([]);

		onMounted(async () => {
			await DungeonService.loadDefaults();
			dungeons.value = DungeonService.getAll();
		});

		return { dungeons, DungeonRoute };
	}
});
</script>

<style lang="scss" scoped>
.dungeon {
	&-list {
		display: flex;
	}

	&-card {
		position: relative;
		width: 300px;
		aspect-ratio: 5 / 7;
		box-shadow: 5px 5px 12px rgba(#000, 0.2);
		border-radius: 4.75% / 3.5%;
		margin: 0 1em;
		overflow: hidden;

		&-content {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}

		&-image {
			img {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		&-placeholder {
			background: #f8f8f8;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			font-size: 2em;
			padding: 1em;
		}
	}
}
</style>
