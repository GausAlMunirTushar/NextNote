// app/enterprise/page.tsx
"use client";

import type React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Zap,
  Lock,
  Building,
  Globe,
  BarChart3,
  HeadphonesIcon,
  CheckCircle2,
  ArrowRight,
  Server,
  Workflow,
  FileCheck,
  CloudCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EnterprisePage() {
  const features = [
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "SOC 2 Type II compliant with advanced security controls, encryption, and compliance certifications.",
    },
    {
      icon: Users,
      title: "Admin & Team Management",
      description: "Centralized user management, role-based access control, and team collaboration tools.",
    },
    {
      icon: Server,
      title: "Self-Hosting Options",
      description: "Deploy on-premises or in your private cloud with full control over your data.",
    },
    {
      icon: Workflow,
      title: "Custom Workflows",
      description: "Tailor NextNote to your business processes with custom templates and automation.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Gain insights into team productivity and content engagement with detailed analytics.",
    },
    {
      icon: CloudCog,
      title: "SLA Guarantee",
      description: "99.9% uptime SLA with dedicated support and priority incident response.",
    },
  ];

  const securityFeatures = [
    "SOC 2 Type II Compliance",
    "GDPR & CCPA Ready",
    "End-to-End Encryption",
    "SSO & SAML Integration",
    "Advanced Audit Logs",
    "Data Loss Prevention",
    "Custom Retention Policies",
    "Penetration Testing",
  ];

  const integrationFeatures = [
    {
      name: "Slack",
      description: "Real-time notifications and quick actions",
    },
    {
      name: "Microsoft Teams",
      description: "Seamless collaboration within Teams",
    },
    {
      name: "Google Workspace",
      description: "Single sign-on and calendar integration",
    },
    {
      name: "Salesforce",
      description: "Connect customer data with notes",
    },
    {
      name: "Jira",
      description: "Link project documentation with tasks",
    },
    {
      name: "GitHub",
      description: "Technical documentation and code reviews",
    },
  ];

  const pricingPlans = [
    {
      name: "Business",
      price: "$20",
      period: "per user/month",
      description: "For teams that need advanced security and collaboration",
      features: [
        "Up to 100 users",
        "Advanced security controls",
        "Custom templates",
        "Priority support",
        "99.5% uptime SLA",
        "Basic analytics",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "per user/month",
      description: "Full enterprise capabilities with dedicated support",
      features: [
        "Unlimited users",
        "SOC 2 Compliance",
        "Self-hosting options",
        "24/7 dedicated support",
        "99.9% uptime SLA",
        "Advanced analytics",
        "Custom workflows",
        "SAML/SSO integration",
      ],
      cta: "Contact Sales",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Building className="h-4 w-4" />
              <span>Enterprise Grade</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              NextNote for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Enterprise
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Secure, scalable note-taking and documentation platform built for 
              the world's most demanding organizations.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" asChild className="text-base px-8">
                <Link href="#contact">Contact Sales</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base bg-transparent px-8"
              >
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Trusted by teams at
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {["Microsoft", "Google", "Amazon", "Meta", "Netflix", "Stripe"].map((company) => (
              <div
                key={company}
                className="text-center text-lg font-semibold text-muted-foreground"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for scale and security
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything your organization needs to collaborate securely and efficiently.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full border hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Lock className="h-4 w-4" />
                <span>Enterprise Security</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Security you can trust
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                NextNote Enterprise meets the highest security standards with comprehensive 
                compliance certifications, advanced encryption, and robust access controls 
                to protect your most sensitive information.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-8 border shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Compliance Ready</h3>
                      <p className="text-muted-foreground text-sm">
                        Fully compliant with industry standards
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-background border">
                      <div className="text-2xl font-bold text-primary">SOC 2</div>
                      <div className="text-xs text-muted-foreground">Type II</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background border">
                      <div className="text-2xl font-bold text-primary">GDPR</div>
                      <div className="text-xs text-muted-foreground">Ready</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background border">
                      <div className="text-2xl font-bold text-primary">CCPA</div>
                      <div className="text-xs text-muted-foreground">Compliant</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-background border">
                      <div className="text-2xl font-bold text-primary">HIPAA</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Seamless integrations
            </h2>
            <p className="text-xl text-muted-foreground">
              Connect NextNote with your existing tools and workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {integrationFeatures.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border">
                  <CardContent className="p-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for your organization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.7 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className={`h-full border-2 ${plan.popular ? "border-primary shadow-xl" : "border-border"} relative overflow-hidden`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.price !== "Custom" && (
                          <span className="text-muted-foreground">{plan.period}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      size="lg"
                      className={`w-full ${plan.popular ? "" : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground"}`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-primary text-primary-foreground border-none shadow-2xl">
              <CardContent className="p-12 text-center">
                <HeadphonesIcon className="h-12 w-12 mx-auto mb-6 opacity-90" />
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to get started?
                </h2>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                  Schedule a personalized demo with our enterprise team and see how NextNote can transform your organization's productivity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-base px-8"
                    asChild
                  >
                    <Link href="/contact">
                      Contact Sales
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}