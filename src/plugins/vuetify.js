/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

const bellingcatDarkTheme = {
    dark: true,
    colors: {
        background: "#1a1918",
        surface: "#2e2e2e",
        "surface-bright": "#fefefe",
        "surface-light": "#fefefe",
        "surface-variant": "#424242",
        "on-surface-variant": "#fefefe",
        primary: "#FBB400",
        "primary-darken-1": "#aa7a00",
        "primary-lighten-1": "#ffd772",
        secondary: "#48a0ff",
        "secondary-darken-1": "#25578e",
        "secondary-darken-2": "#306eb1",
        error: "#FF5D5D",
        info: "#2196F3",
        success: "#4CAF50",
        "success-darken-1": "#204421",
        "success-darken-2": "#377439",
        warning: "#FB8C00",
    },
    variables: {
        "border-color": "#000000",
        "border-opacity": 0.12,
        "high-emphasis-opacity": 0.87,
        "medium-emphasis-opacity": 0.6,
        "disabled-opacity": 0.38,
        "idle-opacity": 0.04,
        "hover-opacity": 0.04,
        "focus-opacity": 0.12,
        "selected-opacity": 0.08,
        "activated-opacity": 0.12,
        "pressed-opacity": 0.12,
        "dragged-opacity": 0.08,
        "theme-kbd": "#212529",
        "theme-on-kbd": "#FFFFFF",
        "theme-code": "#F5F5F5",
        "theme-on-code": "#000000",
    },
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    theme: {
        defaultTheme: "bellingcatDarkTheme",
        themes: {
            bellingcatDarkTheme,
        },
    },
});
