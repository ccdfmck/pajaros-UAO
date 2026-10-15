import * as ecs from '@8thwall/ecs'

type Ave = 'pechirrojo' | 'guacamaya' | 'otro'

type Estado = {
  orden: Ave[]
  ronda: number
  aciertos: number
  pistas: number
  escucho: boolean
  respondida: boolean
  sonando: bigint | null
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
    textoMensaje: ecs.eid,        // el hijo Texto donde se muestran los mensajes
    // @asset
    audioPechirrojo: ecs.string,
    // @asset
    audioGuacamaya: ecs.string,
    // @asset
    audioOtro: ecs.string,
    nombreOtro: ecs.string,
    pistaPechirrojo: ecs.string,
    pistaGuacamaya: ecs.string,
    pistaOtro: ecs.string,
  },
  schemaDefaults: {
    juego: 'pechirrojo',
    nombreOtro: 'Azulejo',
    pistaPechirrojo: 'Silbido corto que se repite, desde un poste o una rama baja.',
    pistaGuacamaya: 'Graznido muy fuerte y áspero, que se oye de lejos.',
    pistaOtro: 'Trinos suaves y agudos, como una melodía corta.',
  },
  add: (world, component) => {
    // copiamos TODO al iniciar
    const juego = component.schema.juego
    const eid = component.eid
    const msgEid = component.schema.textoMensaje
    const audios: Record<Ave, string> = {
      pechirrojo: component.schema.audioPechirrojo,
      guacamaya: component.schema.audioGuacamaya,
      otro: component.schema.audioOtro,
    }
    const nombres: Record<Ave, string> = {
      pechirrojo: 'Pechirrojo',
      guacamaya: 'Guacamaya',
      otro: component.schema.nombreOtro,
    }
    const pistas: Record<Ave, string> = {
      pechirrojo: component.schema.pistaPechirrojo,
      guacamaya: component.schema.pistaGuacamaya,
      otro: component.schema.pistaOtro,
    }
    console.log('juego-canto listo:', juego, audios)

    const mostrar = (texto: string) => {
      ecs.Ui.set(world, msgEid, {text: texto})
    }

    const s: Estado = {
      orden: [], ronda: 0, aciertos: 0, pistas: 0,
      escucho: false, respondida: false, sonando: null,
      oyente: () => {},
    }

    const detener = () => {
      if (s.sonando !== null) {
        try { world.deleteEntity(s.sonando) } catch (e) { /* ya no existe */ }
        s.sonando = null
      }
    }

    const sonar = () => {
      detener()
      const url = audios[s.orden[s.ronda]]
      const e = world.createEntity()
      ecs.Audio.set(world, e, {url, volume: 1, loop: false, paused: false})
      s.sonando = e
      world.events.addListener(e, ecs.events.AUDIO_END, () => {
        try { world.deleteEntity(e) } catch (err) { /* ya no existe */ }
        if (s.sonando === e) s.sonando = null
      })
    }

    const iniciar = () => {
      detener()
      s.orden = barajar(['pechirrojo', 'guacamaya', 'otro'])
      s.ronda = 0
      s.aciertos = 0
      s.pistas = 0
      s.escucho = false
      s.respondida = false
      mostrar('Toca Escuchar y adivina de qué pájaro es el canto. (Ronda 1 de 3)')
    }

    const pedirPista = () => {
      if (s.ronda >= s.orden.length) return
      if (!s.escucho) { mostrar('Primero toca Escuchar.'); return }
      if (s.respondida) return
      const correcta = s.orden[s.ronda]
      s.pistas++
      if (s.pistas === 1) {
        mostrar('Pista: ' + pistas[correcta])
      } else if (s.pistas === 2) {
        const incorrectas = (['pechirrojo', 'guacamaya', 'otro'] as Ave[]).filter(a => a !== correcta)
        const descartada = incorrectas[Math.floor(Math.random() * incorrectas.length)]
        mostrar('Pista: NO es el ' + nombres[descartada] + '.')
      } else {
        mostrar('Ya no hay más pistas. Toca Escuchar de nuevo.')
      }
    }

    const responder = (elegida: Ave) => {
      if (s.ronda >= s.orden.length) return
      if (!s.escucho) { mostrar('Primero toca Escuchar.'); return }
      if (s.respondida) return
      const correcta = s.orden[s.ronda]
      s.respondida = true
      let msg = ''
      if (elegida === correcta) {
        s.aciertos++
        msg = '¡Correcto! Era el ' + nombres[correcta] + '. ' + pistas[correcta]
      } else {
        msg = 'Casi. Era el ' + nombres[correcta] + ', no el ' + nombres[elegida] + '. ' + pistas[correcta]
      }
      s.ronda++
      if (s.ronda >= s.orden.length) {
        msg += '  Resultado: ' + s.aciertos + ' de ' + s.orden.length + '. Toca Reiniciar para jugar otra vez.'
      } else {
        msg += '  Toca Escuchar para la ronda ' + (s.ronda + 1) + '.'
        s.escucho = false
        s.respondida = false
        s.pistas = 0
      }
      mostrar(msg)
    }

    s.oyente = (ev: any) => {
      const d = ev.data
      if (!d || d.juego !== juego) return
      if (d.accion === 'escuchar') {
        if (s.ronda >= s.orden.length) { mostrar('Se acabó el juego. Toca Reiniciar.'); return }
        s.escucho = true
        sonar()
      } else if (d.accion === 'pista') {
        pedirPista()
      } else if (d.accion === 'opcion') {
        responder(d.valor as Ave)
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
      if (s.sonando !== null) {
        try { world.deleteEntity(s.sonando) } catch (e) { /* ya no existe */ }
      }
    }
    estados.delete(component.eid)
  },
})