import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, MapPin, Calendar } from "lucide-react";
import { useState } from "react";

const Reviews = () => {
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    comment: ""
  });

  const reviews = [
    {
      id: 1,
      name: "Michael Kozlov",
      location: "Moskau",
      date: "2024-03-10",
      rating: 5,
      title: "Beste Kneipe in Berlin!",
      comment: "Unglaubliche Atmosphäre! Man fühlt sich wie zu Hause. Das Bier ist ausgezeichnet, die Getränkeauswahl einfach hervorragend. Das Personal ist sehr freundlich und immer hilfsbereit. Komme definitiv wieder!",
      verified: true
    },
    {
      id: 2,
      name: "Anna Schmidt",
      location: "Berlin",
      date: "2024-03-08",
      rating: 5,
      title: "Authentische deutsche Kneipe",
      comment: "Endlich ein Ort in Berlin, wo man echte deutsche Kneipenatmosphäre erleben kann! Die Bierauswahl ist perfekt und das Personal ist sehr aufmerksam. Die Atmosphäre ist gemütlich und einladend.",
      verified: true
    },
    {
      id: 3,
      name: "Thomas Mueller",
      location: "München",
      date: "2024-03-05",
      rating: 4,
      title: "Toller Ort für Treffen mit Freunden",
      comment: "Kam hier mit Kollegen nach der Arbeit hin. Große Bierauswahl, gemütliche Einrichtung. Einziger Minuspunkt - manchmal ist es ziemlich voll, aber das ist eher ein Plus, spricht für die Beliebtheit des Lokals.",
      verified: true
    },
    {
      id: 4,
      name: "Elena Popova",
      location: "St. Petersburg",
      date: "2024-03-02",
      rating: 5,
      title: "Tolle Atmosphäre!",
      comment: "Wunderbarer Ort für einen Abend mit Freunden. Ruhige Ecken, gedämpftes Licht, ausgezeichnete Getränke. Die Kellner sind diskret und professionell. Die Weinkarte ist beeindruckend!",
      verified: true
    },
    {
      id: 5,
      name: "James Wilson",
      location: "London",
      date: "2024-02-28",
      rating: 5,
      title: "Amazing German experience",
      comment: "Als Tourist suchte ich nach einer authentischen deutschen Kneipenerfahrung und fand genau das hier. Das Personal sprach ausgezeichnetes Englisch und half mir, das perfekte Bier auszuwählen. Sehr empfehlenswert!",
      verified: true
    },
    {
      id: 6,
      name: "Marie Dubois",
      location: "Paris",
      date: "2024-02-25",
      rating: 4,
      title: "Très bonne ambiance allemande",
      comment: "Ausgezeichnete Kneipe mit warmer Atmosphäre. Die Bierauswahl ist beeindruckend. Das Personal ist gastfreundlich. Kleiner Kritikpunkt bei der Wartezeit, aber es lohnt sich.",
      verified: true
    }
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Here would be the logic to submit the review
    console.log("Review submitted:", newReview);
    // Reset form
    setNewReview({
      name: "",
      email: "",
      rating: 5,
      title: "",
      comment: ""
    });
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? "fill-accent text-accent" 
                : "text-muted-foreground"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Bewertungen</Badge>
          <h1 className="text-5xl font-bold mb-6">Bewertungen unserer Gäste</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Lesen Sie, was unsere Besucher über uns sagen und teilen Sie Ihre Erfahrungen
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center pub-card-shadow border-0">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-accent mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-muted-foreground">Durchschnittsbewertung</p>
            </CardContent>
          </Card>
          
          <Card className="text-center pub-card-shadow border-0">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-accent mb-2">
                {reviews.length}
              </div>
              <p className="text-muted-foreground">Gesamtbewertungen</p>
            </CardContent>
          </Card>
          
          <Card className="text-center pub-card-shadow border-0">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-accent mb-2">
                {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%
              </div>
              <p className="text-muted-foreground">Zufriedene Gäste</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8">Gästebewertungen</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="pub-card-shadow border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{review.name}</h3>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verifiziert
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{review.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(review.date).toLocaleDateString('de-DE')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold mb-3 text-foreground">
                      {review.title}
                    </h4>
                    
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 h-6 w-6 text-accent/30" />
                      <p className="text-muted-foreground pl-4 italic">
                        {review.comment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Review Form */}
          <div>
            <Card className="sticky top-24 pub-card-shadow border-0">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6">Bewertung hinterlassen</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ihr Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
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
                      value={newReview.email}
                      onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bewertung *
                    </label>
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview({ ...newReview, rating }))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Titel der Bewertung *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ihre Bewertung *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Bewertung senden
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;