import '/index.scss'
import { render } from '/utils/jsx'
import Modal from '/components/Modal'
import Button from '/components/Button'

import IconCheck from 'iconoir/icons/check.svg?raw'
import IconCancel from 'iconoir/icons/cancel.svg?raw'

export function bigText (message, props) {
  render(
    <Modal {...props} bigText>
      {props.url ? <a href={props.url}>{message}</a> : message}
    </Modal>
  )
}

export function say (message, props) {
  render(<Modal {...props}>{message}</Modal>)
}

export function confirm (message, {
  title = 'Action requise',
  yes = 'Valider',
  no = 'Annuler',
  onYes = () => true,
  onNo = () => false,
  onCancel = () => null
} = {}) {
  return new Promise(resolve => {
    let modal

    const y = async () => {
      resolve(await onYes(this))
      modal.destroy()
    }

    const n = async () => {
      resolve(await onNo(this))
      modal.destroy()
    }

    render((
      <Modal
        ref={el => { modal = el }}
        event-close={async () => resolve(await onCancel(this))}
      >
        {message}
        <footer>
          <fieldset class='group'>
            <Button event-click={n} icon={IconCancel} label={no} />
            <Button event-click={y} icon={IconCheck} label={yes} />
          </fieldset>
        </footer>
      </Modal>
    ))
  })
}

export function error (error) {
  const from = error instanceof Response ? 'api' : error instanceof Error ? 'internal' : 'unknown'

  render(
    <Modal title={from === 'api' ? 'Erreur de l’API' : 'Erreur'}>
      {(from === 'internal') && [
        <p>{error.message}</p>,
        <pre class='stacktrace'>{error.stack}</pre>
      ]}

      {(from === 'api') && [
        <p>[{error.status}] {error.statusText}</p>,
        <pre class='stacktrace'>{error.message}</pre>
      ]}

      {(from === 'unknown') && [
        <p>Une erreur inconnue est survenue</p>
      ]}
    </Modal>
  )
}

export default {
  bigText,
  say,
  confirm,
  error
}
