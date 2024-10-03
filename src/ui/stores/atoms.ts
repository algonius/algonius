import { atom, WritableAtom, SetStateAction } from 'jotai'
import { Message, Session } from '~ui/types/index'

const messages = [
  {
    id: '1',
    role: 'system',
    content: '我是你的AI助手，可以帮助你完成各种任务，例如：写文章、翻译、生成代码等等。请告诉我你的需求。'
  },
  {
    id: '2',
    role: 'user',
    content: '请帮我写一篇关于人工智能的短文。'
  },
  {
    id: '3',
    role: 'assistant',
    content: '## 人工智能：改变未来的力量\n\n人工智能（AI）是近年来发展最迅速的科技领域之一，它正在深刻地改变着我们的生活。从智能手机上的语音助手到自动驾驶汽车，人工智能已经渗透到我们生活的方方面面。\n\n人工智能的核心是机器学习，它使计算机能够从数据中学习，并像人类一样做出决策。随着数据量的不断增加和算法的不断改进，人工智能的能力也越来越强大。\n\n人工智能的应用前景非常广阔，它可以帮助我们解决许多社会难题，例如：医疗保健、环境保护、教育等等。例如，人工智能可以帮助医生诊断疾病，帮助科学家发现新药物，帮助教师个性化教学。\n\n当然，人工智能的发展也面临着一些挑战，例如：伦理问题、安全问题、就业问题等等。我们需要谨慎地发展人工智能，确保它能够为人类社会带来福祉。\n\n总而言之，人工智能是改变未来的力量，它将为我们带来无限的可能。我们需要积极拥抱人工智能，并努力解决它带来的挑战，才能让它更好地服务于人类社会。'
  }
] as Array<Message>;

const defaultSession = {
  id: 'default-session',
  name: '默认会话',
  messages: messages,
  type: 'chat',
} as Session;

export const currentMessageListAtom = atom<Array<Message>>(messages)

export const chatConfigDialogAtom = atom<Session | null>(null) as WritableAtom<Session | null, Session[], Session>;

// sessions
const _sessionsAtom = atom<Session[]>([defaultSession]) // Removed atomWithStorage
export const sessionsAtom = atom(
    (get) => get(_sessionsAtom),
    (get, set, update: SetStateAction<Session[]>) => {
        const sessions = get(_sessionsAtom)
        let newSessions = typeof update === 'function' ? update(sessions) : update
        if (newSessions.length === 0) {
            newSessions = []
        }
        set(_sessionsAtom, newSessions)
    }
)

export const sortedSessionsAtom = atom((get) => {
    return sortSessions(get(sessionsAtom))
})

export function sortSessions(sessions: Session[]): Session[] {
    return [...sessions].reverse()
}

const _currentSessionIdCachedAtom = atom<string | null>(null) // Removed atomWithStorage
export const currentSessionIdAtom = atom(
    (get) => {
        const idCached = get(_currentSessionIdCachedAtom)
        const sessions = get(sortedSessionsAtom)
        if (idCached && sessions.some((session) => session.id === idCached)) {
            return idCached
        }
        return sessions.length > 0 ? sessions[0].id : null // Handle empty sessions
    },
    (get, set, update: string | null) => { // Allow null update
        set(_currentSessionIdCachedAtom, update)
    }
)



export const currentSessionAtom = atom((get) => {
  const id = get(currentSessionIdAtom)
  const sessions = get(sessionsAtom)
  let current = sessions.find((session) => session.id === id)
  if (!current) {
      return sessions[-1]
  }
  return current
})
