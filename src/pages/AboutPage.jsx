// src/pages/AboutPage.jsx
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import { 
  Code, 
  Users, 
  Globe, 
  Shield, 
  Lock, 
  Heart 
} from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();

  const featuresList = [
    {
      icon: Code,
      title: "Open Source",
      description: "JToolset is completely open-source. All our tools are freely available and community-driven."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Developed and maintained by developers, for developers. Contributions are always welcome!"
    },
    {
      icon: Globe,
      title: "Multiple Languages",
      description: "Supports multiple languages to help developers worldwide."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All processing happens in your browser. No data is sent to our servers."
    },
    {
      icon: Lock,
      title: "Secure",
      description: "We prioritize security and ensure minimal data handling."
    }
  ];

  const teamMembers = [
    {
      name: "Trinh Ta",
      role: "Lead Developer",
      bio: "Passionate about creating developer tools that solve real-world problems."
    },
    {
      name: "Trinh Ta",
      role: "UI/UX Designer",
      bio: "Design enthusiast focused on creating intuitive and clean interfaces."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t('app.name')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t('common.desc')}
        </p>
      </div>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuresList.map((feature, index) => (
          <Card 
            key={index} 
            className="p-6 text-center transition-all hover:shadow-md"
          >
            <div className="flex flex-col items-center">
              <feature.icon 
                className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" 
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          </Card>
        ))}
      </section>

      {/* Team Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Our Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              className="p-6 text-center transition-all hover:shadow-md"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gray-100 dark:bg-gray-800 p-12 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Join Our Community
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          Want to contribute or have suggestions?
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="https://github.com/tatv-dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 
            border border-transparent text-base font-medium rounded-md 
            text-white bg-primary-600 hover:bg-primary-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-primary-500"
          >
            <Heart className="mr-2 h-5 w-5" /> Contribute on GitHub
          </a>
          <Link
            to="/tools"
            className="inline-flex items-center justify-center px-6 py-3 
            border border-gray-300 dark:border-gray-700 
            text-base font-medium rounded-md 
            text-gray-700 dark:text-gray-300 
            hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Explore Tools
          </Link>
        </div>
      </section>
    </div>
  );
}