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
            :key="desire?.id"
            class="mb-2 flex items-center justify-between bg-white p-2 rounded-lg shadow-sm"
          >
            <button
              @click="selectDesire(desire)"
              class="text-left flex-grow hover:text-blue-500"
            >
              {{ desire.title }}
              <span v-if="isDesireCompleted" class="text-green-500 ml-2"
                >✓</span
              >
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

        <div v-if="!isEditing" class="flex flex-col space-y-8">
          <div class="flex justify-between space-x-4">
            <!-- Desire Image Column -->
            <div class="w-1/3 relative">
              <h3 class="text-xl font-semibold mb-2">Desire Image</h3>
              <div
                class="relative inline-block"
                @mouseenter="isHoveringImage = false"
                @mouseleave="isHoveringImage = false"
              >
                <img
                  v-if="selectedDesire.image"
                  :src="selectedDesire.image"
                  alt="Desire image"
                  class="w-full h-auto max-h-60 object-cover rounded-lg shadow-md cursor-help"
                />
                <p v-else class="text-gray-500 italic cursor-help">
                  No image available
                </p>
                <div
                  v-if="isHoveringImage"
                  class="absolute z-10 w-64 p-2 mt-2 text-sm leading-tight text-white bg-black rounded-lg shadow-lg"
                  style="
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: -60px;
                  "
                >
                  <p>
                    Can you map all objects and forces needed for this to
                    be done?
                  </p>
                </div>
              </div>
            </div>

            <!-- Time Column -->
            <div class="w-1/3 text-center relative">
              <h3 class="text-xl font-semibold mb-2">Time</h3>
              <div
                class="relative inline-block"
                @mouseenter="isHoveringTime = false"
                @mouseleave="isHoveringTime = false"
              >
                <div
                  class="clock-face border-4 border-gray-300 rounded-full w-32 h-32 relative mx-auto cursor-help"
                >
                  <div class="hand hour-hand" :style="hourHandStyle"></div>
                  <div
                    class="hand minute-hand"
                    :style="minuteHandStyle"
                  ></div>
                </div>
                <p class="mt-2">{{ formattedTime }}</p>
                <div
                  v-if="isHoveringTime"
                  class="absolute z-10 w-64 p-2 mt-2 text-sm leading-tight text-white bg-black rounded-lg shadow-lg"
                  style="left: 50%; transform: translateX(-50%)"
                >
                  <p>Does it reduce time to 0s?</p>
                </div>
              </div>
              <div class="mt-2">
                <svg
                  class="w-4 h-4 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4v16m0 0l-4-4m4 4l4-4"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p class="text-sm font-semibold">0s</p>
              </div>
            </div>

            <!-- Opposite Outcome Probability Column -->
            <div class="w-1/3 text-center relative">
              <h3 class="text-xl font-semibold mb-2">
                Opposite Outcome Probability
              </h3>
              <div
                class="relative inline-block"
                @mouseenter="isHoveringProbability = false"
                @mouseleave="isHoveringProbability = false"
              >
                <p class="text-4xl font-bold cursor-help">
                  {{ oppositeOutcomeProbability }}%
                </p>
                <div
                  v-if="isHoveringProbability"
                  class="absolute z-10 w-64 p-2 mt-2 text-sm leading-tight text-white bg-black rounded-lg shadow-lg"
                  style="left: 50%; transform: translateX(-50%)"
                >
                  <p>
                    Which tools or forces will correspond in a perfect 0%
                    probability of an opposite outcome to this desire?
                  </p>
                </div>
              </div>
              <div
                v-if="
                  selectedDesire &&
                  selectedDesire.tools &&
                  selectedDesire.tools.length > 0
                "
                class="mt-4"
              >
                <h4 class="text-lg font-semibold mb-2">Tools:</h4>
                <ul class="text-left">
                  <li
                    v-for="(tool, index) in selectedDesire.tools"
                    :key="index"
                    class="mb-2 text-xs inline-flex items-center"
                  >
                    <button
                      @click="selectTool(tool)"
                      class="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      {{ tool.name }}:
                    </button>
                    <p class="font-bold px-3">
                      {{ tool.probability || 0 }}%
                    </p>
                  </li>
                </ul>
              </div>
              <div v-else class="mt-4 text-red-500">
                <span class="text-2xl mr-2">✗</span> Unspecified
              </div>
              <div class="mt-2">
                <svg
                  class="w-4 h-4 mx-auto"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4v16m0 0l-4-4m4 4l4-4"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p class="text-sm font-semibold">0% oop</p>
              </div>
            </div>
          </div>

          <!-- Question Of Forces section -->
          <div v-if="selectedTool" class="mt-8">
            <h3 class="text-xl font-semibold mb-4">Question Of Forces</h3>
            <div class="flex justify-between space-x-4">
              <div class="w-2/3 border border-black p-4">
                <div class="flex justify-between space-x-4">
                  <!-- Beginning and End Atoms Placement -->
                  <div class="w-1/2">
                    <h4 class="text-lg font-semibold mb-2">
                      Beginning and End Atoms Placement
                    </h4>
                    <ul>
                      <li
                        v-for="(
                          placement, index
                        ) in selectedTool.atomPlacements"
                        :key="index"
                        class="mb-2"
                      >
                        <div class="flex justify-between items-center">
                          <span
                            >{{ placement.beginning }} →
                            {{ placement.end }}</span
                          >
                          <button
                            @click="selectAtomPlacement(index)"
                            class="text-blue-500 hover:text-blue-700"
                          >
                            Select
                          </button>
                        </div>
                      </li>
                    </ul>
                    <button
                      @click="addAtomPlacement"
                      class="bg-green-500 text-white px-2 py-1 rounded mt-2"
                    >
                      Add Placement
                    </button>
                  </div>

                  <!-- Forces -->
                  <div class="w-1/2">
                    <h4 class="text-lg font-semibold mb-2">Forces</h4>
                    <div v-if="selectedAtomPlacementIndex !== null">
                      <ul>
                        <li
                          v-for="(force, index) in selectedTool
                            .atomPlacements[selectedAtomPlacementIndex]
                            .forces"
                          :key="index"
                          class="mb-2"
                        >
                          {{ force.description }}
                        </li>
                      </ul>
                      <input
                        v-model="newForce"
                        placeholder="New force"
                        class="border p-2 w-full mb-2"
                      />
                      <button
                        @click="addForce"
                        class="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Add Force
                      </button>
                    </div>
                    <p v-else class="text-gray-500 italic">
                      Select an atom placement to add forces
                    </p>
                  </div>
                </div>
              </div>

              <!-- Testable Hypothesis -->
              <div class="w-1/3">
                <h4 class="text-lg font-semibold mb-2">
                  Testable Hypothesis
                </h4>
                <textarea
                  v-model="hypothesis"
                  placeholder="Enter your hypothesis"
                  class="border p-2 w-full h-32 mb-2"
                ></textarea>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="hypothesisSuccess"
                    id="hypothesisSuccess"
                    class="mr-2"
                  />
                  <label for="hypothesisSuccess"
                    >Hypothesis succeeded</label
                  >
                </div>
                <button
                  @click="saveHypothesis"
                  class="bg-green-500 text-white px-2 py-1 rounded mt-2"
                >
                  Save Hypothesis
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- Edit mode content -->
          <div v-if="editLoading" class="text-center py-4">
            <p>Saving changes...</p>
          </div>
          <div v-else>
            <!-- Edit mode content -->
            <div v-if="editLoading" class="text-center py-4">
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
                    class="mb-4 border p-4"
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

                    <div class="mt-2">
                      <h5 class="font-semibold">Atom Placements:</h5>
                      <ul>
                        <li
                          v-for="(
                            placement, pIndex
                          ) in tool.atomPlacements"
                          :key="pIndex"
                          class="mb-2"
                        >
                          <input
                            v-model="placement.beginning"
                            type="text"
                            class="border p-2 mr-2"
                            placeholder="Beginning"
                          />
                          <input
                            v-model="placement.end"
                            type="text"
                            class="border p-2 mr-2"
                            placeholder="End"
                          />
                          <button
                            @click="removeAtomPlacement(tool, pIndex)"
                            class="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Remove
                          </button>

                          <div class="ml-4 mt-2">
                            <h6 class="font-semibold">Forces:</h6>
                            <ul>
                              <li
                                v-for="(force, fIndex) in placement.forces"
                                :key="fIndex"
                                class="mb-2"
                              >
                                <input
                                  v-model="
                                    placement.forces[fIndex].description
                                  "
                                  type="text"
                                  class="border p-2 mr-2"
                                  placeholder="Force"
                                />
                                <button
                                  @click="removeForce(placement, fIndex)"
                                  class="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                  Remove
                                </button>
                              </li>
                            </ul>
                            <button
                              @click="addForce(placement)"
                              class="bg-green-500 text-white px-2 py-1 rounded mt-2"
                            >
                              Add Force
                            </button>
                          </div>
                        </li>
                      </ul>
                      <button
                        @click="addAtomPlacement(tool)"
                        class="bg-green-500 text-white px-2 py-1 rounded mt-2"
                      >
                        Add Atom Placement
                      </button>
                    </div>

                    <div class="mt-2">
                      <h5 class="font-semibold">Hypothesis:</h5>
                      <textarea
                        v-model="tool.hypothesis.description"
                        class="border p-2 w-full h-32 mb-2"
                        placeholder="Enter hypothesis"
                      ></textarea>
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          v-model="tool.hypothesis.isSuccessful"
                          :id="`hypothesis-${index}`"
                          class="mr-2"
                        />
                        <label :for="`hypothesis-${index}`"
                          >Hypothesis succeeded</label
                        >
                      </div>
                    </div>
                  </li>
                </ul>
                <button
                  @click="addTool"
                  class="bg-green-500 text-white px-2 py-1 rounded mt-2"
                >
                  Add Tool
                </button>
              </div>

              <button
                @click="saveDesire"
                class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                @click="cancelEdit"
                class="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
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

const isHoveringProbability = ref(false);
const isHoveringTime = ref(false);
const isHoveringImage = ref(false);
const desireStore = useDesireStore();
const userStore = useUserStore();
const { desires, loading, error } = storeToRefs(desireStore);
const { isLoggedIn } = storeToRefs(userStore);
const selectedDesire = ref(null);
const isEditing = ref(false);
const editLoading = ref(false);
const selectedTool = ref(null);
const atomPlacements = ref([]);
const selectedAtomPlacementIndex = ref(null);
const forces = ref({});
const newForce = ref('');
const hypothesis = ref('');
const hypothesisSuccess = ref(false);

const hasDesires = computed(
  () => desires.value && desires.value.length > 0,
);

const oppositeOutcomeProbability = computed(() => {
  if (!selectedDesire.value || !selectedDesire.value.tools) return 100;
  const totalProbability = selectedDesire.value.tools.reduce(
    (sum, tool) => sum + (tool.probability || 0),
    0,
  );
  return Math.max(0, 100 - totalProbability);
});

const isDesireCompleted = computed(() => {
  if (!selectedDesire.value || !selectedDesire.value.tools) return false;
  const { timeDays, timeHours, timeMinutes, tools } = selectedDesire.value;
  const totalTime = timeDays * 24 * 60 + timeHours * 60 + timeMinutes;
  const totalProbability = tools.reduce(
    (sum, tool) => sum + (tool.probability || 0),
    0,
  );
  return totalTime === 0 || totalProbability >= 100;
});

const hasTools = computed(() => {
  return (
    selectedDesire.value &&
    selectedDesire.value.tools &&
    selectedDesire.value.tools.length > 0
  );
});

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

// Update the newDesire function to initialize tools as an empty array
const newDesire = () => {
  selectedDesire.value = {
    title: 'New Desire',
    image: '',
    timeDays: 0,
    timeHours: 0,
    timeMinutes: 0,
    tools: [],
  };
  isEditing.value = true;
};

// Update the selectDesire function to ensure tools is always an array
const selectDesire = (desire) => {
  selectedDesire.value = reactive(
    JSON.parse(
      JSON.stringify({
        ...desire,
        tools: desire.tools || [],
      }),
    ),
  );
  isEditing.value = false;
  selectedTool.value = null;
  selectedAtomPlacementIndex.value = null;
  updateOppositeOutcomeProbability();

  // Force reactivity update
  nextTick(() => {
    if (selectedDesire.value && selectedDesire.value.tools) {
      selectedDesire.value.tools = [...selectedDesire.value.tools];
    }
  });
};

const updateOppositeOutcomeProbability = () => {
  if (selectedDesire.value && selectedDesire.value.tools) {
    const totalProbability = selectedDesire.value.tools.reduce(
      (sum, tool) => sum + (tool.probability || 0),
      0,
    );
    oppositeOutcomeProbability.value = Math.max(0, 100 - totalProbability);
  } else {
    oppositeOutcomeProbability.value = 100;
  }
};

const removeTool = (index) => {
  selectedDesire.value.tools.splice(index, 1);
};

const selectAtomPlacement = (index) => {
  selectedAtomPlacementIndex.value =
    selectedAtomPlacementIndex.value === index ? null : index;
};

const removeAtomPlacement = (tool, index) => {
  tool.atomPlacements.splice(index, 1);
};
const removeForce = (placement, index) => {
  placement.forces.splice(index, 1);
};

const addTool = () => {
  if (!selectedDesire.value.tools) {
    selectedDesire.value.tools = [];
  }
  selectedDesire.value.tools.push({
    name: 'New Tool',
    probability: 0,
    atomPlacements: [],
    hypothesis: { description: '', isSuccessful: false },
  });
  selectTool(
    selectedDesire.value.tools[selectedDesire.value.tools.length - 1],
  );
};

const addAtomPlacement = () => {
  if (selectedTool.value) {
    if (!selectedTool.value.atomPlacements) {
      selectedTool.value.atomPlacements = [];
    }
    selectedTool.value.atomPlacements.push({
      beginning: 'Start',
      end: 'End',
      forces: [],
    });
    selectAtomPlacement(selectedTool.value.atomPlacements.length - 1);
  }
};

const addForce = () => {
  if (
    selectedAtomPlacementIndex.value !== null &&
    newForce.value.trim() !== ''
  ) {
    selectedTool.value.atomPlacements[
      selectedAtomPlacementIndex.value
    ].forces.push({
      description: newForce.value.trim(),
    });
    newForce.value = '';
  }
};

const cancelEdit = () => {
  if (selectedDesire.value.id) {
    // If editing an existing desire, revert changes
    const originalDesire = desires.value.find(
      (d) => d.id === selectedDesire.value.id,
    );
    selectedDesire.value = JSON.parse(JSON.stringify(originalDesire));
  } else {
    // If creating a new desire, clear the form
    selectedDesire.value = null;
  }
  isEditing.value = false;
};

const saveDesire = async () => {
  try {
    error.value = null;
    editLoading.value = true;
    let desireToSave = {
      ...selectedDesire.value,
      timeDays: Number(selectedDesire.value.timeDays),
      timeHours: Number(selectedDesire.value.timeHours),
      timeMinutes: Number(selectedDesire.value.timeMinutes),
      tools: selectedDesire.value.tools.map((tool) => ({
        name: tool.name,
        probability: Number(tool.probability),
        atomPlacements: tool.atomPlacements.map((ap) => ({
          beginning: ap.beginning,
          end: ap.end,
          forces: ap.forces.map((force) => ({
            description:
              typeof force === 'string'
                ? force
                : typeof force.description === 'object'
                ? force.description.description || ''
                : force.description || '',
          })),
        })),
        hypothesis: tool.hypothesis
          ? {
              description: tool.hypothesis.description || '',
              isSuccessful: tool.hypothesis.isSuccessful || false,
            }
          : undefined,
      })),
    };
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
    selectDesire(selectedDesire.value); // Re-select the desire to refresh the view
    isEditing.value = false;
  } catch (err) {
    error.value = 'Failed to save desire. Please try again.';
    console.error('Error saving desire:', err);
  } finally {
    editLoading.value = false;
  }
};

const selectTool = (tool) => {
  if (selectedTool.value === tool) {
    selectedTool.value = null;
    selectedAtomPlacementIndex.value = null;
  } else {
    selectedTool.value = tool;
    atomPlacements.value = tool.atomPlacements || [];
    forces.value = {};
    hypothesis.value = tool.hypothesis ? tool.hypothesis.description : '';
    hypothesisSuccess.value = tool.hypothesis
      ? tool.hypothesis.isSuccessful
      : false;
    selectedAtomPlacementIndex.value = null;
  }
};

const saveHypothesis = async () => {
  if (selectedTool.value) {
    selectedTool.value.hypothesis = {
      description: hypothesis.value.trim(),
      isSuccessful: hypothesisSuccess.value,
    };
    await saveDesire();
    console.log('Hypothesis saved:', selectedTool.value.hypothesis);
  }
};

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
  if (desireStore.desires.length > 0) {
    selectDesire(desireStore.desires[0]);
  }
});

async function toggleEditMode() {
  if (!isEditing.value) {
    editLoading.value = true;
    try {
      if (selectedDesire.value && selectedDesire.value.id) {
        const updatedDesire = await desireStore.fetchDesire(
          selectedDesire.value.id,
        );
        if (updatedDesire) {
          selectedDesire.value = JSON.parse(JSON.stringify(updatedDesire));
        } else {
          console.error('Failed to fetch updated desire');
        }
      } else {
        console.error('No desire selected or desire has no ID');
      }
    } catch (err) {
      console.error('Error fetching updated desire:', err);
    } finally {
      editLoading.value = false;
    }
  }
  isEditing.value = !isEditing.value;
}

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
