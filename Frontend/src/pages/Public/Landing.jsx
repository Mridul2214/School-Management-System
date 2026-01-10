import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

const Landing = () => {
    return (
        <div className="bg-white min-h-screen font-sans text-gray-900">
            {/* Navbar */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                SmartCollege
                            </span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="nav-link">Features</a>
                            <a href="#about" className="nav-link">About</a>
                            <a href="#contact" className="nav-link">Contact</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="nav-link px-4 py-2">
                                Sign In
                            </Link>
                            <Link to="/login" className="btn-get-started">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-2xl"
                        >
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                                Now with AI-Powered features
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
                                Manage your college <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Smartly & Efficiently
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                                A comprehensive ecosystem for modern education. Streamline administration, boost student engagement, and automate complex workflows with our all-in-one platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-xl shadow-blue-600/20">
                                    Access Portal
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                                    View Demo
                                </button>
                            </div>

                            <div className="mt-12 flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    <span>Real-time Analytics</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                    <span>Cloud Secure</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative lg:block"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                                    alt="College Dashboard"
                                    className="rounded-xl w-full"
                                />
                                {/* Floating Cards */}
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 hidden md:block animate-bounce-slow">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Users className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Total Students</p>
                                            <p className="text-lg font-bold">2,500+</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Background Decoration */}
                            <div className="absolute -z-10 top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="absolute -z-10 -bottom-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Everything you need</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powering the next generation of educational institutions with advanced tools and seamless connectivity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "Student Management",
                                desc: "Complete lifecycle management from admission to alumni with digital records."
                            },
                            {
                                icon: BookOpen,
                                title: "Academic Planning",
                                desc: "Dynamic course management, syllabus tracking, and automated timetables."
                            },
                            {
                                icon: Award,
                                title: "Exams & Grading",
                                desc: "Secure examination processes with automated grading and result publication."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="feature-card group">
                                <div className="feature-icon-wrapper">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to transform your campus?</h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Join hundreds of forward-thinking institutions using SmartCollege to deliver better education.
                    </p>
                    <Link to="/login" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition shadow-lg shadow-blue-900/50">
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center opacity-60">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <GraduationCap className="h-6 w-6 text-gray-900" />
                        <span className="font-bold text-lg text-gray-900">SmartCollege</span>
                    </div>
                    <p className="text-sm">© 2026 Smart College Systems. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
