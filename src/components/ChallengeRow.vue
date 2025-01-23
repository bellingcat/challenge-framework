<!-- src/components/PuzzleTile.vue -->
<template>
    <v-divider />
    <v-col cols="12">
        <v-row class="my-2">
            <v-col
                cols="12"
                class="d-flex justify-center align-center text-center"
            >
                <h2>{{ props.challenge.title }}</h2>
            </v-col>
        </v-row>
        <v-row justify="center" class="mt-0 mb-2">
            <!-- For larger screens -->
            <template v-if="lgAndUp">
                <v-col
                    class="justify-center align-center px-0"
                    v-for="(puzzle, index) in props.challenge.puzzles"
                    :key="index"
                    cols="2"
                >
                    <PuzzleTile :puzzle="puzzle" />
                </v-col>
            </template>
            <!-- For smaller screens -->
            <template v-else>
                <v-col cols="12">
                    <v-slide-group
                        show-arrows
                        class="mx-auto"
                        :style="{ width: '90vw' }"
                    >
                        <template
                            v-for="(puzzle, index) in props.challenge.puzzles"
                            :key="index"
                        >
                            <PuzzleTile :puzzle="puzzle" />
                        </template>
                    </v-slide-group>
                </v-col>
            </template>
        </v-row>
    </v-col>
    <v-divider />
</template>

<script setup>
import PuzzleTile from "./PuzzleTile.vue";
import { useDisplay } from "vuetify";
const { lgAndUp } = useDisplay();

const props = defineProps({
    challenge: Object,
});
</script>
