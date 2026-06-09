const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return 'Idade desconhecida'
  
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const m = hoje.getMonth() - nascimento.getMonth()
  
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  
  if (idade === 0) return 'Menos de 1 ano'
  return `${idade} ano${idade > 1 ? 's' : ''}`
}

export async function buscarAnimais() {
  try {
    const response = await fetch('http://127.0.0.1:8000/animais/')
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.map(animal => ({
      id: animal.id,
      nome: animal.name,
      raca: animal.breed_name,
      especie: animal.species,
      sexo: animal.sex === 'M' ? 'Macho' : 'Fêmea',
      castrado: animal.sterilized,
      porte: animal.size === 'P' ? 'Pequeno' : (animal.size === 'M' ? 'Médio' : 'Grande'),
      data_nascimento: animal.birth_date,
      data_listagem: animal.listedAt,
      idade: calcularIdade(animal.birth_date),
      characteristics: animal.characteristic,
      imagem: animal.photo || `https://placehold.co/400x400?text=${animal.name}`,
      adotado: animal.adopted
    }))
    
  } catch (error) {
    console.error('Erro na requisição fetch:', error)
    return []
  }
}

export async function atualizarStatusAnimal(id, statusData) {
  const response = await fetch(`http://127.0.0.1:8000/animais/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(statusData)
  })
  if (!response.ok) throw new Error('Erro ao atualizar animal')
  return await response.json()
}

export async function cadastrarAnimal(formData) {
  const response = await fetch('http://127.0.0.1:8000/animais/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${localStorage.getItem('authToken')}`
    },
    body: formData
  })
  if (!response.ok) throw new Error('Erro ao cadastrar animal')
  return await response.json()
}