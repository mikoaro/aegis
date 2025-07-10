"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, AlertTriangle, CheckCircle, XCircle, MapPin, Clock } from "lucide-react"
import { toast } from "sonner"

export default function MobileDemoPage() {
  const [currentTransaction, setCurrentTransaction] = useState({
    transaction_id: "txn-mobile-demo-123",
    amount: 1250.0,
    merchant: "Luxury Electronics Store",
    location: "Beverly Hills, CA",
    timestamp: new Date().toISOString(),
    user_id: "user-demo-456",
  })

  const [feedbackSent, setFeedbackSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCustomerResponse = async (response: "legitimate" | "fraudulent") => {
    setIsLoading(true)

    try {
      const apiResponse = await fetch("/api/customer-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: currentTransaction.transaction_id,
          user_response: response,
          user_id: currentTransaction.user_id,
        }),
      })

      if (apiResponse.ok) {
        setFeedbackSent(true)
        toast.success(
          response === "legitimate"
            ? "Thank you! Your account will be unlocked shortly."
            : "Thank you for confirming. We've secured your account.",
        )
      }
    } catch (error) {
      toast.error("Failed to send response. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetDemo = () => {
    setFeedbackSent(false)
    setCurrentTransaction({
      ...currentTransaction,
      transaction_id: `txn-mobile-demo-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Mobile App Demo</h1>
          <p className="text-muted-foreground mt-1">Customer Security Companion Interface</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mobile App Simulation */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Mobile App Simulation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Phone Frame */}
              <div className="mx-auto w-80 h-[600px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden flex flex-col">
                  {/* Status Bar */}
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 flex items-center justify-between px-4 text-xs">
                    <span>9:41</span>
                    <span>100%</span>
                  </div>

                  {/* App Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    {!feedbackSent ? (
                      <>
                        {/* Alert Header */}
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                          </div>
                          <h2 className="text-xl font-bold text-foreground">Security Alert</h2>
                          <p className="text-sm text-muted-foreground mt-1">Suspicious transaction detected</p>
                        </div>

                        {/* Transaction Details */}
                        <Card className="mb-6">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">
                                  ${currentTransaction.amount.toLocaleString()}
                                </div>
                                <div className="text-lg font-semibold text-muted-foreground">
                                  {currentTransaction.merchant}
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{currentTransaction.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{new Date(currentTransaction.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Question */}
                        <div className="text-center mb-6">
                          <h3 className="text-lg font-semibold text-foreground mb-2">Was this you?</h3>
                          <p className="text-sm text-muted-foreground">We detected unusual activity on your account</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mt-auto">
                          <Button
                            className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                            onClick={() => handleCustomerResponse("legitimate")}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Yes, this was me
                              </>
                            )}
                          </Button>

                          <Button
                            variant="destructive"
                            className="w-full h-12 text-lg"
                            onClick={() => handleCustomerResponse("fraudulent")}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 mr-2" />
                                No, this was not me
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    ) : (
                      /* Success State */
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-2">Thank You!</h2>
                        <p className="text-muted-foreground mb-6">
                          Your response has been recorded and appropriate action has been taken.
                        </p>
                        <Button onClick={resetDemo} className="w-full">
                          Try Another Demo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Badge className="mt-1">1</Badge>
                  <div>
                    <h4 className="font-semibold">Fraud Detection</h4>
                    <p className="text-sm text-muted-foreground">
                      Aegis AI detects suspicious transaction patterns in real-time
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge className="mt-1">2</Badge>
                  <div>
                    <h4 className="font-semibold">Instant Notification</h4>
                    <p className="text-sm text-muted-foreground">Customer receives immediate SMS/push notification</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge className="mt-1">3</Badge>
                  <div>
                    <h4 className="font-semibold">Quick Verification</h4>
                    <p className="text-sm text-muted-foreground">Simple "Yes/No" interface for immediate response</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Badge className="mt-1">4</Badge>
                  <div>
                    <h4 className="font-semibold">Automated Resolution</h4>
                    <p className="text-sm text-muted-foreground">
                      System automatically unlocks account or maintains security
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Real-time transaction display</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Interactive response buttons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Loading states and feedback</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">API integration simulation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
