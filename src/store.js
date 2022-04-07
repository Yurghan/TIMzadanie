import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
/* eslint-disable */

Vue.use(Vuex);

export default new Vuex.Store({
  state() {
    return {
      weatherInfo: {
        weather: [
          {
            description: '',
            icon: '01d',
          },
        ],
        main: {
          temp: '',
          feels_like: '',
          pressure: '',
          humidity: '',
          temp_min: '',
          temp_max: '',
        },
        visibility: '',
        wind: {
          speed: '',
          deg: '',
          gust: '',
        },
        clouds: {
          all: '',
        },
        rain: {
          '1h': '',
        },
        snow: {
          '1h': '',
        },
        dt: '',
        sys: {
          country: '',
          sunrise: '',
          sunset: '',
        },
        name: '',
      },
      coords: {
        lat: null,
        lon: null,
      },
      error: false,
    };
  },

  mutations: {
    setWeatherInfo(state, payload) {
      state.weatherInfo = payload;
    },

    setCoords(state, payload) {
      state.coords = payload;
    },

    ok(state) {
      state.error = false;
    },

    nok(state) {
      state.error = true;
    },
  },

  actions: {
    async getCoords(context, payload) {
      try {
        context.commit('ok');
        const response = await axios.get(
          // Direct geocoding: nazwa miasta -> lat,lon
          // 'limit=1' - określa ile miast o tej nazwie zwrócić
          // https://api.openweathermap.org/geo/1.0/direct?q=Warsaw&limit=1&appid=7794cbc6f99b14cc2969db38c74a1f4f
          `https://api.openweathermap.org/geo/1.0/direct?q=${payload}&limit=1&appid=7794cbc6f99b14cc2969db38c74a1f4f`
        );
        const [responseData] = response.data;

        const coordsObj = {
          lat: responseData.lat,
          lon: responseData.lon,
        };
        context.commit('setCoords', coordsObj);
      } catch (error) {
        context.commit('nok');
        console.error(`😈 Problem przy pobieraniu koordynat: ${error.message}`);
      }
    },

    async getWeather(context) {
      try {
        const coords = context.getters.finalCoords;
        const response = await axios.get(
          // '&units=metric' - zmiana z kelwinów na celcjusze
          // '&lang=pl - tłumaczy część zwracanych informacji na język polski
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=7794cbc6f99b14cc2969db38c74a1f4f&units=metric&&lang=pl`
        );
        const responseData = response.data;

        context.commit('setWeatherInfo', responseData);
      } catch (error) {
        context.commit('nok');
        console.error(`😈 Problem przy pobieraniu pogody: ${error.message}`);
      }
    },
  },

  getters: {
    finalWeatherInfo(state) {
      return state.weatherInfo;
    },
    finalCoords(state) {
      return state.coords;
    },
    finalError(state) {
      return state.error;
    },
  },
});
