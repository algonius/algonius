import { atom } from 'jotai'
import { atomWithStorage as jotaiAtomWithStorage } from 'jotai/utils'
import { PlasmoStorage, StorageType } from "./plasmo_storage"

export function atomWithStorage<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'local'
) {
  const plasmoStorage = new PlasmoStorage<T>(storageType);

  const baseAtom = jotaiAtomWithStorage<T>(
    key,
    initialValue,
    plasmoStorage
  );

  const derivedAtom = atom(
    (get) => get(baseAtom),
    async (get, set, update: T | ((prev: T) => T)) => {
      const currentValue = await get(baseAtom);
      const nextValue = typeof update === 'function'
        ? (update as (prev: T) => T)(currentValue)
        : update;
      set(baseAtom, nextValue);
    }
  );

  return derivedAtom;
}
