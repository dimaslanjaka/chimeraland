import { useEffect, useState } from 'react'

export function getStorageData<T>(keyName: string, defaultValue: T) {
  const savedItem = localStorage.getItem(keyName)
  if (savedItem) {
    const parsedItem = JSON.parse(savedItem) as T
    return parsedItem
  }
  return defaultValue
}

export function useLocalStorage<T>(keyName: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    return getStorageData(keyName, initialValue)
  })

  useEffect(() => {
    localStorage.setItem(keyName, JSON.stringify(value))
  }, [keyName, value])

  return [value, setValue]
}
