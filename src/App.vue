<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="stylus">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

* {
  box-sizing: border-box;
}

html {
  font-family: 'Roboto', sans-serif;
  font-size: 15px; // I will use REM for RWD
}

body {
  min-height: 90vh;
  background-image: linear-gradient(to bottom right, rgba(44,167,255,0), rgba(44,167,255,0.2));
  margin: 0;
}

@media(max-width: 600px){
  html{
    font-size: 10px;
  }
}
</style>
