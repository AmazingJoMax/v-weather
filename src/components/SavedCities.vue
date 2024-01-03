<template>
    <div v-for="city in savedCities" :key="city.id">
        <CityCard :city="city" @click="goToCity(city)"/>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue'
import CityCard from './CityCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const APIKey = '8a5814f12fd25a2b636b635434acfe97'

const savedCities = ref([])

const getCities = async () => {
    if(localStorage.getItem('savedCities')){
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
    }

    const requests = []
    savedCities.value.forEach((city) => {
        requests.push(
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=${APIKey}&units=metric`))
    })
    const weatherData = await Promise.all(requests)

    // Flicker delay
    await new Promise((res)=>{setTimeout(res,1000)})

    weatherData.forEach((value, index) => {
        savedCities.value[index].weather = value.data
    })
}

await getCities()

const goToCity = (city) => {
    router.push({
        name: 'cityView',
        params: {
            city: city.city,
            state: city.state
        },
        query: {
            lat: city.coords.lat,
            lng: city.coords.lng,
            id: city.id
        }
    })
}
</script>
