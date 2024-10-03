import { getDefaultStore } from 'jotai'
import { Message, Session } from '~ui/types/index'
import { countWord } from "~ui/utils"
import { estimateTokensFromMessages } from "~ui/utils"
import * as atoms from "./atoms"

export function getCurrentSession(): Session {
  const store = getDefaultStore();
  return store.get(atoms.currentSessionAtom); // Read from the atom
}

export function insertMessage(sessionId: string, msg: Message) {
  const store = getDefaultStore()
  msg.wordCount = countWord(msg.content)
  msg.tokenCount = estimateTokensFromMessages([msg])

  store.set(atoms.sessionsAtom, (prevSessions) => {
    console.log("Previous sessions:", prevSessions);
    
    const updatedSessions = prevSessions.map((s) => {
      console.log("Checking session:", s.id, "against:", sessionId);
      
      if (s.id === sessionId) {
        console.log("Matching session found, updating messages");
        return {
          ...s,
          messages: [...s.messages, msg],
        };
      }
      return s;
    });
    
    console.log("Updated sessions:", updatedSessions);
    return updatedSessions;
  });

  // 立即读取更新后的状态来验证
  const updatedSessions = store.get(atoms.sessionsAtom);
  console.log("Sessions after update:", updatedSessions);
}

export async function submitNewUserMessage(params: {
  currentSessionId: string
  newUserMsg: Message
  needGenerating: boolean
}) {
  console.log("params:", params)

  if (params.needGenerating) {
    console.log("generating...")
  }

  await insertMessage(params.currentSessionId, params.newUserMsg)
}
