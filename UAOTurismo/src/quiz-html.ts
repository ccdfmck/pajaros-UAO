import * as ecs from '@8thwall/ecs'
import {PREGUNTAS} from './preguntas'
import {estado} from './estado'

type Registro = {
  panel: HTMLElement
  abrir: (e: any) => void
  cerrar: () => void
}
const registros = new Map<bigint, Registro>()

const BOTON = 'display:block;width:100%;margin:6px 0;padding:12px;font-size:16px;border-radius:10px;border:none;'

ecs.registerComponent({
  name: 'quiz-html',
  add: (world, component) => {
    const panel = document.createElement('div')
    panel.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;max-height:60vh;overflow:auto;' +
      'padding:16px;box-sizing:border-box;background:rgba(0,0,0,0.88);color:white;' +
      'font-family:sans-serif;z-index:1000;display:none;border-radius:16px 16px 0 0;'
    document.body.appendChild(panel)

    const cerrar = () => {
      panel.style.display = 'none'
      panel.innerHTML = ''
    }

    // Fila superior con la X para cerrar
    const encabezado = (texto: string) => {
      const fila = document.createElement('div')
      fila.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;'
      const t = document.createElement('strong')
      t.textContent = texto
      const x = document.createElement('button')
      x.textContent = '✕'
      x.style.cssText = 'background:none;border:none;color:white;font-size:22px;'
      x.addEventListener('click', cerrar)
      fila.append(t, x)
      return fila
    }

    const iniciar = (pajaro: string) => {
      const preguntas = PREGUNTAS[pajaro] ?? []
      let indice = 0
      let puntaje = 0
      panel.style.display = 'block'

      const mostrar = () => {
        panel.innerHTML = ''

        if (preguntas.length === 0) {
          panel.append(encabezado('Quiz'), document.createTextNode('Pronto habrá preguntas para esta ave.'))
          return
        }

        if (indice >= preguntas.length) {
          const fin = document.createElement('p')
          fin.textContent = `¡Terminaste! Puntaje: ${puntaje}/${preguntas.length}`
          const reintentar = document.createElement('button')
          reintentar.textContent = 'Intentar de nuevo'
          reintentar.style.cssText = BOTON
          reintentar.addEventListener('click', () => { indice = 0; puntaje = 0; mostrar() })
          panel.append(encabezado('Resultado'), fin, reintentar)
          return
        }

        const p = preguntas[indice]
        const titulo = document.createElement('p')
        titulo.textContent = p.texto
        panel.append(encabezado(`Pregunta ${indice + 1} de ${preguntas.length}`), titulo)

        p.opciones.forEach((opcion, i) => {
          const boton = document.createElement('button')
          boton.textContent = opcion
          boton.style.cssText = BOTON
          boton.addEventListener('click', () => {
            const acierto = i === p.correcta
            if (acierto) puntaje++
            panel.innerHTML = ''
            const msg = document.createElement('p')
            msg.textContent = (acierto ? '¡Correcto! ' : 'Incorrecto. ') + p.explicacion
            const sig = document.createElement('button')
            sig.textContent = 'Siguiente'
            sig.style.cssText = BOTON
            sig.addEventListener('click', () => { indice++; mostrar() })
            panel.append(encabezado(acierto ? '✅' : '❌'), msg, sig)
          })
          panel.appendChild(boton)
        })
      }

      mostrar()
    }

    const abrir = (e: any) => {
      if (estado.menuAbierto) return   // no abrir el quiz si el menú está abierto
      iniciar(e.data.pajaro)
    }

    world.events.addListener(world.events.globalId, 'abrir-quiz', abrir)
    world.events.addListener(world.events.globalId, 'cerrar-quiz', cerrar)
    registros.set(component.eid, {panel, abrir, cerrar})
  },
  remove: (world, component) => {
    const r = registros.get(component.eid)
    if (!r) return
    world.events.removeListener(world.events.globalId, 'abrir-quiz', r.abrir)
    world.events.removeListener(world.events.globalId, 'cerrar-quiz', r.cerrar)
    r.panel.remove()
    registros.delete(component.eid)
  },
})