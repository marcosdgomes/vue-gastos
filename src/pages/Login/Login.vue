<template>
  <form @submit.prevent="doLogin()" class="form-login">
      <div class="container card">
      	<div class="card-header text-center">
      		<h1>Login</h1>
      	</div>
      	<div class="card-body">
      		<div class="form-group">
      			<input type="email" class="form-control" placeholder="E-mail" v-model="email" required>
      		</div>
      		<div class="form-group">
      			<input type="password" class="form-control" placeholder="Senha" v-model="password" required>
      		</div>
      		<button class="btn btn-primary mb-2" :disabled="loading">
      			<template v-if="loading">
      				Carregando...
      				<i class="fa fa-spinner fa-spin"></i>
      			</template>
      			<template v-else>
      				Entrar
      				<i class="fa fa-sign-in-alt"></i>
      			</template>
      		</button>
      	</div>
      </div>
  </form>
</template>

<script>
export default {
	name: 'Login',
	data: () => {
		return{
			loading: false,
			email: '',
			password: ''
		}
	},
	methods:{
		async doLogin(){
			const { email,password } = this
			this.loading = true

			try{
				const resp = await this.$firebase.auth().signInWithEmailAndPassword(email, password)

				window.uid = resp.user.uid
				this.$router.push({ name: 'Home'}) //redirect user

			}catch(error){
				let message = ''
				switch (error.code) {
					case 'auth/user-not-found':
						message = 'Usuário incorreto.'
						break;
					case 'auth/wrong-password':
						message = 'Senha inválida.'
						break;
					default:
						message = 'Não foi possível logar.'
						break;
				}
				this.$root.$emit('Notification::show',{
                    type: 'danger',
                    message
                })
			}

			this.loading = false
			
		}
	},
	beforeRouteEnter(to,from,next){
		next(vm => {
			if(window.uid){
				vm.$router.push({name: 'Home'})
			}
		})//vm permite acessar o this
	}
}
</script>

<style lang="scss" scoped>
	.form-login{
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		h1{
			font-size: 18px;
		}
		.card{
			width: 30%;
			color: var(--darker)
		}
	}
</style>