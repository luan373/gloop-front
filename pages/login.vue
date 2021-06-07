<template>
	<form @submit.prevent="userLogin">
		<b-field label="Usuário"
			:type="{ 'is-danger': hasError }">
			<b-input v-model="login.username" maxlength="30" id="username"></b-input>
		</b-field>

		<b-field label="Senha"
			:type="{ 'is-danger': hasError }"
			:message="[
				{ 'Usuário ou senha inválidos': hasError }
			]">
			<b-input 
				id="password"
				type="password"
				v-model="login.password"
				password-reveal>
			</b-input>
		</b-field>
		<b-button @click="userLogin" type="is-primary" expanded :loading="loading">Continuar</b-button>
	</form>

</template>

<style lang="scss">
$primary:			#fff;
$purple-darker:		hsl(0, 0%, 21%);
$purple-dark:   	hsl(0, 0%, 29%);
$purple:         	hsl(0, 0%, 48%);
$purple-light:   	hsl(0, 0%, 71%);
$purple-lighter: 	hsl(0, 0%, 86%);


#login-div {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	background: #F7F7F7;

	.login-card {
		background: #fff;
		width: 24rem;
		box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.11);

		.card-title {			
			h1 {
				//color: #67ef7e;
				text-align: center;
				font-size: 3.2rem;
			}
		}

		.content {
			padding: 3rem 2.5rem 5rem;
		}			
	}
}


</style>

<script>
  export default {
    layout: 'login-layout',
    data() {
		return {
			login: {
				username: '',
				password: ''
			},
			hasError: false,
			loading: false
		}
    },
	methods: {
		async userLogin() {
			try {
				this.loading = true;
				await this.$auth.loginWith('local', { data: this.login }).then(() => this.$router.push('/'));
			} catch (err) {		
				this.loading = false;		
				this.hasError = true;
			}
		}
	}
    
  }
</script>