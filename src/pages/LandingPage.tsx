import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { CheckCircle2, Megaphone, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/animations/PageTransition';

export default function LandingPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <PageTransition className="flex flex-col min-h-screen relative overflow-hidden">
            <Navbar />

            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vibrant-blue/20 rounded-full blur-[120px] -z-10 animate-glow" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-vibrant-indigo/20 rounded-full blur-[100px] -z-10 animate-glow" style={{ animationDelay: '2s' }} />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 md:py-32 lg:py-40 px-4 text-center">
                    <div className="container max-w-5xl mx-auto">
                        <motion.div {...fadeIn}>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
                                Empower Your Community. <br />
                                <span className="text-gradient">Make Your Voice Heard.</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join the modern town square. Report local issues, track progress in real-time, and connect directly with those who serve you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" asChild className="text-lg px-10 h-14 rounded-full gradient-primary border-none shadow-xl shadow-vibrant-blue/20">
                                        <Link to="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="outline" asChild className="text-lg px-10 h-14 rounded-full glass border-2">
                                        <Link to="/login">Login</Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 px-4 relative">
                    <div className="container max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <h2 className="text-4xl font-black mb-6">How It Works</h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Simple steps to a better community. From reporting to resolution, we've got you covered.</p>
                        </motion.div>

                        <motion.div
                            variants={stagger}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <FeatureCard
                                icon={CheckCircle2}
                                title="Report Issues"
                                description="Snapped a photo of a pothole? Upload it instantly with your location. Quick and easy."
                                color="bg-vibrant-blue/10 text-vibrant-blue"
                            />
                            <FeatureCard
                                icon={ShieldCheck}
                                title="Track Progress"
                                description="Get real-time updates as your reported problem moves from 'Pending' to 'Resolved'."
                                color="bg-vibrant-indigo/10 text-vibrant-indigo"
                            />
                            <FeatureCard
                                icon={Megaphone}
                                title="Stay Updated"
                                description="Hear directly from your representatives about local projects and community decisions."
                                color="bg-vibrant-teal/10 text-vibrant-teal"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-4">
                    <div className="container max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="gradient-primary text-white rounded-[2.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 max-w-3xl mx-auto text-center">
                                <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to improve your area?</h2>
                                <p className="text-white/80 text-xl md:text-2xl mb-12">
                                    Join thousands of citizens who are already making a difference in their constituencies.
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="secondary" asChild className="text-lg px-12 h-16 rounded-full font-bold">
                                        <Link to="/signup">Join CitizenVoice Today</Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="py-16 px-4 border-t bg-background/50 backdrop-blur-sm">
                <div className="container max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center text-sm font-black text-white shadow-lg shadow-vibrant-blue/30">CV</div>
                        <span className="font-black text-2xl tracking-tighter">Citizen<span className="text-primary">Voice</span></span>
                    </div>
                    <div className="flex gap-10 text-sm font-semibold text-muted-foreground">
                        <Link to="#" className="hover:text-primary transition-colors">About Us</Link>
                        <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-primary transition-colors">Contact</Link>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">© 2024 CitizenVoice. Built for Democracy.</p>
                </div>
            </footer>
        </PageTransition>
    );
}

function FeatureCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
    return (
        <motion.div
            variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -10 }}
            className="bg-card/50 backdrop-blur-sm p-10 rounded-[2rem] border-border/50 border-2 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <div className={`h-16 w-16 rounded-2xl ${color} flex items-center justify-center mb-8 shadow-inner`}>
                <Icon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black mb-4">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
        </motion.div>
    );
}
