import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  Calendar,
  Users,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Contact = () => {
  const { language, t } = useLanguage();
  const { getSetting, loading } = useSiteSettings();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact:", contactForm);
    // Here would be the logic to submit the contact form
  };

  // Get settings from database (no fallback values)
  const address = getSetting('address', language);
  const phone = getSetting('phone', language);
  const email = getSetting('email', language);
  const emailReservations = getSetting('email_reservations', language);

  // Get opening hours settings
  const mondayFriday = getSetting('hours_monday_friday', language);
  const saturdaySunday = getSetting('hours_saturday_sunday', language);

  const openingHours = mondayFriday && saturdaySunday ? [
    { dayKey: "contact.monday", hours: mondayFriday },
    { dayKey: "contact.tuesday", hours: mondayFriday },
    { dayKey: "contact.wednesday", hours: mondayFriday },
    { dayKey: "contact.thursday", hours: mondayFriday },
    { dayKey: "contact.friday", hours: mondayFriday },
    { dayKey: "contact.saturday", hours: saturdaySunday },
    { dayKey: "contact.sunday", hours: saturdaySunday }
  ] : null;

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-muted rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">{t('contact.badge')}</Badge>
          <h1 className="text-5xl font-bold mb-6">{t('contact.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="pub-card-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('contact.address')}</h3>
                    {address ? (
                      <>
                        <p className="text-muted-foreground">{address}</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          {t('common.nearKaDeWe')}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground italic">No address available</p>
                    )}
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => 
                  window.open('https://maps.google.com/?q=Ansbacher+Straße+29,+10789+Berlin', '_blank')
                }>
                  <Navigation className="h-4 w-4 mr-2" />
                  {t('contact.showOnMap')}
                </Button>
              </CardContent>
            </Card>

            <Card className="pub-card-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('contact.phone')}</h3>
                    <p className="text-muted-foreground">{phone || <span className="italic">No phone available</span>}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="pub-card-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('contact.email')}</h3>
                    <p className="text-muted-foreground">{email || <span className="italic">No email available</span>}</p>
                    {emailReservations && (
                      <p className="text-muted-foreground text-sm">{emailReservations}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card className="pub-card-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>{t('contact.openingHours')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {openingHours ? (
                  <div className="space-y-2">
                    {openingHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-foreground">{t(schedule.dayKey)}</span>
                        <span className="text-muted-foreground font-medium">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">No opening hours available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="space-y-8">
            {/* Contact Form */}
            <Card className="pub-card-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  <span>{t('contact.contactForm')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContact} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('contact.name')} *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('contact.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.subject')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {t('contact.sendMessage')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map placeholder - in a real app you'd integrate Google Maps */}
        <Card className="pub-card-shadow border-0">
          <CardContent className="p-0">
            <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t('contact.findUs')}
                </h3>
                {address ? (
                  <>
                    <p className="text-muted-foreground">{address}</p>
                    <p className="text-muted-foreground text-sm">
                      {t('common.nearKaDeWe')}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground italic">No address available</p>
                )}
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.open('https://maps.google.com/?q=Ansbacher+Straße+29,+10789+Berlin', '_blank')}
                >
                  {t('contact.openInGoogleMaps')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;