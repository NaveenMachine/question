import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = url && key ? createClient(url, key) : null

// Fire-and-forget so a slow or failed save never blocks the animations
export function saveAnswer(answer) {
  if (!supabase) return
  supabase
    .from('responses')
    .insert({ answer })
    .then(({ error }) => {
      if (error) console.error('Could not save answer:', error.message)
    })
}
