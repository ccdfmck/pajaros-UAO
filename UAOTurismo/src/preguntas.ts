export type Pregunta = {
  texto: string
  opciones: string[]
  correcta: number      // posición de la opción correcta (0, 1, 2...)
  explicacion: string
}

export const PREGUNTAS: Record<string, Pregunta[]> = {
  // 1. Guacamaya cariseca
  pajaro1: [
    {
      texto: '¿De qué color es casi todo su cuerpo?',
      opciones: ['Verde', 'Rojo', 'Azul'],
      correcta: 0,
      explicacion: 'Es mayormente verde, con la cara blancuzca.',
    },
    {
      texto: '¿Cuándo se ve el rojo de sus alas?',
      opciones: ['Cuando está posada', 'Cuando vuela', 'Solo de noche'],
      correcta: 1,
      explicacion: 'El rojizo está en la parte de abajo de las alas y solo se ve en vuelo.',
    },
    {
      texto: '¿Cómo suele encontrarse?',
      opciones: ['Siempre sola', 'Solo en cuevas', 'En parejas o pequeñas bandadas'],
      correcta: 2,
      explicacion: 'Se ve en parejas o en pequeñas bandadas.',
    },
    {
      texto: '¿Cómo es su voz?',
      opciones: ['Un canto suave', 'Llamadas muy ásperas', 'No hace sonidos'],
      correcta: 1,
      explicacion: 'Se reconoce por sus llamadas muy ásperas.',
    },
  ],

  // 2. Pechirrojo
  pajaro2: [
    {
      texto: '¿De qué color es el pecho del macho?',
      opciones: ['Amarillo', 'Azul', 'Rojo vivo'],
      correcta: 2,
      explicacion: 'El macho tiene el pecho y la cabeza de un rojo muy vivo.',
    },
    {
      texto: '¿De qué se alimenta principalmente?',
      opciones: ['Insectos', 'Peces', 'Carne de animales grandes'],
      correcta: 0,
      explicacion: 'Es un ave insectívora.',
    },
    {
      texto: '¿Cómo caza?',
      opciones: ['Cavando el suelo', 'Al vuelo, desde una rama', 'Buceando'],
      correcta: 1,
      explicacion: 'Espera en una rama y sale a atrapar insectos al vuelo.',
    },
    {
      texto: '¿Cómo es la hembra?',
      opciones: ['Igual de roja', 'Completamente azul', 'Pardo grisácea'],
      correcta: 2,
      explicacion: 'La hembra es de tonos pardo grisáceos, mucho menos llamativa que el macho.',
    },
  ],

  // 3. Colibrí cola azul
  pajaro3: [
    {
      texto: '¿De qué se alimenta principalmente?',
      opciones: ['Néctar de flores', 'Semillas duras', 'Peces'],
      correcta: 0,
      explicacion: 'Se alimenta sobre todo del néctar de las flores.',
    },
    {
      texto: '¿Qué puede hacer en el aire?',
      opciones: ['Dormir volando', 'Quedarse quieto', 'Volar bajo el agua'],
      correcta: 1,
      explicacion: 'Bate las alas decenas de veces por segundo y se queda quieto en el aire.',
    },
    {
      texto: '¿Qué tamaño tiene?',
      opciones: ['Es del tamaño de un águila', 'Es más grande que un loro', 'Es de las aves más pequeñas'],
      correcta: 2,
      explicacion: 'Los colibríes están entre las aves más pequeñas que existen.',
    },
    {
      texto: '¿Con qué toma el néctar?',
      opciones: ['Con una lengua larga', 'Con las patas', 'Con la cola'],
      correcta: 0,
      explicacion: 'Usa su lengua larga y delgada para sacar el néctar.',
    },
  ],

  // 4. Gavilán caminero
  pajaro4: [
    {
      texto: '¿De qué se alimenta?',
      opciones: ['Solo frutas', 'Solo néctar', 'Animales pequeños que caza'],
      correcta: 2,
      explicacion: 'Es un ave rapaz: caza animales pequeños, como lagartijas e insectos grandes.',
    },
    {
      texto: '¿Por qué se le llama "caminero"?',
      opciones: ['Camina todo el día', 'Se posa a la orilla de caminos', 'Vive en cuevas'],
      correcta: 1,
      explicacion: 'Suele posarse a la orilla de caminos y zonas abiertas.',
    },
    {
      texto: '¿Qué tipo de ave es?',
      opciones: ['Rapaz que caza de día', 'Ave nocturna', 'Ave acuática'],
      correcta: 0,
      explicacion: 'Es una rapaz diurna: caza durante el día.',
    },
    {
      texto: '¿Qué usa para atrapar a sus presas?',
      opciones: ['Su canto', 'Una red', 'Sus garras afiladas'],
      correcta: 2,
      explicacion: 'Las atrapa con sus garras fuertes y afiladas.',
    },
  ],

  // 5. Martín pescador
  pajaro5: [
    {
      texto: '¿Cómo atrapa a sus presas?',
      opciones: ['Cavando bajo tierra', 'Lanzándose en picada al agua', 'Esperando en el suelo'],
      correcta: 1,
      explicacion: 'Se lanza en picada al agua para atrapar peces con el pico.',
    },
    {
      texto: '¿De qué se alimenta principalmente?',
      opciones: ['Peces pequeños', 'Semillas', 'Néctar'],
      correcta: 0,
      explicacion: 'Su alimento principal son los peces pequeños.',
    },
    {
      texto: '¿Qué usa para pescar?',
      opciones: ['Una red de plumas', 'Patas palmeadas', 'Su pico largo y fuerte'],
      correcta: 2,
      explicacion: 'Su pico largo y fuerte le sirve para atrapar a los peces.',
    },
    {
      texto: '¿Dónde se le ve con más frecuencia?',
      opciones: ['Cerca de ríos y lagos', 'En desiertos', 'En cimas nevadas'],
      correcta: 0,
      explicacion: 'Vive cerca del agua: ríos, quebradas y lagos.',
    },
  ],
}