import { useEffect, useState } from "react"

export const useDebounce = (input: string, time: number = 1000) => {
  const [data, setData] = useState(input)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(input)
    }, time)

    return () => {
      clearTimeout(timer)
    }
  }, [input, time])

  return data
}