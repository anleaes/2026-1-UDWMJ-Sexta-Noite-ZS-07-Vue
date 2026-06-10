<template>
    <q-page class="bg-cream q-pa-md q-pa-md-xl">
        <div class="container-admin q-mx-auto">

            <q-card class="shadow-2 q-mb-lg bg-grey-1 q-pa-md">
                <div class="row no-wrap q-gutter-md overflow-auto q-pb-md">
                    <div v-for="pet in animaisVacinados" :key="pet.id" class="col-auto" style="width: 240px;">

                        <q-card class="card-animal-admin text-center q-pa-md cursor-pointer" @click="pet.expanded = !pet.expanded">
                            <q-img :src="pet.imagem" :ratio="1" class="rounded-borders q-mb-sm" style="height: 150px;" />
                            <div class="text-weight-bold text-dark text-h6">{{ pet.nome }}</div>
                            <div class="text-caption text-grey-8">{{ pet.raca }}</div>
                            
                            <div class="q-mt-auto">
                                <q-icon :name="pet.expanded ? 'expand_less' : 'expand_more'" size="sm" class="q-mt-sm" />
                            </div>

                            <q-slide-transition>
                                <div v-show="pet.expanded" @click.stop>
                                    <q-separator class="q-my-md" />
                                    
                                    <div class="text-caption text-weight-bold text-grey-7 text-uppercase q-mb-sm text-center">
                                        Histórico
                                    </div>
                                    
                                    <div 
                                        v-for="(vacina, index) in pet.vacinas" 
                                        :key="index" 
                                        class="q-mb-sm bg-grey-2 q-pa-sm rounded-borders"
                                    >
                                        <div class="row justify-between items-center q-mb-xs">
                                            <div class="text-weight-bold text-body2 text-grey-9">{{ vacina.nome }}</div>
                                            <div class="text-caption text-grey-7 text-weight-medium">{{ vacina.data }}</div>
                                        </div>
                                        <div class="text-caption text-grey-6" style="line-height: 1.2; font-size: 10px;">
                                            {{ vacina.descricao }}
                                        </div>
                                    </div>                                 
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
                label="Cadastrar Nova Vacinação"
                header-class="text-weight-bold"
            >
                <q-card>
                    <q-card-section>
                        <q-form @submit.prevent="cadastrarNovaVacinacao" class="q-gutter-y-md">
                            <div class="row q-col-gutter-md">
                                <div class="col-12 col-md-12">
                                    <q-select 
                                    v-model="novaVacinacao.animal" 
                                    :options="listaAnimais" 
                                    option-value="id" 
                                    option-label="nome" 
                                    emit-value 
                                    map-options
                                    label="Animal *" 
                                    outlined dense
                                    lazy-rules 
                                    :rules="[val => !!val || 'Obrigatório']" 
                                    />
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-input v-model="novaVacinacao.data" label="Data:" type="date" outlined dense />
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-input v-model="novaVacinacao.peso_animal" label="Peso do animal (kg):" type="number" outlined dense />
                                </div>
                                <div class="col-12 col-md-9">
                                    <q-select 
                                        v-model="novaVacinacao.vacinas" 
                                        multiple 
                                        emit-value 
                                        map-options
                                        use-chips 
                                        :options="listaVacinas" 
                                        option-value="id" 
                                        option-label="nome"
                                        label="Vacinas aplicadas (Selecione várias):" 
                                        outlined dense 
                                    />
                                </div>
                                <div v-for="vacinaId in novaVacinacao.vacinas" :key="vacinaId" class="col-12 col-md-3">
                                    <q-input 
                                        v-model.number="novaVacinacao.dosagens[vacinaId]" 
                                        :label="`Dosagem - ${getNomeVacina(vacinaId)}`" 
                                        type="number"
                                        min="0.1"
                                        step="any" 
                                        outlined dense
                                        placeholder="Ex: 1"
                                        lazy-rules
                                        :rules="[val => val !== null && val !== '' || 'Dosagem obrigatória']"
                                    />
                                </div>
                            </div>

                            <div class="row justify-end q-mt-lg">
                                <q-btn type="submit" color="primary" label="Salvar Vacinação" icon="save" no-caps />
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
    import { ref, onMounted, computed } from 'vue'
    import { useQuasar } from 'quasar'
    import { buscarVacinacoes, cadastrarVacinacao, cadastrarItensVacina } from '../services/VaccinationsService'
    import { buscarAnimais } from '../services/AnimalsService'
    import { buscarVacinas } from '../services/VaccinesService'

    const $q = useQuasar()
    const listaAnimais = ref([])
    const listaVacinas = ref([])
    const listaVacinacoes = ref([])
    const expansionOpen = ref(false)

    const novaVacinacao = ref({
        vaccinatedAt: '', weight_at: '',
        animal: '', employee: '',
        vaccines: [], dosagens: {},
    })

    const carregarDados = async () => {
        const dados = await buscarVacinacoes()
        listaVacinacoes.value = dados
    }

    const carregarAnimais = async () => {
        const dados = await buscarAnimais()
        listaAnimais.value = dados
    }

    const animaisVacinados = computed(() => {
        return listaAnimais.value.filter(pet => pet.vacinas && pet.vacinas.length > 0)
    })

    const carregarVacinas = async () => {
        const dados = await buscarVacinas()
        listaVacinas.value = dados
    }

    const getNomeVacina = (id) => {
        const vacina = listaVacinas.value.find(v => v.id === id)
        return vacina ? vacina.nome : 'Vacina' 
    }

    const cadastrarNovaVacinacao = async () => {
        try {
            const payload = {
                vaccinatedAt: novaVacinacao.value.data,
                weight_at: novaVacinacao.value.peso_animal,
                animal: novaVacinacao.value.animal,
                employee: novaVacinacao.value.funcionario || 81,
            }

            const vacinacaoCriada = await cadastrarVacinacao(payload)

            if (novaVacinacao.value.vacinas.length && novaVacinacao.value.vacinas.length > 0) {
                const promessasItens = novaVacinacao.value.vacinas.map(vacinaId => {
                    
                    const dosagemDigitada = novaVacinacao.value.dosagens[vacinaId]

                    const payloadItem = {
                        vaccination: vacinacaoCriada.id,
                        vaccines: vacinaId,
                        dosage: dosagemDigitada,
                        expiration_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],                       // Ajuste conforme os seus campos
                    }
                    return cadastrarItensVacina(payloadItem)
                })
                await Promise.all(promessasItens)
            }

            $q.notify({ type: 'positive', message: 'Cadastrado com sucesso!' })
            expansionOpen.value = false
            novaVacinacao.value = { data: '', peso_animal: '', animal: '', funcionario: '',
             vacinas_selecionadas: [], dosagens: {}}

            await carregarDados()
            await carregarAnimais()
        } catch (e) {
            console.error("Erro completo:", e.message)
            $q.notify({ type: 'negative', message: 'Erro no cadastro: ' + e.message })
        }
    }

    onMounted(() => {
        carregarDados()
        carregarAnimais()
        carregarVacinas()
    })

</script>
<style scoped>
    .bg-cream { background-color: #f7f5ef; }
    .container-admin { max-width: 1600px; }
    .card-animal-admin { border-radius: 12px; transition: 0.3s; }
    .card-animal-admin:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
</style>