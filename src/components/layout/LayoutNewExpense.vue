<template>
  <div class="w-100 d-flex justify-content-center">
    <button class="add btn btn-lg btn-outline-primary w-75" @click="showModal = true">
        <i class="fa fa-plus"></i>
        Novo Gasto
    </button>

  <form @submit.prevent="submit()">
    <div class="modal fade" :class="{show: showModal}" :style="{display: showModal ? 'block' : 'none'}">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLiveLabel">Adicionar novo gasto</h5>
                    <button type="button" @click="closeModal()" class="close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="form-group col-8">
                            <label for="">Descrição:</label>
                            <input 
                                v-model="form.description"
                                type="text"
                                class="form-control"
                                required
                            >
                        </div>
                        <div class="form-group col-4">
                            <label for="">Valor (R$):</label>
                            <input 
                                v-model="form.value"
                                type="number"
                                class="form-control"
                                required
                                step="0.01"
                            >
                        </div>
                        <div class="form-group d-flex flex-column align-items-center col-12">
                            <input 
                                ref="inputFile"
                                type="file"
                                class="d-none"
                                accept="image/*"
                                @change="handleFile($event)"
                            >
                            <button 
                                type="button"
                                @click="openFile()"
                                class="btn w-50 btn-outline-secondary"
                            >
                                Adicionar Comprovante
                            </button>
                            <div class="mt-2" v-if="form.receipt">
                                {{form.receipt.name}}
                                <button 
                                    type="button"
                                    @click="form.receipt = ''"
                                    class="btn badge badge-light"
                                >
                                    <i class="fa fa-trash text-danger"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" @click="closeModal()" class="btn btn-secondary">Fechar</button>
                    <button class="btn btn-primary" :disabled="loading">
                        <template v-if="loading">
                            <i class="fa fa-spin fa-spinner"></i>
                            Adicionando...
                        </template>
                        <template v-else>
                            Adicionar
                        </template>
                    </button>
                </div>
            </div>
        </div>
    </div>
  </form>

  <div class="modal-backdrop fade show" :style="{display: showModal ? 'block' : 'none'}"></div>
  
  </div>
</template>

<script>
export default {
    data: () => ({ 
        showModal: false,
        loading: false,
        form: {
            description: '',
            value: '',
            receipt: ''
        }
    }),
    computed: {
        fileName(){
            const { receipt } = this.form
            if(receipt){
                const split = receipt.name.split('.')
                return `${split[0]}-${new Date().getTime()}.${split[1]}`
            } else{
                return ''
            }
        }
    },
    methods: {
        openFile(){
            this.$refs.inputFile.value = null
            this.$refs.inputFile.click()
        },
        handleFile({target}){
            this.form.receipt = target.files[0]
        },
        closeModal(){
            this.showModal = false
        },
        async submit(){
            let url = ''
            this.loading = true

            try {
                this.$root.$emit('Spinner::show')
                const ref = this.$firebase.database().ref(window.uid)
                const id = ref.push().key //gerando hash
    
                if (this.form.receipt) {
                    const snapshot = await this.$firebase
                    .storage()
                    .ref(window.uid)
                    .child(this.fileName)
                    .put(this.form.receipt)
    
                    url = await snapshot.ref.getDownloadURL()
                }
    
                const payload = {
                    id,
                    ...this.form,
                    receipt: url,
                    createdAt: new Date().getTime()
                }
    
                ref.child(id).set(payload, err => {
                    if(err){
                        this.$root.$emit('Notification::show',{
                            type: 'danger',
                            message: 'Não foi possível cadastrar.'
                        })
                    }
                    else{
                        this.$root.$emit('Notification::show',{
                            type: 'success',
                            message: 'Cadastrado com sucesso.'
                        })
                        this.loading = false
                        this.closeModal()
                    }
                })
                
            } catch (error) {
                this.$root.$emit('Notification::show',{
                    type: 'danger',
                    message: 'Não foi possível cadastrar.'
                })
            } finally{
                this.$root.$emit('Spinner::hide')
                this.loading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.modal{
    color: var(--darker);
}
@media (max-width: 400px) {
    .add{
        font-size: 0.7rem;
    }
}
@media (min-width: 401px) and (max-width: 700px){
  .add{
    font-size: 0.8rem;
  }
}
</style>