const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return 'Idade desconhecida'
  
  const hoje = new Date()
  const nascimento = new Date(dataNascimento)

  let totalMonths = (hoje.getFullYear() - nascimento.getFullYear()) * 12 + (hoje.getMonth() - nascimento.getMonth())
  
  if (hoje.getDate() < nascimento.getDate()) {
    totalMonths--
  }
  
  if (totalMonths >= 12) {
    const years = Math.floor(totalMonths / 12)
    return `${years} ${years > 1 ? 'anos' : 'ano'}`
  } else if (totalMonths > 0) {
    return `${totalMonths} ${totalMonths > 1 ? 'meses' : 'mês'}`
  } else {
    return 'Menos de 1 mês'
  }
}

function mapearAnimal(animal) {
  let listaVacinas = [];
  
  if (animal.vaccine_history && Array.isArray(animal.vaccine_history)) {
    animal.vaccine_history.forEach(evento => {
      
      let dataFormatada = '-';
      if (evento.vaccinatedAt) {
        const [ano, mes, dia] = evento.vaccinatedAt.split('-');
        dataFormatada = `${dia}/${mes}/${ano}`;
      }

      if (evento.itens && Array.isArray(evento.itens)) {
        evento.itens.forEach(item => {
          if (item.vaccine_info && item.vaccine_info.name) {
            
            listaVacinas.push({
              nome: item.vaccine_info.name,
              descricao: item.vaccine_info.description || 'Sem descrição',
              data: dataFormatada
            });
            
          }
        });
      }
    });
  }

  return {
    id: animal.id,
    nome: animal.name,
    raca: animal.breed_name,
    especie: animal.species,
    cor: animal.color,
    sexo: animal.sex === 'M' ? 'Macho' : 'Fêmea',
    castrado: animal.sterilized,
    porte: animal.size === 'P' ? 'Pequeno' : (animal.size === 'M' ? 'Médio' : 'Grande'),
    data_nascimento: animal.birth_date,
    data_listagem: animal.listedAt,
    idade: calcularIdade(animal.birth_date),
    tempo_abrigo: calcularIdade(animal.listedAt),
    characteristics: animal.characteristic,
    vacinas: listaVacinas,
    imagem: animal.photo || `https://placehold.co/400x400?text=${animal.name}`,
    adotado: animal.adopted 
  }
}
export async function buscarAnimais() {
  try {
    const response = await fetch('http://127.0.0.1:8000/animais/')
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    return data.map(animal => mapearAnimal(animal))
    
  } catch (error) {
    console.error('Erro na requisição fetch:', error)
    return []
  }
}

export async function buscarAnimalPorId(id) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/animais/${id}/`)
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
    
    const data = await response.json()
    return mapearAnimal(data) 
    
  } catch (error) {
    console.error(`Erro ao buscar o animal com ID ${id}:`, error)
    return null
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