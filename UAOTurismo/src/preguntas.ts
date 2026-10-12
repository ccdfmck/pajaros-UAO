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
    // más preguntas...
  ],
  pajaro2: [],
  pajaro3: [],
  pajaro4: [],
  pajaro5: [],
}