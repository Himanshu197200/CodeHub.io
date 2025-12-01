// Shared mock events data
export const mockEvents = [
    // Technical Events
    {
        id: '692c52c0ac28c541357ecf13',
        title: 'NST Hackathon 2025',
        description: 'Join the biggest coding competition of the year. Build innovative solutions and win amazing prizes!',
        category: 'TECHNICAL',
        type: 'HACKATHON',
        date: '2025-12-15T09:00:00',
        time: '09:00 AM',
        registrationDeadline: '2025-12-14T23:59:59',
        venue: 'NST Tech Hub, Building A',
        thumbnail: '/event-image.jpeg',
        organizer: { name: 'NST Tech Club' },
        registrationFee: 500,
        isPaid: true,
        maxParticipants: 4,
        rules: [
            'Teams must consist of 2-4 members.',
            'All code must be written during the hackathon.',
            'Plagiarism will lead to immediate disqualification.',
            'Participants must bring their own laptops.'
        ]
    },
    {
        id: '692c52c0ac28c541357ecf14',
        title: 'NST Tech Talk: AI & ML',
        description: 'Learn about the latest trends in Artificial Intelligence and Machine Learning from industry experts.',
        category: 'TECHNICAL',
        type: 'SEMINAR',
        date: '2025-12-20T14:00:00',
        time: '02:00 PM',
        registrationDeadline: '2025-12-19T23:59:59',
        venue: 'NST Auditorium',
        thumbnail: '/ai_tech_talk.png',
        organizer: { name: 'NST Innovation Lab' },
        registrationFee: 0,
        isPaid: false,
        maxParticipants: 500,
        rules: [
            'Entry is free but registration is mandatory.',
            'Please be seated 15 minutes before the start.',
            'Q&A session will be held at the end.'
        ]
    },
    {
        id: '692c52c0ac28c541357ecf15',
        title: 'NST Code Sprint',
        description: '24-hour competitive programming marathon. Test your skills against the best coders!',
        category: 'TECHNICAL',
        type: 'COMPETITION',
        date: '2025-12-25T10:00:00',
        time: '10:00 AM',
        registrationDeadline: '2025-12-24T23:59:59',
        venue: 'NST Computer Lab',
        thumbnail: '/code_sprint.png',
        organizer: { name: 'NST Coding Society' },
        registrationFee: 300,
        isPaid: true,
        maxParticipants: 100,
        rules: [
            'Individual participation only.',
            'Use of mobile phones is strictly prohibited.',
            'Internet access is allowed only for documentation.'
        ]
    },
    // Cultural Events
    {
        id: '692c52c0ac28c541357ecf16',
        title: 'NST Cultural Fest 2025',
        description: 'Experience the vibrant culture of NST with music, dance, and drama performances.',
        category: 'CULTURAL',
        type: 'FESTIVAL',
        date: '2025-12-18T16:00:00',
        time: '04:00 PM',
        registrationDeadline: '2025-12-17T23:59:59',
        venue: 'NST Main Stadium',
        thumbnail: '/cultural_fest.png',
        organizer: { name: 'NST Cultural Committee' },
        registrationFee: 200,
        isPaid: true,
        maxParticipants: 1000,
        rules: [
            'Valid ID card is mandatory for entry.',
            'Outside food and drinks are not allowed.',
            'Maintain discipline and cleanliness.'
        ]
    },
    {
        id: '692c52c0ac28c541357ecf17',
        title: 'NST Music Night',
        description: 'Live band performances, DJ sets, and open mic sessions. Showcase your talent!',
        category: 'CULTURAL',
        type: 'CONCERT',
        date: '2025-12-22T19:00:00',
        time: '07:00 PM',
        registrationDeadline: '2025-12-21T23:59:59',
        venue: 'NST Open Air Theater',
        thumbnail: '/music_night.png',
        organizer: { name: 'NST Music Club' },
        registrationFee: 150,
        isPaid: true,
        maxParticipants: 500,
        rules: [
            'Performances must adhere to the time limit.',
            'No offensive content allowed.',
            'Bring your own instruments (except drum kit).'
        ]
    },
    {
        id: '692c52c0ac28c541357ecf18',
        title: 'NST Dance Competition',
        description: 'Show off your moves! Solo, duo, and group dance categories with exciting prizes.',
        category: 'CULTURAL',
        type: 'COMPETITION',
        date: '2025-12-28T17:00:00',
        time: '05:00 PM',
        registrationDeadline: '2025-12-27T23:59:59',
        venue: 'NST Dance Studio',
        thumbnail: '/dance_competition.png',
        organizer: { name: 'NST Dance Society' },
        registrationFee: 250,
        isPaid: true,
        maxParticipants: 50,
        rules: [
            'Music track must be submitted 2 days prior.',
            'Costumes must be decent and appropriate.',
            'Judges decision will be final.'
        ]
    },
    // Sports Events
    {
        id: '692c52c0ac28c541357ecf19',
        title: 'NST Inter-College Cricket',
        description: 'Premier cricket tournament featuring teams from colleges across the city.',
        category: 'SPORTS',
        type: 'TOURNAMENT',
        date: '2025-12-16T08:00:00',
        time: '08:00 AM',
        registrationDeadline: '2025-12-15T23:59:59',
        venue: 'NST Cricket Ground',
        thumbnail: '/nst-logo.png',
        organizer: { name: 'NST Sports Department' },
        registrationFee: 1000,
        isPaid: true,
        maxParticipants: 16,
        rules: [
            'T20 format rules apply.',
            'Teams must report 30 minutes before match time.',
            'Umpire decision is final.'
        ]
    },
    {
        id: '692c52c0ac28c541357ecf1a',
        title: 'NST Marathon 2025',
        description: '10K run for fitness enthusiasts. All proceeds go to charity!',
        category: 'SPORTS',
        type: 'MARATHON',
        date: '2025-12-21T06:00:00',
        time: '06:00 AM',
        registrationDeadline: '2025-12-20T23:59:59',
        venue: 'NST Campus Route',
        thumbnail: '/nst-logo.png',
        organizer: { name: 'NST Athletics Club' },
        registrationFee: 100,
        isPaid: true,
        maxParticipants: 500,
        rules: [
            'Bib number must be visible at all times.',
            'Follow the marked route strictly.',
            'Medical assistance available at checkpoints.'
        ]
    },
    {
        id: '692c52c0ac28c541357ecf1b',
        title: 'NST Basketball Championship',
        description: '3v3 basketball tournament. Fast-paced action and incredible prizes await!',
        category: 'SPORTS',
        type: 'TOURNAMENT',
        date: '2025-12-27T09:00:00',
        time: '09:00 AM',
        registrationDeadline: '2025-12-26T23:59:59',
        venue: 'NST Basketball Court',
        thumbnail: '/nst-logo.png',
        organizer: { name: 'NST Basketball Team' },
        registrationFee: 600,
        isPaid: true,
        maxParticipants: 32,
        rules: [
            'FIBA 3x3 rules apply.',
            'Games are 10 minutes or first to 21 points.',
            'Fair play is mandatory.'
        ]
    },
    // Workshop Events
    {
        id: '692c52c0ac28c541357ecf1c',
        title: 'NST Web Development Workshop',
        description: 'Learn modern web development from scratch. Build your first website in one day!',
        category: 'WORKSHOP',
        type: 'WORKSHOP',
        date: '2025-12-17T10:00:00',
        time: '10:00 AM',
        registrationDeadline: '2025-12-16T23:59:59',
        venue: 'NST Innovation Center',
        thumbnail: '/nst-logo.png',
        organizer: { name: 'NST Web Dev Club' },
        registrationFee: 400,
        isPaid: true,
        maxParticipants: 50,
        rules: [
            'Bring your own laptop.',
            'Install VS Code and Node.js beforehand.',
            'Certificates provided upon completion.'
        ]
    },
    {
        id: '692c52c0ac28c541357ecf1d',
        title: 'NST Entrepreneurship Bootcamp',
        description: 'Transform your ideas into successful startups. Learn from industry leaders!',
        category: 'WORKSHOP',
        type: 'BOOTCAMP',
        date: '2025-12-23T11:00:00',
        time: '11:00 AM',
        registrationDeadline: '2025-12-22T23:59:59',
        venue: 'NST Entrepreneurship Cell',
        thumbnail: '/nst-logo.png',
        organizer: { name: 'NST E-Cell' },
        registrationFee: 500,
        isPaid: true,
        maxParticipants: 40,
        rules: [
            'Open to all students.',
            'Business idea presentation is optional.',
            'Networking session included.'
        ]
    },
    {
        id: '692c52c0ac28c541357ecf1e',
        title: 'NST Design Thinking Workshop',
        description: 'Master the art of creative problem-solving and user-centered design.',
        category: 'WORKSHOP',
        type: 'WORKSHOP',
        date: '2025-12-29T13:00:00',
        time: '01:00 PM',
        registrationDeadline: '2025-12-28T23:59:59',
        venue: 'NST Design Studio',
        thumbnail: '/nst-logo.png',
        organizer: { name: 'NST Design Club' },
        registrationFee: 350,
        isPaid: true,
        maxParticipants: 30,
        rules: [
            'No prior design experience needed.',
            'All materials will be provided.',
            'Interactive group activities.'
        ]
    }
];
