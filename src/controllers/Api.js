import Store from '/store'

const api = endpoint => Store.api.url.get() + '/api/' + endpoint

// Polling abstraction which will try to ping the API server until either the
// version is returned or the max attempts is reached
const polling = {
  timer: null,
  attempts: 0,
  start: function () {
    this.stop()
    if (!Store.api || !Store.api.url.get()) return

    if (this.attempts >= Store.api.pollingMaxAttempts.get()) {
      console.warn('api max polling attempts reached')
      Store.api = null
      console.error('Impossible de contacter l’API: l’export PDF ne sera pas disponible.')
      return
    }

    this.timer = setTimeout(async () => {
      this.attempts++
      try {
        const ping = await fetch(api('version'), { method: 'GET' })
        const response = await ping.json()
        if (!response || !response.version) throw new Error('Ping malformed')

        Store.api.version.set(response.version)
      } catch (error) {
        this.start()
      }
    }, Store.api.pollingInterval.get())
  },

  stop: function () {
    clearTimeout(this.timer)
  }
}

export default {
  polling,
  import: async (uid) => {
    const response = await fetch(api('json/' + uid))
    return response.json()
  },

  export: async (object) => {
    const response = await fetch(api('json'), {
      method: 'PUT',
      body: JSON.stringify(object)
    })

    // TODO handle error
    return response.json()
  }
}
