// Game configuration & scoring. The backend is the source of truth: the
// frontend only sends the user's picks, and we compute the credits here so
// they cannot be spoofed from the browser.

export const GAME_QUESTIONS = [
  { id: 1, difficulty: 'easy',   reward: 50,  correct: 'b' },
  { id: 2, difficulty: 'medium', reward: 100, correct: 'c' },
  { id: 3, difficulty: 'hard', reward: 150, correct: null }, // 'challenge' — any non-empty answer earns the reward
]

export const MAX_GAME_CREDITS = GAME_QUESTIONS.reduce((sum, q) => sum + q.reward, 0) // 300

/**
 * Score a list of answers.
 * @param {Array<{questionId:number, answer:any}>} answers
 * @returns {{ credits: number, breakdown: Array<{questionId, earned, reward, correct}> }}
 */
export function scoreAnswers(answers = []) {
  const breakdown = GAME_QUESTIONS.map((q) => {
    const given = answers.find((a) => Number(a?.questionId) === q.id)
    let earned = 0
    if (q.correct === null) {
      // Challenge question — any non-empty string earns the full reward.
      earned = given && String(given.answer ?? '').trim().length > 0 ? q.reward : 0
    } else {
      earned = given && String(given.answer ?? '').trim().toLowerCase() === q.correct.toLowerCase() ? q.reward : 0
    }
    return { questionId: q.id, earned, reward: q.reward, correct: q.correct }
  })
  const credits = breakdown.reduce((sum, b) => sum + b.earned, 0)
  return { credits, breakdown }
}
