import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    () =>
      languages.find(
        (l) => l.code === (localStorage.getItem("appLanguage") || i18n.language)
      ) ?? languages[0]
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedLanguage && i18n.language !== selectedLanguage.code) {
      i18n.changeLanguage(selectedLanguage.code);
      localStorage.setItem("appLanguage", selectedLanguage.code);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const current = languages.find((l) => l.code === i18n.language);
    if (current && current.code !== selectedLanguage.code)
      setSelectedLanguage(current);
  }, [i18n.language]);

  const handleLanguageSelect = (languageCode: string) => {
    const lang = languages.find((l) => l.code === languageCode);
    if (!lang) return;
    setSelectedLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("language.languageSelectLabel") ?? "Select language"}
        onClick={() => setIsOpen((s) => !s)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700 uppercase">
          {selectedLanguage.code}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t("language.languageMenuAria") ?? "Language menu"}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn"
        >
          {languages.map((language) => {
            const isSelected = selectedLanguage.code === language.code;
            return (
              <button
                key={language.code}
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 text-left ${
                  isSelected
                    ? "bg-green-50 border-l-4 border-green-900"
                    : "border-l-4 border-transparent"
                }`}
              >
                <span className="text-2xl">{language.flag}</span>
                <div className="flex flex-col items-start flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {language.name}
                  </span>
                  <span className="text-xs text-gray-500 uppercase">
                    {language.code}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-green-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
