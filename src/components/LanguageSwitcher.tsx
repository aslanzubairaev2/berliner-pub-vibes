import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2 hover:bg-accent/20"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{language === 'de' ? 'DE' : 'EN'}</span>
    </Button>
  );
};

export default LanguageSwitcher;