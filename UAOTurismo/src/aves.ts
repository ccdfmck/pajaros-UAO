export type Ave = {
  nombre: string
  cientifico: string
  dato: string
  emoji: string
  color: string   // color de fondo de la tarjeta
}

// Reemplacen estos datos por los 5 pajaros reales de la universidad
export const AVES: Ave[] = [
  {
    nombre: 'Guacamaya cariseca',
    cientifico: 'Ara severus',
    dato: 'Es pequena para un guacamayo, y el rojo de sus alas solo se ve cuando vuela.',
    emoji: '🦜',
    color: '#2a9d8f',
  },
  {
    nombre: 'Pechirrojo',
    cientifico: 'Pyrocephalus rubinus',
    dato: 'El macho es rojo vivo y la hembra pardo grisacea. Caza insectos al vuelo desde una rama.',
    emoji: '🐦',
    color: '#e76f51',
  },
  {
    nombre: 'Colibri cola azul',
    cientifico: 'Saucerottia saucerottei',   // CONFIRMAR
    dato: 'Aletea decenas de veces por segundo y puede quedarse quieto en el aire mientras toma néctar.',
    emoji: '🐦',
    color: '#457b9d',
  },
  {
    nombre: 'Gavilan caminero',
    cientifico: 'Rupornis magnirostris',      // CONFIRMAR
    dato: 'Se llama "caminero" porque suele posarse a la orilla de caminos y zonas abiertas, vigilando a sus presas.',
    emoji: '🦅',
    color: '#8d6a9f',
  },
  {
    nombre: 'Martin pescador',
    cientifico: 'Megaceryle torquata o Chloroceryle americana',   // CONFIRMAR cual es
    dato: 'Se lanza en picada al agua para atrapar peces con el pico.',
    emoji: '🐟',
    color: '#bc6c25',
  },
]