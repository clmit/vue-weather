<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
      <p>Предпросмотр города, нажмите + чтобы добавить город</p>
    </div>
    <!-- Weather overview -->
    <div class="flex flex-col items-center text-white p-12">
      <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
      <p class="text-sm mb-12">
        {{
          new Date(weatherData.currentTime).toLocaleDateString(
            "ru-ru",
            {
              weekday: "short",
              day: "2-digit",
              month: "long",
            }
          )
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString(
            "ru-ru",
            {
              timeStyle: "short",
            }
          )
        }}
      </p>
      <p class="text-8xl mb-8">
        {{ Math.round(weatherData.main.temp) }} &deg;
      </p>
      <p>
        Ощущается как
        {{ Math.round(weatherData.main.feels_like) }} &deg;
      </p>
      <p class="capitalize mt-2 mb-0">
        {{ weatherData.weather[0].description }}
      </p>
      <img
        class="w-[150px] h-auto"
        :src="
          `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        "
        alt=""
      />
    </div>   

    <div @click="removeCity" class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500">
      <i class="fa-solid fa-trash"></i>
      <p>Удалить город</p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();

const getWeatherData = async () => {
  try {
    const wKey = `https://api.openweathermap.org/data/2.5/weather?lat=${route.query.lat}&lon=${route.query.lng}&appid=81bc31f240b2756c447275e891261c12&units=metric`;
    const weatherData = await axios.get(wKey);
    //console.log(weatherData);
        
    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.dt * 1000 + localOffset;
    weatherData.data.currentTime =
      utc + 1000 * weatherData.data.timezone;
    console.log(localOffset, utc);
    // cal hourly weather offset
    // weatherData.data.hourly.forEach((hour) => {
    //   const utc = hour.dt * 1000 + localOffset;
    //   hour.currentTime =
    //     utc + 1000 * weatherData.data.timezone_offset;
    // });
    //console.log(weatherData);
    return weatherData.data;
  } catch(e) {
    console.log(e);
  }
}

const weatherData = await getWeatherData();

const router = useRouter();
const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem('savedCities'));
  const updatedCities = cities.filter((c) => c.id !== route.query.id);
  localStorage.setItem('savedCities', JSON.stringify(updatedCities));
  router.push({name: 'home'});
};

</script>