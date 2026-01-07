/**
 * Learn Page
 * Educational resources about Alzheimer's disease
 */

import { PageLayout } from '../components';
import { 
  BookOpen, 
  Search,
  Brain,
  Heart,
  Users,
  Video,
  FileText,
  CheckCircle,
  Code,
  ChevronRight
} from 'lucide-react';

const Learn = () => {
  // Educational content categories
  const categories = [
    { 
      icon: Brain, 
      color: 'blue',
      title: 'Understanding Alzheimer\'s',
      description: 'Disease stages, causes, and progression',
      articles: 12
    },
    { 
      icon: Heart, 
      color: 'green',
      title: 'Caregiver Wellness',
      description: 'Self-care tips and stress management',
      articles: 8
    },
    { 
      icon: Users, 
      color: 'orange',
      title: 'Communication Tips',
      description: 'How to connect with your loved one',
      articles: 10
    },
    { 
      icon: FileText, 
      color: 'purple',
      title: 'Daily Care Guides',
      description: 'Practical advice for everyday tasks',
      articles: 15
    },
  ];

  // Placeholder article cards
  const featuredArticles = [
    { title: '10 Early Warning Signs of Alzheimer\'s', readTime: '5 min read', category: 'Basics' },
    { title: 'Creating a Safe Home Environment', readTime: '8 min read', category: 'Safety' },
    { title: 'Managing Sundowning Symptoms', readTime: '6 min read', category: 'Care' },
    { title: 'Self-Care for Caregivers', readTime: '4 min read', category: 'Wellness' },
  ];

  return (
    <PageLayout
      title="Learn"
      description="Access educational resources, articles, and guides to better understand and manage Alzheimer's care."
      icon={BookOpen}
      bunnyImage="/assets/bunny2.svg"
      themeColor="#A88FD9"
    >
      {/* Search Bar (Non-functional) */}
      <div className="search-bar">
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Search articles, guides, videos..."
          disabled
        />
      </div>

      {/* Simulation Practice Feature */}
      <section className="section">
        <h3 className="section-title">
          <Video size={20} />
          Simulation Practice
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Practice real-world caregiving scenarios in a safe, interactive environment.
        </p>
        <div className="card" style={{ marginBottom: '12px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--radius-md)', 
              background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Brain size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Memory Care Scenarios</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interactive practice exercises</p>
            </div>
            <ChevronRight size={20} style={{ color: 'var(--text-light)' }} />
          </div>
        </div>
        <div className="card" style={{ marginBottom: '12px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--radius-md)', 
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Users size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Communication Training</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Practice effective dialogue techniques</p>
            </div>
            <ChevronRight size={20} style={{ color: 'var(--text-light)' }} />
          </div>
        </div>
        <div className="card" style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: 'var(--radius-md)', 
              background: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Heart size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Crisis Management</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Handle challenging situations</p>
            </div>
            <ChevronRight size={20} style={{ color: 'var(--text-light)' }} />
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section className="section">
        <h3 className="section-title">
          <BookOpen size={20} />
          Browse Categories
        </h3>
        {categories.map(({ icon: Icon, color, title, description, articles }, index) => (
          <div key={index} className="category-card">
            <div className={`category-icon ${color}`}>
              <Icon size={24} />
            </div>
            <div className="category-content">
              <h4>{title}</h4>
              <p>{description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.8rem' }}>{articles}</span>
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </section>

      {/* Featured Articles */}
      <section className="section">
        <h3 className="section-title">
          <FileText size={20} />
          Featured Articles
        </h3>
        {featuredArticles.map((article, index) => (
          <div key={index} className="card" style={{ marginBottom: '12px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  background: 'var(--primary-100)', 
                  color: 'var(--primary-600)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  {article.category}
                </span>
                <h4 style={{ fontSize: '1rem', marginBottom: '6px' }}>{article.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{article.readTime}</p>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-light)' }} />
            </div>
          </div>
        ))}
      </section>

      {/* Video Resources Placeholder */}
      <section className="section">
        <h3 className="section-title">
          <Video size={20} />
          Video Resources
        </h3>
        <div style={{ 
          background: 'var(--neutral-100)', 
          borderRadius: 'var(--radius-md)',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <Video size={48} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Video tutorials and guides coming soon
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Learn;
