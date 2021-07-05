<template>
  <section class="section">
    <div class="content">
      <h1>Cadastrar Questão</h1>
      <form>
        <b-field label="ID" v-if="questao.id != undefined">
          <b-input v-model="questao.id" disabled></b-input>
        </b-field>
        <b-field label="Matéria"
          :type="{'is-danger': hasMateriaError }"
          :message="[
            { 'Campo obrigatório': hasMateriaError}
          ]">
          <b-select placeholder="Selecione uma matéria" v-model="questao.materia.id">
            <option
              v-for="option in listaMateria"
              :value="option.id"
              :key="option.nome">
              {{ option.nome }}
            </option>
          </b-select>            
        </b-field>
        <b-field label="Série" 
          :type="{'is-danger': hasSerieError }"
          :message="[
            { 'Campo obrigatório': hasSerieError}
          ]">
          <b-select placeholder="Selecione uma série" v-model="questao.serie">
            <option
              v-for="option in listaSeries"
              :value="option"
              :key="option">
              {{ option }}
            </option>
          </b-select>
        </b-field>

        <b-field label="Nome questão"          
          :type="{ 'is-danger': hasNomeQuestaoError }"
          :message="[
				    { 'Campo obrigatório': hasNomeQuestaoError }
			    ]">
          <b-input v-model="questao.nomeQuestao" placeholder="Nome questão" ></b-input>
        </b-field>

        <b-field label="Texto questão" 
          :type="{'is-danger': hasTextoQuestaoError } "
          :message="[
				    { 'Campo obrigatório': hasTextoQuestaoError }
			    ]">
          <quill-editor ref="editor" v-model="questao.textoQuestao" :options="editorOption" />
        </b-field>
        
        
        <div class="field is-grouped">
          <div class="control">
            <h2>Alternativas</h2>
          </div>
          <div class="control">
            <b-tooltip label="Adicionar alternativa">
              <b-button type="is-light" @click="adicionaCampoAlternativa" size="is-medium" icon-right="plus-circle-outline" />
            </b-tooltip>
          </div>
        </div>
        <section v-for="(alternativa, index) in questao.alternativas" :key="index" >          
          <b-field>
            <b-button type="is-primary" @click="deletaAlternativa(index)" 
              icon-right="delete" ></b-button>
          </b-field>
          <b-field label="Texto alternativa" :type="{'is-danger': hasAlterantivaErrors[index] }"
            :message="[
              { 'Campo obrigatório': hasAlterantivaErrors[index]}
            ]">            
            <quill-editor ref="editor" v-model="alternativa.textoAlternativa" :key="index" :options="editorOption" />            
          </b-field>
        </section>
        {{ questao }}  

        
      </form>
      <br />
      <div class="field is-grouped">
        <div class="control">
          <b-button type="is-primary" @click="salvarQuestao" :loading="loadingSalvar">Salvar</b-button>
        </div>
        <div class="control">
          <b-button type="is-secondary" @click="limparCampos">Limpar</b-button>
        </div>
        <div class="control">
          <NuxtLink to="/questao/listarQuestao" class="button is-info is-light" inverted>Voltar</NuxtLink>
        </div>
      </div>
    </div>    
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { Questao } from '@/model/Questao'
import { Alternativa } from '@/model/Alternativa'
import { Serie } from '@/model/enums/Serie'

export default Vue.extend({ 

  created(): void {
    this.getMateria();
    this.recuperaQuestao();
  },
  data() {
    return {
      content: '<p>I am Example</p>',
      editorOption: {
        // Some Quill options...
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ]
        }
      },

      questao: new Questao(),

      hasMateriaError: false,
      hasSerieError: false,
      hasNomeQuestaoError: false,
      hasTextoQuestaoError: false,
			hasAlterantivaErrors: new Array<boolean>(),

      loadingSalvar: false,
      
      listaMateria: [],
      listaSeries: Object.values(Serie)
    }
  }, 

  methods: {
    onEditorBlur(editor: any) {
      console.log('editor blur!', editor)
    },
    onEditorFocus(editor: any) {
      console.log('editor focus!', editor.clipboard)
    },
    onEditorReady(editor: any) {
      console.log('editor ready!', editor)
    },
    
    async getMateria() {
      this.listaMateria = await this.$axios.$get('/materia');     
    },
    async salvarQuestao() {
      this.loadingSalvar = true;

      if(this.isCamposValidos()) {     
        if(this.questao.id === undefined) {
          await this.$axios.$post('/questao', this.questao).then(res => {
            this.sucesso();
          }).catch(error => {
            this.$buefy.notification.open({
              message: 'Ocorreu um erro ao salvar.',
              type: 'is-danger'
            });
          });
        } else {
          await this.$axios.$put('/questao', this.questao).then(res => {
            this.sucesso();
          }).catch(error => {
            this.$buefy.notification.open({
              message: 'Ocorreu um erro ao atualizar.',
              type: 'is-danger'
            });
          });
        }
      }
      
      this.loadingSalvar = false;
    },
    async recuperaQuestao(): Promise<Questao> {
      if(this.$route.params.idQuestao) {
        this.questao = await this.$axios.$get('/questao/' + this.$route.params.idQuestao);
      } else {
        this.questao = new Questao();
      }
      return this.questao;
    },
    limparCampos(): void {
      if(this.questao.id != undefined) {
        let idQuestao = this.questao.id;
        this.questao = new Questao();

        this.questao.id = idQuestao;
      } else {
        this.questao = new Questao();
      }
    },
    async deletaAlternativa(index: number) {
      let alt  = this.questao.alternativas[index];      

      if(alt.id != undefined) {
        await this.$axios.$delete('/alternativa/' + alt.id);
      }

      this.questao.alternativas.splice(index, 1);
    },
    adicionaCampoAlternativa() {
      this.questao.alternativas.push(new Alternativa());
    },
    sucesso() {
      this.$buefy.notification.open({
          message: 'Registro salvo com sucesso!',
          type: 'is-success'
      });
    },
    isCamposValidos(): boolean {
      let isCamposValidos: boolean = true

      this.hasMateriaError = false;
      this.hasSerieError = false;
      this.hasNomeQuestaoError = false;
      this.hasTextoQuestaoError = false;
      this.hasAlterantivaErrors = new Array<boolean>();

      if(this.questao.materia.id == undefined) {
        isCamposValidos = false;
        this.hasMateriaError = true;
      } 
      if(this.questao.serie == undefined) {
        isCamposValidos = false;
        this.hasSerieError = true;
      } 
      if(this.questao.nomeQuestao == undefined || this.questao.nomeQuestao == '') {
        isCamposValidos = false;
        this.hasNomeQuestaoError = true;
      } 
      if(this.questao.textoQuestao == undefined || this.questao.textoQuestao == '') {
        isCamposValidos = false;
        this.hasTextoQuestaoError = true;
      }

      this.questao.alternativas.forEach((value, index) => {
        if(value.textoAlternativa == null) {
          isCamposValidos = false;
          this.hasAlterantivaErrors[index] = true; 
        }
      });

      return isCamposValidos;
    }
  }
})
</script>
<style lang="scss" scoped>
  .container {
    width: 60%;
    margin: 0 auto;
    padding: 50px 0;
    .quill-editor {
      min-height: 200px;
      max-height: 400px;
      overflow-y: auto;
    }
  }
</style>
