<template>
    <main class="container text-white">
        <div class="pt-4 mb-8 relative">
            <input v-model="searchQuery" @input="getSearchResults" type="text" placeholder="Search for a city or state"
                class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]">
            <ul v-if="mapboxSearchResults"
                class="absolute bg-weather-secondary text-white w-full shadow-md px-2 py-1 top-[66px]">
                <p v-if="searchError">There was an error fetching the search results.</p>
                <p v-if="!serverError && mapboxSearchResults.length === 0">No results match your query, try another term</p>
                <template v-else>
                    <li @click="previewCity(searchResult)" v-for="searchResult in mapboxSearchResults"
                        :key="searchResult.id">
                        <span class="hover:bg-weather-primary cursor-pointer w-full py-2">{{ searchResult.place_name
                        }}</span>
                    </li>
                </template>
            </ul>
        </div>
        <div class="flex flex-col gap-4">
            <Suspense>
                <SavedCities />
                <template #fallback>
                    <CityCardSkeleton />
                </template>
            </Suspense>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import SavedCities from '../components/SavedCities.vue';
import CityCardSkeleton from '@/components/CityCardSkeleton.vue';


const mapboxAPIKey = "pk.eyJ1IjoiYW1hemluZ21heCIsImEiOiJjbHFyaHlrMWUzeHlwMnFycWxjZmhiaW9wIn0.9HXvzSuMVj7nBCqcCXBvww"
const searchQuery = ref("");
const queryTimeout = ref(null)
const mapboxSearchResults = ref(null)
const searchError = ref(null)
const router = useRouter()


const previewCity = (searchResult) => {
    const [city, state] = searchResult.place_name.split(", ")
    router.push({
        name: "cityView", params: { city: city, state: state },
        query: {
            lat: searchResult.center[1],
            lng: searchResult.center[0],
            preview: true
        } 
    })

}

const getSearchResults = () => {
    clearTimeout(queryTimeout.value)
    queryTimeout.value = setTimeout(async () => {
        try {
            if (searchQuery.value !== "") {
                const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}`)
                mapboxSearchResults.value = result.data.features
                return
            }
            mapboxSearchResults.value = null
        } catch {
            searchError.value = true
        }
    }, 300)
}
</script>
