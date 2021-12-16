<template>
	<div class="home">
		<header class="header">
			<h1>Magic: the Gathering</h1>
			<h1>Dungeon Crawler</h1>
		</header>
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
		<footer class="footer">
			<p>
				Created by
				<a target="_blank" href="https://www.quangdao.com/">Quangdao Nguyen</a>
				|
				<a
					target="_blank"
					href="https://github.com/quangdaon/mtg-dungeon-crawler"
					>GitHub Repo</a
				>
			</p>
			<p class="disclaimer">
				<b>Magic: the Gathering</b> and <b>Dungeons & Dragons</b> are copyright
				Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc. This application
				is unofficial fan content permitted under the Wizards of the Coast Fan
				Content Policy and is not affiliated with Wizards of the Coast.
			</p>
		</footer>
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
.header {
	padding: 0 1em;
	margin: 2em 0 1em;
	text-align: center;
	h1 {
		font-size: 2em;
		margin: 0;
	}
	h2 {
		font-size: 1.75em;
		margin: 0;
	}
}
.dungeon {
	&-list {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	&-link {
		display: block;
		margin: 1em;
		flex: 0 1 300px;
	}

	&-card {
		width: 100%;
		position: relative;
		aspect-ratio: 5 / 7;
		box-shadow: 5px 5px 12px rgba(#000, 0.2);
		border-radius: 4.75% / 3.5%;
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

.footer {
	margin: 1em auto 0;
	text-align: center;
	padding: 0 1em;
	@media (min-width: 600px) {
		max-width: 50%;
	}
	p {
		line-height: 1.2;
		&.disclaimer {
			font-size: 0.75em;
			font-style: italic;
		}
	}
}
</style>
