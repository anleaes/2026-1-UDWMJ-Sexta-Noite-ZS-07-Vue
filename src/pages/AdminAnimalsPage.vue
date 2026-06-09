<template>
    <q-page class="bg-cream q-pa-md q-pa-md-xl">
            <div class="container-admin q-mx-auto">
            
                <q-card class="shadow-2 q-mb-lg bg-grey-1 q-pa-md">
                    <div class="row no-wrap q-gutter-md overflow-auto q-pb-md hide-scrollbar">
                        <div v-for="pet in listaAnimais" :key="pet.id" class="col-auto" style="width: 240px;">
                            <q-card class="card-animal-admin text-center q-pa-md cursor-pointer" @click="pet.expanded = !pet.expanded">
                                <q-img :src="pet.imagem" :ratio="1" class="rounded-borders q-mb-sm" style="height: 150px;" />
                                <div class="text-weight-bold text-dark text-h6">{{ pet.nome }}</div>
                                <div class="text-caption text-grey-8">{{ pet.raca }}</div>
                                
                                <q-icon :name="pet.expanded ? 'expand_less' : 'expand_more'" size="sm" class="q-mt-sm" />

                                <q-slide-transition>
                                    <div v-show="pet.expanded" @click.stop>
                                        <q-separator class="q-my-md" />
                                        
                                        <div class="row q-gutter-xs justify-center q-mb-md">
                                            <q-badge v-for="tag in pet.characteristics" :key="tag" 
                                            rounded outline color="secondary" :label="tag" class="q-px-sm" />
                                        </div>

                                        <q-btn 
                                            label="Modificar Características" 
                                            color="primary" outline rounded unelevated class="q-mb-md full-width" no-caps 
                                            @click="modalAlterarCaracteristicas(pet)" 
                                        />

                                        <q-separator class="q-mb-md" />

                                        <div class="text-left q-gutter-y-sm">
                                            <div class="text-caption text-weight-bold text-grey-8">Status do Animal:</div>
                                            <q-toggle v-model="pet.castrado" label="Castrado" color="primary" />
                                            <q-toggle v-model="pet.adotado" label="Adotado" color="primary" />
                                        </div>

                                        <q-btn color="primary" label="Salvar Status" class="full-width q-mt-md" @click="salvarStatus(pet)" no-caps />
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
                    label="Cadastrar Novo Animal"
                    header-class="text-weight-bold"
                >
                        <q-card>
                            <q-card-section>
                                <q-form @submit.prevent="cadastrarNovo" class="q-gutter-y-md">
                                    <div class="row q-col-gutter-md">
                                        <div class="col-12 col-md-6">
                                            <q-input v-model="novoPet.name" label="Nome:" outlined dense />
                                        </div>
                                        <div class="col-12 col-md-6">
                                            <q-input v-model="novoPet.birth_date" label="Data de Nascimento:" type="date" outlined dense />
                                        </div>
                                        
                                        <div class="col-12 col-md-4">
                                            <q-select v-model="novoPet.sex" :options="['M', 'F']" label="Sexo:" outlined dense />
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <q-select v-model="novoPet.size" :options="['P', 'M', 'G']" label="Tamanho:" outlined dense />
                                        </div>
                                        <div class="col-12 col-md-4">
                                            <q-input v-model="novoPet.color" label="Cor:" outlined dense />
                                        </div>

                                        <div class="col-12 col-md-4">
                                            <q-input v-model="novoPet.listedAt" label="Data de Listagem:" type="date" outlined dense />
                                        </div>

                                        <div class="col-12 col-md-8">
                                            <q-select 
                                                v-model="novoPet.breed" 
                                                :options="listaRacas" 
                                                option-value="id" 
                                                option-label="name" 
                                                emit-value 
                                                map-options 
                                                label="Raça:" 
                                                outlined dense 
                                            />
                                        </div>

                                        <div class="col-12">
                                            <q-select 
                                                v-model="novoPet.characteristic" 
                                                multiple 
                                                use-chips 
                                                :options="listaCaracteristicas" 
                                                label="Características (Selecione várias):" 
                                                outlined dense 
                                            />
                                        </div>

                                        <div class="col-12">
                                            <q-file v-model="fotoUpload" label="Foto:" outlined dense>
                                                <template v-slot:prepend><q-icon name="attach_file" /></template>
                                            </q-file>
                                        </div>

                                        <div class="col-12">
                                            <div class="row q-gutter-md q-mt-sm">
                                                <q-checkbox v-model="novoPet.sterilized" label="Castrado" color="primary" />
                                                <q-checkbox v-model="novoPet.adopted" label="Adotado" color="primary" />
                                            </div>
                                        </div>

                                    </div>

                                    <div class="row justify-end q-mt-lg">
                                        <q-btn type="submit" color="primary" label="Salvar Animal" icon="save" no-caps />
                                    </div>
                                </q-form>
                            </q-card-section>
                        </q-card>
                </q-expansion-item>

            </div>
    </q-page>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useQuasar } from 'quasar'
    import { buscarAnimais, atualizarStatusAnimal, cadastrarAnimal } from '../services/AnimalsService'
    import { buscarCaracteristicas } from '../services/CharacteristicService'
    import { buscarRacas } from '../services/BreedService'

    const $q = useQuasar()
    const listaAnimais = ref([])
    const listaRacas = ref([])
    const listaCaracteristicas = ref([])
    const expansionOpen = ref(false)
    const fotoUpload = ref(null)

    const novoPet = ref({
        name: '', sex: 'M', size: 'M', color: '', birth_date: '',
        listedAt: '', breed: null, characteristic: [],
        sterilized: false, adopted: false
    })

    const carregarDados = async () => {
        const dados = await buscarAnimais()
        listaAnimais.value = dados.map(a => ({ ...a, expanded: false }))
    }

    const carregarCaracteristicasRacas = async () => {
        try {
            const caracDados = await buscarCaracteristicas()
            listaCaracteristicas.value = caracDados.map(c => c.name)

            const racasDados = await buscarRacas()
            listaRacas.value = racasDados.map(r => ({ id: r.id, name: r.name }))

        } catch (error) {
            console.error("Erro ao carregar dados do formulário: ", error)
        }
    }


    const salvarStatus = async (pet) => {
        try {
            await atualizarStatusAnimal(pet.id, {
                sterilized: pet.castrado,
                adopted: pet.adotado
            })
            $q.notify({ type: 'positive', message: 'Animal atualizado!' })
            await carregarDados()
        } catch (e) {
            $q.notify({ type: 'negative', message: 'Erro ao salvar: ' + e.message })
        }
    }

    const cadastrarNovo = async () => {
        try {
            const fd = new FormData()
            Object.keys(novoPet.value).forEach(key => {
                if (key === 'characteristic') {
                    novoPet.value[key].forEach(carac => fd.append('characteristic', carac))
                } 
                else if (key !== 'photo' && novoPet.value[key] !== null && novoPet.value[key] !== '') {
                    fd.append(key, novoPet.value[key])
                }
            })

            if (fotoUpload.value) fd.append('photo', fotoUpload.value)

            await cadastrarAnimal(fd)
            $q.notify({ type: 'positive', message: 'Cadastrado com sucesso!' })
            expansionOpen.value = false
            await carregarDados()
        } catch (e) {
            $q.notify({ type: 'negative', message: 'Erro no cadastro: ' + e.message })
        }
    }

    const modalAlterarCaracteristicas = (pet) => {
        $q.dialog({
            title: 'Modificar Características',
            message: `Selecione as características para ${pet.nome}:`,
            options: {
                type: 'checkbox',
                model: pet.characteristics || [],
                items: listaCaracteristicas.value.map(c => ({ label: c, value: c }))
            },
            cancel: true,
            persistent: true
        }).onOk(async (novasCaracteristicas) => {
            try {
                await atualizarStatusAnimal(pet.id, {
                    characteristic: novasCaracteristicas
                })
                
                pet.characteristics = novasCaracteristicas
                
                $q.notify({ type: 'positive', message: 'Características atualizadas com sucesso!', position: 'top' })
            } catch (error) {
                $q.notify({ type: 'negative', message: 'Erro ao atualizar: ' + error.message, position: 'top' })
            }
        })
    }

    onMounted(() => {
        carregarDados()
        carregarCaracteristicasRacas()
    })
</script>

<style scoped>
    .bg-cream { background-color: #f7f5ef; }
    .container-admin { max-width: 1600px; }
    .card-animal-admin { border-radius: 12px; transition: 0.3s; }
    .card-animal-admin:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
</style>