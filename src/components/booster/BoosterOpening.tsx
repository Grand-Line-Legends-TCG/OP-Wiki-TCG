import { useEffect, useState } from 'react'
import '@fontsource/bangers/400.css'
import './booster.css'

type Rarity = 'C' | 'UC' | 'R' | 'SR'
type Phase = 'sealed' | 'shaking' | 'tearing' | 'reveal'

const CARD_COUNT = 5
const RARITIES: Rarity[] = ['C', 'C', 'UC', 'R', 'SR']
const RARITY_NAME: Record<Rarity, string> = {
  C: 'Commune',
  UC: 'Peu commune',
  R: 'Rare',
  SR: 'Super rare',
}

function ShipWheel({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="24" cy="24" r="4.5" fill="currentColor" />
      <path
        d="M24 3v42M3 24h42M9.9 9.9l28.2 28.2M38.1 9.9L9.9 38.1"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PackHalf({ part }: { part: 'top' | 'bottom' }) {
  return (
    <span className={`booster__body booster__body--${part}`}>
      <ShipWheel className="booster__emblem" />
      <span className="booster__name">Booster</span>
      <span className="booster__meta">Set de test · 5 cartes</span>
    </span>
  )
}

function BoosterPack({
  phase,
  onOpen,
}: {
  phase: Phase
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      className={`booster booster--${phase}`}
      onClick={onOpen}
      disabled={phase !== 'sealed'}
      aria-label="Ouvrir le booster"
    >
      <span className="booster__inner">
        <PackHalf part="top" />
        <PackHalf part="bottom" />
        <svg
          className="booster__blade"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path className="booster__blade-glow" pathLength="1" d="M-4 18.5 L104 5.5" />
          <path className="booster__blade-core" pathLength="1" d="M-4 18.5 L104 5.5" />
        </svg>
        <span className="booster__flash" />
      </span>
    </button>
  )
}

function TradingCard({
  index,
  rarity,
  flipped,
  onClick,
}: {
  index: number
  rarity: Rarity
  flipped: boolean
  onClick: () => void
}) {
  const label = flipped
    ? `Carte ${index + 1} : ${RARITY_NAME[rarity]}. Passer à la suivante`
    : `Carte ${index + 1} face cachée. Révéler`

  return (
    <button
      type="button"
      className={`tcg-card rarity-${rarity.toLowerCase()}${flipped ? ' is-flipped' : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      <span className="tcg-card__inner">
        <span className="tcg-card__face tcg-card__back" aria-hidden="true">
          <ShipWheel className="tcg-card__mark" />
        </span>
        <span className="tcg-card__face tcg-card__front" aria-hidden="true">
          <span className="tcg-card__top">
            <span className="tcg-card__number">N° {String(index + 1).padStart(3, '0')}</span>
            <span className="tcg-card__rarity">{rarity}</span>
          </span>
          <span className="tcg-card__art">
            <ShipWheel className="tcg-card__art-icon" />
            <span className="tcg-card__art-label">Illustration</span>
          </span>
          <span className="tcg-card__name">Nom de la carte</span>
          <span className="tcg-card__effect">
            Effet de la carte à définir. Texte de règle sur deux lignes.
          </span>
          <span className="tcg-card__foot">
            <span>{RARITY_NAME[rarity]}</span>
            <span>Personnage</span>
          </span>
        </span>
      </span>
    </button>
  )
}

export default function BoosterOpening() {
  const [phase, setPhase] = useState<Phase>('sealed')
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [burst, setBurst] = useState(0)

  useEffect(() => {
    if (phase !== 'shaking' && phase !== 'tearing') return
    const timer = window.setTimeout(
      () => setPhase(phase === 'shaking' ? 'tearing' : 'reveal'),
      phase === 'shaking' ? 500 : 1000,
    )
    return () => window.clearTimeout(timer)
  }, [phase])

  const finished = current >= CARD_COUNT
  const rarity = RARITIES[current]

  const openPack = () => setPhase('shaking')

  const advance = () => {
    if (!flipped) {
      setFlipped(true)
      if (rarity === 'SR' || rarity === 'R') setBurst((b) => b + 1)
      return
    }
    setCurrent((c) => c + 1)
    setFlipped(false)
  }

  const reset = () => {
    setPhase('sealed')
    setCurrent(0)
    setFlipped(false)
  }

  let status: string
  if (phase === 'sealed') {
    status = 'Clique sur le booster pour le trancher.'
  } else if (phase !== 'reveal') {
    status = 'Ouverture…'
  } else if (finished) {
    status = 'Booster ouvert. 5 cartes obtenues.'
  } else if (flipped) {
    status = `${RARITY_NAME[rarity]}. Clique pour passer à la carte suivante.`
  } else {
    status = `Carte ${current + 1} sur ${CARD_COUNT}. Clique pour la révéler.`
  }

  return (
    <div className="booster-page">
      <header className="booster-head">
        <h1>Ouverture de booster</h1>
        <p>Prototype d'interface · cartes factices</p>
      </header>

      <main className="booster-main">
        <p className="booster-status" aria-live="polite">
          {status}
        </p>

        {phase === 'tearing' && (
          <span key={`tear-${burst}`} className="burst" aria-hidden="true" />
        )}

        {phase !== 'reveal' ? (
          <BoosterPack phase={phase} onOpen={openPack} />
        ) : (
          <>
            {finished ? (
              <button type="button" className="booster-btn" onClick={reset}>
                Ouvrir un autre booster
              </button>
            ) : (
              <div className="tcg-stage">
                {flipped && burst > 0 && (rarity === 'SR' || rarity === 'R') && (
                  <span key={`burst-${burst}`} className={`burst burst--${rarity.toLowerCase()}`} aria-hidden="true" />
                )}
                <TradingCard
                  key={current}
                  index={current}
                  rarity={rarity}
                  flipped={flipped}
                  onClick={advance}
                />
              </div>
            )}

            <ol className="booster-slots" aria-label="Cartes obtenues">
              {RARITIES.map((r, i) => {
                const filled = i < current
                const isCurrent = i === current && !finished
                return (
                  <li
                    key={i}
                    className={`slot slot--${r.toLowerCase()}${filled ? ' is-filled' : ''}${isCurrent ? ' is-current' : ''}`}
                  >
                    {filled ? r : i + 1}
                  </li>
                )
              })}
            </ol>
          </>
        )}
      </main>
    </div>
  )
}
