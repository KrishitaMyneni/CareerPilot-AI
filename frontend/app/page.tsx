import Link from "next/link";
import {
  MessageSquare,
  FileText,
  BarChart3,
  Map,
  Lightbulb,
  Sparkles
} from "lucide-react";

const features = [
  {
    title: "Career Guidance",
    description: "Get personalized career advice and explore opportunities tailored to your profile",
    icon: MessageSquare,
    href: "/chat",
  },
  {
    title: "Resume Analysis",
    description: "Analyze your resume, get ATS scores, and improve your chances of landing interviews",
    icon: FileText,
    href: "/resume",
  },
  {
    title: "Skill Gap Assessment",
    description: "Identify missing skills and prioritize what to learn next to reach your goals",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    title: "Learning Roadmaps",
    description: "Get personalized step-by-step learning paths with milestones and resources",
    icon: Map,
    href: "/roadmap",
  },
  {
    title: "Project Recommendations",
    description: "Build an impressive portfolio with project ideas matching your skill level",
    icon: Lightbulb,
    href: "/projects",
  },
  {
    title: "Interview Prep",
    description: "Practice with mock interviews and get ready for your dream job",
    icon: MessageSquare,
    href: "/chat",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Your AI Career Mentor
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto">
              Get personalized guidance, analyze your resume, identify skill gaps, and build a roadmap to your dream career with AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Link>
              <Link
                href="/chat"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Start Chatting
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive tools designed to help engineering students navigate their career journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="p-7 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-emerald-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-800 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Ready to get started?</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Transform Your Career Today
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Build your profile and start your journey with CareerPilot AI
          </p>
          <Link
            href="/profile"
            className="inline-block px-10 py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Your Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
