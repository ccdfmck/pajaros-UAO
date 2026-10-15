export type Pregunta = {
  texto: string
  opciones: string[]
  correcta: number      // posición de la opción correcta (0, 1, 2...)
  explicacion: string
}

export const PREGUNTAS: Record<string, Pregunta[]> = {
  pajaro1: [
    {
      texto: '¿Qué come principalmente este pájaro?',
      opciones: ['Semillas', 'Insectos', 'Peces'],
      correcta: 1,
      explicacion: 'Es insectívoro: se alimenta sobre todo de insectos.',
    },
    {
      texto: 'Segunda pregunta aquí',
      opciones: ['Opción A', 'Opción B', 'Opción C'],
      correcta: 0,
      explicacion: 'Explicación corta de por qué es correcta.',
    },
    {
      texto: 'Tercera pregunta aquí',
      opciones: ['Opción A', 'Opción B', 'Opción C'],
      correcta: 2,
      explicacion: 'Explicación corta.',
    },
    {
      texto: 'Cuarta pregunta aquí',
      opciones: ['Opción A', 'Opción B', 'Opción C'],
      correcta: 1,
      explicacion: 'Explicación corta.',
    }
  ],
  pajaro2: [],
  pajaro3: [],
  pajaro4: [],
  pajaro5: [],
}