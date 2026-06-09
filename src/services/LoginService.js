import { ref } from 'vue'

export const isLoggedIn = ref(false)
export const userName = ref('')

export const atualizarEstadoLogin = () => {
  const token = localStorage.getItem('authToken')
  const user = localStorage.getItem('authUsername')

  if (token) {
    isLoggedIn.value = true
    userName.value = user
  } else {
    isLoggedIn.value = false
    userName.value = ''
  }
}

export const fazerLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('authUsername')
  
  isLoggedIn.value = false
  userName.value = ''
}

export const fazerLogin = async (username, password) => {
  const response = await fetch('http://127.0.0.1:8000/contas/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao realizar login')
  }

  localStorage.setItem('authToken', data.token)
  localStorage.setItem('authUsername', data.username)

  atualizarEstadoLogin()

  return data
}