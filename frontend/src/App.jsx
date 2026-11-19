import { useEffect, useState } from 'react'

function App() {
  const [page, setPage] = useState('overview')
  const [events, setEvents] = useState([])
  const [alerts, setAlerts] = useState([])
  const [type, setType] = useState('LOGIN_FAILED')
  const [severity, setSeverity] = useState('HIGH')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  async function loadData() {
    setLoading(true)

    try {
      const [eventsResponse, alertsResponse] = await Promise.all([
        fetch('/events'),
        fetch('/alerts'),
      ])

      if (!eventsResponse.ok || !alertsResponse.ok) {
        throw new Error('Impossible de contacter les microservices')
      }

      const [eventsData, alertsData] = await Promise.all([
        eventsResponse.json(),
        alertsResponse.json(),
      ])

      setEvents(eventsData)
      setAlerts(alertsData)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, severity }),
      })

      if (!response.ok) {
        throw new Error("Impossible de créer l'événement")
      }

      await loadData()
      setPage('events')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const criticalCount = events.filter(
    event => event.severity === 'HIGH'
  ).length

  return (
    <div className="app">

      {/* BARRE SUPÉRIEURE */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">◈</div>
          <div>
            <strong>CyberWatch</strong>
            <span>SECURITY MONITORING</span>
          </div>
        </div>

        <div className="system-status">
          <span className={`status-dot ${error ? 'offline' : ''}`}></span>
          {loading ? 'Chargement...' : error ? 'Service indisponible' : 'Services connectés'}
        </div>
      </header>

      <div className="container">

        {/* NAVIGATION */}
        <nav className="navigation">
          <div className="nav-links">
            <button
              className={page === 'overview' ? 'active' : ''}
              onClick={() => setPage('overview')}
            >
              Vue d'ensemble
            </button>

            <button
              className={page === 'events' ? 'active' : ''}
              onClick={() => setPage('events')}
            >
              Événements
            </button>

            <button
              className={page === 'alerts' ? 'active' : ''}
              onClick={() => setPage('alerts')}
            >
              Alertes
            </button>
          </div>

          <button
            className="primary-button"
            onClick={() => setPage('create')}
          >
            + Nouvel événement
          </button>
        </nav>

        {error && <div className="error-banner">{error}</div>}

        {/* PAGE D'ACCUEIL */}
        {page === 'overview' && (
          <>
            <section className="page-heading">
              <div className="eyebrow">CENTRE DE SUPERVISION</div>
              <h1>Tableau de bord</h1>
              <p>
                Surveillez les événements de sécurité et les alertes
                détectées par CyberWatch.
              </p>
            </section>

            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-top">
                  <span>Événements totaux</span>
                  <span className="stat-icon blue">▤</span>
                </div>
                <div className="stat-value">{events.length}</div>
                <div className="stat-footer">Événements enregistrés</div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Alertes détectées</span>
                  <span className="stat-icon orange">⚑</span>
                </div>
                <div className="stat-value">{alerts.length}</div>
                <div className="stat-footer">Alertes de sécurité</div>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Sévérité élevée</span>
                  <span className="stat-icon red">!</span>
                </div>
                <div className="stat-value">{criticalCount}</div>
                <div className="stat-footer">Événements HIGH</div>
              </div>

            </div>

            <section className="dashboard-section">
              <h2>Explorer CyberWatch</h2>

              <div className="action-grid">

                <button
                  className="action-card"
                  onClick={() => setPage('events')}
                >
                  <div className="action-icon">▤</div>
                  <h3>Journal des événements</h3>
                  <p>
                    Consultez les événements de sécurité enregistrés
                    dans PostgreSQL.
                  </p>
                  <span>Consulter les événements →</span>
                </button>

                <button
                  className="action-card"
                  onClick={() => setPage('alerts')}
                >
                  <div className="action-icon orange">⚑</div>
                  <h3>Centre d'alertes</h3>
                  <p>
                    Retrouvez les alertes générées par notre
                    microservice de détection.
                  </p>
                  <span>Voir les alertes →</span>
                </button>

              </div>
            </section>
          </>
        )}

        {/* PAGE ÉVÉNEMENTS */}
        {page === 'events' && (
          <section className="content-page">
            <div className="page-heading">
              <div className="eyebrow">SURVEILLANCE</div>
              <h1>Journal des événements</h1>
              <p>{events.length} événement(s) enregistré(s)</p>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TYPE D'ÉVÉNEMENT</th>
                    <th>SÉVÉRITÉ</th>
                  </tr>
                </thead>

                <tbody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>#{event.id}</td>
                      <td>{event.type}</td>
                      <td>
                        <span className={`severity ${String(event.severity).toLowerCase()}`}>
                          {event.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {events.length === 0 && (
                <div className="empty-state">Aucun événement enregistré.</div>
              )}
            </div>
          </section>
        )}

        {/* PAGE ALERTES */}
        {page === 'alerts' && (
          <section className="content-page">
            <div className="page-heading">
              <div className="eyebrow">DÉTECTION</div>
              <h1>Centre d'alertes</h1>
              <p>{alerts.length} alerte(s) détectée(s)</p>
            </div>

            <div className="alerts-list">
              {alerts.map(alert => (
                <div className="alert-card" key={alert.eventId}>
                  <div className="alert-symbol">!</div>

                  <div>
                    <strong>{alert.message}</strong>
                    <p>Événement associé : #{alert.eventId}</p>
                  </div>

                  <span className="alert-badge">DÉTECTÉE</span>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="empty-state">Aucune alerte détectée.</div>
              )}
            </div>
          </section>
        )}

        {/* PAGE CRÉATION */}
        {page === 'create' && (
          <section className="content-page">
            <div className="page-heading">
              <div className="eyebrow">GESTION DES ÉVÉNEMENTS</div>
              <h1>Nouvel événement</h1>
              <p>
                Enregistrez un événement pour tester le système
                de surveillance.
              </p>
            </div>

            <div className="form-card">
              <h2>Informations de l'événement</h2>
              <p>Renseignez les caractéristiques de l'événement.</p>

              <form onSubmit={handleSubmit}>

                <label>Type d'événement</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                >
                  <option value="LOGIN_FAILED">Connexion échouée</option>
                  <option value="LOGIN_SUCCESS">Connexion réussie</option>
                  <option value="SUSPICIOUS_ACTIVITY">Activité suspecte</option>
                </select>

                <label>Niveau de sévérité</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value)}
                >
                  <option value="LOW">LOW — Faible</option>
                  <option value="MEDIUM">MEDIUM — Moyenne</option>
                  <option value="HIGH">HIGH — Élevée</option>
                </select>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setPage('overview')}
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer l’événement →'}
                  </button>
                </div>

              </form>
            </div>
          </section>
        )}

      </div>

      <footer>
        CyberWatch · Cloud Native Security Monitoring
      </footer>

    </div>
  )
}

export default App