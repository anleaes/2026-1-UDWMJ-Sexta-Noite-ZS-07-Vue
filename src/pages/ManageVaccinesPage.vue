<template>
    <q-page class="bg-cream q-pa-md q-pa-md-xl">
        <div class="container-admin q-mx-auto">
            <q-card class="shadow-2 q-mb-lg bg-grey-1 q-pa-md">
                <div class="row no-wrap q-gutter-md overflow-auto q-pb-md">
                    <div v-for="vacina in listaVacinas" :key="vacina.id" class="col-auto" style="width: 280px;">
                        <q-card class="card-admin text-center q-pa-md cursor-pointer" style="min-height: 300px;" @click="vacina.expanded = !vacina.expanded">
                            
                            <q-avatar color="gray-2" text-color="dark" icon="vaccines" />

                            <template v-if="isEditingId !== vacina.id">
                                <div class="text-weight-bold text-dark">{{ vacina.nome }}</div>
                                <div class="text-caption text-grey-7">{{ vacina.descricao }}</div>
                            </template>

                            <template v-else>
                                <q-input v-model="vacina.nome" label="Nome da Vacina" dense outlined class="q-mb-sm" />
                                <q-input v-model="vacina.descricao" label="Descrição" type="textarea" autogrow dense outlined />
                            </template>

                            <q-icon :name="vacina.expanded ? 'expand_less' : 'expand_more'" size="sm" class="q-mt-auto" />

                            <q-slide-transition>
                                <div v-show="vacina.expanded" @click.stop>
                                    <q-separator class="q-my-md" />
                                    <q-card-section class="q-pt-md">
                
                                        <template v-if="isEditingId !== vacina.id">
                                            <div class="row q-col-gutter-sm text-caption text-grey-8 q-mb-md">
                                            <div class="col-6">
                                                <div class="text-weight-bold">Prevenção:</div>
                                                <div>{{ vacina.anos_prevencao }} ano(s)</div>
                                            </div>
                                            <div class="col-6">
                                                <div class="text-weight-bold">Fabricante:</div>
                                                <div>{{ vacina.fabricante }}</div>
                                            </div>
                                            </div>

                                            <div class="row q-gutter-sm justify-center">
                                            <q-btn outline color="primary" icon="edit" label="Editar" size="sm" @click="isEditingId = vacina.id" />
                                            <q-btn outline color="negative" icon="delete" label="Excluir" size="sm" @click="excluirVacina(vacina)" />
                                            </div>
                                        </template>

                                        <template v-else>
                                            <q-input v-model.number="vacina.anos_prevencao" label="Anos de Prevenção" type="number" dense outlined class="q-mb-sm" />
                                            <q-input v-model="vacina.fabricante" label="Fabricante" dense outlined class="q-mb-md" />

                                            <div class="row q-gutter-sm justify-center">
                                            <q-btn color="primary" icon="save" label="Salvar" size="sm" @click="editarVacina(vacina); isEditingId = null" />
                                            <q-btn flat color="grey-7" label="Cancelar" size="sm" @click="isEditingId = null" />
                                            </div>
                                        </template>

                                    </q-card-section>
                                </div>
                            </q-slide-transition>
                        </q-card>
                    </div>
                </div>
            </q-card>
            <q-expansion-item
                v-model="expansionOpen"
                class="bg-white shadow-2"
                icon="add_circle"
                label="Cadastrar Nova Vacina"
                header-class="text-weight-bold"
            >
                <q-card>
                    <q-card-section>
                        <q-form @submit.prevent="cadastrarNovaVacina" class="q-gutter-y-md">
                            <div class="row q-col-gutter-md">
                                <div class="col-12 col-md-5">
                                    <q-input v-model="novaVacina.nome" label="Nome:" outlined dense />
                                </div>
                                <div class="col-12 col-md-5">
                                    <q-input v-model="novaVacina.fabricante" label="Fabricante:" outlined dense />
                                </div>
                                <div class="col-12 col-md-2">
                                    <q-input v-model="novaVacina.anos_prevencao" label="Anos de Prevenção:" type="number" outlined dense />
                                </div>

                                <div class="col-12 col-md-12" lines="5">
                                    <q-input v-model="novaVacina.descricao" label="Descrição:" outlined dense />
                                </div>
                            </div>

                            <div class="row justify-end q-mt-lg">
                                <q-btn type="submit" color="primary" label="Salvar Vacina" icon="save" no-caps />
                            </div>
                        </q-form>
                    </q-card-section>
                </q-card>
            </q-expansion-item>
        </div>
    </q-page>
</template>

<script setup>
//teste
    import { ref, onMounted } from 'vue'
    import { useQuasar } from 'quasar'
    import { buscarVacinas, atualizarVacina, deletarVacina, cadastrarVacina } from '../services/VaccinesService'

    const $q = useQuasar()
    const listaVacinas = ref([])
    const isEditingId = ref(null)
    const expansionOpen = ref(false)

    const novaVacina = ref({
        name: '', description: '',
        years_prevention: 1, manufacturer: '',
    })

    const carregarDados = async () => {
        const dados = await buscarVacinas()
        listaVacinas.value = dados
    }

    const editarVacina = async (vacina) => {
        try {
            await atualizarVacina(vacina.id, {
                name: vacina.nome,
                description: vacina.descricao,
                years_prevention: vacina.anos_prevencao,
                manufacturer: vacina.fabricante
            })
            $q.notify({ type: 'positive', message: 'Vacina atualizada!' })
            await carregarDados()
        } catch (e) {
            $q.notify({ type: 'negative', message: 'Erro ao salvar: ' + e.message })
        }
    }

    const cadastrarNovaVacina = async () => {
        try {
            const payload = {
            name: novaVacina.value.nome, 
            description: novaVacina.value.descricao, 
            years_prevention: novaVacina.value.anos_prevencao,
            manufacturer: novaVacina.value.fabricante
            }
            await cadastrarVacina(payload)

            $q.notify({ type: 'positive', message: 'Cadastrado com sucesso!' })
            expansionOpen.value = false
            novaVacina.value = { nome: '', descricao: '', anos_prevencao: 1, fabricante: '' }
            await carregarDados()
        } catch (e) {
            console.error("Erro completo:", e.message)
            $q.notify({ type: 'negative', message: 'Erro no cadastro: ' + e.message })
        }
    }
    const excluirVacina = async (vacina) => {
        console.log("Tentando excluir a vacina:", vacina);
        $q.dialog({
            title: 'Confirmação',
            message: 'Tem certeza que deseja excluir esta vacina?',
            cancel: true,
            persistent: true
        }).onOk(async () => {
            try {
                await deletarVacina(vacina.id)
                $q.notify({ type: 'positive', message: 'Vacina excluída!' })
                await carregarDados()
            } catch (e) {
                $q.notify({ type: 'negative', message: 'Erro ao excluir: ' + e.message })
            }
        })
    }

    onMounted(() => {
        carregarDados()
    })

</script>
<style scoped>
    .bg-cream { background-color: #f7f5ef; }
    .container-admin { max-width: 1600px; }
    .card-animal-admin { border-radius: 12px; transition: 0.3s; }
    .card-animal-admin:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
</style>