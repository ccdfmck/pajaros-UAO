export type Parte = {titulo: string; texto: string}

export const PARTES: Record<string, Record<string, Parte>> = {
  guacamaya: {
    pico: {
      titulo: 'Pico',
      texto: 'Fuerte y en forma de gancho, como el de los guacamayos. Le sirve para romper semillas y trepar.',
    },
    cara: {
      titulo: 'Cara',
      texto: 'Su cara es blancuzca. Es una de las marcas que mejor ayudan a reconocerla.',
    },
    alas: {
      titulo: 'Alas',
      texto: 'Por arriba son verdes, pero por debajo son rojizas. Ese color solo se ve cuando vuela.',
    },
    cuerpo: {
      titulo: 'Cuerpo',
      texto: 'Es casi toda verde. Es pequeña para un guacamayo, pero más grande que cualquier perico de cola larga.',
    },
    patas: {
      titulo: 'Patas',
      texto: 'Tienen dos dedos hacia adelante y dos hacia atrás, y con ellas agarra frutos y semillas.',
    },
  },
}