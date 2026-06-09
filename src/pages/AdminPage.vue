<template>
    <q-page class="bg-cream q-pa-md q-pa-md-xl">
        <div class="container-admin q-mx-auto">
        
            <q-card class="shadow-2 q-mb-lg">
                <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
                >
                    <q-tab name="clientes" label="CLIENTES" />
                    <q-tab name="funcionarios" label="FUNCIONÁRIOS" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated class="bg-grey-1">
                
                    <q-tab-panel name="clientes">
                        <div class="row no-wrap q-gutter-md overflow-auto q-pb-md">
                            <div v-for="user in clientesList" :key="user.id" class="col-auto" style="width: 280px;">
                                
                                <q-card class="card-admin text-center q-pa-md cursor-pointer" @click="user.expanded = !user.expanded">
                                    <q-icon name="account_circle" size="80px" color="grey-8" class="q-mb-sm" />
                                    <div class="text-weight-bold text-dark">{{ user.name }}</div>
                                    <div class="text-caption text-grey-7">{{ user.role }}</div>
                                    <q-icon :name="user.expanded ? 'expand_less' : 'expand_more'" size="sm" class="q-mt-sm" />
                                    
                                    <q-slide-transition>
                                        <div v-show="user.expanded" @click.stop>
                                            <q-separator class="q-my-md" />
                                            <div class="text-left">
                                                <div class="text-caption text-grey">Usuário:</div>
                                                <div class="text-weight-bold q-mb-md">@{{ user.username }}</div>
                                                
                                                <div class="row justify-center q-gutter-xs q-mb-md">
                                                    <q-btn @click="modalAlterarUser(user)" size="sm" color="primary" label="Alterar User" no-caps />
                                                    <q-btn @click="modalAlterarSenha(user)" size="sm" outline color="dark" label="Nova Senha" no-caps />
                                                </div>
                                                
                                                <q-form @submit.prevent="salvarDadosCliente(user)">
                                                    <q-input v-model="user.endereco" label="Endereço:" dense outlined class="q-mb-md" />
                                                    <q-checkbox v-model="user.localSeguro" label="Local Seguro" color="primary" dense class="full-width" />
                                                    <q-checkbox v-model="user.verificado" label="Endereço Verificado" color="primary" dense class="full-width" />
                                                    <q-checkbox v-model="user.dadosValidos" label="Dados Validados" color="primary" dense class="full-width" />
                                                    
                                                    <q-btn type="submit" color="primary" label="Salvar" class="full-width q-mt-md" no-caps />
                                                </q-form>
                                            </div>
                                        </div>
                                    </q-slide-transition>
                                </q-card>
                            </div>
                        </div>
                    </q-tab-panel>

                    <q-tab-panel name="funcionarios">
                        <div class="row no-wrap q-gutter-md overflow-auto q-pb-md">
                            <div v-for="staff in funcionariosList" :key="staff.id" class="col-auto" style="width: 280px;">
                                <q-card class="card-admin text-center q-pa-md cursor-pointer" @click="staff.expanded = !staff.expanded">
                                    <q-icon name="work_outline" size="80px" color="grey-8" class="q-mb-sm" />
                                    <div class="text-weight-bold text-dark">{{ staff.name }}</div>
                                    <div class="text-caption text-grey-7">{{ staff.cargo }}</div>
                                    
                                    <q-badge 
                                        :color="staff.role === 'Administrador' || staff.role === 'admin' ? 'negative' : 'orange'" 
                                        :label="staff.role === 'Administrador' || staff.role === 'admin' ? 'Administrador' : 'Moderador'"
                                        class="q-mt-xs q-px-sm q-py-xs text-weight-bold q-mx-auto"
                                        style="border-radius: 4px; display: block; width: min-content;"
                                    />
                                    
                                    <q-icon :name="staff.expanded ? 'expand_less' : 'expand_more'" size="sm" class="q-mt-sm" />

                                    <q-slide-transition>
                                        <div v-show="staff.expanded" @click.stop>
                                            <q-separator class="q-my-md" />
                                            <div class="text-left">
                                                <div class="text-caption text-grey">Usuário:</div>
                                                <div class="text-weight-bold q-mb-md">@{{ staff.username }}</div>
                                                
                                                <div class="row justify-center q-gutter-xs q-mb-md">
                                                    <q-btn @click="modalAlterarUserFuncionario(staff)" size="sm" color="primary" label="Alterar User" no-caps />
                                                    <q-btn @click="modalAlterarSenhaFuncionario(staff)" size="sm" outline color="dark" label="Resetar Senha" no-caps />
                                                </div>
                                                
                                                <q-form @submit.prevent="salvarDadosFuncionario(staff)">
                                                    <q-input v-model="staff.cargo" label="Cargo:" dense outlined class="q-mb-md" />
                                                    <q-select v-model="staff.role" :options="['Administrador', 'Moderador']" label="Nível no Sistema:" dense outlined class="q-mb-md" />
                                                    
                                                    <q-toggle v-model="staff.is_active" label="Conta Ativa no Sistema" color="primary" class="q-mb-md" />
                                                    
                                                    <q-btn type="submit" color="primary" label="Salvar" class="full-width q-mt-md" no-caps />
                                                </q-form>
                                            </div>
                                        </div>
                                    </q-slide-transition>
                                </q-card>
                            </div>
                        </div>
                    </q-tab-panel>

                </q-tab-panels>
            </q-card>

            <div class="q-gutter-y-sm">
                <q-expansion-item 
                    v-model="expansionCliente" 
                    class="bg-white shadow-2" 
                    icon="person_add" 
                    label="Cadastrar Novo Cliente" 
                    header-class="text-weight-bold"
                >
                    <q-card>
                        <q-card-section>
                            <q-form @submit.prevent="salvarNovoCliente" class="q-gutter-y-md">
                                <div class="row q-col-gutter-md">
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoCliente.first_name" label="Nome *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoCliente.last_name" label="Sobrenome *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoCliente.username" label="Nome de Utilizador *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoCliente.email" label="E-mail *" type="email" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoCliente.password" label="Palavra-passe *" type="password" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoCliente.cpf" label="CPF *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" mask="###.###.###-##" unmasked-value />
                                    </div>
                                    <div class="col-12">
                                        <q-input v-model="novoCliente.address" label="Morada / Endereço Completo *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                </div>

                                <div class="row q-col-gutter-sm q-mt-sm">
                                    <div class="col-12 col-sm-4">
                                        <q-checkbox v-model="novoCliente.yard_security" label="Local Seguro verificado" color="primary" />
                                    </div>
                                    <div class="col-12 col-sm-4">
                                        <q-checkbox v-model="novoCliente.addressComprove" label="Morada Comprovada" color="primary" />
                                    </div>
                                    <div class="col-12 col-sm-4">
                                        <q-checkbox v-model="novoCliente.checkedData" label="Dados Pessoais Validados" color="primary" />
                                    </div>
                                </div>

                                <div class="row justify-end q-mt-lg">
                                    <q-btn type="submit" color="primary" label="Cadastrar Cliente" icon="save" :loading="loadingNovoCliente" no-caps />
                                </div>
                            </q-form>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
                <q-expansion-item 
                    v-model="expansionFuncionario"
                    class="bg-white shadow-2" 
                    icon="work_history" 
                    label="Cadastrar Novo Funcionário" 
                    header-class="text-weight-bold"
                >
                    <q-card>
                        <q-card-section>
                            <q-form @submit.prevent="salvarNovoFuncionario" class="q-gutter-y-md">
                                <div class="row q-col-gutter-md">
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoFuncionario.first_name" label="Nome *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoFuncionario.last_name" label="Sobrenome *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoFuncionario.username" label="Nome de Utilizador *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoFuncionario.email" label="E-mail *" type="email" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoFuncionario.password" label="Palavra-passe *" type="password" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoFuncionario.cpf" label="CPF *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" mask="###.###.###-##" unmasked-value />
                                    </div>
                                    <div class="col-12">
                                        <q-input v-model="novoFuncionario.position" label="Cargo *" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoFuncionario.birth_date" label="Data de Nascimento *" type="date" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <q-input v-model="novoFuncionario.hire_date" label="Data de Contratação *" type="date" outlined dense lazy-rules :rules="[val => !!val || 'Obrigatório']" />
                                    </div>
                                </div>

                                <div class="row justify-end q-mt-lg">
                                    <q-btn type="submit" color="primary" label="Cadastrar Funcionário" icon="save" :loading="loadingNovoFuncionario" no-caps />
                                </div>
                            </q-form>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>
                <q-item clickable v-ripple class="bg-white shadow-2" @click="$router.push('/admin/animais')">
                    <q-item-section avatar><q-icon name="pets" color="primary" /></q-item-section>
                    <q-item-section class="text-weight-bold">Ver animais</q-item-section>
                    <q-item-section side><q-icon name="chevron_right" /></q-item-section>
                </q-item>
            </div>

        </div>
    </q-page>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useQuasar } from 'quasar'
    
    import { 
        buscarClientes, 
        alterarUsernameCliente, 
        alterarSenhaCliente, 
        alterarEnderecoCliente, 
        atualizarStatusCliente,
        cadastrarCliente
    } from '../services/AdopterService'
    
    import { 
        buscarFuncionarios,
        alterarUsernameFuncionario,
        alterarSenhaFuncionario,
        alterarCargoFuncionario,
        atualizarStatusFuncionario,
        cadastrarFuncionario
    } from '../services/EmployeeService'

    const $q = useQuasar()
    const tab = ref('clientes')

    const clientesList = ref([]) 
    const funcionariosList = ref([])

    const expansionCliente = ref(false)
    const loadingNovoCliente = ref(false)
    const novoCliente = ref({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        cpf: '',
        address: '',
        yard_security: false,
        addressComprove: false,
        checkedData: false
    })

    const expansionFuncionario = ref(false)
    const loadingNovoFuncionario = ref(false)
    
    const novoFuncionario = ref({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        cpf: '',
        position: '',
        birth_date: '',
        hire_date: ''
    })

    const carregarClientes = async () => {
        try {
            const dadosDoBackend = await buscarClientes()
            clientesList.value = dadosDoBackend.map(cliente => ({
                id: cliente.register,
                name: `${cliente.first_name || ''} ${cliente.last_name || ''}`.trim() || 'Sem Nome',
                role: 'Cliente', 
                username: cliente.username || (cliente.user ? cliente.user.username : 'Sem Usuário'), 
                endereco: cliente.address || '',
                localSeguro: cliente.yard_security || false,
                verificado: cliente.addressComprove || false,
                dadosValidos: cliente.checkedData || false,
                expanded: false
            }))
        } catch (error) {
            $q.notify({ type: 'negative', message: 'Erro ao carregar clientes: ' + error.mesage, position: 'top' })
        }
    }

    const carregarFuncionarios = async () => {
        try {
            const dadosDoBackend = await buscarFuncionarios()
            funcionariosList.value = dadosDoBackend.map(staff => ({
                id: staff.register,
                name: `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || 'Sem Nome',
                cargo: staff.position || 'Sem cargo', 
                username: staff.username || (staff.user ? staff.user.username : 'Sem Usuário'),
                role: staff.role, 
                is_active: staff.is_active,
                expanded: false
            }))
        } catch (error) {
            $q.notify({ type: 'negative', message: 'Erro ao carregar funcionários: ' + error.message, position: 'top' })
        }
    }

    const salvarNovoCliente = async () => {
        loadingNovoCliente.value = true
        try {
            await cadastrarCliente(novoCliente.value)
            
            $q.notify({ type: 'positive', message: 'Novo cliente cadastrado com sucesso!', position: 'top' })
            
            novoCliente.value = {
                first_name: '', last_name: '', username: '', email: '', password: '',
                cpf: '', address: '', yard_security: false, addressComprove: false, checkedData: false
            }
            
            expansionCliente.value = false
            
            await carregarClientes()

        } catch (error) {
            $q.notify({ type: 'negative', message: error.message, position: 'top' })
        } finally {
            loadingNovoCliente.value = false
        }
    }

    const salvarNovoFuncionario = async () => {
        loadingNovoFuncionario.value = true
        try {
            await cadastrarFuncionario(novoFuncionario.value)
            
            $q.notify({ type: 'positive', message: 'Novo funcionário cadastrado com sucesso!', position: 'top' })
            
            novoFuncionario.value = {
                first_name: '', last_name: '', username: '', email: '', password: '',
                cpf: '', position: '', birth_date: '', hire_date: ''
            }
            
            expansionFuncionario.value = false
            
            await carregarFuncionarios()

        } catch (error) {
            $q.notify({ type: 'negative', message: error.message, position: 'top' })
        } finally {
            loadingNovoFuncionario.value = false
        }
    }

    const modalAlterarUser = (cliente) => {
        $q.dialog({
            title: 'Alterar Usuário',
            message: `Digite o novo usuário para ${cliente.name}:`,
            prompt: { model: cliente.username, type: 'text' },
            cancel: true, persistent: true
        }).onOk(async (novoUsername) => {
            if (novoUsername && novoUsername !== cliente.username) {
                try {
                    await alterarUsernameCliente(cliente.id, novoUsername)
                    cliente.username = novoUsername
                    $q.notify({ type: 'positive', message: 'Usuário alterado com sucesso!', position: 'top' })
                } catch (error) {
                    $q.notify({ type: 'negative', message: error.message, position: 'top' })
                }
            }
        })
    }

    const modalAlterarSenha = (user) => {
        $q.dialog({
            title: 'Redefinir Senha',
            message: `Digite a nova senha para ${user.name}:`,
            prompt: { model: '', type: 'password' },
            cancel: true, persistent: true
        }).onOk(async (novaSenha) => {
            if (novaSenha) {
                try {
                    await alterarSenhaCliente(user.id, novaSenha)
                    $q.notify({ type: 'positive', message: 'Senha atualizada com sucesso!', position: 'top' })
                } catch (error) {
                    $q.notify({ type: 'negative', message: error.message, position: 'top' })
                }
            }
        })
    }

    const salvarDadosCliente = async (user) => {
        try {
            await alterarEnderecoCliente(user.id, user.endereco)
            await atualizarStatusCliente(user.id, {
                yard_security: user.localSeguro,
                addressComprove: user.verificado,
                checkedData: user.dadosValidos
            })
            $q.notify({ type: 'positive', message: 'Dados do cliente atualizados com sucesso!', position: 'top' })
        } catch (error) {
            $q.notify({ type: 'negative', message: error.message, position: 'top' })
        }
    }

    const modalAlterarUserFuncionario = (staff) => {
        $q.dialog({
            title: 'Alterar Usuário',
            message: `Digite o novo usuário para o funcionário ${staff.name}:`,
            prompt: { model: staff.username, type: 'text' },
            cancel: true, persistent: true
        }).onOk(async (novoUsername) => {
            if (novoUsername && novoUsername !== staff.username) {
                try {
                    await alterarUsernameFuncionario(staff.id, novoUsername)
                    staff.username = novoUsername
                    $q.notify({ type: 'positive', message: 'Usuário alterado com sucesso!', position: 'top' })
                } catch (error) {
                    $q.notify({ type: 'negative', message: error.message, position: 'top' })
                }
            }
        })
    }

    const modalAlterarSenhaFuncionario = (staff) => {
        $q.dialog({
            title: 'Resetar Senha',
            message: `Digite a nova senha para o funcionário ${staff.name}:`,
            prompt: { model: '', type: 'password' },
            cancel: true, persistent: true
        }).onOk(async (novaSenha) => {
            if (novaSenha) {
                try {
                    await alterarSenhaFuncionario(staff.id, novaSenha)
                    $q.notify({ type: 'positive', message: 'Senha do funcionário atualizada!', position: 'top' })
                } catch (error) {
                    $q.notify({ type: 'negative', message: error.message, position: 'top' })
                }
            }
        })
    }

    const salvarDadosFuncionario = async (staff) => {
        try {
            await alterarCargoFuncionario(staff.id, staff.cargo, staff.role)
            await atualizarStatusFuncionario(staff.id, staff.is_active)

            $q.notify({ type: 'positive', message: 'Dados do funcionário atualizados com sucesso!', position: 'top' })
        } catch (error) {
            $q.notify({ type: 'negative', message: error.message, position: 'top' })
        }
    }

    onMounted(() => {
        carregarClientes()
        carregarFuncionarios()
    })
</script>

<style scoped>
    .bg-cream { background-color: #f7f5ef; }
    .container-admin { max-width: 1600px; margin: 0 auto;}
    .card-admin { transition: all 0.3s; border-radius: 12px; }
    .card-admin:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
</style>