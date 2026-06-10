const BASE_URL = 'http://127.0.0.1:8000/adotantes/' 

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Token ${token}`
  }
}

export const buscarClientes = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar a lista de clientes.')
  }

  return await response.json()
}

export const cadastrarCliente = async (dadosCliente) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      username: dadosCliente.username,
      email: dadosCliente.email,
      password: dadosCliente.password,
      first_name: dadosCliente.first_name,
      last_name: dadosCliente.last_name,
      cpf: dadosCliente.cpf,
      address: dadosCliente.address,
      yard_security: dadosCliente.yard_security || false,
      addressComprove: dadosCliente.addressComprove || false,
      checkedData: dadosCliente.checkedData || false
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao cadastrar o cliente.')
  }

  return data
}

export const alterarUsernameCliente = async (id, novoUsername) => {
  const response = await fetch(`${BASE_URL}${id}/alterar_username/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ username: novoUsername })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao alterar o utilizador.')
  return data
}

export const alterarSenhaCliente = async (id, novaSenha) => {
  const response = await fetch(`${BASE_URL}${id}/alterar_senha/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ new_password: novaSenha })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao redefinir a palavra-passe.')
  return data
}

export const alterarEnderecoCliente = async (id, novoEndereco) => {
  const response = await fetch(`${BASE_URL}${id}/alterar_endereco/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ address: novoEndereco })
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro ao alterar a morada.')
  return data
}

export const atualizarStatusCliente = async (id, statusData) => {
  const response = await fetch(`${BASE_URL}${id}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(statusData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Erro ao guardar o status do cliente.')
  }

  return await response.json()
}