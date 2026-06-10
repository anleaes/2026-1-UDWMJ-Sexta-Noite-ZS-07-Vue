<template>
  <q-page class="bg-cream q-pa-md q-pa-md-xl">
    <div class="q-mx-auto" style="max-width: 1100px;">

      <div class="text-h5 text-weight-bold text-dark q-mb-xs">Minhas Solicitações</div>
      <div class="text-caption q-mb-lg" style="color: #d85a30;">
        Acompanhe o status das suas solicitações de adoção.
      </div>

      <div v-if="loading" class="flex flex-center q-py-xl">
        <q-spinner color="deep-orange-6" size="3rem" />
      </div>

      <div v-else-if="solicitacoes.length === 0" class="text-center q-py-xl">
        <q-icon name="pets" size="4rem" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">Nenhuma solicitação encontrada.</div>
        <div class="text-body2 text-grey-5 q-mb-lg">Você ainda não solicitou nenhuma adoção.</div>
        <q-btn @click="$router.push('/animais')" label="Ver animais disponíveis" color="deep-orange-6" rounded unelevated no-caps />
      </div>

      <div v-else class="q-gutter-md">
        <q-card
          v-for="s in solicitacoes"
          :key="s.id"
          bordered
          class="no-shadow q-pa-md"
          style="border-radius: 8px;"
        >
          <div class="row items-center q-col-gutter-md">

            <div class="col-12 col-md-auto">
              <q-avatar size="56px" color="orange-1">
                <q-icon name="pets" color="deep-orange-6" size="28px" />
              </q-avatar>
            </div>

            <div class="col">
              <div class="text-weight-bold text-grey-9 text-body1">{{ s.animal_name }}</div>
              <div class="text-caption text-grey-6">
                Solicitado em {{ formatarData(s.submitted_at) }}
              </div>
            </div>

            <div class="col-12 col-md-auto row items-center q-gutter-sm">
              <q-chip
                :color="statusColor(s.status)"
                text-color="white"
                :label="statusLabel(s.status)"
                size="sm"
                class="text-weight-bold"
              />

              <q-btn
                v-if="s.status === 'approved' && s.adoption_term"
                flat
                dense
                no-caps
                color="deep-orange-6"
                icon="download"
                label="Baixar termo"
                :href="s.adoption_term.document"
                target="_blank"
              />
            </div>

          </div>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const solicitacoes = ref([])

onMounted(async () => {
  try {
    const token = localStorage.getItem('authToken')
    const response = await fetch('http://127.0.0.1:8000/adocoes/minhas/', {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    if (response.ok) {
      solicitacoes.value = await response.json()
    }
  } catch (error) {
    console.error('Erro ao buscar solicitações:', error)
  } finally {
    loading.value = false
  }
})

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
</style>