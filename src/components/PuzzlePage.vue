<template>
    <v-card
        class="mx-auto pa-4"
        :max-width="smAndUp ? 600 : '100vw'"
        :max-height="smAndUp ? '95vh' : '100vh'"
        :height="smAndUp ? null : '100vh'"
        style="overflow-y: scroll"
        :color="metadata.solved ? 'success-darken-1' : 'surface'"
    >
        <v-row>
            <v-col>
                <!-- Title and Subtitle, with close button -->
                <div class="d-flex align-top justify-space-between">
                    <div>
                        <v-card-title class="text-h4">{{
                            puzzle.title
                        }}</v-card-title>
                        <v-card-text class="text-h6">{{
                            puzzle.description
                        }}</v-card-text>
                    </div>

                    <v-btn
                        icon
                        @click="$emit('close')"
                        size="30"
                        :color="
                            metadata.solved
                                ? 'success-darken-2'
                                : 'surface-variant'
                        "
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-0">
            <v-col>
                <!-- Add Youtube embed or image -->
                <v-container v-if="puzzle.youtube">
                    <iframe
                        width="560"
                        height="315"
                        :src="youtubeUrl"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                    ></iframe>
                </v-container>
                <v-container v-else>
                    <v-img width="560" :src="puzzle.image_url" cover></v-img>
                    <v-card-subtitle class="px-0 py-2">{{
                        puzzle.image_caption
                    }}</v-card-subtitle>
                </v-container>

                <!-- Main puzzle text and credit -->

                <v-card-text
                    v-for="line in puzzleContent"
                    :key="line"
                    style="word-break: break-word"
                    >{{ line }}</v-card-text
                >
                <v-card-text
                    ><strong>{{ puzzle.final_question }}</strong></v-card-text
                >
                <v-card-subtitle
                    >Puzzle by
                    <a
                        :class="puzzle.author_link ? 'text-primary' : ''"
                        :href="puzzle.author_link ?? undefined"
                        >{{ puzzle.author }}</a
                    ></v-card-subtitle
                >
            </v-col>
        </v-row>
        <!-- Footer form for user solution -->
        <v-row>
            <v-col cols="12">
                <v-container>
                    <v-text-field
                        v-model="userSolution"
                        outlined
                        class="text-field-with-button"
                        color="primary"
                        :label="
                            metadata.solved
                                ? metadata.answer
                                : 'Enter Your Solution'
                        "
                        :disabled="metadata.solved"
                        @keyup.enter="$emit('solve', userSolution)"
                        :error-messages="errorMessage"
                    >
                        <template #append-inner>
                            <v-btn
                                variant="flat"
                                color="primary"
                                @click="$emit('solve', userSolution)"
                            >
                                Solve
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-container>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";
const { mdAndUp, smAndUp, smAndDown } = useDisplay();

const props = defineProps({
    puzzle: Object,
    metadata: Object,
    errorMessage: String,
});
const puzzleContent = ref("");
const youtubeUrl = ref("");
const userSolution = ref("");

puzzleContent.value = props.puzzle.full_text.split("\n");
youtubeUrl.value = "https://www.youtube.com/embed/" + props.puzzle.youtube;
</script>

<style scoped>
/* Bold label */
:deep(.v-field-label--floating) {
    font-weight: bold;
}

/* Bold error message */
:deep(.v-messages__message) {
    font-weight: bold;
}
</style>
