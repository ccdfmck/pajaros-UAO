import * as ecs from '@8thwall/ecs'
import {PREGUNTAS} from './preguntas'
import {estado} from './estado'

type Registro = {
  clics: Array<{eid: any; fn: () => void}>
  abrir: (e: any) => void
  cerrar: () => void
}
const registros = new Map<bigint, Registro>()

ecs.registerComponent({
  name: 'quiz-nativo',
  schema: {
    pajaro: ecs.string,    // pajaro1, pajaro2...
    pregunta: ecs.eid,     // texto de la pregunta
    opcion1: ecs.eid,      // botones de respuesta
    opcion2: ecs.eid,
    opcion3: ecs.eid,
    feedback: ecs.eid,     // texto "Correcto / Incorrecto"
    siguiente: ecs.eid,    // botón Siguiente
    cerrarBtn: ecs.eid,    // botón X
  },
  schemaDefaults: {
    pajaro: 'pajaro1',
  },
  add: (world, component) => {
    const s = component.schema
    const preguntas = PREGUNTAS[s.pajaro] ?? []
    const opciones: any[] = [s.opcion1, s.opcion2, s.opcion3]

    let indice = 0
    let puntaje = 0
    let respondida = false
    let terminado = false

    // --- Ayudas para cambiar texto y mostrar/ocultar ---
    const poner = (eid: any, texto: string) => {
      if (!eid) return
      ecs.Ui.mutate(world, eid, (cursor) => {
        cursor.text = texto
        return false
      })
    }
    const mostrar = (eid: any) => { if (eid) ecs.Hidden.remove(world, eid) }
    const ocultar = (eid: any) => { if (eid) ecs.Hidden.set(world, eid, {}) }

    // --- Pantallas del quiz ---
    const mostrarPregunta = () => {
      respondida = false
      terminado = false
      const p = preguntas[indice]
      poner(s.pregunta, `${indice + 1}/${preguntas.length}  ${p.texto}`)
      opciones.forEach((eid, i) => {
        if (i < p.opciones.length) {
          poner(eid, p.opciones[i])
          mostrar(eid)
        } else {
          ocultar(eid)
        }
      })
      ocultar(s.feedback)
      ocultar(s.siguiente)
    }

    const responder = (i: number) => {
      if (respondida || terminado) return
      const p = preguntas[indice]
      respondida = true
      const acierto = i === p.correcta
      if (acierto) puntaje++
      poner(s.feedback, (acierto ? '¡Correcto! ' : 'Incorrecto. ') + p.explicacion)
      mostrar(s.feedback)
      poner(s.siguiente, indice === preguntas.length - 1 ? 'Ver resultado' : 'Siguiente')
      mostrar(s.siguiente)
    }

    const avanzar = () => {
      if (terminado) {            // botón "Intentar de nuevo"
        indice = 0
        puntaje = 0
        mostrarPregunta()
        return
      }
      if (!respondida) return
      indice++
      if (indice >= preguntas.length) {
        terminado = true
        poner(s.pregunta, `¡Terminaste! Puntaje: ${puntaje}/${preguntas.length}`)
        for (const eid of opciones) ocultar(eid)
        ocultar(s.feedback)
        poner(s.siguiente, 'Intentar de nuevo')
        mostrar(s.siguiente)
        return
      }
      mostrarPregunta()
    }

    const cerrar = () => ocultar(component.eid)

    const abrir = (e: any) => {
      if (estado.menuAbierto) return          // no abrir si el menú está abierto
      if (e.data.pajaro !== s.pajaro) return  // solo el panel de ESTE pájaro
      indice = 0
      puntaje = 0
      mostrar(component.eid)
      if (preguntas.length === 0) {
        poner(s.pregunta, 'Pronto habrá preguntas para esta ave.')
        for (const eid of opciones) ocultar(eid)
        ocultar(s.feedback)
        ocultar(s.siguiente)
        return
      }
      mostrarPregunta()
    }

    // --- Conectar los clics de los botones ---
    const clics: Array<{eid: any; fn: () => void}> = []
    const escuchar = (eid: any, fn: () => void) => {
      if (!eid) return
      world.events.addListener(eid, ecs.input.UI_CLICK, fn)
      clics.push({eid, fn})
    }
    escuchar(s.opcion1, () => responder(0))
    escuchar(s.opcion2, () => responder(1))
    escuchar(s.opcion3, () => responder(2))
    escuchar(s.siguiente, avanzar)
    escuchar(s.cerrarBtn, cerrar)

    world.events.addListener(world.events.globalId, 'abrir-quiz', abrir)
    world.events.addListener(world.events.globalId, 'cerrar-quiz', cerrar)
    registros.set(component.eid, {clics, abrir, cerrar})

    ocultar(component.eid)   // el panel empieza oculto
  },
  remove: (world, component) => {
    const r = registros.get(component.eid)
    if (!r) return
    for (const c of r.clics) world.events.removeListener(c.eid, ecs.input.UI_CLICK, c.fn)
    world.events.removeListener(world.events.globalId, 'abrir-quiz', r.abrir)
    world.events.removeListener(world.events.globalId, 'cerrar-quiz', r.cerrar)
    registros.delete(component.eid)
  },
})