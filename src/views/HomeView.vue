<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input 
        type="text"
        v-model="searchQuery"
        @input="getSearchResults" 
        placeholder="Город" 
        class="py-2 px-1 w-full bg-transparent focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      >
      <ul class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]" v-if="mapBoxSearchResults">
        <p class="py-2" v-if="searchError">Что-то пошло не так</p>
        <p
          class="py-2"
          v-if="!searchError && mapBoxSearchResults.length === 0"
        >
          Ничего не нашлось
        </p>
        <template v-else>
          <li 
            v-for="s in mapBoxSearchResults" 
            :key="s.id" 
            class="py-2 cursor-pointer"
            @click="previewCity(s)"
          >
            {{ s.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkeleton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import CityList from '../components/CityList.vue';
import CityCardSkeleton from '../components/CityCardSkeleton.vue';

const router = useRouter();
const previewCity = (s) => {
  const [city, country] = s.place_name.split(', ');
  router.push({
    name: 'cityView',
    params: {city, country},
    query: {
      lat: s.geometry.coordinates[1],
      lng: s.geometry.coordinates[0],
      preview: true
    }
  })
};

const mapboxAPIKey = 'pk.eyJ1IjoibWl0a2lucyIsImEiOiJjbGZkMzlkbzczMDRqNDFvMTd6cmhudXE4In0.JeVcM8Rt8BFefWC1ypBl7A';
const searchQuery = ref('');
const queryTimeout = ref(null);
const mapBoxSearchResults = ref(null);
const searchError = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== '') {
      try {
        const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`)
        mapBoxSearchResults.value = result.data.features;
      } catch {
        searchError.value = true;
      }
      
      return;
    }
    mapBoxSearchResults.value = null;
  }, 300)
};
</script>