'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Youtube, Download, Search, Star, Zap, Shield, Globe, ChevronRight, 
  FileSpreadsheet, FileText, Play, Users, ArrowRight, Menu, X,
  LogOut, BarChart3, Crown, Check, Clock, TrendingUp, MessageSquare,
  Database, Settings, Sparkles, Target, Award, UserCheck, Instagram,
  Facebook, Linkedin, Twitter
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

// Types
interface Comment {
  id: string;
  authorName: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
}

interface VideoInfo {
  id: string;
  title: string;
  thumbnailUrl: string;
  commentCount: number;
}

// View types
type ViewType = 'landing' | 'login' | 'signup' | 'dashboard' | 'admin';

// Modal types for footer links
type ModalType = 'blog' | 'api-docs' | 'help-center' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'gdpr' | null;

export default function CommentFlowApp() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (currentView === 'login' || currentView === 'signup') {
        setCurrentView('dashboard');
      }
    }
  }, [isAuthenticated, user, currentView]);

  const handleLogout = async () => {
    await logout();
    setCurrentView('landing');
    toast.success('Logged out successfully');
  };

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  // Navigation component
  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigateTo('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text-vibrant">CommentFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigateTo('dashboard')} className="font-medium">
                  Dashboard
                </Button>
                {user?.role === 'ADMIN' && (
                  <Button variant="ghost" onClick={() => navigateTo('admin')}>
                    Admin
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{user?.email}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Crown className="w-3 h-3 mr-1" />
                    Free
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
                <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
                <Button variant="ghost" onClick={() => navigateTo('login')}>
                  Login
                </Button>
                <Button onClick={() => navigateTo('signup')} className="btn-3d">
                  Get Started Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigateTo('dashboard')}>
                  Dashboard
                </Button>
                {user?.role === 'ADMIN' && (
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigateTo('admin')}>
                    Admin Panel
                  </Button>
                )}
                <Separator />
                <div className="text-sm text-muted-foreground px-3">{user?.email}</div>
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <a href="#features" className="block py-2 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="block py-2 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#faq" className="block py-2 text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
                <Separator />
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigateTo('login')}>
                  Login
                </Button>
                <Button className="w-full" onClick={() => navigateTo('signup')}>
                  Get Started Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  // Info Modal Component
  const InfoModal = () => {
    if (!activeModal) return null;

    const modalContent: Record<Exclude<ModalType, null>, { title: string; icon: React.ReactNode; content: React.ReactNode }> = {
      'blog': {
        title: 'Blog',
        icon: <FileText className="w-6 h-6" />,
        content: (
          <div className="space-y-6">
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Latest Articles</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-violet-500 pl-4">
                  <h4 className="font-semibold">How to Analyze YouTube Comments for Better Engagement</h4>
                  <p className="text-sm text-muted-foreground mt-1">Learn strategies to understand your audience through comment analysis.</p>
                  <span className="text-xs text-violet-600">Jan 15, 2024 • 8 min read</span>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">Top 10 Uses for Exported Comment Data</h4>
                  <p className="text-sm text-muted-foreground mt-1">Discover creative ways to leverage comment data for your business.</p>
                  <span className="text-xs text-violet-600">Jan 10, 2024 • 6 min read</span>
                </div>
                <div className="border-l-4 border-pink-500 pl-4">
                  <h4 className="font-semibold">Instagram Comment Marketing: Complete Guide 2024</h4>
                  <p className="text-sm text-muted-foreground mt-1">Master Instagram engagement with our comprehensive guide.</p>
                  <span className="text-xs text-violet-600">Jan 5, 2024 • 12 min read</span>
                </div>
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">Get the latest tips, tutorials, and updates delivered to your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 input-3d rounded-lg" />
                <Button className="btn-3d">Subscribe</Button>
              </div>
            </div>
          </div>
        )
      },
      'api-docs': {
        title: 'API Documentation',
        icon: <Database className="w-6 h-6" />,
        content: (
          <div className="space-y-6">
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Getting Started</h3>
              <p className="text-sm text-muted-foreground mb-4">CommentFlow offers a powerful API for developers to integrate comment extraction into their applications.</p>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-600">{'// Fetch YouTube Comments'}</div>
                <div className="text-muted-foreground">{'POST /api/youtube/fetch'}</div>
                <div className="mt-2 text-blue-600">{'{'}</div>
                <div className="pl-4">{'"videoUrl": "https://youtube.com/watch?v=..."'}</div>
                <div className="text-blue-600">{'}'}</div>
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Available Endpoints</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Badge className="bg-green-500 text-white">POST</Badge>
                  <code className="text-sm">/api/youtube/fetch</code>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Badge className="bg-blue-500 text-white">POST</Badge>
                  <code className="text-sm">/api/youtube/download</code>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Badge className="bg-green-500 text-white">POST</Badge>
                  <code className="text-sm">/api/instagram/fetch</code>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Badge className="bg-blue-500 text-white">POST</Badge>
                  <code className="text-sm">/api/instagram/download</code>
                </div>
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Rate Limits</h3>
              <p className="text-sm text-muted-foreground">Free tier: 100 requests/day. Contact us for higher limits.</p>
            </div>
          </div>
        )
      },
      'help-center': {
        title: 'Help Center',
        icon: <Shield className="w-6 h-6" />,
        content: (
          <div className="space-y-6">
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {[
                  { q: 'How do I download YouTube comments?', a: 'Simply paste a YouTube URL, click "Fetch Comments", then download as CSV or Excel.' },
                  { q: 'Is CommentFlow really free?', a: 'Yes! CommentFlow is 100% free with unlimited downloads.' },
                  { q: 'Can I download Instagram comments?', a: 'Yes! Switch to the Instagram tab and paste any Instagram post URL.' },
                  { q: 'What formats are supported?', a: 'We support CSV and Excel (XLSX) formats for export.' },
                ].map((item, i) => (
                  <div key={i} className="border-b border-border pb-3 last:border-0">
                    <h4 className="font-semibold text-primary">{item.q}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Video Tutorials</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <Play className="w-8 h-8 mx-auto mb-2 text-violet-500" />
                  <span className="text-sm font-medium">Getting Started</span>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <Play className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <span className="text-sm font-medium">Advanced Features</span>
                </div>
              </div>
            </div>
          </div>
        )
      },
      'contact': {
        title: 'Contact Us',
        icon: <Users className="w-6 h-6" />,
        content: (
          <div className="space-y-6">
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Get in Touch</h3>
              <p className="text-sm text-muted-foreground mb-4">Have questions or feedback? We'd love to hear from you!</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input type="text" placeholder="Your name" className="w-full mt-1 px-4 py-2 input-3d rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" placeholder="your@email.com" className="w-full mt-1 px-4 py-2 input-3d rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea placeholder="How can we help?" rows={4} className="w-full mt-1 px-4 py-2 input-3d rounded-lg resize-none" />
                </div>
                <Button className="w-full btn-3d">Send Message</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-3d glass-card p-4 text-center">
                <Globe className="w-6 h-6 mx-auto mb-2 text-violet-500" />
                <span className="text-sm font-medium">Support</span>
                <p className="text-xs text-muted-foreground mt-1">support@commentflow.io</p>
              </div>
              <div className="card-3d glass-card p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <span className="text-sm font-medium">Response Time</span>
                <p className="text-xs text-muted-foreground mt-1">Within 24 hours</p>
              </div>
            </div>
          </div>
        )
      },
      'privacy': {
        title: 'Privacy Policy',
        icon: <Shield className="w-6 h-6" />,
        content: (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Data Collection</h3>
              <p className="text-sm text-muted-foreground">We collect minimal data necessary to provide our services:</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Email address (for account creation)</li>
                <li>• Usage statistics (download counts, preferences)</li>
                <li>• API keys (for YouTube/Instagram integration)</li>
              </ul>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">How We Use Your Data</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Provide comment extraction services</li>
                <li>• Improve user experience</li>
                <li>• Send important notifications</li>
                <li>• Prevent abuse and ensure security</li>
              </ul>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Data Security</h3>
              <p className="text-sm text-muted-foreground">We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.</p>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Your Rights</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Access your personal data</li>
                <li>• Request data deletion</li>
                <li>• Export your data</li>
                <li>• Opt-out of communications</li>
              </ul>
            </div>
          </div>
        )
      },
      'terms': {
        title: 'Terms of Service',
        icon: <FileText className="w-6 h-6" />,
        content: (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">1. Acceptance of Terms</h3>
              <p className="text-sm text-muted-foreground">By using CommentFlow, you agree to these terms. If you disagree with any part, you may not access our service.</p>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">2. Use License</h3>
              <p className="text-sm text-muted-foreground">Permission is granted to temporarily use CommentFlow for personal or commercial purposes. This is the grant of a license, not a transfer of title.</p>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">3. User Responsibilities</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use the service lawfully</li>
                <li>• Respect YouTube and Instagram terms</li>
                <li>• Do not attempt to overload our servers</li>
                <li>• Do not use for spam or harassment</li>
              </ul>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">4. Disclaimer</h3>
              <p className="text-sm text-muted-foreground">CommentFlow is provided "as is" without warranties. We are not liable for any damages arising from the use of our service.</p>
            </div>
          </div>
        )
      },
      'cookies': {
        title: 'Cookie Policy',
        icon: <Settings className="w-6 h-6" />,
        content: (
          <div className="space-y-4">
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">What Are Cookies?</h3>
              <p className="text-sm text-muted-foreground">Cookies are small text files stored on your device that help us provide a better experience.</p>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Cookies We Use</h3>
              <div className="space-y-3 mt-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <span className="font-medium text-sm">auth-token</span>
                    <p className="text-xs text-muted-foreground">Keeps you logged in</p>
                  </div>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <span className="font-medium text-sm">preferences</span>
                    <p className="text-xs text-muted-foreground">Saves your settings</p>
                  </div>
                  <Badge variant="outline">Functional</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <span className="font-medium text-sm">analytics</span>
                    <p className="text-xs text-muted-foreground">Helps us improve</p>
                  </div>
                  <Badge variant="outline">Analytics</Badge>
                </div>
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Managing Cookies</h3>
              <p className="text-sm text-muted-foreground">You can disable cookies in your browser settings. Note that some features may not work properly without essential cookies.</p>
            </div>
          </div>
        )
      },
      'gdpr': {
        title: 'GDPR Compliance',
        icon: <Globe className="w-6 h-6" />,
        content: (
          <div className="space-y-4">
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Your Rights Under GDPR</h3>
              <p className="text-sm text-muted-foreground mb-4">As a EU resident, you have the following rights:</p>
              <div className="grid grid-cols-2 gap-3">
                {['Right to Access', 'Right to Rectification', 'Right to Erasure', 'Right to Portability', 'Right to Restrict', 'Right to Object'].map((right, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{right}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Data Processing</h3>
              <p className="text-sm text-muted-foreground">We process your data based on:</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Your consent</li>
                <li>• Contractual necessity</li>
                <li>• Legitimate business interests</li>
                <li>• Legal obligations</li>
              </ul>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Data Retention</h3>
              <p className="text-sm text-muted-foreground">We retain your data only as long as necessary. You can request deletion at any time by contacting us or using your account settings.</p>
            </div>
            <div className="card-3d glass-card p-6">
              <h3 className="text-lg font-bold gradient-text-vibrant mb-3">Data Transfers</h3>
              <p className="text-sm text-muted-foreground">Your data may be processed outside the EEA. We ensure appropriate safeguards are in place.</p>
            </div>
          </div>
        )
      }
    };

    const current = modalContent[activeModal];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
        <div 
          className="w-full max-w-2xl max-h-[85vh] overflow-hidden bg-background rounded-2xl shadow-2xl border border-border animate-fade-in-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg icon-gradient-purple flex items-center justify-center text-white">
                {current.icon}
              </div>
              <h2 className="text-xl font-bold gradient-text-vibrant">{current.title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setActiveModal(null)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
            {current.content}
          </div>
        </div>
      </div>
    );
  };

  // Landing Page
  const LandingPage = () => (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            #1 Free Comments Downloader
            <Badge variant="secondary" className="ml-2 bg-green-500 text-white text-xs">2024</Badge>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-8 leading-tight animate-fade-in-up">
            <span className="block">Download YouTube & Instagram Comments</span>
            <span className="gradient-text-vibrant block mt-2">Free, Fast & Unlimited</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
            Extract, analyze, and export <strong>YouTube</strong> and <strong>Instagram</strong> comments to <strong>CSV</strong> or <strong>Excel</strong> in seconds. 
            The most powerful <em>free comment downloader</em> trusted by 50,000+ creators, marketers, and researchers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up">
            <Button 
              size="lg" 
              onClick={() => navigateTo('signup')} 
              className="btn-3d text-lg px-10 py-6 h-auto rounded-xl"
            >
              Start Downloading Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigateTo('signup')} 
              className="text-lg px-10 py-6 h-auto rounded-xl border-2"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Unlimited Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>No Registration Needed</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white dark:border-gray-800"></div>
                ))}
              </div>
              <span className="text-sm font-medium">50,000+ Users</span>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm font-medium ml-2">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium">1M+ Comments Downloaded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Active Users', icon: Users },
              { value: '1M+', label: 'Comments Extracted', icon: MessageSquare },
              { value: '100%', label: 'Free Forever', icon: Crown },
              { value: '4.9★', label: 'User Rating', icon: Star },
            ].map((stat, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text-vibrant">CommentFlow</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The most comprehensive YouTube and Instagram comment extraction tool with powerful features designed for creators, marketers, and researchers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Zap, 
                title: 'Lightning Fast Extraction', 
                desc: 'Extract thousands of YouTube comments in just seconds. Our optimized engine handles large video comment sections effortlessly.',
                highlight: 'Up to 1000 comments/minute'
              },
              { 
                icon: FileText, 
                title: 'Export to CSV Format', 
                desc: 'Download comments as CSV files compatible with Excel, Google Sheets, and any data analysis tool. Perfect for bulk processing.',
                highlight: 'Universal compatibility'
              },
              { 
                icon: FileSpreadsheet, 
                title: 'Export to Excel (XLSX)', 
                desc: 'Get beautifully formatted Excel files with proper columns, headers, and styling. Ready for immediate analysis.',
                highlight: 'Professional formatting'
              },
              { 
                icon: Search, 
                title: 'Advanced Search & Filter', 
                desc: 'Search comments by keywords, filter by date range, sort by likes, and find exactly what you need instantly.',
                highlight: 'Powerful filtering'
              },
              { 
                icon: Globe, 
                title: 'Works on Any Device', 
                desc: 'Fully responsive design works perfectly on desktop, tablet, and mobile. Extract comments from anywhere.',
                highlight: 'Mobile optimized'
              },
              { 
                icon: Shield, 
                title: '100% Secure & Private', 
                desc: 'We never store your YouTube comments or personal data. All extractions happen in real-time with complete privacy.',
                highlight: 'Privacy first'
              },
            ].map((feature, i) => (
              <div key={i} className="card-3d glass-card p-6 group">
                <div className="w-14 h-14 rounded-xl icon-gradient-purple flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 gradient-text-purple">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{feature.desc}</p>
                <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                  {feature.highlight}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Extract YouTube Comments in <span className="gradient-text-cyan">3 Simple Steps</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No complicated setup. No technical knowledge required. Get your comments in under 30 seconds.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                title: 'Paste YouTube URL', 
                desc: 'Copy any YouTube video URL and paste it into CommentFlow. We support all YouTube URL formats including shorts.',
                icon: Youtube
              },
              { 
                step: '02', 
                title: 'Fetch Comments', 
                desc: 'Click the "Fetch Comments" button and watch as we extract all available comments with author names, likes, and dates.',
                icon: Search
              },
              { 
                step: '03', 
                title: 'Download & Export', 
                desc: 'Choose CSV or Excel format and download your comments instantly. Use filters to find specific comments before exporting.',
                icon: Download
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="card-3d glass-card p-8 text-center relative z-10">
                  <div className="w-20 h-20 rounded-2xl icon-gradient-cyan mx-auto mb-6 flex items-center justify-center">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold flex items-center justify-center text-lg shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-violet-400 z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Use Cases</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Who Uses <span className="gradient-text-vibrant">CommentFlow</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our free YouTube comment downloader is trusted by professionals worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: TrendingUp, 
                title: 'Marketers', 
                desc: 'Analyze audience sentiment, track brand mentions, and understand customer feedback across YouTube videos.',
                color: 'icon-gradient-purple'
              },
              { 
                icon: Youtube, 
                title: 'Content Creators', 
                desc: 'Engage with your audience, find popular comments, and understand what resonates with your viewers.',
                color: 'icon-gradient-cyan'
              },
              { 
                icon: Database, 
                title: 'Researchers', 
                desc: 'Collect data for academic research, sentiment analysis, and social media studies from YouTube.',
                color: 'icon-gradient-pink'
              },
              { 
                icon: Target, 
                title: 'Businesses', 
                desc: 'Monitor competitor videos, gather customer insights, and track product feedback in bulk.',
                color: 'icon-gradient-green'
              },
            ].map((useCase, i) => (
              <div key={i} className="card-3d glass-card p-6 text-center">
                <div className={`w-16 h-16 rounded-xl ${useCase.color} flex items-center justify-center mx-auto mb-4`}>
                  <useCase.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by <span className="gradient-text-vibrant">50,000+ Users</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our users say about CommentFlow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                name: 'Sarah Mitchell', 
                role: 'YouTube Creator (500K subs)', 
                text: 'CommentFlow has completely transformed how I engage with my audience. I can now analyze thousands of comments in minutes and respond to the most engaged fans. This tool is absolutely essential for any serious creator!',
                rating: 5
              },
              { 
                name: 'James Rodriguez', 
                role: 'Digital Marketing Manager', 
                text: 'We use CommentFlow weekly to track brand sentiment across YouTube. The CSV export feature makes it easy to create reports for our clients. Best of all, it\'s completely free - no hidden costs!',
                rating: 5
              },
              { 
                name: 'Dr. Emily Chen', 
                role: 'Social Media Researcher', 
                text: 'For my PhD research on online communities, I needed to analyze comments from hundreds of videos. CommentFlow made this possible without any budget. The data quality is excellent.',
                rating: 5
              },
            ].map((testimonial, i) => (
              <div key={i} className="card-3d glass-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text-cyan">Questions</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about CommentFlow
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: 'Is CommentFlow really 100% free?',
                a: 'Yes! CommentFlow is completely free with no hidden costs. We offer unlimited downloads, all features included, and no credit card required. We believe in providing value to the community without barriers.'
              },
              {
                q: 'How do I download YouTube comments using CommentFlow?',
                a: 'Simply paste any YouTube video URL into our dashboard, click "Fetch Comments", and then download as CSV or Excel. The process takes under 30 seconds and requires no technical knowledge.'
              },
              {
                q: 'What data is included in the exported comments?',
                a: 'Each exported comment includes: Author name, Comment text, Like count, Publication date, and Author channel ID. Both CSV and Excel formats include all this data in an organized format.'
              },
              {
                q: 'How many comments can I download at once?',
                a: 'You can download up to 1,000 comments per extraction in the free version. This covers the vast majority of use cases. For larger comment sections, you can run multiple extractions.'
              },
              {
                q: 'Is it legal to download YouTube comments?',
                a: 'Yes, downloading publicly available YouTube comments for personal or business analysis is legal. Comments are public data that users have chosen to share. Always respect privacy and use data responsibly.'
              },
              {
                q: 'Do you store my YouTube comments or personal data?',
                a: 'No. We never store your extracted comments or personal information. All extractions happen in real-time and data is only temporarily processed to generate your download file. Your privacy is our priority.'
              },
              {
                q: 'Can I filter or search comments before downloading?',
                a: 'Absolutely! CommentFlow includes powerful search and filter features. You can search by keywords, sort by date or likes, and filter comments before exporting to focus on what matters most.'
              },
              {
                q: 'What YouTube URL formats are supported?',
                a: 'We support all YouTube URL formats including: standard watch URLs (youtube.com/watch?v=), short URLs (youtu.be/), embed URLs, and YouTube Shorts. Just paste any valid YouTube video link.'
              },
            ].map((faq, i) => (
              <div key={i} className="card-3d glass-card p-6">
                <h3 className="text-lg font-bold mb-3 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">?</span>
                  {faq.q}
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-9">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Download YouTube Comments?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join 50,000+ creators, marketers, and researchers who trust CommentFlow for their YouTube comment analysis. 100% free, forever.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigateTo('signup')} 
            className="text-lg px-12 py-6 h-auto rounded-xl bg-white text-violet-600 hover:bg-gray-100 shadow-xl"
          >
            Get Started Free Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm opacity-75 mt-6">
            No credit card required • Unlimited downloads • Free forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50 mt-auto border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl gradient-text-vibrant">CommentFlow</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The #1 free YouTube comments downloader. Extract, analyze, and export comments in seconds.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setActiveModal('blog')} className="hover:text-foreground transition-colors text-left">Blog</button></li>
                <li><button onClick={() => setActiveModal('api-docs')} className="hover:text-foreground transition-colors text-left">API Documentation</button></li>
                <li><button onClick={() => setActiveModal('help-center')} className="hover:text-foreground transition-colors text-left">Help Center</button></li>
                <li><button onClick={() => setActiveModal('contact')} className="hover:text-foreground transition-colors text-left">Contact Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-foreground transition-colors text-left">Privacy Policy</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="hover:text-foreground transition-colors text-left">Terms of Service</button></li>
                <li><button onClick={() => setActiveModal('cookies')} className="hover:text-foreground transition-colors text-left">Cookie Policy</button></li>
                <li><button onClick={() => setActiveModal('gdpr')} className="hover:text-foreground transition-colors text-left">GDPR</button></li>
              </ul>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 CommentFlow. All rights reserved. Free YouTube Comments Downloader.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span>Made with ❤️ for creators worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  // Login Page
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        await checkAuth();
        toast.success('Welcome back!');
        navigateTo('dashboard');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Login failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 dashboard-bg">
        <Card className="w-full max-w-md card-3d glass-card">
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
              <Youtube className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl gradient-text-vibrant">Welcome Back</CardTitle>
            <CardDescription>Sign in to your CommentFlow account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-3d"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-3d"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full btn-3d" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{' '}
                <Button variant="link" className="p-0 h-auto text-violet-600" onClick={() => navigateTo('signup')}>
                  Sign up free
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  };

  // Signup Page
  const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        await checkAuth();
        toast.success('Account created successfully!');
        navigateTo('dashboard');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Registration failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 dashboard-bg">
        <Card className="w-full max-w-md card-3d glass-card">
          <CardHeader className="text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
              <Youtube className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl gradient-text-vibrant">Create Free Account</CardTitle>
            <CardDescription>Start extracting YouTube comments - completely free!</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-3d"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-3d"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-3d"
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full btn-3d" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Free Account'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Button variant="link" className="p-0 h-auto text-violet-600" onClick={() => navigateTo('login')}>
                  Sign in
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  };

  // Dashboard Page
  const DashboardPage = () => {
    const [platform, setPlatform] = useState<'youtube' | 'instagram' | 'facebook' | 'linkedin' | 'twitter'>('youtube');
    const [videoUrl, setVideoUrl] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'likes'>('date');
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
      fetchStats();
    }, []);

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    const handleFetchComments = async () => {
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
  setPlatform("youtube")
}

if (videoUrl.includes("instagram.com")) {
  setPlatform("instagram")
}

if (videoUrl.includes("facebook.com")) {
  setPlatform("facebook")
}

if (videoUrl.includes("linkedin.com")) {
  setPlatform("linkedin")
}

if (videoUrl.includes("twitter.com") || videoUrl.includes("x.com")) {
  setPlatform("twitter")
}
      if (!videoUrl.trim()) {
        toast.error(`Please enter a ${platform === 'youtube' ? 'YouTube' : 'Instagram'} URL`);
        return;
      }

      setLoading(true);
      setComments([]);
      setVideoInfo(null);
useEffect(() => {
  const interval = setInterval(() => {
    if (videoUrl) {
      handleFetchComments();
    }
  }, 15000);

  return () => clearInterval(interval);
}, [videoUrl, platform]);
      try {
        let endpoint = '';

if (platform === 'youtube') endpoint = '/api/youtube/fetch';
if (platform === 'instagram') endpoint = '/api/instagram/fetch';
if (platform === 'facebook') endpoint = '/api/facebook/fetch';
if (platform === 'linkedin') endpoint = '/api/linkedin/fetch';
if (platform === 'twitter') endpoint = '/api/twitter/fetch';
     let requestBody = {};

if (platform === 'youtube') requestBody = { videoUrl: videoUrl };
if (platform === 'instagram') requestBody = { postUrl: videoUrl };
if (platform === 'facebook') requestBody = { postUrl: videoUrl };
if (platform === 'linkedin') requestBody = { postUrl: videoUrl };
if (platform === 'twitter') requestBody = { tweetUrl: videoUrl };

let bodyData = {};

if (platform === 'youtube') {
  bodyData = { videoUrl: videoUrl };
}

if (platform === 'instagram') {
  bodyData = { postUrl: videoUrl };
}

if (platform === 'facebook') {
  bodyData = { postUrl: videoUrl };
}

if (platform === 'linkedin') {
  bodyData = { postUrl: videoUrl };
}

if (platform === 'twitter') {
  bodyData = { tweetUrl: videoUrl };
}

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bodyData),
});
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch comments');
        }

        setComments(data.comments);
        setVideoInfo(data.videoInfo || data.mediaInfo);
        toast.success(`Fetched ${data.comments.length} comments!`);
        fetchStats();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };

    const handleDownload = async (format: 'csv' | 'xlsx') => {
      if (comments.length === 0) {
        toast.error('No comments to download');
        return;
      }

      try {
        let endpoint = '';

if (platform === 'youtube') endpoint = '/api/youtube/download';
if (platform === 'instagram') endpoint = '/api/instagram/download';
if (platform === 'facebook') endpoint = '/api/facebook/download';
if (platform === 'linkedin') endpoint = '/api/linkedin/download';
if (platform === 'twitter') endpoint = '/api/twitter/download';
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            comments,
            videoId: videoInfo?.id,
            mediaId: videoInfo?.id,
            videoTitle: videoInfo?.title,
            mediaTitle: videoInfo?.title,
            format,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Download failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${platform}-comments-${videoInfo?.id || 'export'}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(`Downloaded as ${format.toUpperCase()}!`);
        fetchStats();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Download failed');
      }
    };

    const filteredComments = useMemo(() => {
      let result = [...comments];
      
      if (searchTerm) {
        result = result.filter(c => 
          c.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.textDisplay.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (sortBy === 'likes') {
        result.sort((a, b) => b.likeCount - a.likeCount);
      } else {
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
      
      return result;
    }, [comments, searchTerm, sortBy]);

    return (
      <div className="min-h-screen pt-20 pb-8 px-4 dashboard-bg">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text-vibrant">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Extract comments from YouTube & Instagram</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Downloads Today */}
            <div className="card-3d glass-card p-6 animate-fade-in-up-delay-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Downloads Today</p>
                  <div className="stat-number gradient-text-purple">{stats?.downloadsToday || 0}</div>
                </div>
                <div className="w-12 h-12 rounded-xl icon-gradient-purple flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Remaining */}
            <div className="card-3d glass-card p-6 animate-fade-in-up-delay-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <div className="stat-number gradient-text-cyan">∞</div>
                  <p className="text-xs text-muted-foreground mt-1">Unlimited</p>
                </div>
                <div className="w-12 h-12 rounded-xl icon-gradient-cyan flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Total Downloads */}
            <div className="card-3d glass-card p-6 animate-fade-in-up-delay-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Downloads</p>
                  <div className="stat-number gradient-text-vibrant">{stats?.totalDownloads || 0}</div>
                </div>
                <div className="w-12 h-12 rounded-xl icon-gradient-pink flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Plan */}
            <div className="card-3d glass-card p-6 animate-fade-in-up-delay-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Plan</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1">
                      <Crown className="w-3 h-3 mr-1" />
                      Free Forever
                    </Badge>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl icon-gradient-green flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Platform Tabs */}
          <div className="flex gap-2 mb-6 animate-fade-in-up">
            <Button
              variant={platform === 'youtube' ? 'default' : 'outline'}
              onClick={() => { setPlatform('youtube'); setVideoUrl(''); setComments([]); setVideoInfo(null); }}
              className={`flex items-center gap-2 ${platform === 'youtube' ? 'btn-3d' : ''}`}
            >
              <Youtube className="w-4 h-4" />
              YouTube
            </Button>
            <Button
              variant={platform === 'instagram' ? 'default' : 'outline'}
              onClick={() => { setPlatform('instagram'); setVideoUrl(''); setComments([]); setVideoInfo(null); }}
              className={`flex items-center gap-2 ${platform === 'instagram' ? 'btn-3d' : ''}`}
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Button>
              <Button
    variant={platform === 'facebook' ? 'default' : 'outline'}
    onClick={() => { setPlatform('facebook'); setVideoUrl(''); setComments([]); setVideoInfo(null); }}
    className={`flex items-center gap-2 ${platform === 'facebook' ? 'btn-3d' : ''}`}
  >
    Facebook
  </Button>

  <Button
    variant={platform === 'linkedin' ? 'default' : 'outline'}
    onClick={() => { setPlatform('linkedin'); setVideoUrl(''); setComments([]); setVideoInfo(null); }}
    className={`flex items-center gap-2 ${platform === 'linkedin' ? 'btn-3d' : ''}`}
  >
    LinkedIn
  </Button>

  <Button
    variant={platform === 'twitter' ? 'default' : 'outline'}
    onClick={() => { setPlatform('twitter'); setVideoUrl(''); setComments([]); setVideoInfo(null); }}
    className={`flex items-center gap-2 ${platform === 'twitter' ? 'btn-3d' : ''}`}
  >
    Twitter
  </Button>
          </div>

          {/* Main Content Card */}
          <div className="card-3d glass-card p-6 md:p-8 mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform === 'youtube' ? 'icon-gradient-purple' : 'icon-gradient-pink'}`}>
                {platform === 'youtube' ? <Youtube className="w-5 h-5 text-white" /> : <Instagram className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text-purple">Extract Comments</h2>
                <p className="text-sm text-muted-foreground">
                  {platform === 'youtube' 
                    ? 'Paste a YouTube video URL to extract comments' 
                    : 'Paste an Instagram post URL to extract comments'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                 placeholder={
 platform === "youtube"
  ? "https://www.youtube.com/watch?v=..."
  : platform === "instagram"
  ? "https://www.instagram.com/p/..."
  : platform === "facebook"
  ? "https://www.facebook.com/post/..."
  : platform === "linkedin"
  ? "https://www.linkedin.com/posts/..."
  : "https://twitter.com/status/..."
}
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 input-3d text-base"
                />
              </div>
              <button
                onClick={handleFetchComments}
                disabled={loading}
                className={`btn-3d px-6 py-3 text-white font-medium flex items-center justify-center gap-2 min-w-[160px] rounded-xl ${loading ? 'animate-pulse-glow' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Fetch Comments
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Video Info */}
          {videoInfo && (
            <div className="card-3d glass-card p-6 mb-8 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {videoInfo.thumbnailUrl && (
                  <div className="relative">
                    <img 
                      src={videoInfo.thumbnailUrl} 
                      alt={videoInfo.title}
                      className="w-40 h-auto rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 gradient-text-vibrant">{videoInfo.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium text-primary">{comments.length} comments</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments Table */}
          {comments.length > 0 && (
            <div className="card-3d glass-card p-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg icon-gradient-cyan flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold gradient-text-cyan">Comments</h2>
                    <p className="text-sm text-muted-foreground">{filteredComments.length} results</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search comments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 input-3d text-sm w-full sm:w-48 rounded-lg"
                  />
                  <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'likes')}>
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="date" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Date</TabsTrigger>
                      <TabsTrigger value="likes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Likes</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button 
                  onClick={() => handleDownload('csv')} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FileText className="w-4 h-4" />
                  Download CSV
                </button>
                <button 
                  onClick={() => handleDownload('xlsx')} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Download Excel
                </button>
              </div>
              
              {/* Table */}
              <ScrollArea className="h-96 rounded-xl border border-border/50">
                <Table className="table-3d">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40 font-semibold">Username</TableHead>
                      <TableHead className="font-semibold">Comment</TableHead>
                      <TableHead className="w-20 text-center font-semibold">Likes</TableHead>
                      <TableHead className="w-36 font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComments.slice(0, 100).map((comment) => (
                      <TableRow key={comment.id} className="group">
                        <TableCell className="font-medium">
                          <span className="group-hover:text-primary transition-colors">{comment.authorName}</span>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div 
                            dangerouslySetInnerHTML={{ __html: comment.textDisplay.slice(0, 200) + (comment.textDisplay.length > 200 ? '...' : '') }} 
                            className="text-sm leading-relaxed"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {comment.likeCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(comment.publishedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              {filteredComments.length > 100 && (
                <p className="text-sm text-muted-foreground text-center mt-4 px-4 py-2 bg-muted/30 rounded-lg">
                  Showing first 100 of <span className="font-semibold text-primary">{filteredComments.length}</span> comments
                </p>
              )}
            </div>
          )}

          {/* Empty State */}
          {comments.length === 0 && !loading && (
            <div className="card-3d glass-card p-12 text-center animate-fade-in-up">
              <div className="w-20 h-20 rounded-2xl icon-gradient-purple mx-auto mb-6 flex items-center justify-center">
                <Youtube className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold gradient-text-vibrant mb-2">Ready to Extract</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Paste a YouTube video URL above and click "Fetch Comments" to get started. 
                Your comments will appear here instantly!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Admin Page
  const AdminPage = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchStats();
    }, []);

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch admin stats');
        }
        
        setStats(data);
      } catch (error) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    const handleUserAction = async (userId: string, action: string) => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });

        if (!response.ok) {
          throw new Error('Failed to perform action');
        }

        toast.success('Action completed successfully');
        fetchStats();
      } catch (error) {
        toast.error('Failed to perform action');
      }
    };

    if (user?.role !== 'ADMIN') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md card-3d glass-card">
            <CardContent className="pt-6 text-center">
              <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 pb-8 px-4 dashboard-bg">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text-vibrant">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and view statistics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-3d glass-card p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl icon-gradient-purple flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text-purple">{stats?.totalUsers || 0}</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl icon-gradient-cyan flex items-center justify-center">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text-cyan">{stats?.totalDownloads || 0}</div>
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                </div>
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl icon-gradient-pink flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text-vibrant">{stats?.downloadsThisMonth || 0}</div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </div>
            <div className="card-3d glass-card p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl icon-gradient-green flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <Badge className="bg-green-500 text-white">Free</Badge>
                  <p className="text-sm text-muted-foreground mt-1">Plan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card-3d glass-card p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage all registered users</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <ScrollArea className="h-96 rounded-xl border border-border/50">
                <Table className="table-3d">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Downloads</TableHead>
                      <TableHead className="font-semibold">Joined</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.users?.map((u: any) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.email}</TableCell>
                        <TableCell>{u.name || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{u._count?.downloads || 0}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {u.role !== 'ADMIN' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUserAction(u.id, 'makeAdmin')}
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </div>
        </div>
      </div>
    );
  };

  // Render based on current view
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'dashboard':
        return isAuthenticated ? <DashboardPage /> : <LoginPage />;
      case 'admin':
        return isAuthenticated ? <AdminPage /> : <LoginPage />;
      default:
        return <LandingPage />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">{renderView()}</div>
      <InfoModal />
    </main>
  );
}
