import * as ecs from '@8thwall/ecs'

type Comida = 'flor' | 'bebedero' | 'insectos' | 'pan'

const TODAS: Comida[] = ['flor', 'bebedero', 'insectos', 'pan']

type Estado = {
  probadas: Set<Comida>
  oyente: (e: any) => void
}

const estados = new Map<bigint, Estado>()

ecs.registerComponent({
  name: 'juego-alimentar',
  schema: {
    juego: ecs.string,
    textoMensaje: ecs.eid,
    textoInicio: ecs.string,
    textoFlor: ecs.string,
    textoBebedero: ecs.string,
    textoInsectos: ecs.string,
    textoPan: ecs.string,
    textoFinal: ecs.string,
  },
  schemaDefaults: {
    juego: 'colibri',
    textoInicio:
      'El colibrí coliazul come solo, casi siempre en flores del borde del bosque, arbustos y jardines. Arrastra hasta él lo que le darías de comer.',
    textoFlor:
      '¡Perfecto! Las flores son su comida principal. Con su pico recto, de largo medio, bebe el néctar que le da energía para volar.',
    textoBebedero:
      'Le sirve, pero la flor es mejor. En los jardines se usa agua con azúcar blanca (1 parte de azúcar por 4 de agua, sin miel ni colorantes) y el bebedero se lava seguido.',
    textoInsectos:
      'También es correcto. Además del néctar captura insectos y arañas diminutas, que le dan la proteína que el néctar no tiene.',
    textoPan:
      'No. El pan no es alimento para aves: llena sin nutrir y puede enfermarlo. Lo que necesita es néctar de flores y algunos insectos.',
    textoFinal:
      'Ya probaste todo. El coliazul vive del néctar (flores, y bebederos bien preparados) y lo complementa con insectos. El pan no es para él.',
  },
  add: (world, component) => {
    // copiamos TODO al iniciar
    const juego = component.schema.juego
    const eid = component.eid
    const msgEid = component.schema.textoMensaje
    const inicio = component.schema.textoInicio
    const final = component.schema.textoFinal
    const textos: Record<Comida, string> = {
      flor: component.schema.textoFlor,
      bebedero: component.schema.textoBebedero,
      insectos: component.schema.textoInsectos,
      pan: component.schema.textoPan,
    }
    console.log('juego-alimentar listo:', juego)

    const mostrar = (texto: string) => {
      ecs.Ui.set(world, msgEid, {text: texto})
    }

    const s: Estado = {probadas: new Set<Comida>(), oyente: () => {}}

    const iniciar = () => {
      s.probadas.clear()
      mostrar(inicio)
    }

    const elegir = (c: Comida) => {
      if (!textos[c]) return
      s.probadas.add(c)
      let msg = textos[c]
      if (s.probadas.size >= TODAS.length) {
        msg += '  ' + final + ' Toca Reiniciar para volver a empezar.'
      } else {
        msg += '  (Has probado ' + s.probadas.size + ' de ' + TODAS.length + ')'
      }
      mostrar(msg)
    }

    s.oyente = (ev: any) => {
      const d = ev.data
      if (!d || d.juego !== juego) return
      if (d.accion === 'comida') {
        elegir(d.valor as Comida)
      } else if (d.accion === 'lejos') {
        mostrar('Acércala más al colibrí para dársela.')
      } else if (d.accion === 'reiniciar') {
        iniciar()
      }
    }

    estados.set(eid, s)
    world.events.addListener(world.events.globalId, 'comida-boton', s.oyente)
    iniciar()
  },
  remove: (world, component) => {
    const s = estados.get(component.eid)
    if (s) world.events.removeListener(world.events.globalId, 'comida-boton', s.oyente)
    estados.delete(component.eid)
  },
})