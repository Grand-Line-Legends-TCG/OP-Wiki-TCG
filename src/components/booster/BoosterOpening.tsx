import { useEffect, useState } from 'react'
import '@fontsource/bangers/400.css'
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel/900.css'
import cartesData from '../../../cartes.json'
import './booster.css'

type Phase = 'sealed' | 'shaking' | 'tearing' | 'reveal'

type CardData = {
  pageid: number
  title: string
  rarity: string
  image: string | null
  description: string
}

const CARDS = cartesData as CardData[]
const CARD_COUNT = 5
const RARE_RARITIES = ['R', 'UR', 'SR', 'L']
const RARITY_NAME: Record<string, string> = {
  C: 'Commune',
  PC: 'Peu commune',
  R: 'Rare',
  UR: 'Ultra rare',
  SR: 'Super rare',
  L: 'Leader',
}

const rarityName = (rarity: string) => RARITY_NAME[rarity] ?? rarity

const isRare = (rarity: string) => RARE_RARITIES.includes(rarity)

const nameSizeClass = (title: string) => {
  if (title.length > 34) return ' tcg-card__name--xlong'
  if (title.length > 18) return ' tcg-card__name--long'
  return ''
}

function drawBooster(): CardData[] {
  const pool = CARDS.filter((card) => card.title && card.description)
  const picks: CardData[] = []
  for (let i = 0; i < CARD_COUNT && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    picks.push(pool.splice(idx, 1)[0])
  }
  return picks
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

function ScrollCurl({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      className={`tcg-card__scroll tcg-card__scroll--${side}`}
      viewBox="0 0 24 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 4 C8 2 6 14 12 22 C16 28 18 34 12 46 C8 54 4 58 12 60 C20 62 22 66 12 74 C6 82 8 92 14 96 C18 100 14 112 6 116" />
    </svg>
  )
}

function PackHalf({ part }: { part: 'top' | 'bottom' }) {
  return (
    <span className={`booster__body booster__body--${part}`}>
      <span className="booster__art" aria-hidden="true" />
      <span className="booster__label">
        <span className="booster__crest">
          <ShipWheel className="booster__emblem" />
        </span>
        <span className="booster__name">Grand Line Legends</span>
        <span className="booster__meta">Booster · 5 cartes</span>
      </span>
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
  card,
  flipped,
  onClick,
}: {
  index: number
  card: CardData
  flipped: boolean
  onClick: () => void
}) {
  const label = flipped
    ? `Carte ${index + 1} : ${rarityName(card.rarity)}. Passer à la suivante`
    : `Carte ${index + 1} face cachée. Révéler`

  return (
    <button
      type="button"
      className={`tcg-card rarity-${card.rarity.toLowerCase()}${flipped ? ' is-flipped' : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      <svg className="tcg-card__defs" aria-hidden="true" focusable="false">
        <filter id="tcg-aged" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="edge" />
          <feDisplacementMap in="SourceGraphic" in2="edge" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="3" result="wear" />
          <feColorMatrix
            in="wear"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3 0 0 0 2.6"
            result="speck"
          />
          <feComposite in="rough" in2="speck" operator="in" />
        </filter>
      </svg>
      <span className="tcg-card__inner">
        <span className="tcg-card__face tcg-card__back" aria-hidden="true">
          <span className="tcg-card__backmark">Grand Line Legends</span>
        </span>
        <span className="tcg-card__face tcg-card__front" aria-hidden="true">
          <span className="tcg-card__header">WANTED</span>
          <span className="tcg-card__photo">
            {card.image ? (
              <img src={card.image} alt="" />
            ) : (
              <ShipWheel className="tcg-card__photo-icon" />
            )}
          </span>
          <span className="tcg-card__lower">
            <ScrollCurl side="left" />
            <ScrollCurl side="right" />
            <span className="tcg-card__alive">Dead or Alive</span>
            <span className={`tcg-card__name${nameSizeClass(card.title)}`}>{card.title}</span>
            <span className="tcg-card__effect">{card.description}</span>
            <span className="tcg-card__foot">
              <span className="tcg-card__bounty">{card.rarity}</span>
              <span className="tcg-card__rank">{rarityName(card.rarity)}</span>
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}

export default function BoosterOpening() {
  const [phase, setPhase] = useState<Phase>('sealed')
  const [deck, setDeck] = useState<CardData[]>([])
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

  const finished = current >= deck.length
  const card = deck[current]
  const rarity = card?.rarity ?? 'C'

  const openPack = () => {
    setDeck(drawBooster())
    setPhase('shaking')
  }

  const advance = () => {
    if (!flipped) {
      setFlipped(true)
      if (isRare(rarity)) setBurst((b) => b + 1)
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
    status = `Booster ouvert. ${deck.length} cartes obtenues.`
  } else if (flipped) {
    status = `${rarityName(rarity)}. Clique pour passer à la carte suivante.`
  } else {
    status = `Carte ${current + 1} sur ${deck.length}. Clique pour la révéler.`
  }

  return (
    <div className="booster-page">
      <header className="booster-head">
        <h1>Ouverture de booster</h1>
        <p>Prototype d'interface · cartes issues de cartes.json</p>
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
                {flipped && burst > 0 && isRare(rarity) && (
                  <span key={`burst-${burst}`} className={`burst burst--${rarity.toLowerCase()}`} aria-hidden="true" />
                )}
                <TradingCard
                  key={current}
                  index={current}
                  card={card}
                  flipped={flipped}
                  onClick={advance}
                />
              </div>
            )}

            <ol className="booster-slots" aria-label="Cartes obtenues">
              {deck.map((c, i) => {
                const filled = i < current
                const isCurrent = i === current && !finished
                return (
                  <li
                    key={c.pageid}
                    className={`slot slot--${c.rarity.toLowerCase()}${filled ? ' is-filled' : ''}${isCurrent ? ' is-current' : ''}`}
                  >
                    {filled ? c.rarity : i + 1}
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
