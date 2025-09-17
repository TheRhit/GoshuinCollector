"use client"
import { useTranslation, Trans } from "react-i18next"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export function EnhancedFooter() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative glass-strong border-t border-border/50 py-16 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        ></motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:col-span-4 text-center"
          >
            <h3 className="text-2xl font-bold text-primary">{t("nav_title")}</h3>
            <p className="text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto">
              {t("footer_subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Trans
              i18nKey="footer_copyright"
              values={{ year: currentYear }}
              components={{
                heart: <Heart className="inline w-4 h-4 text-red-500 animate-pulse" />,
                authorLink: (
                  <a
                    href="https://github.com/TheRhit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  />
                ),
              }}
            />
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
