<template>
  <section class="section">
    <div class="content">
      <h1>Matéria</h1>

      <form>
        <b-field label="Nome matéria"
          :type="{ 'is-danger': hasError || hasDuplicidade }"
          :message="[
				    { 'Campo obrigatório': hasError, 'Matéria já cadastrada': hasDuplicidade }
			    ]">
            <b-input v-model="materia.nome" placeholder="Nome matéria" ></b-input>
        </b-field>

        <b-button type="is-primary" @click="salvarMateria" :loading="loadingSalvar">Salvar</b-button>
        <b-button type="is-secondary" @click="limparCampos">Limpar</b-button>
      </form>
      
      <h2>Lista de matérias</h2>
      <b-table :data="listaMaterias" >       
        <b-table-column field="id" label="ID" v-slot="mat">
          {{ mat.row.id }}          
        </b-table-column>
        <b-table-column field="nome" label="Nome" v-slot="mat">
          {{ mat.row.nome }}
        </b-table-column>
        <b-table-column field="acoes" label="Ações" v-slot="mat">
          <b-button type="is-info is-light" @click="recuperaMateria(mat.row)" icon-right="pencil" />
          <b-button 
            type="is-primary" 
            @click="deletaMateria(mat.row.id, listaMaterias.indexOf(mat.row) + 1 )" 
            icon-right="delete" 
            :loading="loadingDeletar && indexClicked === listaMaterias.indexOf(mat.row) + 1"/>
        </b-table-column>
      </b-table>
    </div>    
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Buefy from 'buefy'

export default Vue.extend({
  created() {
    this.getMaterias();
  },
  data() {
    return {
      materia: {
        id: null,
        nome: ''
      },
      hasError: false,
      hasDuplicidade: false,
			loadingSalvar: false,
      loadingDeletar: false,
      indexClicked: null,
      listaMaterias: []     
    }
  },
  methods: {
    async getMaterias() {
      this.listaMaterias = await this.$axios.$get('/materia');     
    },
    async salvarMateria() {
      this.loadingSalvar = true;

      if(this.materia.nome === '') {
        this.hasError = true;        
      } else {
        if(this.materia.id === null) {
          await this.$axios.$post('/materia', this.materia).then(res => {
            this.limparCampos();

            this.hasDuplicidade = false;
            this.sucesso();
          }).catch(error => {
            this.hasDuplicidade = true;
          });
        } else {
          await this.$axios.$put('/materia', this.materia).then(res => {
            this.limparCampos();

            this.hasDuplicidade = false;
            this.sucesso();
          }).catch(error => {
            this.hasDuplicidade = true;
          });
        }

        this.getMaterias();
      }
      
      this.loadingSalvar = false;
    },
    limparCampos() {
      this.materia.id = null;
      this.materia.nome = '';
    },
    recuperaMateria(materia: { id: null; nome: string; }) {
      this.materia.id = materia.id;
      this.materia.nome = materia.nome;
    },
    async deletaMateria(id: number, index: null) {
      this.indexClicked = index;
      this.loadingDeletar = true;

      await this.$axios.$delete('/materia/' + id);

      this.getMaterias();

      this.loadingDeletar = false;
      this.indexClicked = null;
    },
    sucesso() {
      this.$buefy.notification.open({
          message: 'Registro salvo com sucesso!',
          type: 'is-success'
      })
    }
  }
})
</script>
