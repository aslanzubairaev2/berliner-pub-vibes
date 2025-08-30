import { MapPin, Phone, Clock, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-accent" />
                <div>
                  <p>Ansbacher Straße 29</p>
                  <p>10789 Berlin, Germany</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent" />
                <p>+49 30 123 456 789</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent" />
                <p>info@berlinerpub.de</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Часы работы</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">Пн - Чт: 16:00 - 01:00</p>
                  <p className="font-medium">Пт - Сб: 16:00 - 03:00</p>
                  <p className="font-medium">Вс: 14:00 - 24:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Berliner Pub</h3>
            <p className="text-primary-foreground/80 mb-4">
              Традиционный немецкий паб в сердце Берлина. Лучшее пиво, 
              аутентичная кухня и уютная атмосфера для незабываемых вечеров.
            </p>
            <p className="text-sm text-primary-foreground/60">
              © 2024 Berliner Pub. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;