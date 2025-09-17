"use client"

import { useTranslation } from "react-i18next"
import { useEffect } from "react"

export function LanguageUpdater() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return null
}
