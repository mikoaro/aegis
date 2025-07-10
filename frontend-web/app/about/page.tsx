import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Brain, Users, ArrowRight, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Aegis</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">AI-Powered Real-Time Fraud Detection & Remediation</p>
          <Badge variant="secondary" className="text-sm">
            Autonomous Security for Modern Finance
          </Badge>
        </div>

        {/* How It Works Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span>How Aegis Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Aegis represents a paradigm shift from passive fraud detection to active, agentic remediation. Unlike
                traditional systems that simply flag suspicious transactions, Aegis employs an AI agent that
                autonomously orchestrates complex, multi-step response workflows in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Real-Time Detection</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Amazon Kinesis streams process transactions in real-time</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>AWS Lambda functions score fraud risk using Amazon Bedrock AI</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>EventBridge triggers immediate response workflows</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <span>Agentic Remediation</span>
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Bedrock Agent orchestrates multi-step responses</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Step Functions manage stateful workflows</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Lambda tools execute account locks, alerts, and tickets</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Architecture Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Ingestion Layer</h4>
                  <p className="text-sm text-muted-foreground">
                    Kinesis Data Streams capture high-volume transaction events
                  </p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-purple-500" />
                  </div>
                  <h4 className="font-semibold mb-2">AI Processing</h4>
                  <p className="text-sm text-muted-foreground">Bedrock models analyze patterns and score fraud risk</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <h4 className="font-semibold mb-2">Response Layer</h4>
                  <p className="text-sm text-muted-foreground">
                    Automated remediation through intelligent agent orchestration
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Demo Walkthrough</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Experience the complete Aegis workflow through our interactive demonstration:
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Command Center Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Visit the Command Center to see real-time threat detection in action. Watch as suspicious
                      transactions appear in the Live Threat Feed with detailed risk scores.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-12">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click on any threat to view detailed agent actions
                  </span>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Agent Action Timeline</h4>
                    <p className="text-sm text-muted-foreground">
                      Observe the Agent Action Log showing the complete sequence of automated responses: account locks,
                      customer alerts, and investigation ticket creation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-12">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Each action includes precise timestamps and status indicators
                  </span>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Analyst Override</h4>
                    <p className="text-sm text-muted-foreground">
                      Test the innovative "Override & Unlock" feature with optimistic UI updates. Experience instant
                      visual feedback while the system processes the unlock request.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-12">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Uses React 19's useOptimistic hook for seamless UX
                  </span>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Customer Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      Try the Mobile Demo to see the customer-facing security companion. Experience the simple "Was this
                      you?" verification flow.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-12">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Immediate feedback loop closes the security verification process
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <Card>
          <CardHeader>
            <CardTitle>Key Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">For Financial Institutions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Millisecond response times prevent fraud losses</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Reduced operational costs through automation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Complete audit trail for compliance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Scalable serverless architecture</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">For Customers</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Immediate fraud protection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Simple verification process</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Transparent security actions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Reduced false positive friction</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
