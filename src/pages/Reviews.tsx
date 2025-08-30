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
      name: "Михаил Козлов",
      location: "Москва",
      date: "2024-03-10",
      rating: 5,
      title: "Лучший паб в Берлине!",
      comment: "Невероятная атмосфера! Чувствуешь себя как дома. Пиво отличное, шницель просто превосходный. Персонал очень дружелюбный и всегда готов помочь. Обязательно вернусь сюда снова!",
      verified: true
    },
    {
      id: 2,
      name: "Anna Schmidt",
      location: "Berlin",
      date: "2024-03-08",
      rating: 5,
      title: "Authentische deutsche Küche",
      comment: "Endlich ein Ort in Berlin, wo man echte deutsche Küche bekommt! Die Sauerbraten war perfekt zubereitet und das Personal ist sehr aufmerksam. Die Atmosphäre ist gemütlich und einladend.",
      verified: true
    },
    {
      id: 3,
      name: "Thomas Mueller",
      location: "München",
      date: "2024-03-05",
      rating: 4,
      title: "Отличное место для встречи с друзьями",
      comment: "Приходил сюда с коллегами после работы. Большой выбор пива, уютная обстановка. Единственный минус - иногда бывает довольно людно, но это скорее плюс, говорит о популярности заведения.",
      verified: true
    },
    {
      id: 4,
      name: "Elena Popova",
      location: "St. Petersburg",
      date: "2024-03-02",
      rating: 5,
      title: "Романтический ужин удался!",
      comment: "Прекрасное место для романтического ужина. Тихие уголки, приглушенное освещение, изысканные блюда. Официанты дискретные и профессиональные. Винная карта впечатляет!",
      verified: true
    },
    {
      id: 5,
      name: "James Wilson",
      location: "London",
      date: "2024-02-28",
      rating: 5,
      title: "Amazing German experience",
      comment: "As a tourist, I was looking for an authentic German pub experience and found exactly that here. The staff spoke excellent English and helped me choose the perfect beer and meal. Highly recommended!",
      verified: true
    },
    {
      id: 6,
      name: "Marie Dubois",
      location: "Paris",
      date: "2024-02-25",
      rating: 4,
      title: "Très bonne cuisine allemande",
      comment: "Excellent restaurant avec une atmosphère chaleureuse. Les plats sont copieux et savoureux. Le personnel est accueillant. Un petit bémol sur le temps d'attente, mais cela en vaut la peine.",
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
          <Badge variant="outline" className="mb-4">Отзывы</Badge>
          <h1 className="text-5xl font-bold mb-6">Отзывы наших гостей</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Читайте что говорят о нас наши посетители и поделитесь своим опытом
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
              <p className="text-muted-foreground">Средняя оценка</p>
            </CardContent>
          </Card>
          
          <Card className="text-center pub-card-shadow border-0">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-accent mb-2">
                {reviews.length}
              </div>
              <p className="text-muted-foreground">Всего отзывов</p>
            </CardContent>
          </Card>
          
          <Card className="text-center pub-card-shadow border-0">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-accent mb-2">
                {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%
              </div>
              <p className="text-muted-foreground">Довольных гостей</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8">Отзывы посетителей</h2>
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
                              Проверено
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
                            <span>{new Date(review.date).toLocaleDateString('ru-RU')}</span>
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
                <h3 className="text-2xl font-bold mb-6">Оставьте отзыв</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ваше имя *
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
                      Email *
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
                      Оценка *
                    </label>
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview({ ...newReview, rating }))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Заголовок отзыва *
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
                      Ваш отзыв *
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
                    Отправить отзыв
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