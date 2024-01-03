<template>
    <div class="flex py-6 px-3 cursor-pointer bg-weather-secondary rounded-md shadow-md">
        <div class="flex flex-col flex-1">
            <h2 class="text-3xl">{{ city.city }}</h2>
            <h3>{{ city.state }}</h3>
        </div>
        <div class="flex flex-col gap-2">
            <p class="text-3xl flex-end">
                {{ Math.round(city.weather.main.temp) }}&deg;<sup>c</sup>
            </p>
            <div class="flex gap-2">
                    <span class="text-xs">
                        H:
                        {{ Math.round(city.weather.main.temp_max) }}&deg;
                    </span>
                    <span class="text-xs">
                        L:
                        {{ Math.round(city.weather.main.temp_min) }}&deg;
                    </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    city: {
        type: Object,
        default: () => {}
    }
})
</script>
