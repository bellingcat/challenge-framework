<template>
    <div class="text-center">
        <h2>Congratulations! You solved this challenge! 🎉</h2>
        <div>
            <ShareNetwork
                v-for="network in socialNetworks"
                :key="network.name"
                :network="network.name"
                v-slot="{ share }"
                url="https://challenge.bellingcat.com/"
                :title="`I just solved Bellingcat's '${puzzleTitle}' challenge 🏆 Try it yourself!`"
            >
                <v-btn
                    variant="flat"
                    color="primary"
                    @click="share"
                    class="text-capitalize mt-2 mx-2 px-3"
                >
                    <v-icon :size="16" class="mr-1">
                        {{ network.icon }}
                    </v-icon>
                    {{ network.label }}
                </v-btn>
            </ShareNetwork>
        </div>
        <p class="my-2">
            Share your success and encourage others to give it a try.
        </p>
    </div>
</template>

<script setup>
import { defineProps } from "vue";
import { ShareNetwork } from "vue3-social-sharing";
import socialNetworks from "@/data/social";

defineProps({
    puzzleTitle: String,
});
</script>
