import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { t, language } = useLanguage();
  const { getSetting, loading } = useSiteSettings();

  // Don't use fallback values - only show data from database or loading state
  const address = getSetting('address', language);
  const phone = getSetting('phone', language);
  const email = getSetting('email', language);
  const openingHours = getSetting('opening_hours', language);

  // Split opening hours if it contains a comma
  const hours = openingHours ? openingHours.split(',').map(h => h.trim()) : [];

  if (loading) {
    return (
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            <div className="h-32 bg-primary-foreground/10 rounded"></div>
            <div className="h-32 bg-primary-foreground/10 rounded"></div>
            <div className="h-32 bg-primary-foreground/10 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-3">
              {address && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <div>
                    <p>{address}</p>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <p>{phone}</p>
                </div>
              )}
              {email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <p>{email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.openingHours')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-accent" />
                <div>
                  {hours.map((hour, index) => (
                    <p key={index} className="font-medium">{hour}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.about')}</h3>
            <p className="text-primary-foreground/80 mb-4">
              {t('footer.aboutText')}
            </p>
            <p className="text-sm text-primary-foreground/60">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;