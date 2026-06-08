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

export async function buscarAnimaisBackEnd() {
  try {
    const response = await fetch('http://127.0.0.1:8000/animais/')
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.map(animal => ({
      id: animal.id,
      nome: animal.name,
      raca: animal.breed,
      sexo: animal.sex === 'M' ? 'Macho' : 'Fêmea',
      idade: calcularIdade(animal.birth_date),
      tags: animal.characteristic.slice(0, 2),
      imagem: animal.photo || `https://placehold.co/400x400?text=${animal.name}`
    }))
    
  } catch (error) {
    console.error('Erro na requisição fetch:', error)
    return []
  }
}