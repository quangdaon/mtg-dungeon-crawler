<template>
	<div class="dungeon-grid" v-if="currentRoom !== null">
		<button class="room-return" v-if="returnRoom !== null" @click="goBack">
			Return to <span>{{ returnRoom.name }}</span>
		</button>
		<div class="room room-current">
			<div class="room-text">
				<h3>{{ currentRoom.name }}</h3>
				<p>{{ currentRoom.effect }}</p>
			</div>
		</div>
		<div class="room-exits">
			<button
				class="room room-next"
				v-for="room in nextRooms"
				:key="room.id"
				@click="proceedTo(room.id)"
			>
				<div class="room-text">
					<h3>{{ room.name }}</h3>
					<p>{{ room.effect }}</p>
				</div>
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

<style lang="scss">
.dungeon {
	&-grid {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		overflow: hidden;
		background: #c3bfbc;
	}
}

button {
	cursor: pointer;
}

.room {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1em;
	&-text {
		text-align: center;
		h3 {
			font-size: 2em;
		}
		p {
			font-size: 1.5em;
			font-style: italic;
		}
	}

	&-return {
		position: absolute;
		background: transparent;
		border: none;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1.5em;
		padding-top: 2em;
		&::before {
			content: '';
			$light-tint: #fff3b0;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 1em;
			background: radial-gradient(ellipse at top, $light-tint 0, rgba($light-tint, 0) 50%);
			overflow: visible;
		}
		&::after {
			content: '^';
			position: absolute;
			top: 0.5em;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	&-current {
		flex: 1 1 0;
	}

	&-exits {
		flex: 0 0 20%;
		display: flex;
		width: 100%;
	}

	&-next {
		flex: 1 1 0;
		background: transparent;
		border: 0 solid #443a31;
		border-width: 20px 10px 0;
		&:first-child {
			border-left-width: 0;
		}
		&:last-child {
			border-right-width: 0;
		}
	}
}
</style>
