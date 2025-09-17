"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useTranslation } from "react-i18next"

export function LanguageSelector() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex justify-center space-x-4 mb-8">
      <motion.div
        className="glass rounded-full p-2 cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => changeLanguage("es")}
      >
        <Image src="/flag-es.svg" alt="Spanish Flag" width={32} height={32} />
      </motion.div>
      <motion.div
        className="glass rounded-full p-2 cursor-pointer"
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => changeLanguage("ja")}
      >
        <Image src="/flag-jp.svg" alt="Japanese Flag" width={32} height={32} />
      </motion.div>
    </div>
  )
}
