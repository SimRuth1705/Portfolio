import React, { useState, useEffect, useRef } from 'react';

const LazySection = ({ children, fallback = null }) => {
    const [isIntersected, setIsIntersected] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersected(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '300px' } // Preload when 300px away from viewport
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="relative min-h-[100px]">
            {isIntersected ? children : fallback}
        </div>
    );
};

export default LazySection;
