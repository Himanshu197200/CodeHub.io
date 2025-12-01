// Mock event details data for all events
// This provides additional details like prizes, reviews, FAQs for each event

export const mockEventDetails = {
    // Event ID 1: NST Hackathon 2024
    '692c52c0ac28c541357ecf13': {
        prizes: [
            { position: "Winner", amount: 50000, description: "Cash prize + Internship opportunity + Swag kit", icon: "🏆" },
            { position: "First Runner Up", amount: 25000, description: "Cash prize + Certificates + Swag kit", icon: "🥈" },
            { position: "Second Runner Up", amount: 15000, description: "Cash prize + Certificates", icon: "🥉" },
            { position: "Best Innovation", amount: 10000, description: "Special category award", icon: "💡" }
        ],
        reviews: [
            { user: "Rahul Kumar", avatar: "RK", rating: 5, comment: "Amazing hackathon! Great learning experience with industry mentors. The problem statements were challenging and relevant.", date: "2023-12-20" },
            { user: "Priya Sharma", avatar: "PS", rating: 4, comment: "Well organized event. Could improve on food arrangements but overall great experience.", date: "2023-12-18" },
            { user: "Arjun Singh", avatar: "AS", rating: 5, comment: "Best hackathon I've attended! The organizers were very supportive and the prizes were amazing.", date: "2023-12-17" }
        ],
        faqs: [
            { question: "What is the team size for the hackathon?", answer: "Teams can have 2-4 members. Solo participation is also allowed." },
            { question: "Do I need to bring my own laptop?", answer: "Yes, participants must bring their own laptops and chargers." },
            { question: "Will food be provided?", answer: "Yes, meals and snacks will be provided throughout the 24-hour hackathon." },
            { question: "Is accommodation provided?", answer: "Yes, we have sleeping areas arranged for participants who want to rest." },
            { question: "What technologies can we use?", answer: "You can use any technology stack. We encourage using modern frameworks and cloud services." }
        ],
        keyDates: {
            registrationOpen: "2024-11-25T00:00:00",
            registrationDeadline: "2024-12-14T23:59:59",
            eventDate: "2024-12-15T09:00:00",
            resultsDate: "2024-12-16T18:00:00"
        }
    },

    // Event ID 2: NST Tech Talk: AI & ML
    '692c52c0ac28c541357ecf14': {
        prizes: [],
        reviews: [
            { user: "Sneha Patel", avatar: "SP", rating: 5, comment: "Excellent session! The speaker explained complex ML concepts in a very simple way.", date: "2023-12-21" },
            { user: "Vikram Joshi", avatar: "VJ", rating: 5, comment: "Very informative. Learned about latest AI trends and practical applications.", date: "2023-12-20" }
        ],
        faqs: [
            { question: "Is this session recorded?", answer: "Yes, the session will be recorded and shared with registered participants." },
            { question: "Do I need prior AI/ML knowledge?", answer: "Basic programming knowledge is recommended, but the session covers concepts from fundamentals." },
            { question: "Will there be hands-on coding?", answer: "This is primarily a talk/seminar. Demo codes will be shared for self-practice." },
            { question: "Can I ask questions during the talk?", answer: "Yes, there will be a dedicated Q&A session at the end." }
        ],
        keyDates: {
            registrationOpen: "2024-11-26T00:00:00",
            registrationDeadline: "2024-12-19T23:59:59",
            eventDate: "2024-12-20T14:00:00",
            resultsDate: null
        }
    },

    // Event ID 3: NST Code Sprint
    '692c52c0ac28c541357ecf15': {
        prizes: [
            { position: "Winner", amount: 15000, description: "Cash prize + Coding platform premium subscription", icon: "🏆" },
            { position: "Runner Up", amount: 8000, description: "Cash prize + Certificates", icon: "🥈" },
            { position: "Third Place", amount: 5000, description: "Cash prize + Certificates", icon: "🥉" }
        ],
        reviews: [
            { user: "Amit Verma", avatar: "AV", rating: 5, comment: "Challenging problems! Really tests your coding skills under time pressure.", date: "2023-12-26" },
            { user: "Neha Gupta", avatar: "NG", rating: 4, comment: "Good variety of problems from easy to hard. Great for practice.", date: "2023-12-25" }
        ],
        faqs: [
            { question: "What programming languages are allowed?", answer: "You can use C, C++, Java, Python, or JavaScript." },
            { question: "How many problems will there be?", answer: "Approximately 8-10 problems of varying difficulty levels." },
            { question: "Is internet access allowed?", answer: "Yes, you can use online resources but collaboration is not allowed." },
            { question: "What is the judging criteria?", answer: "Problems are auto-judged based on correctness and time/space complexity." }
        ],
        keyDates: {
            registrationOpen: "2024-11-27T00:00:00",
            registrationDeadline: "2024-12-24T23:59:59",
            eventDate: "2024-12-25T10:00:00",
            resultsDate: "2024-12-26T10:00:00"
        }
    },

    // Event ID 4: NST Cultural Fest 2024
    '692c52c0ac28c541357ecf16': {
        prizes: [
            { position: "Overall Winners", amount: 100000, description: "Trophy + Cash prize + Festival merchandise", icon: "👑" },
            { position: "Dance Competition Winner", amount: 30000, description: "Cash prize + Certificates", icon: "💃" },
            { position: "Music Competition Winner", amount: 30000, description: "Cash prize + Certificates", icon: "🎵" },
            { position: "Drama Competition Winner", amount: 25000, description: "Cash prize + Certificates", icon: "🎭" }
        ],
        reviews: [
            { user: "Riya Malhotra", avatar: "RM", rating: 5, comment: "Best cultural fest ever! So many amazing performances and great vibes.", date: "2023-12-19" },
            { user: "Karan Mehta", avatar: "KM", rating: 5, comment: "The energy was incredible! Met so many talented people. Well organized.", date: "2023-12-18" },
            { user: "Anjali Desai", avatar: "AD", rating: 4, comment: "Loved the variety of events. Only issue was crowd management at times.", date: "2023-12-18" }
        ],
        faqs: [
            { question: "Can I participate in multiple events?", answer: "Yes, you can participate in multiple cultural events." },
            { question: "Is there an entry fee for visitors?", answer: "Entry is free for NST students. Outside visitors need to register." },
            { question: "Are food stalls available?", answer: "Yes, multiple food stalls will be set up throughout the venue." },
            { question: "What are the timings?", answer: "The fest runs from 4 PM to 11 PM over two days." }
        ],
        keyDates: {
            registrationOpen: "2024-11-20T00:00:00",
            registrationDeadline: "2024-12-17T23:59:59",
            eventDate: "2024-12-18T16:00:00",
            resultsDate: "2024-12-19T22:00:00"
        }
    },

    // Event ID 5: NST Music Night
    '692c52c0ac28c541357ecf17': {
        prizes: [
            { position: "Best Band", amount: 20000, description: "Cash prize + Recording opportunity", icon: "🎸" },
            { position: "Best Solo Performance", amount: 10000, description: "Cash prize + Certificates", icon: "🎤" },
            { position: "Audience Choice", amount: 5000, description: "Special award based on live voting", icon: "⭐" }
        ],
        reviews: [
            { user: "Rohan Kapoor", avatar: "RK", rating: 5, comment: "Epic night! The bands were phenomenal and the crowd was amazing.", date: "2023-12-23" },
            { user: "Meera Iyer", avatar: "MI", rating: 5, comment: "Best music event of the year. Great sound quality and lighting.", date: "2023-12-22" }
        ],
        faqs: [
            { question: "Can I perform my original songs?", answer: "Yes! Both covers and originals are welcome." },
            { question: "Do you provide instruments?", answer: "Basic instruments and amplifiers are provided. Bring your own if you prefer." },
            { question: "How long is each performance slot?", answer: "Each act gets 15-20 minutes on stage." },
            { question: "Is there a rehearsal time?", answer: "Yes, sound check and rehearsal slots will be allocated before the event." }
        ],
        keyDates: {
            registrationOpen: "2024-11-23T00:00:00",
            registrationDeadline: "2024-12-21T23:59:59",
            eventDate: "2024-12-22T19:00:00",
            resultsDate: "2024-12-22T23:00:00"
        }
    },

    // Event ID 6: NST Dance Competition
    '692c52c0ac28c541357ecf18': {
        prizes: [
            { position: "Solo Category Winner", amount: 12000, description: "Cash prize + Trophy", icon: "👤" },
            { position: "Duo Category Winner", amount: 18000, description: "Cash prize + Trophy", icon: "👥" },
            { position: "Group Category Winner", amount: 25000, description: "Cash prize + Trophy", icon: "👨‍👩‍👧‍👦" }
        ],
        reviews: [
            { user: "Dance Crew Alpha", avatar: "DA", rating: 5, comment: "Amazing platform to showcase talent. Judges were professional and feedback was constructive.", date: "2023-12-29" },
            { user: "Sia Reddy", avatar: "SR", rating: 5, comment: "Well organized competition with fair judging. Loved the energy!", date: "2023-12-28" }
        ],
        faqs: [
            { question: "What dance styles are allowed?", answer: "All styles are welcome - contemporary, hip-hop, classical, fusion, etc." },
            { question: "Is there a theme?", answer: "No specific theme. You can choose your own concept and music." },
            { question: "How long should the performance be?", answer: "2-3 minutes for solo, 3-5 minutes for duos, 5-7 minutes for groups." },
            { question: "Can we use props?", answer: "Yes, but you must manage your own props. No dangerous items allowed." }
        ],
        keyDates: {
            registrationOpen: "2024-11-29T00:00:00",
            registrationDeadline: "2024-12-27T23:59:59",
            eventDate: "2024-12-28T17:00:00",
            resultsDate: "2024-12-28T22:00:00"
        }
    },

    // Event ID 7: NST Inter-College Cricket
    '692c52c0ac28c541357ecf19': {
        prizes: [
            { position: "Champion Team", amount: 75000, description: "Trophy + Cash prize + Sports merchandise", icon: "🏏" },
            { position: "Runner Up Team", amount: 40000, description: "Trophy + Cash prize", icon: "🥈" },
            { position: "Man of the Tournament", amount: 10000, description: "Individual award + Certificate", icon: "⭐" }
        ],
        reviews: [
            { user: "Virat Sharma", avatar: "VS", rating: 5, comment: "Professional level organization! Great ground facilities and umpiring.", date: "2023-12-17" },
            { user: "Cricket Team NST", avatar: "CT", rating: 4, comment: "Competitive matches and good sportsmanship. Well worth it!", date: "2023-12-16" }
        ],
        faqs: [
            { question: "What is the format?", answer: "T20 format with 20 overs per side." },
            { question: "How many players per team?", answer: "Squad of 15 players, 11 playing at a time." },
            { question: "Are professional cricketers allowed?", answer: "Only college students are eligible. No state/national level players." },
            { question: "What equipment is provided?", answer: "Stumps, balls, and basic gear provided. Bring your own bats and pads." }
        ],
        keyDates: {
            registrationOpen: "2024-11-17T00:00:00",
            registrationDeadline: "2024-12-15T23:59:59",
            eventDate: "2024-12-16T08:00:00",
            resultsDate: "2024-12-16T18:00:00"
        }
    },

    // Event ID 8: NST Marathon 2024
    '692c52c0ac28c541357ecf1a': {
        prizes: [
            { position: "1st Place (Male)", amount: 5000, description: "Cash prize + Medal + Fitness tracker", icon: "🏃‍♂️" },
            { position: "1st Place (Female)", amount: 5000, description: "Cash prize + Medal + Fitness tracker", icon: "🏃‍♀️" },
            { position: "Charity Champions", amount: 0, description: "All proceeds go to charity", icon: "❤️" }
        ],
        reviews: [
            { user: "Marathon Runner", avatar: "MR", rating: 5, comment: "Well marked route and great support from volunteers. Hydration points were perfect!", date: "2023-12-22" },
            { user: "Fitness Enthusiast", avatar: "FE", rating: 5, comment: "Loved running for a cause! Route was scenic and safe.", date: "2023-12-21" }
        ],
        faqs: [
            { question: "What is the distance?", answer: "Standard 10K run (10 kilometers)." },
            { question: "Is there an age limit?", answer: "Participants must be 16 years or older." },
            { question: "What should I bring?", answer: "Comfortable running shoes, water bottle, and your BIB number." },
            { question: "Are there medical facilities?", answer: "Yes, medical team and ambulances will be stationed throughout the route." }
        ],
        keyDates: {
            registrationOpen: "2024-11-22T00:00:00",
            registrationDeadline: "2024-12-20T23:59:59",
            eventDate: "2024-12-21T06:00:00",
            resultsDate: "2024-12-21T10:00:00"
        }
    },

    // Event ID 9: NST Basketball Championship
    '692c52c0ac28c541357ecf1b': {
        prizes: [
            { position: "Champion Team", amount: 30000, description: "Trophy + Cash prize + Basketball gear", icon: "🏀" },
            { position: "Runner Up Team", amount: 18000, description: "Trophy + Cash prize", icon: "🥈" },
            { position: "Best Player", amount: 5000, description: "Individual award + Certificate", icon: "💪" }
        ],
        reviews: [
            { user: "Hoop Stars", avatar: "HS", rating: 5, comment: "Intense games! Great competition and fair refereeing.", date: "2023-12-28" },
            { user: "Basketball Pro", avatar: "BP", rating: 4, comment: "Good tournament. Court conditions were excellent.", date: "2023-12-27" }
        ],
        faqs: [
            { question: "What is the format?", answer: "3v3 half-court basketball. Knockout format." },
            { question: "How long are the games?", answer: "12 minutes per game or first to 21 points." },
            { question: "Can girls participate?", answer: "Yes, we have separate brackets for mens and womens teams." },
            { question: "Do we need matching jerseys?", answer: "Matching colored t-shirts are recommended but not mandatory." }
        ],
        keyDates: {
            registrationOpen: "2024-11-28T00:00:00",
            registrationDeadline: "2024-12-26T23:59:59",
            eventDate: "2024-12-27T09:00:00",
            resultsDate: "2024-12-27T17:00:00"
        }
    },

    // Event ID 10: NST Web Development Workshop
    '692c52c0ac28c541357ecf1c': {
        prizes: [],
        reviews: [
            { user: "Web Dev Learner", avatar: "WL", rating: 5, comment: "Hands-on workshop with real projects. Learned React from scratch!", date: "2023-12-18" },
            { user: "Code Newbie", avatar: "CN", rating: 5, comment: "Perfect for beginners. Instructor was patient and explained everything clearly.", date: "2023-12-17" }
        ],
        faqs: [
            { question: "Do I need prior coding experience?", answer: "Basic HTML/CSS knowledge is helpful but not required." },
            { question: "What will we build?", answer: "A complete responsive website using HTML, CSS, JavaScript and React." },
            { question: "Will I get a certificate?", answer: "Yes, certificates will be provided to all participants who complete the workshop." },
            { question: "Do I need to bring a laptop?", answer: "Yes, bring your laptop with any code editor installed (VS Code recommended)." }
        ],
        keyDates: {
            registrationOpen: "2024-11-18T00:00:00",
            registrationDeadline: "2024-12-16T23:59:59",
            eventDate: "2024-12-17T10:00:00",
            resultsDate: null
        }
    },

    // Event ID 11: NST Entrepreneurship Bootcamp
    '692c52c0ac28c541357ecf1d': {
        prizes: [
            { position: "Best Startup Pitch", amount: 25000, description: "Seed funding + Mentorship program", icon: "💼" },
            { position: "Most Innovative Idea", amount: 15000, description: "Cash prize + Incubation support", icon: "💡" }
        ],
        reviews: [
            { user: "Startup Founder", avatar: "SF", rating: 5, comment: "Incredible learning from industry leaders. Network opportunity was priceless!", date: "2023-12-24" },
            { user: "Future Entrepreneur", avatar: "FE", rating: 5, comment: "Transformed my business idea into a viable plan. Worth every minute!", date: "2023-12-23" }
        ],
        faqs: [
            { question: "Do I need a business idea?", answer: "Not mandatory, but having an idea will help you get more from the bootcamp." },
            { question: "Who are the mentors?", answer: "Successful entrepreneurs, VCs, and industry experts from various sectors." },
            { question: "Will there be networking opportunities?", answer: "Yes, dedicated networking sessions with mentors and fellow participants." },
            { question: "Is there a pitch competition?", answer: "Yes, final day includes startup pitch presentations with prize money." }
        ],
        keyDates: {
            registrationOpen: "2024-11-24T00:00:00",
            registrationDeadline: "2024-12-22T23:59:59",
            eventDate: "2024-12-23T11:00:00",
            resultsDate: "2024-12-24T18:00:00"
        }
    },

    // Event ID 12: NST Design Thinking Workshop
    '692c52c0ac28c541357ecf1e': {
        prizes: [],
        reviews: [
            { user: "UX Designer", avatar: "UX", rating: 5, comment: "Best workshop on design thinking! Practical exercises and great mentorship.", date: "2023-12-30" },
            { user: "Product Manager", avatar: "PM", rating: 5, comment: "Learned systematic approach to problem solving. Highly recommended!", date: "2023-12-29" }
        ],
        faqs: [
            { question: "What is design thinking?", answer: "A user-centered approach to creative problem-solving and innovation." },
            { question: "Do I need design experience?", answer: "No prior design experience needed. Open to all disciplines." },
            { question: "What tools will we use?", answer: "Mix of pen-paper brainstorming, digital tools like Figma, and collaborative exercises." },
            { question: "Will we work on real problems?", answer: "Yes, case studies based on real-world challenges from partner organizations." }
        ],
        keyDates: {
            registrationOpen: "2024-11-30T00:00:00",
            registrationDeadline: "2024-12-28T23:59:59",
            eventDate: "2024-12-29T13:00:00",
            resultsDate: null
        }
    }
};
