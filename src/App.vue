<template>
  <nav>
    <router-link to="/">Options API</router-link>
    <router-link to="/composition">Composition API</router-link>

  </nav>
  <router-view />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #0a1628;
  font-family: Arial, sans-serif;
}

nav {
  padding: 16px;
  background: #0d1f3c;
}

nav a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  margin-right: 16px;
}

nav a.router-link-exact-active {
  color: #f0c040;
}
</style>
