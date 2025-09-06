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

const Contact = () => {
  const { language, t } = useLanguage();
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

  const openingHours = [
    { dayKey: "contact.monday", hours: "12:00 - 02:00" },
    { dayKey: "contact.tuesday", hours: "12:00 - 02:00" },
    { dayKey: "contact.wednesday", hours: "12:00 - 02:00" },
    { dayKey: "contact.thursday", hours: "12:00 - 02:00" },
    { dayKey: "contact.friday", hours: "12:00 - 02:00" },
    { dayKey: "contact.saturday", hours: "12:00 - 06:00" },
    { dayKey: "contact.sunday", hours: "12:00 - 06:00" }
  ];

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
                    <p className="text-muted-foreground">Ansbacher Straße 29</p>
                    <p className="text-muted-foreground">10789 Berlin, Germany</p>
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
                    <h3 className="text-lg font-semibold">Telefon</h3>
                    <p className="text-muted-foreground">+49 30 123 456 789</p>
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
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-muted-foreground">info@berlinerpub.de</p>
                    <p className="text-muted-foreground text-sm">reservations@berlinerpub.de</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card className="pub-card-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>Öffnungszeiten</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {openingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-foreground">{t(schedule.dayKey)}</span>
                      <span className="text-muted-foreground font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
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
                  <span>Kontakt</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContact} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name *
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
                        E-Mail *
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
                      Betreff *
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
                      Nachricht *
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
                    Nachricht senden
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
                <h3 className="text-xl font-semibold mb-2">Hier finden Sie uns</h3>
                <p className="text-muted-foreground">Ansbacher Straße 29, 10789 Berlin</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.open('https://maps.google.com/?q=Ansbacher+Straße+29,+10789+Berlin', '_blank')}
                >
                  In Google Maps öffnen
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