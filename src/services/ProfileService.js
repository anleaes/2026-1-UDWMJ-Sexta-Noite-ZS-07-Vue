const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Token ${token}`
  }
}

export const buscarMeuPerfil = async (role) => {
  const endpoint = role === 'user' ? 'adotantes' : 'funcionarios'
  
  const response = await fetch(`http://127.0.0.1:8000/${endpoint}/me/`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados do seu perfil.')
  }
  return await response.json()
}

export const atualizarMeuPerfil = async (role, id, dados) => {
  const endpoint = role === 'user' ? 'adotantes' : 'funcionarios'

  const response = await fetch(`http://127.0.0.1:8000/${endpoint}/${id}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(dados)
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao atualizar informações.')
  return data
}

export const alterarMinhaSenha = async (role, id, novaSenha) => {
  const endpoint = role === 'user' ? 'adotantes' : 'funcionarios'

  const response = await fetch(`http://127.0.0.1:8000/${endpoint}/${id}/alterar_senha/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ new_password: novaSenha })
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Erro ao alterar a senha.')
  }
}

export const alterarMeuUsuario = async (role, id, novoUsername) => {
  const endpoint = role === 'user' ? 'adotantes' : 'funcionarios'
  
  const response = await fetch(`http://127.0.0.1:8000/${endpoint}/${id}/alterar_username/`, {
    method: 'PATCH', 
    headers: getAuthHeaders(),
    body: JSON.stringify({ username: novoUsername })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao alterar o utilizador.')
  return data
}