<template>
	<div
		class="dungeon"
		v-if="currentRoom !== null"
		@mousemove="mouseMove"
		@mouseup="endDrag"
		@touchmove="mouseMove"
		@touchend="endDrag"
	>
		<div class="dungeon-grid">
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
					<div class="room-text">
						<h3>Exit Dungeon</h3>
					</div>
				</button>
			</div>
		</div>

		<div
			ref="inventory"
			class="inventory"
			:style="{ '--top-position': inventoryPosition + 'px' }"
			@mousedown="startDrag"
			@touchstart="startDrag"
		>
			<div class="inventory-title">Inventory:</div>
			<button class="inventory-item" v-if="nextRooms" @click="exitDungeon">
				<div class="inventory-icon">🏠</div>
				<div class="inventory-label">Teleport</div>
			</button>
			<button
				class="inventory-item"
				v-if="dungeon.image"
				@click="mapOpen = true"
			>
				<div class="inventory-icon">🗺️</div>
				<div class="inventory-label">Map</div>
			</button>
		</div>

		<div class="map" v-if="mapOpen" @click="mapOpen = false">
			<img :src="dungeon.image" :alt="dungeon.name" />
		</div>
	</div>
</template>

<script lang="ts">
import { Dungeon, Room } from '@/models';
import router, { HomeRoute } from '@/router';
import { DungeonService } from '@/services';
import { onMounted, defineComponent, ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';

interface InventoryPositionCalculation {
	anchor: number;
	mousePosition: number;
	storedPosition: number;
}

export default defineComponent({
	setup() {
		const invPositionCalc = reactive<InventoryPositionCalculation>({
			anchor: null,
			mousePosition: null,
			storedPosition: window.innerHeight / 2
		});
		const inventory = ref();
		const route = useRoute();
		const dungeon = ref<Dungeon>(null);
		const mapOpen = ref(false);
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

		const inventoryPosition = computed<number>(() => {
			if (invPositionCalc.anchor === null)
				return invPositionCalc.storedPosition;

			const diff = invPositionCalc.mousePosition - invPositionCalc.anchor;

			const target = invPositionCalc.storedPosition + diff;

			const max = window.innerHeight - inventory.value.offsetHeight;

			return Math.max(Math.min(target, max), 0);
		});

		const exitDungeon = () => router.push({ name: HomeRoute });

		const startDrag = (e: MouseEvent | TouchEvent) => {
			const pos = e instanceof MouseEvent ? e.clientY : e.touches[0].screenY;
			invPositionCalc.mousePosition = pos;
			invPositionCalc.anchor = pos;
			document.body.classList.add('disable-refresh');
		};

		const endDrag = () => {
			invPositionCalc.storedPosition = inventoryPosition.value;
			invPositionCalc.anchor = null;
			document.body.classList.remove('disable-refresh');
		};

		const mouseMove = (e: MouseEvent | TouchEvent) => {
			invPositionCalc.mousePosition =
				e instanceof MouseEvent ? e.clientY : e.touches[0].screenY;
		};

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
			dungeon,
			mapOpen,

			currentRoom,
			returnRoom,
			nextRooms,
			proceedTo,
			goBack,
			exitDungeon,

			inventory,
			inventoryPosition,
			startDrag,
			endDrag,
			mouseMove
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
		background-color: #c3bfbc;
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
			background: radial-gradient(
				ellipse at top,
				$light-tint 0,
				rgba($light-tint, 0) 50%
			);
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
		position: relative;
		flex: 1 1 0;
		background: transparent;
		border: none;
		&::before {
			$door-width: 12vw;
			$wall-width: 1em;
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			border: 0 solid #443a31;
			border-width: ($wall-width) calc($wall-width / 2) 0;
			clip-path: polygon(
				0 0,
				calc(50% - ($door-width / 2)) 0,
				calc(50% - ($door-width / 2)) calc($wall-width + 0.25em),
				calc(50% + ($door-width / 2)) calc($wall-width + 0.25em),
				calc(50% + ($door-width / 2)) 0,
				100% 0,
				100% 100%,
				0 100%,
				0 0
			);
		}
		&:first-child::before {
			border-left-width: 0;
		}
		&:last-child::before {
			border-right-width: 0;
		}
	}
}

.inventory {
	position: absolute;
	right: 0;
	top: var(--top-position);
	&-title {
		text-align: center;
		margin-bottom: 1em;
		font-size: 0.875em;
	}
	&-item {
		position: relative;
		width: 6em;
		height: 6em;
		border: 0.25em solid #000;
		background: #fff;
		display: block;
	}
	&-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 4em;
	}
	&-label {
		position: absolute;
		top: 50%;
		left: 50%;
		font-weight: bold;
		transform: translate(-50%, -50%);
		text-shadow: 0 0 0.25em #fff;
	}
}

.map {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(#000, 0.75);
	display: flex;
	justify-content: center;
	align-items: center;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}
</style>
