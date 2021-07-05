<template>
  <div>
    <b-navbar>
        <!--<template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img 
                    src="~/assets/gloop.png"
                    alt="Lightweight UI components for Vue.js based on Bulma"
                >
            </b-navbar-item>
        </template> -->
        <template #start>
            <b-navbar-item>
              <NuxtLink to="/" >Home</NuxtLink>
            </b-navbar-item>
            <b-navbar-item>
              <NuxtLink to="/materia/listarMateria" >Matéria</NuxtLink>
            </b-navbar-item>
            <b-navbar-item>
              <NuxtLink to="/questao/listarQuestao" >Questões</NuxtLink>
            </b-navbar-item>
            <b-navbar-dropdown label="Info">
                <b-navbar-item href="#">
                  About
                </b-navbar-item>
                <b-navbar-item href="#">
                  Contact
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>

        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-light">
                      Logout
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
    <div class="container is-fluid">
    <section class="main-content">
      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
    </div>
  </div>
</template>

<script>
export default {  
}
</script>
