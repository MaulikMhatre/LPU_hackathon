import React from 'react';
import Link from 'next/link';
import { BookOpenText, FileText, Video, Zap, ChevronRight } from 'lucide-react';


const RESOURCE_CATEGORIES = [
    { 
        name: "Adaptive Quizzes", 
        icon: Zap, 
        description: "Personalized quizzes that adjust difficulty based on your strengths and weaknesses in core subjects.",
        link: "/quiz",
        iconBgClass: "bg-amber-100/70",
        textColorClass: "text-amber-700",
        items: [
            { id: 1, title: "Start Adaptive Math Quiz", type: "Quiz" },
            { id: 2, title: "Practice Physics Concepts", type: "Quiz" },
        ]
    },
    { 
        name: "Study Guides & Notes", 
        icon: FileText, 
        description: "Downloadable, curated guides and printable notes for quick review and exam preparation.",
        link: "/guides",
        iconBgClass: "bg-teal-100/70",
        textColorClass: "text-teal-700",
        items: [
            { id: 3, title: "Algebra Review Sheet (PDF)", type: "PDF" },
            { id: 4, title: "History Essay Outline Template", type: "Doc" },
        ]
    },
    { 
        name: "Video Tutorials", 
        icon: Video, 
        description: "High-definition video lectures and bite-sized tutorials on core and advanced topics.",
        link: "/videos",
        iconBgClass: "bg-indigo-100/70",
        textColorClass: "text-indigo-700",
        items: [
            { id: 5, title: "Lecture: Newton's Laws (Video)", type: "Video" },
            { id: 6, title: "Grammar Deep Dive (Video)", type: "Video" },
        ]
    },
];

interface ResourceCardProps {
    category: typeof RESOURCE_CATEGORIES[0];
}

const ResourceCard: React.FC<ResourceCardProps> = ({ category }) => {
    const Icon = category.icon;
    return (
        <div className="bg-white p-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${category.iconBgClass} border-b border-t ${category.textColorClass.replace('text-', 'border-')}`}></div>

            <div className="flex items-start space-x-4 mb-5">
                <div className={`p-3 rounded-full ${category.iconBgClass} shadow-md`}>
                    <Icon className={`w-7 h-7 ${category.textColorClass}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mt-0.5">{category.name}</h3>
            </div>
            
            <p className="text-base text-muted-foreground mb-6 flex-1">{category.description}</p>
            
         
            <h4 className="text-sm font-semibold text-gray-700 mb-3 border-t pt-3">Popular Resources:</h4>
            <ul className="space-y-3 mb-6">
                {category.items.map(item => (
                    <li key={item.id} className="group flex items-center justify-between transition-colors">
                        <Link href={category.link} className="flex items-center text-sm font-medium text-gray-800 hover:text-teal-600 transition-colors">
                            <span className={`w-1.5 h-1.5 mr-2 rounded-full ${category.textColorClass.replace('text-', 'bg-')} group-hover:opacity-100 opacity-70 transition-opacity`}></span>
                            {item.title}
                        </Link>
                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">{item.type}</span>
                    </li>
                ))}
            </ul>

           
            <Link href={category.link} passHref className="mt-auto self-start">
                <button className={`inline-flex items-center text-base font-semibold ${category.textColorClass} hover:opacity-80 transition-opacity group`}>
                    Explore Full Library 
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>
        </div>
    );
};

export default function ResourcesPage() {
    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <header className="mb-10 border-b border-gray-200 pb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center">
                    <BookOpenText className="w-9 h-9 mr-4 text-teal-600" /> Learning Resources Library
                </h1>
                <p className="text-lg text-muted-foreground mt-2">Access all your high-quality learning materials, guides, and practice tools curated by our experts.</p>
            </header>

            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
                {RESOURCE_CATEGORIES.map((category, index) => (
                    <ResourceCard key={index} category={category} />
                ))}
            </div>
            
            {/* Footer */}
            <footer className="mt-12 text-center text-base text-muted-foreground border-t border-gray-200 pt-6">
                <p>&copy; 2024 Smart EdTech. All Rights Reserved. Need help finding a resource? Contact support.</p>
            </footer>
        </div>
    );
}