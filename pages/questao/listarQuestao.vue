<template>
  <section class="section">
    <div class="content">
      <h1>Questões</h1>

      <form>
        <NuxtLink to="/questao/salvarQuestao" class="button is-primary">Cadastrar Questão</NuxtLink>
      </form>
      <br />
      <h2>Lista de questões </h2>
      <b-table :data="listaQuestoes" >       
        <b-table-column field="id" label="ID" v-slot="prop">
          {{ prop.row.id }}          
        </b-table-column>
        <b-table-column field="nomeQuestao" label="Nome Questão" v-slot="prop">
          {{ prop.row.nomeQuestao }}
        </b-table-column>
        <b-table-column field="acoes" label="Ações" v-slot="prop">
          <b-button type="is-primary" @click="alterarQuestao(prop.row.id)" icon-right="pencil" />
          <b-button 
            type="is-primary" 
            @click="deletaQuestao(prop.row.id, listaQuestoes.indexOf(prop.row) + 1 )" 
            icon-right="delete" 
            :loading="loadingDeletar && indexClicked === listaQuestoes.indexOf(prop.row) + 1"/>
        </b-table-column>
      </b-table>
    </div>    
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { Questao } from '@/model/Questao'

export default Vue.extend({
  created() {
    this.getQuestoes();
  },
  data() {
    return {
      questao: new Questao(),
			
      loadingDeletar: false,
      indexClicked: null,
      
      listaQuestoes: new Array<Questao>(),
    }
  },
  methods: {
    async getQuestoes() {
      this.listaQuestoes = await this.$axios.$get('/questao');     
    },
    alterarQuestao(id: number) {
      this.$router.push({ name: 'alterarQuestao', params: { idQuestao: `${id}` } })
    },
    async deletaQuestao(id: number, index: null) {
      this.indexClicked = index;
      this.loadingDeletar = true;

      await this.$axios.$delete('/questao/' + id);

      this.getQuestoes();

      this.loadingDeletar = false;
      this.indexClicked = null;

      this.$buefy.notification.open({
          message: 'Registro deletado com sucesso!',
          type: 'is-success'
      });
    },
    sucesso() {
      this.$buefy.notification.open({
          message: 'Registro salvo com sucesso!',
          type: 'is-success'
      });
    }
  }
})
</script>