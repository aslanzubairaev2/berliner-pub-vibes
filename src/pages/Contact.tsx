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

const Contact = () => {
  const [reservationForm, setReservationForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    message: ""
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reservation:", reservationForm);
    // Here would be the logic to submit the reservation
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact:", contactForm);
    // Here would be the logic to submit the contact form
  };

  const openingHours = [
    { day: "Понедельник", hours: "12:00 - 02:00" },
    { day: "Вторник", hours: "12:00 - 02:00" },
    { day: "Среда", hours: "12:00 - 02:00" },
    { day: "Четверг", hours: "12:00 - 02:00" },
    { day: "Пятница", hours: "12:00 - 02:00" },
    { day: "Суббота", hours: "12:00 - 06:00" },
    { day: "Воскресенье", hours: "12:00 - 06:00" }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Контакты</Badge>
          <h1 className="text-5xl font-bold mb-6">Свяжитесь с нами</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Мы всегда рады вашим вопросам и предложениям. Забронируйте столик или просто напишите нам
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
                    <h3 className="text-lg font-semibold">Адрес</h3>
                    <p className="text-muted-foreground">Ansbacher Straße 29</p>
                    <p className="text-muted-foreground">10789 Berlin, Germany</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => 
                  window.open('https://maps.google.com/?q=Ansbacher+Straße+29,+10789+Berlin', '_blank')
                }>
                  <Navigation className="h-4 w-4 mr-2" />
                  Показать на карте
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
                    <h3 className="text-lg font-semibold">Телефон</h3>
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
                  <span>Часы работы</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {openingHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-foreground">{schedule.day}</span>
                      <span className="text-muted-foreground font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forms */}
          <div className="space-y-8">
            {/* Reservation Form */}
            <Card className="pub-card-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <span>Бронирование столика</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReservation} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Имя *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        value={reservationForm.name}
                        onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        value={reservationForm.email}
                        onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      value={reservationForm.phone}
                      onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Дата *
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        value={reservationForm.date}
                        onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Время *
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        value={reservationForm.time}
                        onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Гостей *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        value={reservationForm.guests}
                        onChange={(e) => setReservationForm({ ...reservationForm, guests: e.target.value })}
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Дополнительные пожелания
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                      value={reservationForm.message}
                      onChange={(e) => setReservationForm({ ...reservationForm, message: e.target.value })}
                      placeholder="Особые пожелания, аллергии, торжество..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Забронировать столик
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="pub-card-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  <span>Обратная связь</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContact} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Имя *
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
                        Email *
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
                      Тема *
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
                      Сообщение *
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
                    Отправить сообщение
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
                <h3 className="text-xl font-semibold mb-2">Мы находимся здесь</h3>
                <p className="text-muted-foreground">Ansbacher Straße 29, 10789 Berlin</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => window.open('https://maps.google.com/?q=Ansbacher+Straße+29,+10789+Berlin', '_blank')}
                >
                  Открыть в Google Maps
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