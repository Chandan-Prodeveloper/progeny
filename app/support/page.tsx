import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, Users, ArrowLeft, MessageCircle, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-xl">Progeny AI</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center space-y-4 mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold">Help & Support</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to your questions or get in touch with our support team.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* FAQ Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">How do I take a good plant photo for accurate detection?</h3>
                    <p className="text-muted-foreground text-sm">
                      Take clear, well-lit photos of affected plant parts. Ensure the diseased area is visible and in
                      focus. Avoid shadows and blurry images for best results.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">What should I do if I have payment issues?</h3>
                    <p className="text-muted-foreground text-sm">
                      Contact our support team immediately using the contact information below. We'll help resolve any
                      payment-related concerns quickly and ensure your service continues uninterrupted.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">How accurate is the AI detection?</h3>
                    <p className="text-muted-foreground text-sm">
                      Our AI achieves over 90% accuracy, trained on thousands of plant disease images. The confidence
                      score shown with each result indicates the reliability of the detection.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Can I use Progeny AI for any type of plant?</h3>
                    <p className="text-muted-foreground text-sm">
                      Yes, our AI supports detection for a wide variety of crops and plants including tomatoes,
                      potatoes, corn, wheat, and many other common agricultural plants.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">How do I upgrade to premium?</h3>
                    <p className="text-muted-foreground text-sm">
                      Click the "Upgrade to Premium" button in your dashboard. Premium gives you unlimited scans,
                      detailed reports, and priority support for ₹200/month.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">What happens after my free scans are used up?</h3>
                    <p className="text-muted-foreground text-sm">
                      After using your 5 free daily scans, you'll see a subscription prompt. You can either wait until
                      the next day for your free scans to reset or upgrade to premium for unlimited access.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Admin Support Team */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Admin Support Team</h2>
              </div>

              <p className="text-muted-foreground mb-6">
                For urgent issues, account problems, or technical support, contact our admin team directly. We're here
                to help you get the most out of Progeny AI.
              </p>

              <div className="grid gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">Darshan Ramrakhyani</h3>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Lead Admin</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a href="mailto:ramrakhyanidarshan@gmail.com" className="text-primary hover:underline">
                              ramrakhyanidarshan@gmail.com
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a href="tel:+919024102842" className="text-primary hover:underline">
                              +91 9024102842
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">Chandan Arora</h3>
                          <Badge className="bg-green-100 text-green-800 text-xs">Technical Support</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a href="mailto:arorachandan2004@gmail.com" className="text-primary hover:underline">
                              arorachandan2004@gmail.com
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a href="tel:+918619084224" className="text-primary hover:underline">
                              +91 8619084224
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">Rachit Tripathi</h3>
                          <Badge className="bg-purple-100 text-purple-800 text-xs">AI Specialist</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a href="mailto:22cs93@ecajmer.ac.in" className="text-primary hover:underline">
                              22cs93@ecajmer.ac.in
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a href="tel:+916350019449" className="text-primary hover:underline">
                              +91 6350019449
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">Parth Tripathi</h3>
                          <Badge className="bg-orange-100 text-orange-800 text-xs">Customer Success</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a href="mailto:parthdadhich15augast@gmail.com" className="text-primary hover:underline">
                              parthdadhich15augast@gmail.com
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a href="tel:+917339856367" className="text-primary hover:underline">
                              +91 7339856367
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For urgent technical issues or account problems, contact any of our admins directly via phone or
                    email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button className="flex-1" asChild>
                      <Link href="mailto:ramrakhyanidarshan@gmail.com">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href="tel:+919024102842">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
