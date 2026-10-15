export type Pregunta = {
  texto: string
  opciones: string[]
  correcta: number
  explicacion: string
}

export const PREGUNTAS: Record<string, Pregunta[]> = {
  // 1. Guacamaya cariseca
  pajaro1: [
    {
      texto: 'Cual es el nombre cientifico de la Guacamaya Cariseca?',
      opciones: ['Megaceryle torquata', 'Ara severus', 'Rupornis magnirostris'],
      correcta: 1,
      explicacion: 'Su nombre cientifico es Ara severus.',
    },
    {
      texto: 'Cual es el color predominante de su plumaje?',
      opciones: ['Verde', 'Azul', 'Amarillo'],
      correcta: 0,
      explicacion: 'Su plumaje es principalmente verde.',
    },
    {
      texto: 'Que color tiene la parte inferior de sus alas?',
      opciones: ['Blanca', 'Negra', 'Rojiza'],
      correcta: 2,
      explicacion: 'La parte inferior de sus alas es rojiza y se aprecia durante el vuelo.',
    },
    {
      texto: 'Como suele encontrarse esta guacamaya?',
      opciones: ['Siempre sola', 'En parejas o pequenas bandadas', 'En grandes grupos acuaticos'],
      correcta: 1,
      explicacion: 'Suele encontrarse en parejas o pequenas bandadas.',
    },
  ],

  // 2. Petirrojo o Pechirrojo
  pajaro2: [
    {
      texto: Que color destaca en el macho adulto?',
      opciones: ['Azul', 'Rojo', 'Verde'],
      correcta: 1,
      explicacion: 'El macho adulto tiene la cabeza y las partes inferiores de color rojo vivo.',
    },
    {
      texto: 'De que se alimenta principalmente?',
      opciones: ['Insectos', 'Semillas', 'Peces'],
      correcta: 0,
      explicacion: 'Su alimentacion se basa principalmente en insectos.',
    },
    {
      texto: 'En que habitats se encuentra?',
      opciones: ['Desiertos', 'Aguas profundas', 'Bosques abiertos y zonas con maleza'],
      correcta: 2,
      explicacion: 'Habita en bosques abiertos y areas con arbustos.',
    },
    {
      texto: 'Donde suele posarse?',
      opciones: ['En postes junto a las carreteras', 'Bajo el agua', 'En cuevas profundas'],
      correcta: 0,
      explicacion: 'Suele posarse en postes de cercas junto a las carreteras.',
    },
  ],

  // 3. Colibri Colirufo
  pajaro3: [
    {
      texto: 'Que color tiene la cola del Colibri Colirufo?',
      opciones: ['Blanca', 'Canela', 'Negra'],
      correcta: 1,
      explicacion: 'Una de sus caracteristicas es su cola de color canela.',
    },
    {
      texto: 'Que lugares prefiere habitar?',
      opciones: ['Desiertos secos', 'Mar abierto', 'Jardines y bordes de bosque'],
      correcta: 2,
      explicacion: 'Prefiere los bordes de bosque, la vegetacion secundaria y los jardines.',
    },
    {
      texto: 'Donde suele alimentarse?',
      opciones: ['En diferentes alturas de la vegetacion', 'Solo en el suelo', 'Bajo el agua'],
      correcta: 0,
      explicacion: 'Busca alimento desde las partes bajas hasta las altas de la vegetacion.',
    },
    {
      texto: 'Que suele visitar para alimentarse?',
      opciones: ['Cuevas', 'Comederos para colibries', 'Nidos de otras aves'],
      correcta: 1,
      explicacion: 'Con frecuencia visita comederos para colibries.',
    },
  ],

  // 4. Gavilan o Pigua
  pajaro4: [
    {
      texto: 'Cual es el nombre cientifico del Gavilan o Pigua?',
      opciones: ['Milvago chimachima', 'Ara severus', 'Amazilia tzacatl'],
      correcta: 0,
      explicacion: 'Su nombre cientifico es Milvago chimachima.',
    },
    {
      texto: 'De que color es principalmente el adulto?',
      opciones: ['Verde brillante', 'Beige palido', 'Rojo intenso'],
      correcta: 1,
      explicacion: 'El adulto presenta un plumaje principalmente beige pálido.',
    },
    {
      texto: 'En que lugares suele encontrarse?',
      opciones: ['En aguas profundas', 'En cuevas oscuras', 'En pastizales y bordes de rios'],
      correcta: 2,
      explicacion: 'Habita en espacios abiertos, como pastizales y bordes de rios.',
    },
    {
      texto: 'Como son sus vocalizaciones?',
      opciones: ['Chirriantes', 'Silenciosas', 'Silbidos melodicos suaves'],
      correcta: 0,
      explicacion: 'Sus vocalizaciones se describen como sonidos chirriantes.',
    },
  ],

  // 5. Martin Pescador
  pajaro5: [
    {
      texto: '¿Cual es el nombre cientifico del Martin Pescador?',
      opciones: ['Ara severus', 'Megaceryle torquata', 'Pyrocephalus rubinus'],
      correcta: 1,
      explicacion: 'Su nombre cientifico es Megaceryle torquata.',
    },
    {
      texto: 'A que orden pertenece?',
      opciones: ['Coraciiformes', 'Psittaciformes', 'Passeriformes'],
      correcta: 0,
      explicacion: 'Segun la guia, pertenece al orden Coraciiformes.',
    },
    {
      texto: 'A qu feamilia pertenece?',
      opciones: ['Trochilidae', 'Accipitridae', 'Cerylidae'],
      correcta: 2,
      explicacion: 'Esta clasificado dentro de la familia Cerylidae.',
    },
    {
      texto: 'Cual es su nombre en ingles?',
      opciones: ['Chestnut-fronted Macaw', 'Ringed Kingfisher', 'Vermilion Flycatcher'],
      correcta: 1,
      explicacion: 'En ingles se conoce como Ringed Kingfisher.',
    },
  ],
}