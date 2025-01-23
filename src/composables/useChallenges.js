import { useStorage } from "@vueuse/core";

export function useChallenges() {
    return useStorage("challenges", {});
}
