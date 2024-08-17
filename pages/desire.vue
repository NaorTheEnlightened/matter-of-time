<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4 text-center">My Desires</h1>

    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-if="loading" class="text-center py-4">
      <p>Loading desires...</p>
    </div>

    <div v-else class="flex">
      <!-- Sidebar -->
      <div class="w-1/4 pr-4">
        <h2 class="text-xl font-semibold mb-2">Desires</h2>
        <ul>
          <li
            v-for="desire in desires"
            :key="desire.id"
            class="mb-2 flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
          >
            <button
              @click="selectDesire(desire)"
              class="text-left flex-grow hover:text-blue-500"
            >
              {{ desire.title }}
            </button>
            <div class="flex items-center">
              <button
                @click.stop="editDesireFromSidebar(desire)"
                class="text-blue-500 hover:text-blue-700 mr-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
              </button>
              <button
                @click.stop="deleteDesireFromSidebar(desire)"
                class="text-red-500 hover:text-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </li>
        </ul>
        <button
          @click="newDesire"
          class="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
        >
          Add New Desire
        </button>
      </div>

      <!-- Main content -->
      <div v-if="selectedDesire" class="w-3/4 pl-4">
        <h2 class="text-2xl font-bold mb-4 text-center">
          {{ selectedDesire.title }}
          <span v-if="isCompleted" class="text-green-500 ml-2">✓</span>
        </h2>
        <button
          @click="toggleEditMode"
          class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {{ isEditing ? 'View Mode' : 'Edit Mode' }}
        </button>

        <div v-if="!isEditing" class="flex justify-between space-x-4">
          <!-- New Image Column -->
          <div class="w-1/3">
            <h3 class="text-xl font-semibold mb-2">Desire Image</h3>
            <img
              v-if="selectedDesire.image"
              :src="selectedDesire.image"
              alt="Desire image"
              class="w-full h-auto max-h-60 object-cover rounded-lg shadow-md"
            />
            <p v-else class="text-gray-500 italic">No image available</p>
          </div>

          <!-- Existing Time Column -->
          <div class="w-1/3 text-center">
            <h3 class="text-xl font-semibold mb-2">Time</h3>
            <div
              class="clock-face border-4 border-gray-300 rounded-full w-32 h-32 relative mx-auto"
            >
              <!-- Clock hands -->
              <div class="hand hour-hand" :style="hourHandStyle"></div>
              <div class="hand minute-hand" :style="minuteHandStyle"></div>
            </div>
            <p class="mt-2">{{ formattedTime }}</p>
          </div>

          <!-- Existing Probability Column -->
          <div class="w-1/3 text-center">
            <h3 class="text-xl font-semibold mb-2">
              Opposite Outcome Probability
            </h3>
            <p class="text-4xl font-bold">
              {{ oppositeOutcomeProbability }}%
            </p>
            <ul class="mt-4 text-left">
              <li
                v-for="(tool, index) in selectedDesire.tools"
                :key="index"
                class="mb-2"
              >
                {{ tool.name }}: {{ tool.probability }}%
              </li>
            </ul>
          </div>
        </div>

        <div v-else>
          <!-- Edit mode content -->
          <div v-if="editLoading" class="text-center py-4">
            <p>Loading...</p>
            <p>Saving changes...</p>
          </div>
          <div v-else>
            <div class="mb-4">
              <label class="block mb-2">Title:</label>
              <input
                v-model="selectedDesire.title"
                type="text"
                class="border p-2 w-full"
              />
            </div>

            <div class="mb-4">
              <label class="block mb-2">Image:</label>
              <div class="flex items-center">
                <input
                  v-model="selectedDesire.image"
                  type="text"
                  class="border p-2 w-full mr-2"
                  placeholder="Image URL"
                />
                <span class="mr-2">OR</span>
                <input
                  type="file"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="border p-2"
                />
              </div>
            </div>

            <img
              v-if="selectedDesire.image"
              :src="selectedDesire.image"
              alt="Desire image"
              class="mb-4 max-w-md"
            />

            <div class="mb-4">
              <label class="block mb-2">Time:</label>
              <input
                v-model.number="selectedDesire.timeDays"
                type="number"
                class="border p-2 mr-2"
                min="0"
              />
              Days
              <input
                v-model.number="selectedDesire.timeHours"
                type="number"
                class="border p-2 mr-2 ml-2"
                min="0"
                max="23"
              />
              Hours
              <input
                v-model.number="selectedDesire.timeMinutes"
                type="number"
                class="border p-2 mr-2 ml-2"
                min="0"
                max="59"
              />
              Minutes
            </div>

            <div class="mb-4">
              <label class="block mb-2">Tools:</label>
              <ul>
                <li
                  v-for="(tool, index) in selectedDesire.tools"
                  :key="index"
                  class="mb-2"
                >
                  <input
                    v-model="tool.name"
                    type="text"
                    class="border p-2 mr-2"
                    placeholder="Tool name"
                  />
                  <input
                    v-model.number="tool.probability"
                    type="number"
                    class="border p-2 mr-2"
                    min="0"
                    max="100"
                  />
                  %
                  <button
                    @click="removeTool(index)"
                    class="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </li>
              </ul>
              <button
                @click="addTool"
                class="bg-green-600 text-white px-4 py-2 rounded mt-2"
              >
                Add Tool
              </button>
            </div>

            <button
              @click="saveDesire"
              class="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              @click="deleteDesire"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-else class="w-3/4 pl-4">
        <p>Select a desire from the sidebar or create a new one.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useDesireStore } from '~/stores/desire';
import { useUserStore } from '~/stores/user';
import { storeToRefs } from 'pinia';

const desireStore = useDesireStore();
const userStore = useUserStore();
const { desires, loading, error } = storeToRefs(desireStore);
const { isLoggedIn } = storeToRefs(userStore);
const selectedDesire = ref(null);
const isEditing = ref(false);
const editLoading = ref(false);

const isUserDataAvailable = () => {
  if (process.client) {
    return !!localStorage.getItem('user');
  }
  return false;
};

const fetchDesires = async () => {
  if (isUserDataAvailable()) {
    await desireStore.fetchDesires();
  }
};

watch(
  () => isUserDataAvailable(),
  (newValue) => {
    if (newValue) {
      fetchDesires();
    }
  },
  { immediate: true },
);

watch(isLoggedIn, (newValue) => {
  if (newValue) {
    desireStore.fetchDesires();
  } else {
    desireStore.resetState();
  }
});

onMounted(() => {
  userStore.initializeFromStorage();
  if (isLoggedIn.value) {
    desireStore.fetchDesires();
  }
});

function selectDesire(desire) {
  selectedDesire.value = JSON.parse(JSON.stringify(desire));
  isEditing.value = false;
}

function newDesire() {
  selectedDesire.value = {
    title: 'New Desire',
    image: '',
    timeDays: 0,
    timeHours: 0,
    timeMinutes: 0,
    tools: [],
  };
  isEditing.value = true;
}

async function toggleEditMode() {
  if (!isEditing.value) {
    editLoading.value = true;
    try {
      const updatedDesire = await desireStore.fetchDesire(
        selectedDesire.value.id,
      );
      selectedDesire.value = JSON.parse(JSON.stringify(updatedDesire));
    } catch (err) {
      console.error('Error fetching updated desire:', err);
    } finally {
      editLoading.value = false;
    }
  }
  isEditing.value = !isEditing.value;
}

function addTool() {
  selectedDesire.value.tools.push({ name: '', probability: 0 });
}

function removeTool(index) {
  selectedDesire.value.tools.splice(index, 1);
}

const oppositeOutcomeProbability = computed(() => {
  if (!selectedDesire.value) return 100;
  const totalProbability = selectedDesire.value.tools.reduce(
    (sum, tool) => sum + tool.probability,
    0,
  );
  return Math.max(0, 100 - totalProbability);
});

const formattedTime = computed(() => {
  if (!selectedDesire.value) return '';
  const { timeDays, timeHours, timeMinutes } = selectedDesire.value;
  return `${timeDays}d ${timeHours}h ${timeMinutes}m`;
});

const isCompleted = computed(() => {
  if (!selectedDesire.value) return false;
  const { timeDays, timeHours, timeMinutes, tools } = selectedDesire.value;
  const totalTime = timeDays * 24 * 60 + timeHours * 60 + timeMinutes;
  const totalProbability = tools.reduce(
    (sum, tool) => sum + tool.probability,
    0,
  );
  return totalTime === 0 || totalProbability >= 100;
});

const hourHandStyle = computed(() => {
  if (!selectedDesire.value) return {};
  const { timeDays, timeHours } = selectedDesire.value;
  const totalHours = timeDays * 24 + timeHours;
  const degrees = ((totalHours % 12) / 12) * 360;
  return {
    transform: `rotate(${degrees}deg)`,
    transformOrigin: 'bottom',
    position: 'absolute',
    bottom: '50%',
    left: 'calc(50% - 2px)',
    width: '4px',
    height: '25%',
    backgroundColor: 'black',
  };
});

const minuteHandStyle = computed(() => {
  if (!selectedDesire.value) return {};
  const { timeMinutes } = selectedDesire.value;
  const degrees = (timeMinutes / 60) * 360;
  return {
    transform: `rotate(${degrees}deg)`,
    transformOrigin: 'bottom',
    position: 'absolute',
    bottom: '50%',
    left: 'calc(50% - 1px)',
    width: '2px',
    height: '40%',
    backgroundColor: 'black',
  };
});

async function saveDesire() {
  try {
    error.value = null;
    editLoading.value = true;
    let desireToSave = {
      ...selectedDesire.value,
      timeDays: Number(selectedDesire.value.timeDays),
      timeHours: Number(selectedDesire.value.timeHours),
      timeMinutes: Number(selectedDesire.value.timeMinutes),
      tools: selectedDesire.value.tools.map((tool) => ({
        ...tool,
        probability: Number(tool.probability),
      })),
    };

    const totalTime =
      desireToSave.timeDays * 24 * 60 +
      desireToSave.timeHours * 60 +
      desireToSave.timeMinutes;
    const totalProbability = desireToSave.tools.reduce(
      (sum, tool) => sum + tool.probability,
      0,
    );

    if (totalTime === 0 || totalProbability >= 100) {
      desireToSave.timeDays = 0;
      desireToSave.timeHours = 0;
      desireToSave.timeMinutes = 0;
      desireToSave.tools = desireToSave.tools.map((tool) => ({
        ...tool,
        probability: 0,
      }));
    }

    if (selectedDesire.value.id) {
      await desireStore.updateDesire(
        selectedDesire.value.id,
        desireToSave,
      );
    } else {
      const newDesire = await desireStore.addDesire(desireToSave);
      selectedDesire.value.id = newDesire.id;
    }
    await desireStore.fetchDesires();
    isEditing.value = false;
  } catch (err) {
    error.value = 'Failed to save desire. Please try again.';
    console.error('Error saving desire:', err);
  } finally {
    editLoading.value = false;
  }
}

async function deleteDesire() {
  if (selectedDesire.value.id) {
    try {
      error.value = null;
      editLoading.value = true;
      await desireStore.deleteDesire(selectedDesire.value.id);
      selectedDesire.value = null;
    } catch (err) {
      error.value = 'Failed to delete desire. Please try again.';
      console.error('Error deleting desire:', err);
    } finally {
      editLoading.value = false;
    }
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedDesire.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function editDesireFromSidebar(desire) {
  selectDesire(desire);
  isEditing.value = true;
}

async function deleteDesireFromSidebar(desire) {
  if (confirm(`Are you sure you want to delete "${desire.title}"?`)) {
    try {
      error.value = null;
      await desireStore.deleteDesire(desire.id);
      if (selectedDesire.value && selectedDesire.value.id === desire.id) {
        selectedDesire.value = null;
      }
    } catch (err) {
      error.value = 'Failed to delete desire. Please try again.';
      console.error('Error deleting desire:', err);
    }
  }
}
</script>

<style scoped>
.clock-face {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background-color: black;
}
</style>
