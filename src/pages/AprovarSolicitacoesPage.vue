<template>
  <div class="q-pa-md">
    <div class="q-mx-auto" style="max-width: 1100px;">

      <div class="text-h5 text-weight-bold text-dark q-mb-xs">Solicitações de Adoção</div>
      <div class="text-caption q-mb-lg" style="color: #d85a30;">
        Analise e responda às solicitações enviadas pelos adotantes.
      </div>

      <!-- Filtro por status -->
      <div class="row q-gutter-sm q-mb-lg">
        <q-btn
          v-for="f in filtros"
          :key="f.value"
          :label="f.label"
          :outline="filtroAtivo !== f.value"
          :color="f.color"
          rounded
          no-caps
          size="sm"
          @click="filtroAtivo = f.value"
        />
      </div>

      <div v-if="loading" class="flex flex-center q-py-xl">
        <q-spinner color="deep-orange-6" size="3rem" />
      </div>

      <div v-else-if="solicitacoesFiltradas.length === 0" class="text-center q-py-xl">
        <q-icon name="inbox" size="4rem" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">Nenhuma solicitação aqui.</div>
      </div>

      <div v-else class="q-gutter-md">
        <q-card
          v-for="s in solicitacoesFiltradas"
          :key="s.id"
          bordered
          class="no-shadow"
          style="border-radius: 8px;"
        >
          <!-- Cabeçalho do card -->
          <q-card-section class="row items-center q-pb-none">
            <div class="col">
              <div class="text-weight-bold text-grey-9 text-body1">{{ s.full_name }}</div>
              <div class="text-caption text-grey-6">
                Animal: <strong>{{ s.animal_name }}</strong> •
                Enviado em {{ formatarData(s.submitted_at) }}
              </div>
            </div>
            <q-chip
              :color="statusColor(s.status)"
              text-color="white"
              :label="statusLabel(s.status)"
              size="sm"
              class="text-weight-bold"
            />
          </q-card-section>

          <!-- Detalhes expansíveis -->
          <q-expansion-item
            label="Ver detalhes da solicitação"
            header-class="text-deep-orange-6 text-caption text-weight-bold"
            dense
          >
            <q-card-section class="q-pt-none">
              <div class="row q-col-gutter-md">

                <div class="col-12">
                  <div class="section-title">Dados Pessoais</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-md-4"><info-item label="CPF" :value="s.cpf" /></div>
                    <div class="col-12 col-md-4"><info-item label="Nascimento" :value="s.birth_date" /></div>
                    <div class="col-12 col-md-4"><info-item label="Telefone" :value="s.phone" /></div>
                    <div class="col-12 col-md-6"><info-item label="E-mail" :value="s.email" /></div>
                    <div class="col-12 col-md-6"><info-item label="Ocupação" :value="s.occupation || '—'" /></div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="section-title">Endereço</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-md-6"><info-item label="Rua" :value="`${s.street}, ${s.number}`" /></div>
                    <div class="col-12 col-md-3"><info-item label="Bairro" :value="s.neighborhood" /></div>
                    <div class="col-12 col-md-3"><info-item label="Cidade/UF" :value="`${s.city}/${s.state}`" /></div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="section-title">Moradia</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-6 col-md-3"><info-item label="Tipo" :value="s.housing_type" /></div>
                    <div class="col-6 col-md-3"><info-item label="Posse" :value="s.ownership_type" /></div>
                    <div class="col-6 col-md-3"><info-item label="Moradores" :value="String(s.residents_count)" /></div>
                    <div class="col-12 col-md-3">
                      <div class="text-caption text-grey-6 text-uppercase">Condições</div>
                      <div class="text-body2 q-gutter-x-sm">
                        <q-badge v-if="s.has_yard" color="teal-2" text-color="teal-9" label="Tem pátio" />
                        <q-badge v-if="s.yard_secured" color="teal-2" text-color="teal-9" label="Pátio seguro" />
                        <q-badge v-if="s.has_children" color="blue-2" text-color="blue-9" label="Tem crianças" />
                      </div>
                    </div>
                    <div v-if="s.has_children && s.children_ages" class="col-12">
                      <info-item label="Idade das crianças" :value="s.children_ages" />
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="section-title">Experiência com Animais</div>
                  <div class="row q-col-gutter-sm">
                    <div class="col-6">
                      <info-item label="Já teve pets" :value="s.had_pets_before ? 'Sim' : 'Não'" />
                    </div>
                    <div class="col-6">
                      <info-item label="Tem pets atualmente" :value="s.currently_has_pets ? 'Sim' : 'Não'" />
                    </div>
                    <div v-if="s.currently_has_pets && s.current_pets_description" class="col-12">
                      <info-item label="Pets atuais" :value="s.current_pets_description" />
                    </div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="section-title">Motivação</div>
                  <info-item label="Por que deseja adotar?" :value="s.reason_for_adoption" />
                  <info-item label="Responsável pelo animal" :value="s.caretaker" class="q-mt-sm" />
                </div>

              </div>
            </q-card-section>
          </q-expansion-item>

          <!-- Ações (só aparecem se pendente) -->
          <q-card-actions v-if="s.status === 'pending'" align="right" class="q-px-md q-pb-md">
            <q-btn
              flat
              no-caps
              rounded
              color="negative"
              label="Rejeitar"
              :loading="s._loading"
              @click="atualizarStatus(s, 'rejected')"
            />
            <q-btn
              unelevated
              no-caps
              rounded
              color="positive"
              label="Aprovar"
              :loading="s._loading"
              @click="atualizarStatus(s, 'approved')"
            />
          </q-card-actions>

        </q-card>
      </div>

    </div>
</div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { Notify } from 'quasar'

// Componente inline simples para exibir label + valor
const InfoItem = defineComponent({
  props: { label: String, value: String },
  setup (props) {
    return () => h('div', [
      h('div', { class: 'text-caption text-grey-6 text-uppercase' }, props.label),
      h('div', { class: 'text-body2 text-grey-9' }, props.value || '—')
    ])
  }
})

const loading = ref(true)
const solicitacoes = ref([])
const filtroAtivo = ref('all')

const filtros = [
  { label: 'Todas', value: 'all', color: 'grey-7' },
  { label: 'Pendentes', value: 'pending', color: 'orange-7' },
  { label: 'Aprovadas', value: 'approved', color: 'positive' },
  { label: 'Rejeitadas', value: 'rejected', color: 'negative' }
]

const solicitacoesFiltradas = computed(() => {
  if (filtroAtivo.value === 'all') return solicitacoes.value
  return solicitacoes.value.filter(s => s.status === filtroAtivo.value)
})

onMounted(async () => {
  await carregarSolicitacoes()
})

async function carregarSolicitacoes () {
  loading.value = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await fetch('http://127.0.0.1:8000/adocoes/', {
      headers: { Authorization: `Token ${token}` }
    })
    if (response.ok) {
      const data = await response.json()
      solicitacoes.value = data.map(s => ({ ...s, _loading: false }))
    }
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error)
  } finally {
    loading.value = false
  }
}

async function atualizarStatus (solicitacao, novoStatus) {
  solicitacao._loading = true
  try {
    const token = localStorage.getItem('authToken')
    const response = await fetch(`http://127.0.0.1:8000/adocoes/${solicitacao.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({ status: novoStatus })
    })

    if (response.ok) {
      solicitacao.status = novoStatus
      Notify.create({
        type: novoStatus === 'approved' ? 'positive' : 'negative',
        message: novoStatus === 'approved' ? 'Solicitação aprovada!' : 'Solicitação rejeitada.'
      })
    } else {
      throw new Error()
    }
  } catch {
    Notify.create({ type: 'negative', message: 'Erro ao atualizar status.' })
  } finally {
    solicitacao._loading = false
  }
}

function formatarData (dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function statusLabel (status) {
  return { pending: 'Pendente', approved: 'Aprovada', rejected: 'Rejeitada' }[status] || status
}

function statusColor (status) {
  return { pending: 'orange-7', approved: 'positive', rejected: 'negative' }[status] || 'grey'
}
</script>

<style scoped>
.bg-cream {
  background-color: #f7f5ef;
}
.section-title {
  color: #d85a30;
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 8px;
  margin-top: 4px;
}
</style>