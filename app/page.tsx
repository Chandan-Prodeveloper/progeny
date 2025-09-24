import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">Progeny</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-primary text-primary-foreground border-primary hover:bg-primary/90">
                AI-Powered Agriculture
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                  Transform Your Farming with <span className="text-accent">AI-Powered</span> Disease Detection
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Empowering farmers to safeguard their plants effortlessly with advanced AI technology for instant
                  disease identification and real-time alerts.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-lg px-8" asChild>
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-primary">✓</span>
                  Free 5 detections per day
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-primary">✓</span>
                  No credit card required
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 lg:p-12">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7bIiDz0eX6QPtxrCSpqGQnvFN00dpN.png"
                  alt="Progeny AI app interface showing plant disease detection"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary text-primary-foreground border-primary">How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Simple steps to healthier plants</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-accent-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold">Capture Image</h3>
              <p className="text-muted-foreground">
                Simply take a photo of your plant using your smartphone or upload an existing image.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes the image and identifies potential diseases with high accuracy.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-accent-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold">Get Results</h3>
              <p className="text-muted-foreground">
                Receive instant diagnosis with treatment recommendations and prevention tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary text-primary-foreground border-primary">Key Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Everything you need to protect your plants</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive disease detection and management tools designed
              specifically for modern farmers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold">Instant Disease Identification</h3>
                <p className="text-muted-foreground">
                  Get accurate disease diagnosis in seconds using advanced AI algorithms trained on thousands of plant
                  images.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold">User-Friendly Interface</h3>
                <p className="text-muted-foreground">
                  Simple, intuitive design that works perfectly on any device. No technical expertise required.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="text-xl font-semibold">Real-Time Alerts</h3>
                <p className="text-muted-foreground">
                  Receive immediate notifications about potential threats to your plants with actionable treatment
                  recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary text-primary-foreground border-primary">Pricing</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Choose the plan that fits your needs</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Free Plan</h3>
                  <p className="text-muted-foreground">Perfect for small-scale farmers</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">₹0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 text-primary">✓</span>
                    <span>5 disease detections per day</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 text-primary">✓</span>
                    <span>Basic disease identification</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 text-primary">✓</span>
                    <span>Mobile app access</span>
                  </li>
                </ul>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/auth/signup">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-accent relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Premium Plan</h3>
                  <p className="text-muted-foreground">For professional farmers and agricultural businesses</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">₹200</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 text-primary">✓</span>
                    <span>Unlimited disease detections</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 text-primary">✓</span>
                    <span>Advanced AI analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 text-primary">✓</span>
                    <span>Detailed treatment reports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 text-primary">✓</span>
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 text-primary">✓</span>
                    <span>Historical data tracking</span>
                  </li>
                </ul>
                <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                  <Link href="/auth/signup">Start Premium Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-accent-foreground text-balance">
              Ready to protect your plants with AI?
            </h2>
            <p className="text-xl text-accent-foreground/90 text-pretty">
              Join thousands of farmers who trust Progeny to keep their plants healthy and productive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/auth/signup">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10 bg-transparent"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Team Section */}
      <section id="contact" className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">👥</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Help & Support</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Find answers to your questions or get in touch with our support team.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* FAQ Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">How do I take a good plant photo for accurate detection?</h4>
                    <p className="text-muted-foreground text-sm">
                      Take clear, well-lit photos of affected plant parts. Ensure the diseased area is visible and in
                      focus.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">What should I do if I have payment issues?</h4>
                    <p className="text-muted-foreground text-sm">
                      Contact our support team immediately. We'll help resolve any payment-related concerns quickly.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">How accurate is the AI detection?</h4>
                    <p className="text-muted-foreground text-sm">
                      Our AI achieves over 90% accuracy, trained on thousands of plant disease images.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">Can I use Progeny AI for any type of plant?</h4>
                    <p className="text-muted-foreground text-sm">
                      Yes, our AI supports detection for a wide variety of crops and plants.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Admin Support Team */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Admin Support Team</h3>
              <p className="text-muted-foreground">
                For urgent issues or account-related inquiries, please contact our admins directly.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto"></div>
                    <div>
                      <h4 className="font-semibold">Darshan Ramrakhyani</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3">📧</span>
                          <span className="text-xs">ramrakhyanidarshan@gmail.com</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3">📞</span>
                          <span>9024102842</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto"></div>
                    <div>
                      <h4 className="font-semibold">Chandan Arora</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3">📧</span>
                          <span className="text-xs">arorachandan2004@gmail.com</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3">📞</span>
                          <span>8619084224</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto"></div>
                    <div>
                      <h4 className="font-semibold">Rachit Tripathi</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3">📧</span>
                          <span className="text-xs">22cs93@ecajmer.ac.in</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3">📞</span>
                          <span>6350019449</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto"></div>
                    <div>
                      <h4 className="font-semibold">Parth Tripathi</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3">📧</span>
                          <span className="text-xs">parthdadhich15august@gmail.com</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-3 h-3">📞</span>
                          <span>7339856367</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-xl">Progeny</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers with AI-powered disease detection for healthier plants and better yields.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2024 Progeny. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
