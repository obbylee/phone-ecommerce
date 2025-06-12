import type { Route } from "./+types/onboard";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Search,
  ShieldCheck,
  Truck,
  Headphones,
  Tag,
  PiggyBank,
} from "lucide-react";
import { trpcClient } from "~/utils/trpc";
import { Form, Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Badge } from "~/components/ui/badge";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Aliphone - Wholesale Phones & Accessories" },
    {
      name: "description",
      content:
        "Aliphone is your premier source for wholesale phones, accessories, and electronics. Connect with verified suppliers and secure the best bulk deals.",
    },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  const response = await trpcClient.healthCheck.query();
  console.log("tRPC Health Check:", response);
  return null;
}

export default function Route() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="py-16 md:py-36 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 md:mb-8 tracking-tight leading-tight">
            Your Ultimate Hub for <br className="hidden md:inline" />
            <span className="text-primary">Wholesale Mobile Devices</span>
          </h1>
          <p className="text-lg sm:text-xl mb-10 md:mb-12 max-w-3xl mx-auto text-muted-foreground">
            Streamline your procurement process. Connect with verified suppliers
            and access
            <span className="font-semibold text-primary"></span>
            on bulk phone orders, accessories, and more.
          </p>

          <Form
            action="/product"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-xl mx-auto mb-16"
            autoComplete="off"
          >
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                name="query"
                placeholder="Search for phone models,   brands, or accessories..."
                className="w-full pl-10 pr-4 py-2 text-foreground rounded-lg shadow-sm focus:ring-ring focus:border-input"
              />
            </div>
            <Button
              variant="default"
              size="lg"
              type="submit"
              className="font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              <span>Find Deals Now</span>
            </Button>
          </Form>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-md text-foreground border border-border shadow-sm"
            >
              <ShieldCheck className="h-4 w-4 mr-2" /> Verified Suppliers
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-md text-foreground border border-border shadow-sm"
            >
              <Tag className="h-4 w-4 mr-2" /> Best Bulk Pricing
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-md text-foreground border border-border shadow-sm"
            >
              <Truck className="h-4 w-4 mr-2" /> Fast & Secure Shipping
            </Badge>
          </div>
        </div>
      </main>

      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Explore Our Curated Selection
          </h2>

          <Carousel className="w-full max-w-5xl mx-auto overflow-hidden">
            <CarouselContent className="-ml-4">
              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader className="relative pb-0">
                    <img
                      src="https://s.alicdn.com/@sc04/kf/H0b222c1919b94d2eb2cd4cbc0f564abbG.jpg_720x720q50.jpg"
                      alt="Latest iPhone Model"
                      className="w-full h-48 object-contain rounded-md mb-4"
                    />
                    <Badge variant="default" className="absolute top-4 left-4">
                      New Arrival
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-6 flex-grow">
                    <CardTitle className="text-xl font-semibold mb-2">
                      iPhone 16 Pro Max
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">
                      Unleash unparalleled power and a pro-grade camera system.
                    </CardDescription>
                    <p className="text-2xl font-bold text-primary mb-4">
                      $899.99
                      <span className="text-sm text-muted-foreground font-normal">
                        /unit (min 10)
                      </span>
                    </p>
                    <Button className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader className="relative pb-0">
                    <img
                      src="https://s.alicdn.com/@sc04/kf/H8169d232cfdd47649d4f26601f24f9315.jpg_720x720q50.jpg"
                      alt="Samsung Galaxy S25"
                      className="w-full h-48 object-contain rounded-md mb-4"
                    />
                    <Badge variant="outline" className="absolute top-4 left-4">
                      Bestseller
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-6 flex-grow">
                    <CardTitle className="text-xl font-semibold mb-2">
                      Samsung Galaxy S25 Ultra
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">
                      Experience cutting-edge display and incredible
                      performance.
                    </CardDescription>
                    <p className="text-2xl font-bold text-primary mb-4">
                      $799.99
                      <span className="text-sm text-muted-foreground font-normal">
                        /unit (min 15)
                      </span>
                    </p>
                    <Button className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader className="relative pb-0">
                    <img
                      src="https://s.alicdn.com/@sc04/kf/Hea386cbeb6ec4892b44d749c4b46fa442.jpg_720x720q50.jpg"
                      alt="Xiaomi Flagship"
                      className="w-full h-48 object-contain rounded-md mb-4"
                    />
                  </CardHeader>
                  <CardContent className="pt-6 flex-grow">
                    <CardTitle className="text-xl font-semibold mb-2">
                      Xiaomi Mi 15 Pro
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4">
                      Premium features without the premium price tag.
                    </CardDescription>
                    <p className="text-2xl font-bold text-primary mb-4">
                      $499.99
                      <span className="text-sm text-muted-foreground font-normal">
                        /unit (min 20)
                      </span>
                    </p>
                    <Button className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/product">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Why Choose Aliphone for Your Wholesale Needs?
          </h2>
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
            {/* Card 1: Verified Suppliers */}
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 group flex-none w-full sm:w-[calc(50%-1rem)] md:w-[calc(32%-0.5rem)] lg:w-[calc(32%-0.5rem)]">
              <CardHeader className="flex justify-center items-center pb-4">
                <ShieldCheck className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-xl font-semibold">
                  Verified Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Access a secure network of thoroughly vetted manufacturers and
                  distributors.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 2: Competitive Bulk Pricing */}
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 group flex-none w-full sm:w-[calc(50%-1rem)] md:w-[calc(32%-0.5rem)] lg:w-[calc(32%-0.5rem)]">
              <CardHeader className="flex justify-center items-center pb-4">
                <Tag className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-xl font-semibold">
                  Competitive Bulk Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Leverage our partnerships for the most aggressive pricing on
                  large volume orders.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 3: Global & Secure Logistics */}
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 group flex-none w-full sm:w-[calc(50%-1rem)] md:w-[calc(32%-0.5rem)] lg:w-[calc(32%-0.5rem)]">
              <CardHeader className="flex justify-center items-center pb-4">
                <Truck className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-xl font-semibold">
                  Global & Secure Logistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reliable, insured worldwide delivery ensuring your orders
                  arrive safely and on schedule.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 4: Expert Customer Support */}
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 group flex-none w-full sm:w-[calc(50%-1rem)] md:w-[calc(32%-0.5rem)] lg:w-[calc(32%-0.5rem)]">
              <CardHeader className="flex justify-center items-center pb-4">
                <Headphones className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-xl font-semibold">
                  Expert Customer Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our dedicated team provides personalized assistance from
                  inquiry to after-sales.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Card 5: Significant Cost Savings */}
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300 group flex-none w-full sm:w-[calc(50%-1rem)] md:w-[calc(32%-0.5rem)] lg:w-[calc(32%-0.5rem)]">
              <CardHeader className="flex justify-center items-center pb-4">
                <PiggyBank className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-xl font-semibold">
                  Significant Cost Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reduce overheads and maximize your profits with our
                  direct-from-source deals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-primary-foreground text-3xl sm:text-4xl font-bold mb-6">
            Ready to Streamline Your Business?
          </h2>
          <p className="text-primary-foreground text-lg sm:text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Join Aliphone today to unlock exclusive deals and a seamless
            wholesale experience.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="font-semibold px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Get Started Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-semibold px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
