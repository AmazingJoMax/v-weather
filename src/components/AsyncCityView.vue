<template>
    <!-- Banner -->
    <div class="flex flex-col flex-1 items-center">
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>
                You are currently viewing a preview of the weather for {{ route.params.city }},
                {{ route.params.state }}.
                To track this city, click the "+" icon in the top right.

            </p>
        </div>
    </div>
    <!-- Weather Overview -->
    <div class="flex flex-col flex-1 items-center text-white py-12">
        <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
        <p class="text-sm mb-12">
            {{
                new Date(weatherData.data.currentTime).toLocaleString(
                    "en-US",
                    {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        // hour: "numeric",
                        // minute: "numeric",
                        // timeZoneName: "short",
                    }
                )
            }}
            {{
                new Date(weatherData.data.currentTime).toLocaleString(
                    "en-US",
                    {
                        timeStyle: "short",
                    }
                )
            }}
        </p>
        <p class="text-8xl mb-8">
            {{ Math.round(weatherData.data.current.temp) }}&deg;
        </p>
        <p>
            Feels like {{ Math.round(weatherData.data.current.feels_like) }}&#8451;
        </p>
        <p class="capitalize">
            {{ weatherData.data.current.weather[0].description }}
        </p>
        <img class="w-[150px] h-auto"
            :src="`https://openweathermap.org/img/wn/${weatherData.data.current.weather[0].icon}@2x.png`" alt="">
        <hr class="border-white border-opacity-10 border w-full">
        <!-- Hourly Weather -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">
                    Hourly Weather
                </h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div v-for="hourData in weatherData.data.hourly" :key="hourData.dt"
                        class="flex flex-col items-center gap-4">
                        <p class="whitespace-nowrap text-md">
                            {{

                                new Date(hourData.currentTime).toLocaleString(
                                    "en-US",
                                    {
                                        hour: "numeric",
                                        // timeZoneName: "short",
                                    }
                                )
                            }}
                        </p>
                        <img class="w-auto h-[50px] object-cover"
                            :src="`https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`" alt="">
                        <p>
                            {{ Math.round(hourData.temp) }}&#8451;
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border w-full">
        <!-- Weekly Weather -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4 font-bold">
                    Weekly Weather
                </h2>
                <div v-for="day in weatherData.data.daily" :key="day.dt" class="flex items-center">
                    <p class="flex-1">
                        {{

                            new Date(day.dt * 1000).toLocaleString(
                                "en-US",
                                {
                                    weekday: "long",
                                }
                            )
                        }}
                    </p>
                    <img class="w-auto h-[50px] object-cover"
                        :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="">
                    <div class="flex gap-2 flex-1 justify-end">
                        <p>H: {{ Math.round(day.temp.max) }}&#8451;</p>
                        <p>L: {{ Math.round(day.temp.min) }}&#8451;</p>
                    </div>
                </div>
            </div>
        </div>
        <div @click="removeCity()" class="flex items-center gap-2 py-4 text-white cursor-pointer hover:text-red-500">
            <i class="fa fa-trash"></i>
            Remove City
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const getWeatherData = async () => {
    try {
        const weatherData = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.lng}&appid=8a5814f12fd25a2b636b635434acfe97&units=metric`)

        // cal current date & time
        const localOffset = new Date().getTimezoneOffset() * 60000
        const utc = weatherData.data.current.dt * 1000 + localOffset
        weatherData.data.currentTime =
            utc + 1000 * weatherData.data.timezone_offset

        // cal hourly weather offset
        weatherData.data.hourly.forEach((hour) => {
            const utc = hour.dt * 1000 + localOffset
            hour.currentTime =
                utc + 1000 * weatherData.data.timezone_offset
        })
        return weatherData
    } catch (error) {
        console.log(error)
    }
}

const weatherData = await getWeatherData()
// console.log(weatherData)

const router = useRouter()
const removeCity = () => {
    const cities = JSON.parse(localStorage.getItem('savedCities'))
    const  updatedCities = cities.filter((city)=>{city.id !==route.query.id})

    localStorage.setItem('savedCities', JSON.stringify(updatedCities))

    router.push({name: "home"})
}
</script>
