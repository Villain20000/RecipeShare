<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/signup">Signup</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/profile">Profile</router-link>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background-color: #f8f9fa;
}
nav a {
  text-decoration: none;
  color: #007bff;
}
</style>
