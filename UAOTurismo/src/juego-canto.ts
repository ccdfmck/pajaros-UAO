import * as ecs from '@8thwall/ecs'

type Ave = 'pechirrojo' | 'periquito' | 'azulejo'

const TODAS: Ave[] = ['pechirrojo', 'periquito', 'azulejo']

type Estado = {
  orden: Ave[]          // orden[0] es lo que suena como "Audio 1", etc.
  escucho: boolean
  respondida: boolean
  pistaUsada: boolean
  sonando: bigint | null
  token: number         // para cancelar la secuencia si se reinicia o se responde
  oyente: (e: any) => void
}

const estados = new Map<bigint, Estado>()

const barajar = (a: Ave[]) => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

ecs.registerComponent({
  name: 'juego-canto',
  schema: {
    juego: ecs.string,
    textoMensaje: ecs.eid,
    // @asset
    audioPechirrojo: ecs.string,
    // @asset
    audioPeriquito: ecs.string,
    // @asset
    audioAzulejo: ecs.string,
    pistaPechirrojo: ecs.string,
  },
  schemaDefaults: {
    juego: 'pechirrojo',
    pistaPechirrojo: 'Escribe aquí una característica del canto del pechirrojo.',
  },
  add: (world, component) => {
    // copiamos TODO al iniciar
    const juego = component.schema.juego
    const eid = component.eid
    const msgEid = component.schema.textoMensaje
    const pista = component.schema.pistaPechirrojo
    const audios: Record<Ave, string> = {
      pechirrojo: component.schema.audioPechirrojo,
      periquito: component.schema.audioPeriquito,
      azulejo: component.schema.audioAzulejo,
    }
    const nombres: Record<Ave, string> = {
      pechirrojo: 'Pechirrojo',
      periquito: 'Periquito barbinaranja',
      azulejo: 'Azulejo',
    }
    console.log('juego-canto listo:', juego, audios)

    const mostrar = (texto: string) => {
      ecs.Ui.set(world, msgEid, {text: texto})
    }

    const s: Estado = {
      orden: [], escucho: false, respondida: false, pistaUsada: false,
      sonando: null, token: 0, oyente: () => {},
    }

    const detener = () => {
      s.token++   // invalida cualquier secuencia en curso
      if (s.sonando !== null) {
        try { world.deleteEntity(s.sonando) } catch (e) { /* ya no existe */ }
        s.sonando = null
      }
    }

    // Reproduce el audio i (0, 1, 2) y al terminar pasa al siguiente
    const reproducir = (i: number, token: number) => {
      if (token !== s.token) return
      if (i >= s.orden.length) {
        mostrar('Listo. ¿Cuál era el canto del pechirrojo? Elige Audio 1, Audio 2 o Audio 3.')
        return
      }
      mostrar('Sonando: Audio ' + (i + 1))
      const e = world.createEntity()
      ecs.Audio.set(world, e, {url: audios[s.orden[i]], volume: 1, loop: false, paused: false})
      s.sonando = e
      world.events.addListener(e, ecs.events.AUDIO_END, () => {
        try { world.deleteEntity(e) } catch (err) { /* ya no existe */ }
        if (s.sonando === e) s.sonando = null
        setTimeout(() => reproducir(i + 1, token), 600)
      })
    }

    const iniciar = () => {
      detener()
      s.orden = ['azulejo', 'periquito', 'pechirrojo']
      s.escucho = false
      s.respondida = false
      s.pistaUsada = false
      mostrar('Pista: ' + pista + '  Toca Escuchar para oír los 3 audios y elige cuál es el pechirrojo.')
    }

    const pedirPista = () => {
      if (s.respondida) return
      if (!s.escucho) { mostrar('Pista: ' + pista); return }
      if (!s.pistaUsada) {
        s.pistaUsada = true
        const malos: number[] = []
        s.orden.forEach((a, i) => { if (a !== 'pechirrojo') malos.push(i) })
        const d = malos[Math.floor(Math.random() * malos.length)]
        mostrar('Pista extra: el Audio ' + (d + 1) + ' NO es el pechirrojo.')
      } else {
        mostrar('Pista: ' + pista)
      }
    }

    const responder = (pos: number) => {
      if (!s.escucho) { mostrar('Primero toca Escuchar.'); return }
      if (s.respondida) return
      if (pos < 1 || pos > s.orden.length) return
      detener()
      s.respondida = true
      const correcta = s.orden.indexOf('pechirrojo') + 1
      const lista = s.orden.map((a, i) => 'Audio ' + (i + 1) + ' = ' + nombres[a]).join(', ')
      let msg = ''
      if (pos === correcta) {
        msg = '¡Correcto! El Audio ' + pos + ' es el canto del pechirrojo.'
      } else {
        msg = 'Casi. El canto del pechirrojo era el Audio ' + correcta + ', no el Audio ' + pos + '.'
      }
      mostrar(msg + '  Así sonaban: ' + lista + '. Toca Reiniciar para jugar de nuevo.')
    }

    s.oyente = (ev: any) => {
      const d = ev.data
      if (!d || d.juego !== juego) return
      if (d.accion === 'escuchar') {
        if (s.respondida) { mostrar('Ya respondiste. Toca Reiniciar para jugar de nuevo.'); return }
        detener()
        s.escucho = true
        reproducir(0, s.token)
      } else if (d.accion === 'pista') {
        pedirPista()
      } else if (d.accion === 'opcion') {
        responder(parseInt(d.valor, 10))
      } else if (d.accion === 'reiniciar') {
        iniciar()
      }
    }

    estados.set(eid, s)
    world.events.addListener(world.events.globalId, 'canto-boton', s.oyente)
    iniciar()
  },
  remove: (world, component) => {
    const s = estados.get(component.eid)
    if (s) {
      world.events.removeListener(world.events.globalId, 'canto-boton', s.oyente)
      s.token++
      if (s.sonando !== null) {
        try { world.deleteEntity(s.sonando) } catch (e) { /* ya no existe */ }
      }
    }
    estados.delete(component.eid)
  },
})