import React, { useState, useMemo } from "react";
import {
  Star,
  X,
  User,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Home, // Added Home icon
  Store, // Added Store icon
} from "lucide-react";

const ProjectLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    reviewerName: "Anonymous User",
  });
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [showAllFiltered, setShowAllFiltered] = useState(false); // New state to control showing all filtered projects

  const defaultItemsPerPage = 20;
  const reducedItemsPerPage = 4; // Number of projects to show when filtered/searched

  // Significantly expanded dummy project data for pagination
  const initialProjects = useMemo(
    () => [
      // Memoize initialProjects to prevent re-creation
      {
        id: 1,
        title: "AI-Powered Learning Assistant",
        student: "Emma Thompson",
        image:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=450&fit=crop&auto=format&q=80",
        category: "AI/ML",
        date: "2024-03-15",
        description:
          "An intelligent tutoring system that adapts to individual learning styles using machine learning algorithms. This project aims to revolutionize the educational landscape by providing personalized learning experiences. It leverages natural language processing and data analytics to offer tailored content and feedback, fostering a more engaging and effective learning environment for students across various disciplines. The system also includes a progress tracking feature and customizable difficulty levels.",
        contactEmail: "emma.thompson@example.com",
        reviews: [
          {
            rating: 5,
            comment:
              "Excellent work! This tool is incredibly helpful for personalized learning.",
            reviewerName: "Alex R.",
          },
          {
            rating: 4,
            comment:
              "Very innovative approach, a few minor UI tweaks would make it perfect.",
            reviewerName: "Sophia K.",
          },
        ],
      },
      {
        id: 2,
        title: "Sustainable Urban Garden App",
        student: "Marcus Chen",
        image:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Environment",
        date: "2024-03-12",
        description:
          "Mobile application helping urban residents create and maintain sustainable gardens in small spaces. It provides guidance on plant selection, watering schedules, and pest control using eco-friendly methods. The app integrates with local weather data to optimize gardening practices and encourages community sharing of produce. It's designed to promote green living and food sustainability in dense urban environments.",
        contactEmail: "marcus.chen@example.com",
        reviews: [
          {
            rating: 5,
            comment:
              "Great for city dwellers! Finally, I can grow my own herbs on my balcony.",
            reviewerName: "Carlos D.",
          },
          {
            rating: 3,
            comment: "Useful, but the plant database could be larger.",
            reviewerName: "Maria G.",
          },
        ],
      },
      {
        id: 3,
        title: "Virtual Reality Museum Tour",
        student: "Sarah Williams",
        image:
          "https://images.unsplash.com/photo-1593508312308-d4c29d8dc7f1?w=300&h=500&fit=crop&auto=format&q=80",
        category: "VR/AR",
        date: "2024-03-10",
        description:
          "Immersive VR experience allowing users to explore world-famous museums from their homes. This project offers high-fidelity 3D scans of artifacts and interactive exhibits, complete with audio guides and historical context. It aims to make cultural heritage accessible to everyone, regardless of geographical location or physical limitations, providing a rich educational and entertainment experience.",
        contactEmail: "sarah.williams@example.com",
        reviews: [
          { rating: 4, comment: "Amazing immersion!", reviewerName: "Liam P." },
          {
            rating: 5,
            comment: "Future of education",
            reviewerName: "Olivia T.",
          },
          {
            rating: 5,
            comment: "Absolutely stunning graphics and historical detail.",
            reviewerName: "Noah Z.",
          },
        ],
      },
      {
        id: 4,
        title: "Blockchain Voting System",
        student: "David Rodriguez",
        image:
          "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=420&fit=crop&auto=format&q=80",
        category: "Blockchain",
        date: "2024-03-08",
        description:
          "Secure and transparent voting system built on blockchain technology ensuring election integrity. This decentralized platform enhances trust by providing an immutable record of votes, reducing the risk of fraud and increasing public confidence in democratic processes. It includes features for voter authentication and real-time tabulation, all while maintaining privacy.",
        contactEmail: "david.rodriguez@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Revolutionary concept!",
            reviewerName: "Ethan B.",
          },
          {
            rating: 5,
            comment:
              "This could change elections globally. Incredible work on security.",
            reviewerName: "Mia C.",
          },
        ],
      },
      {
        id: 5,
        title: "Mental Health Chatbot",
        student: "Lisa Park",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Healthcare",
        date: "2024-03-05",
        description:
          "AI-powered chatbot providing mental health support and resources for students and young adults. It offers empathetic conversations, coping strategies, and directs users to professional help when needed. The chatbot is designed to be a first line of support, reducing the stigma around mental health and making immediate resources available 24/7.",
        contactEmail: "lisa.park@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Very helpful resource",
            reviewerName: "Sophia L.",
          },
          {
            rating: 5,
            comment: "Compassionate design",
            reviewerName: "Jack W.",
          },
          {
            rating: 5,
            comment: "A truly needed application for modern times.",
            reviewerName: "Chloe M.",
          },
        ],
      },
      {
        id: 6,
        title: "Smart Home Energy Manager",
        student: "Alex Johnson",
        image:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=450&fit=crop&auto=format&q=80",
        category: "IoT",
        date: "2024-03-03",
        description:
          "IoT solution that optimizes home energy consumption and reduces electricity bills automatically. This system learns user patterns and adjusts lighting, heating, and appliance usage to maximize efficiency. It provides detailed energy reports and smart alerts, empowering homeowners to take control of their energy footprint and save money.",
        contactEmail: "alex.johnson@example.com",
        reviews: [
          { rating: 5, comment: "Saved me money!", reviewerName: "David S." },
          {
            rating: 4,
            comment:
              "Easy to use, and I've seen a noticeable drop in my energy bill.",
            reviewerName: "Emily R.",
          },
        ],
      },
      {
        id: 7,
        title: "Language Exchange Platform",
        student: "Maria Garcia",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=420&fit=crop&auto=format&q=80",
        category: "Education",
        date: "2024-03-01",
        description:
          "Platform connecting language learners worldwide for real-time conversation practice and cultural exchange. It features video calls, text chat, and a built-in grammar checker. Users can find native speakers for various languages, fostering a global community of learners and promoting cross-cultural understanding. It's an excellent tool for improving fluency.",
        contactEmail: "maria.garcia@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Great for language learning",
            reviewerName: "Oliver B.",
          },
          {
            rating: 5,
            comment: "Helped me connect with native speakers easily!",
            reviewerName: "Isabella H.",
          },
          {
            rating: 3,
            comment: "Good concept, but sometimes video quality drops.",
            reviewerName: "William F.",
          },
        ],
      },
      {
        id: 8,
        title: "Drone-Based Crop Monitoring",
        student: "James Kim",
        image:
          "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=380&fit=crop&auto=format&q=80",
        category: "Agriculture",
        date: "2024-02-28",
        description:
          "Autonomous drone system for monitoring crop health and optimizing agricultural yield using computer vision. The drones collect high-resolution images and multispectral data, identifying issues like nutrient deficiencies or pest infestations early. This allows farmers to apply targeted treatments, reducing waste and increasing productivity sustainably.",
        contactEmail: "james.kim@example.com",
        reviews: [
          { rating: 5, comment: "Farmers love this!", reviewerName: "Ava N." },
          { rating: 4, comment: "Great precision", reviewerName: "Lucas Q." },
        ],
      },
      {
        id: 9,
        title: "Music Therapy for Autism",
        student: "Rachel Green",
        image:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Healthcare",
        date: "2024-02-25",
        description:
          "Interactive music therapy application designed specifically for children with autism spectrum disorders. It uses adaptive music, visual cues, and guided exercises to improve communication, social skills, and emotional regulation. The app is developed in collaboration with therapists and provides a safe, engaging environment for developmental support.",
        contactEmail: "rachel.green@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Heartwarming project",
            reviewerName: "Grace W.",
          },
          {
            rating: 5,
            comment: "As a parent, I can say this is genuinely helpful.",
            reviewerName: "Daniel P.",
          },
        ],
      },
      {
        id: 10,
        title: "Ocean Plastic Cleanup Robot",
        student: "Tom Wilson",
        image:
          "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=550&fit=crop&auto=format&q=80",
        category: "Environment",
        date: "2024-02-22",
        description:
          "Autonomous marine robot designed to collect and sort plastic waste from ocean surfaces. This innovative solution uses advanced sensors and AI to identify and capture various types of plastic, contributing significantly to marine ecosystem restoration. It operates autonomously, making ocean cleanup more efficient and scalable.",
        contactEmail: "tom.wilson@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Saving our oceans!",
            reviewerName: "Sophie M.",
          },
          {
            rating: 4,
            comment: "Impressive engineering",
            reviewerName: "Ethan J.",
          },
          {
            rating: 5,
            comment: "A truly inspiring solution to a global problem.",
            reviewerName: "Liam D.",
          },
        ],
      },
      {
        id: 11,
        title: "AR Shopping Assistant",
        student: "Jennifer Lee",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=360&fit=crop&auto=format&q=80",
        category: "VR/AR",
        date: "2024-02-20",
        description:
          "Augmented reality app that helps shoppers find products and compare prices in physical stores. Users can point their phone at an item to get real-time information, reviews, and price comparisons from other retailers. It enhances the in-store shopping experience by providing instant digital insights.",
        contactEmail: "jennifer.lee@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Shopping made easy!",
            reviewerName: "Olivia F.",
          },
          {
            rating: 3,
            comment:
              "Useful for price comparison, but sometimes slow to recognize items.",
            reviewerName: "William G.",
          },
        ],
      },
      {
        id: 12,
        title: "Elderly Care Companion",
        student: "Michael Brown",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Healthcare",
        date: "2024-02-18",
        description:
          "AI companion robot providing emotional support and health monitoring for elderly individuals. This robot engages users in conversation, reminds them of medication, and can alert caregivers in emergencies. It aims to reduce loneliness and provide peace of mind for families, acting as a friendly presence in the home.",
        contactEmail: "michael.brown@example.com",
        reviews: [
          {
            rating: 5,
            comment: "My grandma loves it!",
            reviewerName: "Emma C.",
          },
          {
            rating: 5,
            comment: "Compassionate technology",
            reviewerName: "Noah E.",
          },
          {
            rating: 4,
            comment: "A great concept, provides much-needed reassurance.",
            reviewerName: "Sophia D.",
          },
        ],
      },
      {
        id: 13,
        title: "Solar Panel Efficiency Optimizer",
        student: "Kevin Zhang",
        image:
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300&h=480&fit=crop&auto=format&q=80",
        category: "Energy",
        date: "2024-02-15",
        description:
          "Machine learning system that optimizes solar panel positioning and maintenance for maximum energy output. It analyzes weather patterns, sunlight intensity, and dust accumulation to recommend optimal adjustments and cleaning schedules. This project ensures that solar energy systems operate at peak efficiency, maximizing return on investment.",
        contactEmail: "kevin.zhang@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Great for renewable energy",
            reviewerName: "James S.",
          },
          {
            rating: 5,
            comment: "Highly effective for optimizing our solar farm output.",
            reviewerName: "Isabella V.",
          },
        ],
      },
      {
        id: 14,
        title: "Food Waste Reduction App",
        student: "Amanda Davis",
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Sustainability",
        date: "2024-02-12",
        description:
          "Mobile app connecting restaurants with surplus food to local charities and food banks. It facilitates efficient donation and distribution, significantly reducing food waste and addressing food insecurity. The app includes features for scheduling pickups and tracking donations, creating a seamless process for all parties involved.",
        contactEmail: "amanda.davis@example.com",
        reviews: [
          { rating: 5, comment: "Fighting hunger!", reviewerName: "Ethan K." },
          { rating: 4, comment: "Social impact", reviewerName: "Olivia L." },
          {
            rating: 5,
            comment: "An excellent initiative, truly making a difference.",
            reviewerName: "Lucas M.",
          },
        ],
      },
      {
        id: 15,
        title: "Cybersecurity Training Game",
        student: "Robert Taylor",
        image:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=390&fit=crop&auto=format&q=80",
        category: "Security", // Maps to "Cyber Sec"
        date: "2024-02-10",
        description:
          "Gamified cybersecurity training platform teaching employees to identify and prevent cyber threats. It uses interactive scenarios, puzzles, and quizzes to make learning engaging and effective. The platform covers phishing, malware, data privacy, and other critical security topics, enhancing organizational resilience against cyberattacks.",
        contactEmail: "robert.taylor@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Learning through gaming!",
            reviewerName: "Mia N.",
          },
          {
            rating: 5,
            comment: "Our team's security awareness has drastically improved.",
            reviewerName: "Daniel O.",
          },
        ],
      },
      {
        id: 16,
        title: "Sign Language Translator",
        student: "Nicole Martinez",
        image:
          "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Accessibility",
        date: "2024-02-08",
        description:
          "Real-time sign language translation system using computer vision and natural language processing. It translates sign language gestures into spoken or written text and vice versa, bridging communication gaps for the deaf and hard-of-hearing community. This project aims to enhance accessibility and inclusion in everyday interactions.",
        contactEmail: "nicole.martinez@example.com",
        reviews: [
          { rating: 5, comment: "Breaking barriers!", reviewerName: "Ava P." },
          {
            rating: 5,
            comment: "Incredible accuracy",
            reviewerName: "Jackson Q.",
          },
          {
            rating: 5,
            comment: "A truly empowering tool for the deaf community.",
            reviewerName: "Charlotte R.",
          },
        ],
      },
      {
        id: 17,
        title: "Smart Traffic Management",
        student: "Chris Anderson",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Smart City",
        date: "2024-02-05",
        description:
          "AI-powered traffic management system reducing congestion and optimizing traffic flow in urban areas. It uses real-time data from sensors and cameras to dynamically adjust traffic signals and reroute vehicles. The system aims to minimize travel times, reduce fuel consumption, and improve air quality in busy cities.",
        contactEmail: "chris.anderson@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Smoother commutes!",
            reviewerName: "Sophia S.",
          },
          {
            rating: 5,
            comment: "Our city's traffic has improved noticeably.",
            reviewerName: "Liam T.",
          },
        ],
      },
      {
        id: 18,
        title: "Water Quality Monitor",
        student: "Stephanie White",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Environment",
        date: "2024-02-03",
        description:
          "IoT sensor network monitoring water quality in real-time and alerting authorities to contamination. This system deploys sensors in rivers, lakes, and reservoirs to detect pollutants and abnormal chemical levels. Early detection helps prevent environmental disasters and ensures safe water supplies for communities.",
        contactEmail: "stephanie.white@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Clean water for all!",
            reviewerName: "Oliver U.",
          },
          {
            rating: 4,
            comment: "Important for health",
            reviewerName: "Emma V.",
          },
          {
            rating: 5,
            comment: "Crucial for public health and environmental protection.",
            reviewerName: "Noah W.",
          },
        ],
      },
      {
        id: 19,
        title: "Virtual Personal Trainer",
        student: "Daniel Moore",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop&auto=format&q=80",
        category: "Fitness",
        date: "2024-02-01",
        description:
          "AI-powered fitness app providing personalized workout plans and real-time form correction. It uses computer vision to analyze user movements during exercises and offers instant feedback for better technique. The app adapts to individual progress and preferences, making personal training accessible to everyone.",
        contactEmail: "daniel.moore@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Great motivation!",
            reviewerName: "Sophia X.",
          },
          {
            rating: 5,
            comment: "The form correction is surprisingly accurate.",
            reviewerName: "Liam Y.",
          },
        ],
      },
      {
        id: 20,
        title: "Student Mental Health Dashboard",
        student: "Ashley Clark",
        image:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Education",
        date: "2024-01-30",
        description:
          "Analytics dashboard helping educators identify and support students experiencing mental health challenges. It aggregates data from various sources (with privacy in mind) to provide insights into student well-being trends. The dashboard enables early intervention and tailored support, fostering a healthier academic environment.",
        contactEmail: "ashley.clark@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Caring for students!",
            reviewerName: "James Z.",
          },
          {
            rating: 5,
            comment: "Preventive approach",
            reviewerName: "Olivia A.",
          },
          {
            rating: 4,
            comment: "A vital tool for school counselors.",
            reviewerName: "Noah B.",
          },
        ],
      },
      // --- Projects with added/modified categories for filtering ---
      {
        id: 21,
        title: "Smart Agriculture System",
        student: "Ben Carter",
        image:
          "https://images.unsplash.com/photo-1596701092716-e5554f6b2164?w=300&h=380&fit=crop&auto=format&q=80",
        category: "Agriculture",
        date: "2024-01-28",
        description:
          "IoT-based system for precision farming, monitoring soil moisture, temperature, and nutrient levels to optimize irrigation and fertilization. This system helps farmers maximize yields and reduce resource consumption through data-driven decisions. It integrates with smart sprinklers and nutrient dispensers.",
        contactEmail: "ben.carter@example.com",
        reviews: [
          { rating: 4, comment: "Highly efficient!", reviewerName: "Ethan C." },
          {
            rating: 5,
            comment: "Modern farming solution.",
            reviewerName: "Mia D.",
          },
        ],
      },
      {
        id: 22,
        title: "Personalized News Feed",
        student: "Chloe Davis",
        image:
          "https://images.unsplash.com/photo-1495020689067-95de64624f3c?w=300&h=350&fit=crop&auto=format&q=80",
        category: "Data Analysis", // Added for filter demo
        date: "2024-01-25",
        description:
          "An AI-driven news aggregator that curates content based on user preferences and reading habits. It uses natural language processing to understand user interests and filter out irrelevant information, providing a highly personalized and engaging news consumption experience. Features include topic customization and source filtering.",
        contactEmail: "chloe.davis@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Finally, news I care about!",
            reviewerName: "James E.",
          },
        ],
      },
      {
        id: 23,
        title: "Gamified Fitness Tracker",
        student: "Ethan Lee",
        image:
          "https://images.unsplash.com/photo-1581009146145-b593ef0757a3?w=300&h=420&fit=crop&auto=format&q=80",
        category: "Software Engineering", // Added for filter demo
        date: "2024-01-22",
        description:
          "A mobile application that turns fitness goals into an engaging game, with challenges, rewards, and social integration. Users can compete with friends, unlock achievements, and track their progress through an intuitive interface. It aims to motivate users to stay active and achieve their health targets.",
        contactEmail: "ethan.lee@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Addictive and motivating!",
            reviewerName: "Olivia F.",
          },
          {
            rating: 5,
            comment: "Great for staying active.",
            reviewerName: "Noah G.",
          },
        ],
      },
      {
        id: 24,
        title: "Voice-Controlled Home Security",
        student: "Fiona Scott",
        image:
          "https://images.unsplash.com/photo-1505373030206-a957a44f1c7d?w=300&h=400&fit=crop&auto=format&q=80",
        category: "IoT",
        date: "2024-01-20",
        description:
          "An IoT-based home security system that can be controlled entirely by voice commands. It integrates with smart locks, cameras, and alarms, providing hands-free security management. Features include real-time alerts, remote access, and customizable security zones.",
        contactEmail: "fiona.scott@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Super convenient and secure.",
            reviewerName: "Sophia H.",
          },
        ],
      },
      {
        id: 25,
        title: "Interactive History Timeline",
        student: "George White",
        image:
          "https://images.unsplash.com/photo-1517036662490-b1ac2d1c68f7?w=300&h=360&fit=crop&auto=format&q=80",
        category: "Education",
        date: "2024-01-18",
        description:
          "A web-based interactive timeline presenting historical events with rich multimedia content, including videos, images, and primary source documents. It allows users to explore history in a non-linear fashion, deepening their understanding of complex historical periods and connections.",
        contactEmail: "george.white@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Engaging way to learn history.",
            reviewerName: "Liam I.",
          },
        ],
      },
      {
        id: 26,
        title: "Predictive Healthcare Analytics",
        student: "Hannah Green",
        image:
          "https://images.unsplash.com/photo-1526256247496-e35c24a9e578?w=300&h=410&fit=crop&auto=format&q=80",
        category: "Data Analysis", // Added for filter demo
        date: "2024-01-15",
        description:
          "A machine learning model that predicts patient health risks based on electronic health records and demographic data. This tool assists healthcare professionals in early diagnosis and personalized treatment plans, improving patient outcomes and optimizing resource allocation.",
        contactEmail: "hannah.green@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Revolutionary for medical field!",
            reviewerName: "Olivia J.",
          },
        ],
      },
      {
        id: 27,
        title: "Community Recycling Platform",
        student: "Isaac Hall",
        image:
          "https://images.unsplash.com/photo-1532982846152-ee6e4a29a3e6?w=300&h=390&fit=crop&auto=format&q=80",
        category: "Environment",
        date: "2024-01-12",
        description:
          "A social platform connecting individuals and organizations for efficient recycling and waste management. Users can find local recycling points, organize collection drives, and share tips on sustainable living, fostering a community-driven approach to environmental conservation.",
        contactEmail: "isaac.hall@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Making a difference!",
            reviewerName: "Noah K.",
          },
        ],
      },
      {
        id: 28,
        title: "AI-Powered Customer Support",
        student: "Julia King",
        image:
          "https://images.unsplash.com/photo-1544717305-ad200d9e8b0a?w=300&h=430&fit=crop&auto=format&q=80",
        category: "AI/ML",
        date: "2024-01-10",
        description:
          "An AI solution designed to automate and enhance customer support interactions through intelligent chatbots and sentiment analysis. It can handle common queries, escalate complex issues, and provide personalized assistance, significantly improving customer satisfaction and operational efficiency.",
        contactEmail: "julia.king@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Fast and efficient support.",
            reviewerName: "Sophia L.",
          },
        ],
      },
      {
        id: 29,
        title: "Personal Finance Manager",
        student: "Kyle Lopez",
        image:
          "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Finance",
        date: "2024-01-08",
        description:
          "A secure and intuitive mobile app for tracking expenses, setting budgets, and visualizing financial goals. It provides insights into spending habits, helps users save money, and offers financial planning tools, empowering individuals to take control of their finances.",
        contactEmail: "kyle.lopez@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Helped me save a lot!",
            reviewerName: "Liam M.",
          },
        ],
      },
      {
        id: 30,
        title: "Smart Classroom System",
        student: "Lily Miler",
        image:
          "https://images.unsplash.com/photo-1546410531-bb44865e49c7?w=300&h=370&fit=crop&auto=format&q=80",
        category: "Education",
        date: "2024-01-05",
        description:
          "An integrated system for modern classrooms, featuring interactive whiteboards, automated attendance, and real-time student performance tracking. It aims to create a more dynamic and engaging learning environment, providing teachers with tools to enhance instruction and student participation.",
        contactEmail: "lily.miler@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Future of learning!",
            reviewerName: "Olivia N.",
          },
        ],
      },
      {
        id: 31,
        title: "AR Interior Design App",
        student: "Noah Perez",
        image:
          "https://images.unsplash.com/photo-1581458022800-47e923e3e7f4?w=300&h=450&fit=crop&auto=format&q=80",
        category: "VR/AR",
        date: "2024-01-03",
        description:
          "Augmented reality application that allows users to visualize furniture and decor items in their homes before purchasing. It uses accurate 3D models and real-time rendering to provide a realistic preview, helping users make informed design decisions.",
        contactEmail: "noah.perez@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Changed how I buy furniture!",
            reviewerName: "Emma O.",
          },
        ],
      },
      {
        id: 32,
        title: "Personalized Study Planner",
        student: "Sophia Quinn",
        image:
          "https://images.unsplash.com/photo-1550005809-918997637172?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Education",
        date: "2024-01-01",
        description:
          "An AI-powered study planner that creates customized study schedules based on student's academic goals, course load, and learning pace. It adapts to progress, reminds of deadlines, and suggests optimal study techniques, maximizing efficiency and reducing stress.",
        contactEmail: "sophia.quinn@example.com",
        reviews: [
          {
            rating: 5,
            comment: "My grades improved significantly!",
            reviewerName: "Ava P.",
          },
        ],
      },
      {
        id: 33,
        title: "Smart Waste Sorting Bin",
        student: "William Roberts",
        image:
          "https://images.unsplash.com/photo-1579781390492-c4e97d19c159?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Sustainability",
        date: "2023-12-28",
        description:
          "IoT-enabled smart bin that automatically sorts waste (plastics, paper, organic) using image recognition and sensors. It aims to improve recycling rates and reduce contamination in waste streams, making waste management more efficient and environmentally friendly for homes and public spaces.",
        contactEmail: "william.roberts@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Innovating recycling!",
            reviewerName: "Chloe Q.",
          },
        ],
      },
      {
        id: 34,
        title: "Real-time Air Quality Monitor",
        student: "Emily Smith",
        image:
          "https://images.unsplash.com/photo-1506748687220-7764d84d6dd2?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Environment",
        date: "2023-12-25",
        description:
          "A network of IoT sensors providing real-time local air quality data (PM2.5, CO2, etc.) to a mobile app. Users can access current air quality levels, historical data, and forecasts, helping them make informed decisions about outdoor activities and health precautions.",
        contactEmail: "emily.smith@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Essential for health-conscious citizens.",
            reviewerName: "Daniel R.",
          },
        ],
      },
      {
        id: 35,
        title: "AI-Powered Art Generator",
        student: "Jacob Thomas",
        image:
          "https://images.unsplash.com/photo-1579781390492-c4e97d19c159?w=300&h=400&fit=crop&auto=format&q=80",
        category: "AI/ML",
        date: "2023-12-22",
        description:
          "A web-based tool that uses generative adversarial networks (GANs) to create unique digital artwork based on user text prompts or input images. It allows artists and enthusiasts to explore new forms of creative expression and push the boundaries of digital art.",
        contactEmail: "jacob.thomas@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Unleashed my inner artist!",
            reviewerName: "Ethan S.",
          },
        ],
      },
      {
        id: 36,
        title: "Medical Diagnostic Assistant",
        student: "Madison Uso",
        image:
          "https://images.unsplash.com/photo-1581009146145-b593ef0757a3?w=300&h=420&fit=crop&auto=format&q=80",
        category: "Healthcare",
        date: "2023-12-19",
        description:
          "An AI-driven system assisting medical professionals in diagnosing diseases more accurately and efficiently. It analyzes patient data, medical images, and symptoms, providing probabilistic diagnoses and recommending further tests, thereby improving diagnostic speed and precision.",
        contactEmail: "madison.uso@example.com",
        reviews: [
          {
            rating: 5,
            comment: "A game-changer for diagnostics.",
            reviewerName: "Fiona T.",
          },
        ],
      },
      {
        id: 37,
        title: "Gamified Language Learning",
        student: "Nathan Vance",
        image:
          "https://images.unsplash.com/photo-1478144067967-ec9834164c4c?w=300&h=450&fit=crop&auto=format&q=80", // Corrected image URL
        category: "Education",
        date: "2023-12-16",
        description:
          "An interactive mobile app that makes learning new languages fun and engaging through games, challenges, and competitive leaderboards. It focuses on practical conversation skills and cultural insights, making language acquisition an enjoyable journey.",
        contactEmail: "nathan.vance@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Finally stuck with a language app!",
            reviewerName: "Grace U.",
          },
        ],
      },
      {
        id: 38,
        title: "Smart Farm Pest Detection",
        student: "Jessica Walker",
        image:
          "https://images.unsplash.com/photo-1616892694200-a544c4b5d4e1?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Agriculture",
        date: "2023-12-13",
        description:
          "An AI-powered system using computer vision to detect pests and diseases in crops early, allowing for targeted intervention. This reduces pesticide use and crop loss, promoting sustainable and efficient agricultural practices for large-scale farms.",
        contactEmail: "jessica.walker@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Crucial for modern farming efficiency.",
            reviewerName: "Henry W.",
          },
        ],
      },
      {
        id: 39,
        title: "Personalized Recipe Generator",
        student: "Kevin Xylo",
        image:
          "https://images.unsplash.com/photo-1543353071-10c73e86c125?w=300&h=400&fit=crop&auto=format&q=80",
        category: "AI/ML",
        date: "2023-12-10",
        description:
          "An AI app that generates personalized recipes based on available ingredients, dietary restrictions, and preferred cuisines. It minimizes food waste and inspires culinary creativity, catering to individual tastes and nutritional needs.",
        contactEmail: "kevin.xylo@example.com",
        reviews: [
          {
            rating: 4,
            comment: "Never run out of ideas for dinner!",
            reviewerName: "Ivy X.",
          },
        ],
      },
      {
        id: 40,
        title: "Virtual Fashion Try-on",
        student: "Laura Young",
        image:
          "https://images.unsplash.com/photo-1603400523289-53b6a41f6e21?w=300&h=400&fit=crop&auto=format&q=80",
        category: "VR/AR",
        date: "2023-12-07",
        description:
          "An augmented reality application allowing users to virtually try on clothes and accessories using their smartphone camera. It provides a realistic visualization of how items fit and look, enhancing online shopping experiences and reducing returns.",
        contactEmail: "laura.young@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Shopping from home made easier!",
            reviewerName: "Jack Y.",
          },
        ],
      },
      {
        id: 41,
        title: "Elderly Home Safety Monitor",
        student: "Mark Zoller",
        image:
          "https://images.unsplash.com/photo-1582234032549-ee9b10640f1a?w=300&h=400&fit=crop&auto=format&q=80",
        category: "IoT",
        date: "2023-12-04",
        description:
          "An IoT system using non-intrusive sensors to monitor elderly individuals' activities at home for fall detection and unusual patterns. It sends alerts to caregivers in emergencies, ensuring safety and peace of mind without compromising privacy.",
        contactEmail: "mark.zoller@example.com",
        reviews: [
          {
            rating: 5,
            comment: "Invaluable for elder care.",
            reviewerName: "Karen Z.",
          },
        ],
      },
      {
        id: 42,
        title: "AI-Powered Drug Discovery",
        student: "Nancy Allen",
        image:
          "https://images.unsplash.com/photo-1582719230155-b461c3b1e7f6?w=300&h=400&fit=crop&auto=format&q=80",
        category: "Healthcare",
        date: "2023-12-01",
        description:
          "An AI platform accelerating the drug discovery process by predicting molecular interactions and potential drug candidates. It leverages vast biological data to identify promising compounds, significantly reducing research time and costs in pharmaceutical development.",
        contactEmail: "nancy.allen@example.com",
        reviews: [
          {
            rating: 5,
            comment: "The future of medicine!",
            reviewerName: "Leo A.",
          },
        ],
      },
    ],
    []
  );

  const allCategories = useMemo(() => {
    const categories = new Set(
      initialProjects.map((project) => project.category)
    );
    return ["All", ...Array.from(categories)].sort();
  }, [initialProjects]);

  // Filtered and searched projects
  const filteredProjects = useMemo(() => {
    let projects = initialProjects;

    if (selectedFilterCategory !== "All") {
      projects = projects.filter(
        (project) => project.category === selectedFilterCategory
      );
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      projects = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          project.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          project.student.toLowerCase().includes(lowerCaseSearchTerm) ||
          project.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    return projects;
  }, [initialProjects, selectedFilterCategory, searchTerm]);

  // Determine items per page based on filter/search state
  const currentItemsPerPage = useMemo(() => {
    const isFilteredOrSearched = selectedFilterCategory !== "All" || searchTerm;
    return isFilteredOrSearched && !showAllFiltered
      ? reducedItemsPerPage
      : defaultItemsPerPage;
  }, [selectedFilterCategory, searchTerm, showAllFiltered]);

  const totalPages = Math.ceil(filteredProjects.length / currentItemsPerPage);

  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * currentItemsPerPage;
    const endIndex = startIndex + currentItemsPerPage;
    return filteredProjects.slice(startIndex, endIndex);
  }, [currentPage, currentItemsPerPage, filteredProjects]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowAllFiltered(false); // Reset showAllFiltered on page change
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setNewReview({ rating: 5, comment: "", reviewerName: "Anonymous User" });
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReview = () => {
    if (selectedProject && newReview.comment.trim() !== "") {
      const updatedProjects = initialProjects.map((proj) =>
        proj.id === selectedProject.id
          ? {
              ...proj,
              reviews: [
                ...proj.reviews,
                {
                  ...newReview,
                  reviewerName: newReview.reviewerName || "Anonymous User",
                },
              ],
            }
          : proj
      );
      // You would typically update a global state or send this to a backend
      // For this demo, we'll just update the selected project in local state
      setSelectedProject((prev) => ({
        ...prev,
        reviews: [
          ...prev.reviews,
          {
            ...newReview,
            reviewerName: newReview.reviewerName || "Anonymous User",
          },
        ],
      }));
      setNewReview({ rating: 5, comment: "", reviewerName: "Anonymous User" });
      alert("Review added! (Note: In a real app, this would persist.)");
    }
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleFilterChange = (category) => {
    setSelectedFilterCategory(category);
    setCurrentPage(1); // Reset page to 1 on filter change
    setSearchTerm(""); // Clear search term on filter change
    setShowAllFiltered(false); // Reset showAllFiltered on filter change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page to 1 on search change
    setSelectedFilterCategory("All"); // Clear filter on search change
    setShowAllFiltered(false); // Reset showAllFiltered on search change
  };

  const handleShowMoreProjects = () => {
    setShowAllFiltered(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Header and Navigation */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Student Project Showcase
        </h1>
        <nav className="flex items-center space-x-4">
          <a
            href="/"
            className="text-gray-600 hover:text-blue-600 flex items-center"
          >
            <Home className="w-5 h-5 mr-1" /> Home
          </a>
          <a
            href="/shop"
            className="text-gray-600 hover:text-blue-600 flex items-center"
          >
            <Store className="w-5 h-5 mr-1" /> Merchant
          </a>
        </nav>
      </header>

      {/* Filter and Search Section */}
      <section className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Category Filter */}
        <div className="relative w-full sm:w-1/3">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 shadow-sm"
            value={selectedFilterCategory}
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category === "All" ? "All Categories" : category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <Filter className="w-5 h-5" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-2/3">
          <input
            type="text"
            placeholder="Search projects by title, student, or description..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer relative group"
            onMouseEnter={() => setHoveredCard(project.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleProjectClick(project)}
          >
            {/* Image Container with hover effect */}
            <div className="w-full h-48 sm:h-56 overflow-hidden relative">
              <img
                src={project.image}
                alt={project.title}
                className={`w-full h-full object-cover transition-all duration-300
                  ${
                    hoveredCard === project.id
                      ? "brightness-75 scale-105" // Reduced brightness and slight scale
                      : ""
                  }`}
              />
              {hoveredCard === project.id && (
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                {project.title}
              </h3>
              <p className="text-gray-600 text-sm flex items-center mb-1">
                <User className="w-4 h-4 mr-1 text-gray-500" />
                {project.student}
              </p>
              <p className="text-gray-600 text-sm flex items-center mb-1">
                <Tag className="w-4 h-4 mr-1 text-gray-500" />
                {project.category}
              </p>
              <p className="text-gray-600 text-sm flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                {project.date}
              </p>
              <div className="flex items-center">
                <Star
                  className={`w-5 h-5 ${
                    getAverageRating(project.reviews) > 0
                      ? "text-yellow-400"
                      : "text-gray-300"
                  } fill-current`}
                />
                <span className="ml-1 text-gray-700 font-medium">
                  {getAverageRating(project.reviews)}{" "}
                  <span className="text-sm text-gray-500">
                    ({project.reviews.length} reviews)
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Projects button for filtered/searched results */}
      {(selectedFilterCategory !== "All" || searchTerm) &&
        !showAllFiltered &&
        filteredProjects.length > reducedItemsPerPage && (
          <div className="mt-8 text-center">
            <button
              onClick={handleShowMoreProjects}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Show More Projects (
              {filteredProjects.length - reducedItemsPerPage} more)
            </button>
          </div>
        )}

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 animate-fade-in-up">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedProject.title}
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold">Student:</span>{" "}
              {selectedProject.student}
            </p>
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold">Category:</span>{" "}
              {selectedProject.category}
            </p>
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold">Date:</span>{" "}
              {selectedProject.date}
            </p>
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-auto max-h-96 object-cover rounded-lg mb-6 shadow-md"
            />
            <p className="text-gray-800 text-base leading-relaxed mb-6">
              {selectedProject.description}
            </p>

            {/* Reviews Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Reviews ({selectedProject.reviews.length})
              </h3>
              {selectedProject.reviews.length === 0 ? (
                <p className="text-gray-600 italic">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {selectedProject.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-gray-800 mr-2">
                          {review.reviewerName}
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              } fill-current`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add a Review Form */}
              <div className="mt-6 bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
                <h4 className="text-xl font-semibold text-blue-800 mb-3">
                  Add Your Review
                </h4>
                <div className="mb-4">
                  <label
                    htmlFor="reviewerName"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Your Name:
                  </label>
                  <input
                    type="text"
                    id="reviewerName"
                    name="reviewerName"
                    value={newReview.reviewerName}
                    onChange={handleReviewChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Anonymous User"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="rating"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Rating:
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={newReview.rating}
                    onChange={handleReviewChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="comment"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Comment:
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={newReview.comment}
                    onChange={handleReviewChange}
                    rows="4"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your comments here..."
                  ></textarea>
                </div>
                <button
                  onClick={handleAddReview}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectLayout;
