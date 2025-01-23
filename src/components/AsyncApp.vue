<template>
    <v-row :key="renderKey" class="mx-1 my-2">
        <template v-for="(challenge, index) in challengesList" :key="index">
            <ChallengeRow :challenge="challenge" />
        </template>
        <template v-if="challengesList.length === 0">
            <v-col
                cols="12"
                class="d-flex justify-center align-center text-center my-16 py-16"
            >
                <h2>There are no challenges yet - come back soon...</h2>
            </v-col>
        </template>
    </v-row>
</template>

<script setup>
import { useChallenges } from "@/composables/useChallenges";
import { watch, ref, onMounted, computed, onUpdated } from "vue";

const challenges = useChallenges();

const challengesList = computed(() =>
    Object.values(challenges.value).sort((a, b) => {
        const aDate = new Date(a.puzzles[0].metadata.publishDate);
        const bDate = new Date(b.puzzles[0].metadata.publishDate);
        return bDate - aDate;
    }),
);
const renderKey = ref(0);
onMounted(() => run_on_mount_and_update());
onUpdated(() => run_on_mount_and_update());

function run_on_mount_and_update() {
    // Using import.meta.glob to dynamically import files from the puzzles directory
    const puzzleFiles = import.meta.glob("@/puzzles/*.yaml", { eager: true });
    const imageFiles = import.meta.glob(
        "@/assets/images/*.{jpg,jpeg,png,gif}",
        {
            eager: true,
        },
    );
    for (const path in puzzleFiles) {
        var puzzle = puzzleFiles[path]["default"];
        const challenge = puzzle.metadata.challenge;
        const puzzleId = puzzle.metadata.id;

        // Check if the challenge already exists as a key in the challenges object
        if (challenges.value[challenge] === undefined) {
            challenges.value[challenge] = { title: challenge, puzzles: {} };
        }
        const cachedPuzzle = challenges.value[challenge].puzzles[puzzleId];

        // Replace the image paths when they match an image file in the assets directory
        if (
            "unencryptedContent" in puzzle &&
            "image_url" in puzzle.unencryptedContent &&
            `/src/assets/images/${puzzle.unencryptedContent.image_url}` in
                imageFiles
        ) {
            puzzle.unencryptedContent.image_url =
                imageFiles[
                    `/src/assets/images/${puzzle.unencryptedContent.image_url}`
                ].default;
        }

        // Handle the case where a challenge that is still locked in the yaml file is unlocked in the users local storage
        else if (
            cachedPuzzle &&
            "unencryptedContent" in cachedPuzzle &&
            "image_url" in cachedPuzzle.unencryptedContent &&
            `/src/assets/images/${cachedPuzzle.unencryptedContent.image_url}` in
                imageFiles
        ) {
            challenges.value[challenge].puzzles[
                puzzleId
            ].unencryptedContent.image_url =
                imageFiles[
                    `/src/assets/images/${cachedPuzzle.unencryptedContent.image_url}`
                ].default;
        }

        // If the puzzle is not already in the puzzle object, add it, otherwise merge the puzzle data
        if (challenges.value[challenge].puzzles[puzzleId] === undefined) {
            challenges.value[challenge].puzzles[puzzleId] = puzzle;
        } else {
            // Merge the puzzle data if puzzle contains unencryptedContent and the existing puzzle does not
            if (
                puzzle.unencryptedContent &&
                !challenges.value[challenge].puzzles[puzzleId]
                    .unencryptedContent
            ) {
                challenges.value[challenge].puzzles[
                    puzzleId
                ].unencryptedContent = puzzle.unencryptedContent;
            }
        }
    }
    // watch the challenges object for deep changes
    watch(
        () => challenges.value,
        (newChallenges) => {
            // rerender the component by incrementing the renderKey
            renderKey.value += 1;
        },
        { deep: true },
    );
}
</script>
