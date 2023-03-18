<template>
  <div v-for="c in savedCities" :key="c.id">
    <CityCard :city="c" @click="goToCityView(c)" />
  </div>
  <p v-if="savedCities.length === 0">Сначала добавьте города</p>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CityCard from './CityCard.vue';

const savedCities = ref([]);
const getCities = async () => {
  if (localStorage.getItem('savedCities')) {
    savedCities.value = JSON.parse(
      localStorage.getItem('savedCities')
    );

    const requests = [];
    savedCities.value.forEach((c) => {
      requests.push(
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${c.coords.lat}&lon=${c.coords.lng}&appid=81bc31f240b2756c447275e891261c12&units=metric`)
      );
    });

    const weatherData = await Promise.all(requests);

    // Fake timeout
    await new Promise((res) => setTimeout(res, 300));

    weatherData.forEach((v, i) => {
      savedCities.value[i].weather = v.data;
    });
  }
}

await getCities();

const router = useRouter();
const goToCityView = (city) => {
  router.push({
    name: 'cityView',
    params: {country: city.country, city: city.city},
    query: {id: city.id, lat: city.coords.lat, lng: city.coords.lng}
  })
};
</script>