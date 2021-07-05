<template>
  <b-field label="Matéria">
    <b-select placeholder="Selecione uma matéria" v-model="materia.id">
        <option
            v-for="option in listaMateria"
            :value="option.id"
            :key="option.nome">
            {{ option.nome }}
        </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Materia } from '../model/Materia'

export default Vue.extend({
  name: 'select-materia',
  
  props: {
    materia: {
      type: Object,
      required: true
    } as PropOptions<Materia>,
    
  },
  created() {
    this.getMaterias();
  },
  data () {
    return {
      listaMateria: [],
    }
  },
  methods: {
    async getMaterias() {
      this.listaMateria = await this.$axios.$get('/materia'); 
    }
  }
})
</script>>