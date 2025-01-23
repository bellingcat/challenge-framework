<template>
    <v-app>
        <v-container fluid class="fill-height">
            <Header />
            <Suspense>
                <AsyncApp />
            </Suspense>
            <Footer />
        </v-container>
    </v-app>
</template>

<script setup>
import AsyncApp from "./components/AsyncApp.vue";
</script>
