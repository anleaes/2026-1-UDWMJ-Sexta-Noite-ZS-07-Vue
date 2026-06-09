const BASE_URL = 'http://127.0.0.1:8000/funcionarios/' 

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Token ${token}`
  }
}

export const buscarFuncionarios = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar a lista de funcionários.')
  }

  return await response.json()
}

export const cadastrarFuncionario = async (dadosFuncionario) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      username: dadosFuncionario.username,
      email: dadosFuncionario.email,
      password: dadosFuncionario.password,
      first_name: dadosFuncionario.first_name,
      last_name: dadosFuncionario.last_name,
      cpf: dadosFuncionario.cpf,
      position: dadosFuncionario.position,
      birth_date: dadosFuncionario.birth_date,
      hire_date: dadosFuncionario.hire_date
    })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar funcionário.')
  return data
}

export const alterarCargoFuncionario = async (id, position, role) => {
  const response = await fetch(`${BASE_URL}${id}/alterar_cargo/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ position: position, role: role })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao alterar o cargo.')
  return data
}

export const alterarUsernameFuncionario = async (id, novoUsername) => {
  const response = await fetch(`${BASE_URL}${id}/alterar_username/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ username: novoUsername })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao alterar o utilizador.')
  return data
}

export const alterarSenhaFuncionario = async (id, novaSenha) => {
  const response = await fetch(`${BASE_URL}${id}/alterar_senha/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ new_password: novaSenha })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao redefinir a palavra-passe.')
  return data
}

export const atualizarStatusFuncionario = async (id, is_active) => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ is_active: is_active })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Erro ao guardar o status do funcionário.')
  }
  return await response.json()
}