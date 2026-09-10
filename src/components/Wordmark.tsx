interface Props {
  /** Masque l'emblème pour ne garder que le nom. */
  textOnly?: boolean
}

/**
 * Marque de l'application, composée comme sur le logo : emblème, SKY en blanc
 * et LOGIC en dégradé, puis CHECK espacé entre deux filets.
 */
export function Wordmark({ textOnly = false }: Props) {
  return (
    <div className="wordmark">
      {!textOnly && <img className="wordmark-emblem" src={`${import.meta.env.BASE_URL}emblem.png`} alt="" />}
      <div className="wordmark-name">
        <span className="wm-sky">SKY</span>
        <span className="wm-logic">LOGIC</span>
      </div>
      <div className="wordmark-check">
        <span className="wm-rule" />
        CHECK
        <span className="wm-rule" />
      </div>
      <div className="wordmark-sub">Line Training · Line Check · Line Control</div>
    </div>
  )
}
