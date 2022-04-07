<template>
  <div>
    <base-container>
      <form>
        <label>Miasto: </label>
        <input type="text" v-model="inputCity" />
        <button @click.prevent="getWeatherByCoords">Sprawdź pogodę</button>
      </form>
      <p v-if="isError">
        Wystąpił błąd. Proszę spróbuj ponownie lub zajrzyj do konsoli jeśli chcesz dowiedzieć się
        więcej.
      </p>
    </base-container>

    <!-- Weather Widget -->
    <base-container>
      <h1>Prognoza pogody</h1>
      <!-- Uzależniam wyświetlanie od temeratury ponieważ -->
      <!-- ta informacja występuje przy każdym fetch'u -->
      <div class="supremeContainer" v-if="temperature">
        <h2>{{ city }} ({{ country }})</h2>
        <img class="weatherIcon" :src="weatherIcon" alt="Symbol poogdy" />
        <h3>{{ weatherDescription }}</h3>

        <div class="majorContainer">
          <div class="minorContainer">
            <p>Średnia temperatura: {{ temperature }}°C</p>
            <p>
              Temperatura może wachać się między {{ temperatureMin }}°C, a {{ temperatureMax }}°C
            </p>
            <p>Temperatura odczuwalna: {{ temperatureFeelsLike }}°C</p>
            <p>Ciśnienie: {{ pressure }} hPa</p>
            <p>Wilgotność powietrzna: {{ humidity }}%</p>
            <p v-if="weather.rain">Opady deszczu w ostaniej godzinie: {{ rain1h }} mm</p>
            <p v-if="weather.snow">Opady śniegu w ostaniej godzinie: {{ snow1h }} mm</p>
          </div>
          <div class="minorContainer">
            <p>Prędkość wiatru: {{ windSpeed }} m/s</p>
            <p v-if="windGust">Porywy wiatru dochodzące do {{ windGust }} m/s</p>
            <p>
              Kierunek wiatru: {{ windDirection }} stopni. <br />
              Kierunek wskazuje skąd wieje. <br />
              (0 stopni - północ, 90 stopni - wschód, 180 stopni - południe, 270 stopni - zachód).
            </p>
            <p>Widoczność możliwa na odległości {{ visibility }} m</p>
            <p>Poziom zachmurzenia: {{ clouds }}%</p>
            <p>Słońce tego dnia znajduje się na nieboskłonie od {{ sunrise }} do {{ sunset }}</p>
          </div>
        </div>

        <p class="whenMeasured">Pomiar dokonano: {{ whenMeasured }}</p>
      </div>
    </base-container>
  </div>
</template>

<script>
import BaseContainer from './BaseContainer.vue';

export default {
  components: {
    BaseContainer,
  },

  computed: {
    weather() {
      return this.$store.getters.finalWeatherInfo;
    },
    weatherDescription() {
      return this.weather.weather[0].description;
    },
    weatherIcon() {
      const iconSrc = `https://openweathermap.org/img/wn/${this.weather.weather[0].icon}@2x.png`;
      return iconSrc;
    },
    temperature() {
      return this.weather.main.temp;
    },
    temperatureFeelsLike() {
      return this.weather.main.feels_like;
    },
    pressure() {
      return this.weather.main.pressure;
    },
    humidity() {
      return this.weather.main.humidity;
    },
    temperatureMin() {
      return this.weather.main.temp_min;
    },
    temperatureMax() {
      return this.weather.main.temp_max;
    },
    visibility() {
      return this.weather.visibility;
    },
    windSpeed() {
      return this.weather.wind.speed;
    },
    windDirection() {
      return this.weather.wind.deg;
    },
    // porywy nie zawsze występują
    windGust() {
      return this.weather.wind.gust;
    },
    clouds() {
      return this.weather.clouds.all;
    },
    // deszcz oraz śnieg występują czasami
    // 3 godzinne wersje nie wsystępowały nigdzie więc ich nie zamieszczam
    rain1h() {
      return this.weather.rain['1h'];
    },
    snow1h() {
      return this.weather.snow['1h'];
    },
    whenMeasured() {
      const when = new Date(this.weather.dt * 1000);
      return when.toISOString();
    },
    country() {
      return this.weather.sys.country;
    },
    sunrise() {
      const when = new Date(this.weather.sys.sunrise * 1000);
      const whatTime = `${when.getHours()}:${when.getMinutes()}:${when.getSeconds()}`;
      return whatTime;
    },
    sunset() {
      const when = new Date(this.weather.sys.sunset * 1000);
      const whatTime = `${when.getHours()}:${when.getMinutes()}:${when.getSeconds()}`;
      return whatTime;
    },

    city() {
      // Nie używam this.weather.name ponieważ przy
      // niektórych miastach zwracało np. nazwy dzielnic
      return this.confirmedInputCity === '' ? 'Twoja lokalizacja' : this.confirmedInputCity;
    },

    isError() {
      return this.$store.getters.finalError;
    },
  },

  data() {
    return {
      inputCity: '',
      confirmedInputCity: '',
    };
  },

  methods: {
    async getWeatherByCoords() {
      await this.$store.dispatch('getCoords', this.inputCity);
      await this.$store.dispatch('getWeather');
      this.confirmedInputCity = this.inputCity;
      console.log(this.weather);

      this.inputCity = '';
    },
  },

  mounted() {
    /* eslint-disable */
    // Obecnie geolokacja działa tylko z użyciem hhtps
    // w trakcie developmentu zdecydowałem się
    // na dodanie włansego certyfikatu do VS

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const myLat = position.coords.latitude;
        const myLon = position.coords.longitude;
        console.log('Twoje koordynaty (szerokość, długość): ', myLat, myLon);
        this.$store.commit('setCoords', { lat: myLat, lon: myLon });
        this.$store.dispatch('getWeather');
      },
      () => {
        alert(
          'Nie można określić Twojej lokalizacji. Powodem może być używanie http zamiast https lub niewyrażenie zgody na udostępnienie lokalizacji'
        );
      }
    );
  },
};
</script>

<style lang="stylus" scoped>
form{
  display:flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  label{
    font-size: 1.2rem;
  }
  input{
    margin: 0 0.5rem;
    font-size: 1.2rem;
  }
  button{
    padding: 0.5rem 1rem;
    border-radius: 2rem
    background-color: #2C5BFF;
    color: #fff;
    font-size: 1rem;
    cursor pointer

    &:hover{
      background-color:#1C4BEF ;
    }
  }
}

h2,h3, .weatherIcon{
  padding: 0;
  margin: 0;
}

.supremeContainer{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .whenMeasured{
    align-self: flex-end;
  }
}
.majorContainer{
  display: flex;
  flex-direction: row
  padding: 1rem;
}
.minorContainer{
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 1rem;
  border: 0.1rem dotted #000;
  margin: 1rem;
  font-size: 1rem;
}

// podstawowe RWD
@media(max-width: 600px){

  form{
    flex-direction: column

    input{
      margin:1rem;
    }
  }

  .majorContainer{
    flex-direction: column;
    align-items: center;
  }

  .minorContainer{
    width: 100%;
  }
}
</style>
