<template>
  <div id="app">

   <BaseSpinner/>
   <LayoutNotification/>

   <div class="container-fluid" v-if="isLogged">
     <div class="row">
       <div class="col-2 navigation-sidebar">
          <h1 class="app-title">Expenses</h1>
          <LayoutNavigation/>
       </div>
       <div class="col">
          <router-view/>
       </div>
     </div>
   </div>

   <router-view v-else/>

  </div>
</template>

<script>

import BaseSpinner from './components/global/BaseSpinner'
import LayoutNavigation from './components/layout/LayoutNavigation'
import LayoutNotification from './components/layout/LayoutNotification'


export default {
  components: {
    BaseSpinner,
    LayoutNavigation,
    LayoutNotification
  },

  data: ()=>({ isLogged: false}),

  mounted (){
    this.$firebase.auth().onAuthStateChanged(user => {
      window.uid = user ? user.uid : null
      this.isLogged = !!user

      this.$router.push({name: window.uid ? 'Home' : 'Login'})//redirect user
      
      setTimeout(()=>{
        this.$root.$emit('Spinner::hide')
      },300)
    })
  }
}
</script>

<style lang="scss">

#app{
	min-height: 100vh;
	background-color: var(--dark);
  color: var(--light);

  .navigation-sidebar{
    background-color: var(--dark-medium);
    .app-title{
      font-size: 20px;
      margin-top: 10px;
      text-align: center;
    }
  }
}

@media (max-width: 400px){
  .navigation-sidebar{
    font-size: 10px;
  .app-title{
    font-size: 0.8rem !important;
    margin-left: -10px;
    }
  }
}
@media (min-width: 401px) and (max-width: 700px){
  .navigation-sidebar{
    font-size: 13px;
  .app-title{
    font-size: 1.1rem !important;
    margin-left: -13px;
    }
  }
}

</style>
