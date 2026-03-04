import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for a premium feel
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const MotionCard = motion(
    ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
            {children}
        </div>
    )
);
