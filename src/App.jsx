import { useState } from 'react'
import { saveAnswer } from './supabase.js'

function App() {
  const [answered, setAnswered] = useState(false)

  function answer(value) {
    saveAnswer(value)
    setAnswered(true)
  }

  return (
    <main className={answered ? 'answered' : undefined}>
      <h1>can we forget that ever happened?</h1>
      <div className="answers">
        <button onClick={() => answer('yes please')}>Yes please</button>
        <button onClick={() => answer('🫪')}>🫪</button>
      </div>
    </main>
  )
}

export default App
