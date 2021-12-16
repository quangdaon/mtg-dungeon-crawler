<template>
	<div class="dungeon-grid" v-if="currentRoom !== null">
		<button class="room-return" v-if="returnRoom !== null" @click="goBack">
			Return to <span>{{ returnRoom.name }}</span>
		</button>
		<div class="room-current">
			<h3>{{ currentRoom.name }}</h3>
			<p>{{ currentRoom.effect }}</p>
		</div>
		<div class="room-exits">
			<button
				class="room-next"
				v-for="room in nextRooms"
				:key="room.id"
				@click="proceedTo(room.id)"
			>
				<h3>{{ room.name }}</h3>
				<p>{{ room.effect }}</p>
			</button>
			<button class="room-next" v-if="!nextRooms" @click="exitDungeon">
				<h3>Exit Dungeon</h3>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { Dungeon, Room } from '@/models';
import router, { HomeRoute } from '@/router';
import { DungeonService } from '@/services';
import { onMounted, defineComponent, ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
	setup() {
		const route = useRoute();
		const dungeon = ref<Dungeon>(null);
		const currentRoom = ref<Room>(null);
		const roomHistory = reactive<number[]>([]);

		const getRoom = (id: number) => dungeon.value?.rooms.find(e => e.id === id);

		const proceedTo = (id: number) => {
			if (currentRoom.value) roomHistory.push(currentRoom.value.id);
			currentRoom.value = getRoom(id);
		};

		const goBack = () => {
			const id = roomHistory.pop();
			currentRoom.value = getRoom(id);
		};

		const returnRoom = computed<Room>(() => {
			if (!roomHistory.length) return null;

			return getRoom(roomHistory[roomHistory.length - 1]);
		});

		const nextRooms = computed<Room[]>(() => {
			const exits = currentRoom.value.exits;
			if (!exits.length) return null;

			return exits.map(e => getRoom(e));
		});

		const exitDungeon = () => router.push({ name: HomeRoute });

		onMounted(() => {
			const slug = route.params.slug as string;
			dungeon.value = DungeonService.get(slug);

			if (!dungeon.value) {
				exitDungeon();
				return;
			}

			const entranceId = dungeon.value.entrances[0];

			proceedTo(entranceId);
		});

		return {
			currentRoom,
			returnRoom,
			nextRooms,
			proceedTo,
			goBack,
			exitDungeon
		};
	}
});
</script>

<style lang="scss"></style>
