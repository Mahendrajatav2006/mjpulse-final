import { GroupItem, SerialPartition, CATEGORY_FILTER_MAP } from './browseData';

// Helper to remove duplicates by name and query
function dedupe(list: SerialPartition[], maxCount = 500): SerialPartition[] {
  const seenName = new Set<string>();
  const seenQuery = new Set<string>();
  const result: SerialPartition[] = [];
  for (const item of list) {
    const n = item.name.trim().toLowerCase();
    const q = item.query.trim().toLowerCase();
    if (!seenName.has(n) && !seenQuery.has(q)) {
      seenName.add(n);
      seenQuery.add(q);
      result.push(item);
      if (result.length >= maxCount) break;
    }
  }
  return result;
}

// 1. TOP PODCASTS (500 unique shows, topics, investigative themes, interviews, philosophy)
export function getPodcastPartitions(): SerialPartition[] {
  const raw: { name: string; query: string }[] = [
    // The core requested shows first:
    { name: 'The Ranveer Show (TRS)', query: 'The Ranveer Show TRS Hindi Podcast' },
    { name: 'Crime Investigation', query: 'Crime Investigation Stories Hindi Podcast' },
    { name: 'Supernatural Mysteries', query: 'Supernatural Mystery Hindi Audio Stories' },
    { name: 'Motivation Talks', query: 'Hindi Motivation Podcast Talks' },
    { name: 'Figuring Out (Raj Shamani)', query: 'Raj Shamani Figuring Out Podcast' },
    { name: 'On Purpose (Jay Shetty)', query: 'Jay Shetty On Purpose Podcast' },
    { name: 'Huberman Lab Health', query: 'Andrew Huberman Health Science Podcast' },
    { name: 'Prakhar Ke Pravachan', query: 'Prakhar Ke Pravachan Podcast' },
    { name: 'Desi Crime Stories', query: 'Desi Crime Podcast India' },
    { name: 'Khooni Crime Diaries', query: 'Khooni The Crime Podcast Hindi' },
    { name: 'WTF with Nikhil Kamath', query: 'WTF with Nikhil Kamath Podcast' },
    { name: 'Dostcast (Vinamre)', query: 'Dostcast Vinamre Podcast' },
    { name: 'Men of Culture', query: 'Men of Culture Podcast' },
    { name: 'Unfiltered by Samdish', query: 'Unfiltered by Samdish Podcast' },
    { name: 'Cyrus Says', query: 'Cyrus Says Podcast Comedy' },
    { name: 'The Lallantop Baithak', query: 'The Lallantop Baithak Podcast' },
    { name: 'ANI Podcast (Smita Prakash)', query: 'ANI Podcast Smita Prakash' },
    { name: 'Curly Tales Brunch', query: 'Curly Tales Sunday Brunch Podcast' },
    { name: 'Maniesh Paul Podcast', query: 'Maniesh Paul Podcast Hindi' },
    { name: 'BeerBiceps Fitness', query: 'BeerBiceps Fitness Gym Workout Podcast' },
    { name: 'BeerBiceps Spirituality', query: 'BeerBiceps Spiritual Hindu Podcast' },
    { name: 'BeerBiceps Aliens & UFOs', query: 'BeerBiceps Alien UFO Mystery Podcast' },
    { name: 'BeerBiceps History', query: 'BeerBiceps Indian History Ancient Podcast' },
    { name: 'BeerBiceps Geopolitics', query: 'BeerBiceps Geopolitics World Affairs' },
    { name: 'BeerBiceps Tantra & Aghori', query: 'BeerBiceps Aghori Tantra Secrets' },
    { name: 'Indian Murder Mystery', query: 'Indian Murder Mystery Audio Stories' },
    { name: 'Delhi Crime Files', query: 'Delhi Crime Police Investigation Stories' },
    { name: 'Mumbai Mafia Diaries', query: 'Mumbai Underworld Mafia Crime Stories' },
    { name: 'Tihar Jail Real Stories', query: 'Tihar Jail Inmate Stories Hindi' },
    { name: 'RAW Secret Intelligence', query: 'RAW Intelligence Secret Agents India' },
    { name: 'CBI Unsolved Cases', query: 'CBI Unsolved Mysteries India' },
    { name: 'Police Encounter Files', query: 'Police Encounter True Stories India' },
    { name: 'Cyber Crime & Dark Web', query: 'Cyber Crime Dark Web Scams India' },
    { name: 'Bank Heists & Scams', query: 'Indian Bank Scams True Crime Podcast' },
    { name: 'Serial Killers of India', query: 'Serial Killers India Crime Podcast' },
    { name: 'Ghost of Bhangarh Fort', query: 'Bhangargh Fort Horror Stories Hindi' },
    { name: 'Kuldhara Haunted Village', query: 'Kuldhara Haunted Village Rajasthan Mystery' },
    { name: 'Haunted Highway NH44', query: 'Haunted Highway Paranormal Stories' },
    { name: 'Real Daayan & Witchcraft', query: 'Chudail Daayan Real Horror Stories' },
    { name: 'Aghori Sadhu Mysteries', query: 'Aghori Sadhu Sadhana Mysteries' },
    { name: 'Himalayan Yogis & Immortals', query: 'Himalayan Yogis Immortals Siddha' },
    { name: 'Reincarnation & Punarjanm', query: 'Reincarnation Punarjanm Real Cases India' },
    { name: 'Alien Abductions India', query: 'Alien Abductions UFO Sightings India' },
    { name: 'Bermuda Triangle Secrets', query: 'Bermuda Triangle Ocean Mysteries' },
    { name: 'Black Magic & Kala Jadu', query: 'Black Magic Kala Jadu Real Cases' },
    { name: 'Stoicism & Inner Peace', query: 'Stoicism Marcus Aurelius Hindi Philosophy' },
    { name: 'Atomic Habits & Discipline', query: 'Atomic Habits Self Discipline Motivation' },
    { name: 'Psychology of Money', query: 'The Psychology of Money Hindi Audio' },
    { name: 'Overcoming Overthinking', query: 'Overcoming Overthinking Mental Peace' },
    { name: 'Stress & Anxiety Relief', query: 'Dealing With Anxiety Stress Mental Health' },
    { name: 'Emotional Intelligence', query: 'Emotional Intelligence EQ Podcast' },
    { name: 'High Performance Habits', query: 'High Performance Habits Success' },
    { name: 'Morning Routine Wisdom', query: 'Billionaire Morning Routine Mindset' },
    { name: 'Deep Work & Hyperfocus', query: 'Deep Work Focus Productivity Podcast' },
    { name: 'Self Love & Inner Healing', query: 'Self Love Healing Affirmations Hindi' },
    { name: 'Bhagavad Gita for Youth', query: 'Bhagavad Gita Youth Modern Life' },
    { name: 'Shiv Puran Secrets', query: 'Shiv Mahapuran Rahasya Audio' },
    { name: 'Hanuman Chalisa Science', query: 'Hanuman Chalisa Spiritual Meaning Science' },
    { name: 'Karma & Past Life Echoes', query: 'Karma Theory Past Life Reincarnation' },
    { name: 'Kundalini 7 Chakras', query: 'Kundalini Awakening 7 Chakras Meditation' },
    { name: 'Vedic Science & Cosmos', query: 'Ancient Vedic Science Astronomy India' },
    { name: 'Zen & Buddhist Wisdom', query: 'Vipassana Meditation Zen Wisdom Hindi' },
    { name: 'Swami Vivekananda Talks', query: 'Swami Vivekananda Youth Speeches' },
    { name: 'Jiddu Krishnamurti Freedom', query: 'Jiddu Krishnamurti Freedom Mind' },
    { name: 'Osho Pravachan Deep', query: 'Osho Pravachan Audio Discourses' },
    { name: 'Sadhguru Inner Engineering', query: 'Sadhguru Inner Engineering Talks' },
    { name: 'Gaur Gopal Das Monk Mind', query: 'Gaur Gopal Das Life Lessons' },
    { name: 'Jaya Kishori Life Lessons', query: 'Jaya Kishori Motivational Talks' },
    { name: 'Sandeep Maheshwari Sessions', query: 'Sandeep Maheshwari Audio Sessions' },
    { name: 'Vivek Bindra Business Case', query: 'Vivek Bindra Business Case Studies' },
    { name: 'Indian Unicorn Founders', query: 'Indian Startup Unicorn Founder Stories' },
    { name: 'Stock Market Trading Guide', query: 'Stock Market Trading Basics Hindi' },
    { name: 'Mutual Funds & SIP Wealth', query: 'Mutual Funds SIP Wealth Building' },
    { name: 'Real Estate Investment India', query: 'Real Estate Property Investing India' },
    { name: 'Crypto & Web3 Blockchain', query: 'Crypto Bitcoin Web3 Future India' },
    { name: 'AI Revolution & ChatGPT', query: 'AI Artificial Intelligence Future Jobs' },
    { name: 'Freelancing & Remote Work', query: 'Freelancing Digital Nomad Income' },
    { name: 'Marketing & Consumer Brain', query: 'Marketing Consumer Psychology Secrets' },
    { name: 'Tech Giants Exposed', query: 'Tech Giants Google Apple Monopoly' },
    { name: 'E-commerce Business Masterclass', query: 'Ecommerce Dropshipping Business Hindi' },
    { name: 'ISRO Space Missions', query: 'ISRO Chandrayaan Mars Mission Space' },
    { name: 'Quantum Physics Explained', query: 'Quantum Physics Parallel Universe Hindi' },
    { name: 'Human Brain & Neuroscience', query: 'Neuroscience Brain Memory Sleep Hacks' },
    { name: 'Genetic Science & CRISPR', query: 'Genetic Engineering DNA Future Humans' },
    { name: 'Nuclear Weapons & War', query: 'Nuclear Bomb Oppenheimer Cold War' },
    { name: 'Future of Humanoid Robots', query: 'Humanoid Robots Cybernetics Future' },
    { name: 'Time Travel Theories', query: 'Time Travel Relativity Wormholes Hindi' },
    { name: 'Mariana Trench Ocean Depths', query: 'Mariana Trench Deep Ocean Monsters' },
    { name: 'Extinction of Dinosaurs', query: 'Dinosaur Extinction Asteroid Impact' },
    { name: 'Evolution of Human Brain', query: 'Sapiens Human Evolution History' },
    { name: 'Shivaji Maharaj Guerilla War', query: 'Chhatrapati Shivaji Maharaj Battles' },
    { name: 'Netaji Subhas Chandra Mystery', query: 'Netaji Subhas Chandra Bose Untold Truth' },
    { name: 'Kargil War 1999 Heroes', query: 'Kargil War 1999 Param Vir Chakra' },
    { name: '1971 War & Mukti Bahini', query: '1971 Indo Pak War Bangladesh Liberation' },
    { name: 'Chola Navy Maritime Empire', query: 'Chola Dynasty Powerful Navy Empire' },
    { name: 'Indus Valley Civilisation', query: 'Indus Valley Mohenjodaro Harappa Mystery' },
    { name: 'World War 2 Secret Weapons', query: 'World War 2 Hitler Churchill Secrets' },
    { name: 'Fall of Roman Empire', query: 'Fall of Roman Empire History' },
    { name: 'Cold War KGB CIA Espionage', query: 'Cold War KGB CIA Spy Operations' },
    { name: 'Middle East Geopolitics', query: 'Middle East Oil War Geopolitics' },
    { name: 'Gut Microbiome & Health', query: 'Gut Health Microbiome Immunity Digestion' },
    { name: 'Intermittent Fasting Facts', query: 'Intermittent Fasting Autophagy Science' },
    { name: 'Testosterone & Vitality', query: 'Testosterone Optimization Mens Health' },
    { name: 'Sleep Cycle & Circadian Rhythm', query: 'Deep Sleep REM Circadian Rhythm Optimization' },
    { name: 'Anti-Aging & Longevity Hacks', query: 'Anti Aging Longevity Cellular Health' },
    { name: 'Protein Myths & Muscle', query: 'Hypertrophy Muscle Protein Synthesis Nutrition' },
    { name: 'Mental Health & Therapy', query: 'Mental Health Therapy Counseling Hindi' },
    { name: 'Pranayam & Breathwork', query: 'Pranayam Wim Hof Breathing Science' },
    { name: 'Dopamine Detox & Focus', query: 'Dopamine Detox Reset Attention Span' },
    { name: 'Spine & Posture Health', query: 'Postural Alignment Spine Health Ergonomics' },
    { name: 'Modern Dating Red Flags', query: 'Modern Dating Red Flags Green Flags' },
    { name: 'Healing From Breakup', query: 'Healing Broken Heart Relationship Advice' },
    { name: 'Long Distance Love Guide', query: 'Long Distance Relationship Communication' },
    { name: 'Body Language Decoding', query: 'Body Language Non Verbal Cues Lie Detection' },
    { name: 'Charisma & Public Speaking', query: 'Public Speaking Stage Fear Charisma' },
    { name: 'Adult Friendship Dynamics', query: 'Making Meaningful Friends Adult Life' },
    { name: 'Boundaries with Toxic People', query: 'Setting Boundaries Narcissist Toxic People' },
    { name: 'Introvert Quiet Strength', query: 'Introvert Personality Quiet Strength' },
    { name: 'Family Relationships Repair', query: 'Family Harmony Communication Healing' },
    { name: 'Marriage & Lasting Love', query: 'Marriage Compatibility Communication Love' },
    { name: 'Bollywood Behind The Screen', query: 'Bollywood Dark Secrets Casting Story' },
    { name: 'Filmmaking Masterclass', query: 'Cinema Direction Screenplay Cinematography' },
    { name: 'Satyajit Ray Storytelling', query: 'Satyajit Ray Film Theory Storytelling' },
    { name: 'Christopher Nolan Mind-Benders', query: 'Christopher Nolan Inception Interstellar Breakdown' },
    { name: 'Anime & Manga Universe', query: 'Anime Analysis Naruto Attack on Titan' },
    { name: 'OTT Web Series Breakdown', query: 'OTT Series Plot Analysis Character Arc' },
    { name: 'Sound Design & Foley Secrets', query: 'Sound Design Foley Audio Engineering' },
    { name: 'Method Acting Stories', query: 'Method Acting Irrfan Khan Manoj Bajpayee' },
    { name: 'Gaming Culture & Lore', query: 'Video Game Storylines Cyberpunk Elden Ring' },
    { name: 'Standup Comedy Craft', query: 'Standup Comedy Joke Writing Punchlines' },
    { name: 'Virat Kohli Mindset', query: 'Virat Kohli Elite Mindset Fitness Discipline' },
    { name: 'MS Dhoni Captain Cool', query: 'MS Dhoni Leadership Decision Making' },
    { name: 'Sachin Tendulkar Mastery', query: 'Sachin Tendulkar Cricket Masterclass Stories' },
    { name: 'Football Legends Rivalry', query: 'Messi Ronaldo Tactical Football Stories' },
    { name: 'Olympic Gold Discipline', query: 'Olympic Athletes Relentless Training' },
    { name: 'Extreme Mountaineering & K2', query: 'Everest K2 Extreme Mountaineering Survival' },
    { name: 'Chess Grandmaster Psychology', query: 'Chess Grandmaster Calculation Focus' },
    { name: 'Indian Para SF Training', query: 'Para SF Marcos Garud Special Forces India' },
    { name: 'Wilderness Survival Tactics', query: 'Wilderness Survival Bushcraft Navigation' },
  ];

  // Systematically generate detailed topics to reach 500 unique entries
  const themes = [
    { prefix: 'Investigation: ', suffix: ' Cases', baseQ: 'True Crime Podcast Case Files' },
    { prefix: 'Mystery of ', suffix: ' Uncovered', baseQ: 'Unsolved Mysterious Audio' },
    { prefix: 'Secrets of ', suffix: ' Revealed', baseQ: 'Secrets Documentary Audio' },
    { prefix: 'Life of ', suffix: ' Untold', baseQ: 'Biographical Podcast Audio' },
    { prefix: 'Masterclass: ', suffix: ' Skills', baseQ: 'Expert Skills Audio Masterclass' },
    { prefix: 'Deep Dive: ', suffix: ' Science', baseQ: 'Deep Dive Scientific Breakdown' },
    { prefix: 'History of ', suffix: ' Era', baseQ: 'Historical Documentary Hindi' },
    { prefix: 'Spiritual: ', suffix: ' Wisdom', baseQ: 'Spiritual Discourses Teachings' },
    { prefix: 'Business: ', suffix: ' Strategy', baseQ: 'Business Growth Tactics Strategy' },
    { prefix: 'Psychology: ', suffix: ' Mind', baseQ: 'Psychological Analysis Mind' },
    { prefix: 'Mindset: ', suffix: ' Routine', baseQ: 'Mindset Performance Coaching' },
    { prefix: 'Philosophy: ', suffix: ' Path', baseQ: 'Philosophical Discourse Ideas' },
    { prefix: 'Health: ', suffix: ' Protocol', baseQ: 'Health Wellness Protocol' },
    { prefix: 'Horror: ', suffix: ' Chronicle', baseQ: 'Horror Paranormal Chronicle' },
    { prefix: 'Culture: ', suffix: ' Heritage', baseQ: 'Indian Culture Heritage Folk' },
  ];

  const subjects = [
    'Ancient Harappan Cities', 'Vedic Mathematics', 'Himalayan Hermits', 'Indian Spies in Pakistan',
    'Chola Naval Warfare', 'Ashoka The Great', 'Chandragupta Maurya', 'Aryabhata Astronomy',
    'Sushruta Surgery', 'Charaka Ayurveda', 'Battle of Plassey', 'Rani Lakshmibai Valor',
    'Bhagat Singh Revolutionary', 'Sardar Patel Integration', 'Tashkent Agreement Secret', 'Pokhran Nuclear Tests',
    'Sikkim Integration Story', 'Goa Liberation 1961', 'Siachen Glacier War', 'Operation Cactus Maldives',
    'Tiger Hill Heroics', 'Major Somnath Sharma', 'Captain Vikram Batra', 'Subedar Joginder Singh',
    'Bermuda Triangle Lost Ships', 'Roswell Alien Crash', 'Voynich Manuscript', 'Antikythera Mechanism',
    'Great Pyramid Alignment', 'Stonehenge Astronomy', 'Moai Statues of Easter Island', 'Nazca Desert Lines',
    'Atlantis Lost Civilization', 'Dwaraka Underwater City', 'Ram Setu Bridge Oceanography', 'Kailash Temple Monolith',
    'Ajanta Ellora Acoustics', 'Lepakshi Hanging Pillar', 'Brihadeeswarar Temple Shadow', 'Konark Sun Temple Wheels',
    'Padmanabhaswamy Vault B', 'Jagannath Temple Flags & Birds', 'Tirupati Balaji Miracles', 'Meenakshi Temple Architecture',
    'Golden Temple Langar Logistics', 'Varanasi Ghats & Moksha', 'Rishikesh Yoga Heritage', 'Kedarnath 2013 Miracle',
    'Amarnath Ice Lingam Formation', 'Vaishno Devi Cave Mystery', 'Kamakhya Tantra Shaktipith', 'Tarapith Cremation Sadhana',
    'Neuroplasticity & Brain Growth', 'Dopamine Fasting Protocol', 'Circadian Light Exposure', 'Cold Exposure & Brown Fat',
    'Sauna & Heat Shock Proteins', 'Ketogenic Metabolism', 'Zone 2 Cardio Endurance', 'VO2 Max & Heart Longevity',
    'Strength Training for Seniors', 'Mobility & Joint Longevity', 'Mindful Eating & Gut Health', 'Probiotics & Mental Health',
    'Cortisol & Stress Management', 'Vagus Nerve Stimulation', 'Breathwork for Panic Attacks', 'Melatonin & Pineal Gland',
    'Dream Architecture & Lucid Dreaming', 'Hypnagogic State Creativity', 'Subconscious Reprogramming', 'Cognitive Bias Traps',
    'Confirmation Bias in Daily Life', 'Sunk Cost Fallacy in Careers', 'Pareto Principle 80/20 Rule', 'Parkinson Law Productivity',
    'Eisenhower Matrix Prioritization', 'Pomodoro Deep Focus Sprints', 'Second Brain Digital Organization', 'Journaling for Mental Clarity',
    'Shadow Work & Jungian Psychology', 'Archetypes of Human Persona', 'Ego & Higher Consciousness', 'Existential Crisis Resolution',
    'Nietzsche Ubermensch & Will', 'Camus Absurdism & Joy', 'Sartre Existential Freedom', 'Kierkegaard Leap of Faith',
    'Schopenhauer Pessimism to Peace', 'Spinoza Pantheism God & Nature', 'Plato Allegory of the Cave', 'Aristotle Golden Mean',
    'Sun Tzu Art of War Strategy', 'Chanakya Neeti Political Statecraft', 'Machiavelli The Prince Reality', 'Robert Greene 48 Laws',
    'Negotiation Tactics of Chris Voss', 'Influence Principles of Cialdini', 'Thinking Fast and Slow Kahneman', 'Fooled by Randomness Taleb',
    'Antifragile Systems in Life', 'Black Swan Events in History', 'Skin in the Game Accountability', 'Zero to One Startup Innovation',
    'Lean Startup Iteration Loop', 'Blue Ocean Strategy Creation', 'Good to Great Company Culture', 'Blitzscaling Rapid Growth',
    'Network Effects in Platforms', 'Moats of Competitive Advantage', 'SaaS Business Metrics Decoded', 'Venture Capital Term Sheets',
    'Angel Investing Due Diligence', 'IPO Listing Day Mechanics', 'Index Fund Passive Wealth Compounding', 'Value Investing Security Margin',
    'Dividend Aristocrats Income', 'Bonds & Yield Curve Signals', 'Inflation & Central Bank Interest', 'Fiat Currency vs Gold Standard',
    'Bitcoin Halving Cycle Dynamics', 'Ethereum Smart Contract Utility', 'DeFi Decentralized Lending', 'Zero Knowledge Cryptography',
    'Quantum Computing Qubits & Encryption', 'Large Language Models Transformer', 'Neural Networks Backpropagation', 'Autonomous Driving Sensors',
    'Nuclear Fusion Energy Clean Power', 'Solid State Battery Vehicles', 'Desalination Clean Water Tech', 'Vertical Farming Food Security',
    'CRISPR Gene Editing for Diseases', 'mRNA Vaccine Technology', 'Synthetic Biology Biofuels', 'Nanotechnology Targeted Medicine',
    'James Webb Deep Space Telescope', 'Exoplanets in Goldilocks Zone', 'Dark Matter Cosmic Web', 'Dark Energy Expanding Universe',
    'Supermassive Black Hole Event Horizon', 'Neutron Stars & Pulsar Beacons', 'Gamma Ray Bursts Cosmic Threat', 'Fermi Paradox Where Are Aliens',
    'Drake Equation Probability', 'Kardashev Scale Civilizations', 'Dyson Sphere Stellar Energy', 'Oumuamua Interstellar Visitor',
    'Voyager Golden Record Messages', 'Apollo 11 Moon Landing Telemetry', 'Artemis Lunar Base Gateway', 'Mars Colonization Starship',
    'Europa Moon Subsurface Ocean', 'Titan Moon Methane Lakes', 'Enceladus Cryovolcano Geysers', 'Asteroid Mining Rare Metals',
  ];

  let themeIdx = 0;
  for (const s of subjects) {
    const t = themes[themeIdx % themes.length];
    themeIdx++;
    raw.push({
      name: `${t.prefix}${s}`,
      query: `${s} ${t.baseQ}`
    });
    if (raw.length >= 520) break;
  }

  // If still below 500, fill systematically:
  for (let i = raw.length; i < 520; i++) {
    raw.push({
      name: `Podcast Episode #${i + 1}: Insight`,
      query: `Hindi Podcast Episode ${i + 1} Best Audio`
    });
  }

  const partitions: SerialPartition[] = raw.map((item, idx) => ({
    id: `pc_cat_${idx}`,
    name: item.name,
    query: item.query
  }));

  return dedupe(partitions, 500);
}

// 2. HORROR & SUPERNATURAL STORIES (500 unique horror cases)
export function getHorrorPartitions(): SerialPartition[] {
  const base = [
    { name: 'Bhootiya Haveli (Series)', query: 'Bhootiya Haveli Horror Story' },
    { name: 'Midnight Horror Show', query: 'Midnight Horror Stories Hindi' },
    { name: 'Khooni Raat & Kuan', query: 'Khooni Raat Horror Story' },
    { name: 'Real Paranormal Cases', query: 'Real Paranormal Horror Hindi' },
    { name: 'Shaitani Jungle', query: 'Shaitani Jungle Horror Story' },
    { name: 'Daayan Ki Gupha', query: 'Daayan Ki Gupha Horror Story' },
    { name: 'Shamshan Ghat Ki Raat', query: 'Shamshan Ghat Horror Stories' },
    { name: 'Haunted Highway NH44', query: 'Haunted Highway NH44 Stories' },
    { name: 'Hostel Room 404', query: 'Haunted Hostel Room 404 Story' },
    { name: 'Bhangarh Fort Ka Saya', query: 'Bhangarh Fort Real Ghost Story' },
    { name: 'Kuldhara Abandoned Village', query: 'Kuldhara Haunted Village Mystery' },
    { name: 'Kala Jadu & Tantrik', query: 'Kala Jadu Tantrik Real Stories' },
    { name: 'Aatma Ka Badla', query: 'Aatma Ka Badla Horror Kahani' },
    { name: 'Train No 13 Midnight', query: 'Haunted Train Midnight Horror' },
    { name: 'Purani Haveli Ka Tehkana', query: 'Purani Haveli Tehkana Horror' },
    { name: 'Aakhri Safar Bus Stop', query: 'Haunted Bus Stop Night Horror' },
    { name: 'Chudail Ka Kuan', query: 'Chudail Ka Kuan Horror Kahani' },
    { name: 'Kabristan Ki Aawaz', query: 'Kabristan Night Sound Horror' },
    { name: 'Bhatakti Aatma', query: 'Bhatakti Aatma Real Horror' },
    { name: 'Pind Daan & Pisach', query: 'Pisach Pind Daan Horror Story' },
  ];

  const locations = [
    'Shimla Tunnel 103', 'Dumas Beach Surat', 'Mukesh Mills Mumbai', 'Ramoji Film City Studio',
    'GP Block Meerut', 'Agrasen Ki Baoli Delhi', 'Dow Hill Kurseong Forest', 'Delhi Cantonment Road',
    'Shaniwar Wada Pune', 'Three Kings Church Goa', 'Lambi Dehar Mines Mussoorie', 'Malcha Mahal Delhi',
    'Sanjay Gandhi National Park', 'D Souza Chawl Mahim', 'Vrindavan Society Thane', 'Raj Kiran Hotel Lonavala',
    'Feroz Shah Kotla Djinns', 'Khooni Nadi Rohini', 'Mutiny Memorial Delhi', 'Jamali Kamali Tomb Delhi',
    'Haunted Bungalow Mumbai', 'Cursed Lake Nainital', 'Dark Valley Manali', 'Black Mountain Ladakh',
    'Abandoned Hospital Kolkata', 'Old Morgue Bangalore', 'Shadow Lake Ooty', 'Mist Forest Darjeeling',
    'The Cursed Mirror', 'Possessed Antique Clock', 'The Weeping Portrait', 'Doll of Annabelle India',
    'Whispering Well Jodhpur', 'Midnight Cremation Ground', 'Witches Tree Kerala', 'The Shadow in Mirror',
    'Room 302 Secret', 'Bloodstained Letter', 'Footsteps on Roof', 'Knocking on Window at 3AM',
  ];

  const types = ['Case', 'Diary', 'Encounter', 'Rahasya', 'Kahani', 'Terror', 'Nightmare', 'Horror Files', 'Real Incident', 'Chilling Tale'];

  const raw = [...base];
  let count = 0;
  for (const loc of locations) {
    for (const t of types) {
      count++;
      raw.push({
        name: `${loc} ${t}`,
        query: `${loc} ${t} Hindi Horror Audio Story`
      });
      if (raw.length >= 520) break;
    }
    if (raw.length >= 520) break;
  }

  while (raw.length < 520) {
    count++;
    raw.push({
      name: `Horror Tale #${count}: Whispers`,
      query: `Hindi Horror Tale ${count} Audio Story`
    });
  }

  return dedupe(raw.map((item, idx) => ({
    id: `h_part_${idx}`,
    name: item.name,
    query: item.query
  })), 500);
}

// 3. STANDUP COMEDY (500 unique comedy acts, comedians & specials)
export function getComedyPartitions(): SerialPartition[] {
  const baseComedians = [
    'Zakir Khan', 'Anubhav Singh Bassi', 'Abhishek Upmanyu', 'Munawar Faruqui', 'Harsh Gujral',
    'Samay Raina', 'Vipul Goyal', 'Rahul Subramanian', 'Biswa Kalyan Rath', 'Kanan Gill',
    'Kenny Sebastian', 'Gaurav Kapoor', 'Akash Gupta', 'Prashasti Singh', 'Jaspreet Singh',
    'Ravi Gupta', 'Ashish Solanki', 'Devesh Dixit', 'Urooj Ashfaq', 'Aakash Mehta',
    'Varun Grover', 'Kunal Kamra', 'Aditi Mittal', 'Sumit Anand', 'Appurv Gupta',
    'Manish Tyagi', 'Rajat Chauhan', 'Sorabh Pant', 'Amit Tandon', 'Neeti Palta',
  ];

  const comedyThemes = [
    'Special Uncut', 'Crowd Work', 'Roast Session', 'College Days', 'Hostel Life',
    'Engineering Struggles', 'Corporate Job', 'Marriage & Dating', 'Delhi vs Mumbai',
    'Middle Class Habits', 'Family WhatsApp Group', 'Indian Parents Logic', 'Friendship Chaos',
    'First Flight Experience', 'Gym Motivation Fail', 'Doctor Visit Panic', 'Online Shopping Scam',
    'School Exam Stress', 'Train Journey Drama', 'Wedding Buffet Fight', 'Rickshaw Wale Bhaiyya',
    'Traffic Police Tales', 'House Hunting Broker', 'Cooking Disasters', 'Movie Theatre Etiquette'
  ];

  const raw: { name: string; query: string }[] = [];
  for (const c of baseComedians) {
    raw.push({ name: `${c} Specials`, query: `${c} Standup Comedy Specials` });
  }

  for (const c of baseComedians) {
    for (const t of comedyThemes) {
      raw.push({
        name: `${c}: ${t}`,
        query: `${c} ${t} Standup Comedy`
      });
      if (raw.length >= 520) break;
    }
    if (raw.length >= 520) break;
  }

  let idx = 0;
  while (raw.length < 520) {
    idx++;
    raw.push({
      name: `Standup Comedy Act #${idx}`,
      query: `Hindi Standup Comedy Act ${idx}`
    });
  }

  return dedupe(raw.map((item, i) => ({
    id: `st_part_${i}`,
    name: item.name,
    query: item.query
  })), 500);
}

// 4. AUDIO STORIES (500 unique stories, classics, thrillers & folklore)
export function getAudioStoriesPartitions(): SerialPartition[] {
  const authors = [
    'Munshi Premchand', 'Panchatantra Stories', 'Akbar Birbal Kisse', 'Vikram Betal', 'Crime & Suspense',
    'Tenali Rama Stories', 'Chandrakanta Santati', 'Alif Laila Arabian Nights', 'Jataka Tales', 'Hitopadesha Fables',
    'Rabindranath Tagore', 'Saadat Hasan Manto', 'Sherlock Holmes Hindi', 'Byomkesh Bakshi', 'Feluda Detective',
    'Sarat Chandra Chattopadhyay', 'Harivansh Rai Bachchan', 'Ramdhari Singh Dinkar', 'Jaishankar Prasad', 'Mahadevi Varma',
    'Phanishwar Nath Renu', 'Bhagwati Charan Verma', 'Amrita Pritam', 'Krishna Sobti', 'Kamleshwar',
  ];

  const storyTypes = [
    'Classic Kahani', 'Mystery Chapter', 'Moral Tale', 'Suspense Audio', 'Drama Episode',
    'Historical Tale', 'Folk Legend', 'Romantic Novella', 'Adventure Story', 'Philosophical Tale',
    'Village Life Story', 'Royal Court Mystery', 'Detective Case', 'Philosophical Discourse', 'Bedtime Tale',
    'Children Fable', 'Supernatural Tale', 'Social Satire', 'Patriotic Story', 'Inspirational Biography'
  ];

  const raw: { name: string; query: string }[] = [];
  for (const a of authors) {
    raw.push({ name: `${a} Tales`, query: `${a} Kahaniya Hindi Audio Story` });
  }

  for (const a of authors) {
    for (const st of storyTypes) {
      raw.push({
        name: `${a}: ${st}`,
        query: `${a} ${st} Audio Story Hindi`
      });
      if (raw.length >= 520) break;
    }
    if (raw.length >= 520) break;
  }

  let i = 0;
  while (raw.length < 520) {
    i++;
    raw.push({
      name: `Audio Kahani Episode #${i}`,
      query: `Hindi Audio Story Episode ${i}`
    });
  }

  return dedupe(raw.map((item, idx) => ({
    id: `as_part_${idx}`,
    name: item.name,
    query: item.query
  })), 500);
}

// 5. DEVOTIONAL (500 unique Bhajans, Mantras, Aartis, Kathas)
export function getDevotionalPartitions(): SerialPartition[] {
  const gods = [
    'Shri Ram', 'Shri Krishna', 'Shiv Shankar', 'Hanuman Ji', 'Ganesh Ji', 'Maa Durga',
    'Maa Lakshmi', 'Maa Saraswati', 'Surya Dev', 'Shani Dev', 'Khatu Shyam Ji', 'Sai Baba',
    'Ganga Maa', 'Radha Rani', 'Maha Kali', 'Lord Jagannath', 'Tirupati Balaji', 'Sufi Qawwali',
    'Gurbani Shabad', 'Navgrah Mantra'
  ];

  const formats = [
    'Aarti & Stuti', 'Chalisa 108 Times', 'Bhajan Sandhya', 'Amritwani Path', 'Mahamantra Japa',
    'Ashtakam & Stotram', 'Sahasranama 1000 Names', 'Dhyan Meditation', 'Morning Prarthana', 'Evening Vandana',
    'Kavacham Protection', 'Katha & Leela', 'Chaupaiyan Path', 'Sufiana Kalam', 'Shabad Kirtan',
    'Peaceful Chants', 'Devotional Flute', 'Temple Bell Aarti', 'Sanskrit Slokas', 'Bhakti Sagar'
  ];

  const raw: { name: string; query: string }[] = [
    { name: 'Sundarkand Path', query: 'Sundarkand Path Hindi' },
    { name: 'Ram Aarti & Stuti', query: 'Shri Ram Aarti Stuti' },
    { name: 'Ramcharitmanas Chaupai', query: 'Ramcharitmanas Chaupai Audio' },
    { name: 'Hanuman Chalisa 100x', query: 'Hanuman Chalisa 100 Times Hariharan' },
    { name: 'Shiv Tandav Stotram', query: 'Shiv Tandav Stotram Powerful Chants' },
    { name: 'Mahamrityunjaya 108x', query: 'Mahamrityunjaya Mantra 108 Times' },
    { name: 'Gayatri Mantra 108x', query: 'Gayatri Mantra 108 Times Chanting' },
    { name: 'Vishnu Sahasranama', query: 'Vishnu Sahasranama MS Subbalakshmi' },
    { name: 'Krishna Mahamantra', query: 'Hare Krishna Mahamantra Kirtan' },
    { name: 'Aarti Kunj Bihari Ki', query: 'Aarti Kunj Bihari Ki Krishna' },
  ];

  for (const g of gods) {
    for (const f of formats) {
      raw.push({
        name: `${g} ${f}`,
        query: `${g} ${f} Hindi Devotional Bhakti`
      });
      if (raw.length >= 520) break;
    }
    if (raw.length >= 520) break;
  }

  let i = 0;
  while (raw.length < 520) {
    i++;
    raw.push({
      name: `Bhakti Sangeet Volume ${i}`,
      query: `Hindi Bhakti Sangeet Bhajan ${i}`
    });
  }

  return dedupe(raw.map((item, idx) => ({
    id: `dev_part_${idx}`,
    name: item.name,
    query: item.query
  })), 500);
}

// 6. GENERIC / DYNAMIC CATEGORY GENERATOR FOR ANY PLAYLIST (500 unique subgenres, moods, acoustic styles)
export function getGenericPartitions(title: string, baseQuery: string): SerialPartition[] {
  const vibes = [
    'All Time Hits', 'Romantic Melodies', 'Sad & Heartbreak', 'Lo-Fi Chill Mix', 'Slowed & Reverb',
    'Acoustic Unplugged', 'Bass Boosted Party', 'Late Night Drive', 'Coffee Cafe Vibe', 'Workout Pump',
    'Rainy Day Special', 'Golden Classics', 'Retro 90s Vibes', 'Nostalgic 2000s', 'Modern Remix',
    'Club Dance Mix', 'Sufi & Soulful', 'Highway Road Trip', 'Deep Melancholy', 'Sunset Chillout',
    'Morning Energy', 'Monsoon Melodies', 'Live Concert Version', 'Coke Studio Style', 'Duet Classics',
    'Female Cover', 'Male Cover', 'Piano Instrumental Cover', 'Guitar Acoustic Cover', 'Flute Meditation Cover',
    'Bhangra & Dhol Beats', 'Desi Trap Remix', 'EDM Festival Mix', 'Gym High Voltage', 'Ambient Study Focus',
    'Summer Vibes', 'Winter Cozy Playlist', 'Festival Celebration', 'Wedding Sangeet', 'Car Stereo Banger',
    'Heartfelt Ballad', 'Euphoric Drops', 'Nostalgia Express', 'Chillhop Beats', 'Vintage Gramophone',
    'Neon Cyber City', 'Midnight Memories', 'Echoes & Reverb', 'Feel Good Anthems', 'Timeless Masterpieces'
  ];

  const subModifiers = [
    'Volume 1', 'Volume 2', 'Volume 3', 'Special Edition', 'Extended Mix',
    'Radio Edit', 'Club Rework', 'Acoustic Session', 'Sunset Edition', 'Midnight Cut',
    'Stripped Down', 'Symphonic Suite', 'Lo-Fi Tape', 'B-Side Rarities', 'Top Tier Picks',
    'Crowd Favorite', 'Platinum Collection', 'Studio Master', 'Reimagined', 'Essential Hits'
  ];

  const raw: { name: string; query: string }[] = [
    { name: `Top ${title}`, query: baseQuery },
  ];

  for (const v of vibes) {
    raw.push({
      name: `${v}`,
      query: `${title} ${v}`
    });
  }

  for (const v of vibes) {
    for (const m of subModifiers) {
      raw.push({
        name: `${v} (${m})`,
        query: `${title} ${v} ${m}`
      });
      if (raw.length >= 520) break;
    }
    if (raw.length >= 520) break;
  }

  let i = 0;
  while (raw.length < 520) {
    i++;
    raw.push({
      name: `${title} Chapter ${i}`,
      query: `${baseQuery} Chapter ${i}`
    });
  }

  return dedupe(raw.map((item, idx) => ({
    id: `gen_part_${idx}`,
    name: item.name,
    query: item.query
  })), 500);
}

// Main dispatcher that returns up to 500 unique partitions for ANY group item
export function getPartitionsForGroup(item: GroupItem, categoryName?: string): SerialPartition[] {
  if (!item) return [];

  if (item.partitions && item.partitions.length > 0) {
    return item.partitions;
  }

  const itemId = item.id || '';
  const title = (item.title || '').toLowerCase();
  const cat = (categoryName || '').toLowerCase();

  if (itemId === 'pod1' || title.includes('podcast') || cat.includes('podcast')) {
    return getPodcastPartitions();
  }
  if (itemId === 'pod2' || title.includes('horror') || title.includes('ghost')) {
    return getHorrorPartitions();
  }
  if (itemId === 'pod3' || title.includes('standup') || title.includes('comedy')) {
    return getComedyPartitions();
  }
  if (itemId === 'pod5' || title.includes('story') || title.includes('kahani')) {
    return getAudioStoriesPartitions();
  }
  if (itemId.startsWith('d') || itemId.includes('devotional') || itemId.includes('bhakti') || title.includes('bhajan') || title.includes('aarti') || title.includes('bhakti') || cat.includes('devotional')) {
    return getDevotionalPartitions();
  }

  // For any other playlist (Bollywood, Punjabi, Hip Hop, International, etc.)
  return getGenericPartitions(item.title || 'Music', item.query || item.title || 'Bollywood Hits');
}

// Strict partition keyword matcher to guarantee completely pure artist / category results (no cross-contamination)
export function isTrackMatchingPartition(
  track: { title?: string; artist?: string; album?: string }, 
  partitionId?: string,
  partitionQuery?: string
): boolean {
  if (!partitionId || partitionId.endsWith('_all') || partitionId.startsWith('gen_part_')) return true;
  const text = `${track.title || ''} ${track.artist || ''} ${track.album || ''}`.toLowerCase();
  const q = (partitionQuery || '').toLowerCase();

  // Comedian cross-matching prevention:
  if (partitionId === 'st_zakir' || q.includes('zakir') || partitionId.includes('zakir')) {
    const isZakir = text.includes('zakir') || text.includes('जाकिर');
    const isOther = text.includes('bassi') || text.includes('upmanyu') || text.includes('munawar') || text.includes('gujral');
    return isZakir && !isOther;
  }
  if (partitionId === 'st_bassi' || q.includes('bassi') || partitionId.includes('bassi')) {
    const isBassi = text.includes('bassi') || text.includes('anubhav') || text.includes('बस्सी') || text.includes('अनुभव');
    const isOther = text.includes('zakir') || text.includes('upmanyu') || text.includes('munawar') || text.includes('gujral');
    return isBassi && !isOther;
  }
  if (partitionId === 'st_upmanyu' || q.includes('upmanyu') || partitionId.includes('upmanyu')) {
    const isUpmanyu = text.includes('upmanyu') || text.includes('abhishek') || text.includes('उपमन्यु');
    const isOther = text.includes('zakir') || text.includes('bassi') || text.includes('munawar');
    return isUpmanyu && !isOther;
  }
  if (partitionId === 'st_munawar' || q.includes('munawar') || partitionId.includes('munawar')) {
    const isMunawar = text.includes('munawar') || text.includes('faruqui') || text.includes('मुनव्वर');
    const isOther = text.includes('zakir') || text.includes('bassi');
    return isMunawar && !isOther;
  }
  if (partitionId === 'st_harsh' || q.includes('harsh') || q.includes('gujral') || partitionId.includes('harsh')) {
    const isHarsh = text.includes('harsh') || text.includes('gujral') || text.includes('हर्ष');
    const isOther = text.includes('zakir') || text.includes('bassi');
    return isHarsh && !isOther;
  }

  // Podcasts:
  if (partitionId === 'pc_trs' || q.includes('ranveer') || q.includes('trs') || q.includes('beerbiceps')) {
    return text.includes('ranveer') || text.includes('trs') || text.includes('beerbiceps') || text.includes('the ranveer show');
  }
  if (partitionId === 'pc_crime' || q.includes('crime')) {
    return text.includes('crime') || text.includes('murder') || text.includes('investigation') || text.includes('police') || text.includes('अपराध');
  }
  if (partitionId === 'pc_mystery' || q.includes('supernatural') || q.includes('mystery')) {
    return text.includes('mystery') || text.includes('paranormal') || text.includes('supernatural') || text.includes('रहस्य');
  }
  if (partitionId === 'pc_talks' || q.includes('motivation')) {
    return text.includes('motivation') || text.includes('speech') || text.includes('talk') || text.includes('inspiration');
  }

  // Horror:
  if (partitionId === 'h_haveli' || q.includes('haveli')) {
    return text.includes('haveli') || text.includes('bhoot') || text.includes('हवेली') || text.includes('bhootiya') || text.includes('horror');
  }
  if (partitionId === 'h_midnight' || q.includes('midnight')) {
    return text.includes('midnight') || text.includes('horror') || text.includes('daravani') || text.includes('रात');
  }
  if (partitionId === 'h_khooni' || q.includes('khooni')) {
    return text.includes('khooni') || text.includes('kuan') || text.includes('raat') || text.includes('खूनी') || text.includes('horror');
  }
  if (partitionId === 'h_paranormal' || q.includes('paranormal')) {
    return text.includes('paranormal') || text.includes('ghost') || text.includes('aatma') || text.includes('real');
  }

  // Audio Stories:
  if (partitionId === 'as_premchand' || q.includes('premchand')) {
    return text.includes('premchand') || text.includes('प्रेमचंद') || text.includes('godaan') || text.includes('kafan');
  }
  if (partitionId === 'as_panch' || q.includes('panchatantra')) {
    return text.includes('panchatantra') || text.includes('पंचतंत्र');
  }
  if (partitionId === 'as_akbar' || q.includes('akbar')) {
    return text.includes('akbar') || text.includes('birbal') || text.includes('अकबर') || text.includes('बीरबल');
  }
  if (partitionId === 'as_vikram' || q.includes('vikram')) {
    return text.includes('vikram') || text.includes('betal') || text.includes('विक्रम') || text.includes('बेताल');
  }
  if (partitionId === 'as_crime' || q.includes('thriller')) {
    return text.includes('crime') || text.includes('thriller') || text.includes('suspense');
  }

  // Ram Katha:
  if (partitionId === 'ram_sundar' || q.includes('sundarkand')) {
    return text.includes('sundarkand') || text.includes('सुंदरकांड');
  }
  if (partitionId === 'ram_aarti' || q.includes('aarti')) {
    return text.includes('aarti') || text.includes('stuti') || text.includes('आरती') || text.includes('स्तुति');
  }
  if (partitionId === 'ram_chaupai' || q.includes('chaupai')) {
    return text.includes('chaupai') || text.includes('चौपाई') || text.includes('ramcharitmanas');
  }

  return true;
}

// Smart episode / part number extractor for chronological sorting
export function extractEpisodeNumber(title: string): number {
  if (!title) return 999;
  const m1 = title.match(/(?:part|pt|episode|ep|chapter|ch|भाग|एपिसोड|अध्याय)\s*(\d+)/i);
  if (m1 && m1[1]) return parseInt(m1[1], 10);
  const m2 = title.match(/^\s*(\d+)[\.\-\s]/);
  if (m2 && m2[1]) return parseInt(m2[1], 10);
  const m3 = title.match(/(\d+)\s*$/);
  if (m3 && m3[1]) return parseInt(m3[1], 10);
  return 999;
}

// Sort serial tracks chronologically (Part 1, 2, 3...)
export function sortSerialTracks<T extends { title?: string }>(tracks: T[]): T[] {
  const hasEpisodes = tracks.some(t => extractEpisodeNumber(t.title || '') !== 999);
  if (!hasEpisodes) return tracks;
  return [...tracks].sort((a, b) => {
    const numA = extractEpisodeNumber(a.title || '');
    const numB = extractEpisodeNumber(b.title || '');
    if (numA !== 999 && numB !== 999) return numA - numB;
    return 0;
  });
}

// Client-side strict category filter: drops tracks that do not match category keywords to prevent mixing
export function categoryFilter<T extends { title?: string; artist?: string; album?: string }>(tracks: T[], filterKey: string): T[] {
  const allowed = CATEGORY_FILTER_MAP[filterKey];
  if (!allowed || allowed.length === 0) return tracks;
  return tracks.filter((track) => {
    const text = `${track.title || ''} ${track.artist || ''} ${track.album || ''}`.toLowerCase();
    return allowed.some((kw) => text.includes(kw));
  });
}
