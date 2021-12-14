<template>
	<div class="home"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { DungeonService } from '@/services';

export default defineComponent({
	name: 'Home',
	setup() {
		onMounted(async () => {
			await DungeonService.loadDefaults();

			console.log(DungeonService.getAll());
		});
	}
});
</script>
