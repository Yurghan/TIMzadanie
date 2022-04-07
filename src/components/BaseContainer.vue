<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style lang="stylus">

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 1.2rem;
  box-shadow: 0 0.2rem 0.8rem rgba(#000, $alpha: 0.1);
  padding: 1rem;
  margin: 2rem auto;
  max-width: 70vw;
  background-color: #fff;
}
</style>
