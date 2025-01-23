<!-- src/components/PuzzleTile.vue -->
<template>
    <!-- A v-card that contains some placeholder text and includes a title from the props -->
    <v-card
        class="mx-2"
        height="100%"
        max-width="344"
        :disabled="locked"
        :color="
            solved
                ? 'success-darken-1'
                : locked
                  ? 'surface'
                  : 'secondary-darken-1'
        "
        @click="openPuzzle"
    >
        <v-img height="200px" :src="imageUrl" cover></v-img>

        <v-card-title>
            {{ title }}
            <v-icon
                :color="
                    solved
                        ? 'success'
                        : locked
                          ? 'surface-variant'
                          : 'secondary-darken-2'
                "
                :icon="
                    solved
                        ? 'mdi-check-circle'
                        : locked
                          ? 'mdi-lock'
                          : 'mdi-arrow-right-circle'
                "
            />
        </v-card-title>
        <v-card-text class="pb-1">{{ teaser }} </v-card-text>
        <v-card-text v-if="locked" class="pt-1">{{ countdown }}</v-card-text>
    </v-card>
    <v-overlay v-model="puzzleActive" class="align-center justify-center">
        <PuzzlePage
            v-if="puzzle.unencryptedContent"
            :puzzle="puzzle.unencryptedContent"
            :metadata="puzzle.metadata"
            :errorMessage="errorMessage"
            @close="puzzleActive = false"
            @solve="handleSolve"
        />
    </v-overlay>
</template>

<script setup>
import { ref, computed } from "vue";
import CryptoJS from "crypto-js";
import { useChallenges } from "@/composables/useChallenges";
const challenges = useChallenges();
const props = defineProps({
    puzzle: Object,
});

const locked = ref(true);
const solved = ref(false);
const puzzleActive = ref(false);
const errorMessage = ref("");

// If unencryptedContent is present, the puzzle is unlocked
if (props.puzzle.unencryptedContent) {
    locked.value = false;
}

// If the puzzle was already solved, set solved to true
if (props.puzzle.metadata.solved === true) {
    solved.value = true;
}

const unlockDate =
    props.puzzle.metadata.unlockDate === undefined
        ? false
        : new Date(props.puzzle.metadata.unlockDate);

// Define computed properties for the image URL, title, and teaser
const imageUrl = computed(() =>
    locked.value === true
        ? "locked.jpg"
        : props.puzzle.unencryptedContent.image_url || "locked.jpg",
);
const title = computed(() =>
    locked.value === true
        ? "Locked Challenge"
        : props.puzzle.unencryptedContent.title || "Unknown Challenge",
);
const teaser = computed(() =>
    locked.value === true
        ? "Can you unlock it?"
        : props.puzzle.unencryptedContent.description || "What is it?",
);
const countdown = computed(() =>
    unlockDate === false
        ? "No automatic unlock."
        : "Automatic unlock on " + unlockDate.toLocaleDateString() + ".",
);

function openPuzzle() {
    puzzleActive.value = true;
    errorMessage.value = "";
}

function handleSolve(userSolution) {
    // Placeholder function to solve the puzzle
    const checkString = decrypt(props.puzzle.answerCheck, userSolution);

    const currentChallenge = props.puzzle.metadata.challenge;
    const currentPuzzle = props.puzzle.metadata.id;
    const nextPuzzle = challenges.value[currentChallenge].puzzles[
        currentPuzzle + 1
    ]
        ? currentPuzzle + 1
        : null;

    // Mark the current puzzle as solved
    if (checkString === '"Answer Correct"') {
        solved.value = true;
        errorMessage.value = "";

        challenges.value[currentChallenge].puzzles[
            currentPuzzle
        ].metadata.solved = true;
        challenges.value[currentChallenge].puzzles[
            currentPuzzle
        ].metadata.answer = userSolution;

        // Close the puzzle
        puzzleActive.value = false;

        // Unencrypt the next puzzle
        if (
            nextPuzzle &&
            challenges.value[currentChallenge].puzzles[nextPuzzle]
                .encryptedContent
        ) {
            const encryptedContent =
                challenges.value[currentChallenge].puzzles[nextPuzzle]
                    .encryptedContent;
            const unencryptedContent = JSON.parse(
                decrypt(encryptedContent, userSolution),
            );
            challenges.value[currentChallenge].puzzles[
                nextPuzzle
            ].unencryptedContent = unencryptedContent;
        }
    } else {
        errorMessage.value = "Solution is incorrect, try again.";
    }
}

function decrypt(string, key) {
    try {
        return CryptoJS.AES.decrypt(
            string,
            key
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, ""),
        ).toString(CryptoJS.enc.Utf8);
    } catch (error) {
        if (error.message !== "Malformed UTF-8 data") {
            console.error(error);
            return "";
        } else {
            return "";
        }
    }
}
</script>
