<template>
  <div class="home">
    <weather-widget> </weather-widget>
  </div>
</template>

<script>
import WeatherWidget from '../components/WeatherWidget.vue';

export default {
  components: {
    WeatherWidget,
  },
};
</script>
