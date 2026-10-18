export interface SerialPartition {
  id: string;
  name: string;
  query: string;
}

export interface GroupItem {
  id: string;
  title: string;
  query: string;
  image: string;
  subtitle?: string;
  isSerial?: boolean;
  partitions?: SerialPartition[];
}

export interface CategoryGroup {
  category: string;
  filterKey: string; // Used for strict client-side content isolation
  searchQueries: string[]; // Rotation pool for sub-screen content loading
  items: GroupItem[];
}

export const BROWSE_CATEGORIES_DATA: CategoryGroup[] = [
  {
    category: 'Trending Now',
    filterKey: 'trending',
    searchQueries: [
      'Global Top 50 Hits', 'Viral Hindi Songs 2024', 'Trending Instagram Audio',
      'Top Bollywood Hits 2024', 'Viral Beats India', 'New Releases 2024',
      'Top Viral Songs India', 'Instagram Reels Hits',
    ],
    items: [
      { id: 't1', title: 'Global Top 50', subtitle: 'Worldwide Chartbusters', query: 'Global Top 50 Hits', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 't2', title: 'Viral Hits India', subtitle: 'Trending On Socials', query: 'Viral Hits India', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 't3', title: 'Top Bollywood', subtitle: 'Box Office Chart Toppers', query: 'Top Bollywood Hits', image: 'https://images.unsplash.com/photo-1593697972679-c4041d132a46?w=500' },
      { id: 't4', title: 'New Punjabi Hits', subtitle: 'Desi Swag & Urban Beats', query: 'New Punjabi Hits', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
      { id: 't5', title: 'Trending Reels', subtitle: 'Viral Short-Form Sounds', query: 'Trending Reels Audio', image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=500' },
    ]
  },
  {
    category: 'Standup Comedy',
    filterKey: 'comedy',
    searchQueries: [
      'Zakir Khan Standup Comedy', 'Anubhav Singh Bassi Standup', 'Abhishek Upmanyu Standup',
      'Munawar Faruqui Standup', 'Harsh Gujral Standup', 'Gaurav Kapoor Standup',
    ],
    items: [
      {
        id: 'pod3',
        title: 'Zakir Khan Specials',
        subtitle: 'Haq Se Single, Chacha Vidhayak & Kaksha Gyarvi',
        query: 'Zakir Khan Standup Comedy',
        image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=500',
        isSerial: true,
        partitions: [
          { id: 'st_zakir', name: 'Zakir Khan Specials', query: 'Zakir Khan Standup Comedy' },
          { id: 'st_bassi', name: 'Anubhav Singh Bassi', query: 'Anubhav Singh Bassi Standup' },
          { id: 'st_upmanyu', name: 'Abhishek Upmanyu', query: 'Abhishek Upmanyu Standup' },
          { id: 'st_munawar', name: 'Munawar Faruqui', query: 'Munawar Faruqui Standup' },
          { id: 'st_harsh', name: 'Harsh Gujral', query: 'Harsh Gujral Standup' },
        ]
      },
      {
        id: 'st_bassi_card',
        title: 'Anubhav Singh Bassi',
        subtitle: 'Hostel, Roommate, Cheating & Flatmates',
        query: 'Anubhav Singh Bassi Standup',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
        isSerial: true,
      },
      {
        id: 'st_upmanyu_card',
        title: 'Abhishek Upmanyu',
        subtitle: 'Friends, Crime, Delhi & Toxic Relations',
        query: 'Abhishek Upmanyu Standup',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
        isSerial: true,
      },
      {
        id: 'st_munawar_card',
        title: 'Munawar Faruqui',
        subtitle: 'Dongri to Nowhere & Standup Specials',
        query: 'Munawar Faruqui Standup',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
        isSerial: true,
      },
      {
        id: 'st_harsh_card',
        title: 'Harsh Gujral',
        subtitle: 'Kanpuria Swag, Crowd Work & Relatable Humor',
        query: 'Harsh Gujral Standup',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500',
        isSerial: true,
      },
      {
        id: 'st_gaurav_card',
        title: 'Gaurav Kapoor',
        subtitle: 'Vasiyat, Dilli 6 & Middle Class Truths',
        query: 'Gaurav Kapoor Standup Comedy',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500',
        isSerial: true,
      },
    ]
  },
  {
    category: 'Horror Stories & Thrillers',
    filterKey: 'horror',
    searchQueries: [
      'Bhootiya Haveli Horror Story', 'Midnight Horror Stories', 'Khooni Raat Horror Story',
      'Real Paranormal Horror Hindi', 'Aahat Horror Audio', 'Kabristan Ki Raat Horror',
    ],
    items: [
      {
        id: 'pod2',
        title: 'Bhootiya Haveli (Series)',
        subtitle: 'Haunted Mansion Chapters & Screams',
        query: 'Bhootiya Haveli Horror Story',
        image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500',
        isSerial: true,
        partitions: [
          { id: 'h_haveli', name: 'Bhootiya Haveli (Series)', query: 'Bhootiya Haveli Horror Story' },
          { id: 'h_midnight', name: 'Midnight Horror Show', query: 'Midnight Horror Stories' },
          { id: 'h_khooni', name: 'Khooni Raat & Kuan', query: 'Khooni Raat Horror Story' },
          { id: 'h_paranormal', name: 'Real Paranormal Cases', query: 'Real Paranormal Horror Hindi' },
        ]
      },
      {
        id: 'h_mid_card',
        title: 'Midnight Horror Show',
        subtitle: '12 AM Chilling Tales of Darkness',
        query: 'Midnight Horror Stories',
        image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500',
        isSerial: true,
      },
      {
        id: 'h_khooni_card',
        title: 'Khooni Raat & Kuan',
        subtitle: 'Ancient Cursed Well & Bloodstained Nights',
        query: 'Khooni Raat Horror Story',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
        isSerial: true,
      },
      {
        id: 'h_paranormal_card',
        title: 'Real Paranormal Cases',
        subtitle: 'True Witness Encounters & Ghost Investigations',
        query: 'Real Paranormal Horror Hindi',
        image: 'https://images.unsplash.com/photo-1516057747705-0609711c1b31?w=500',
        isSerial: true,
      },
      {
        id: 'h_kabristan_card',
        title: 'Kabristan Ki Raatein',
        subtitle: 'Graveyard Whispers & Solitary Souls',
        query: 'Kabristan Ki Raat Horror Story',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500',
        isSerial: true,
      },
    ]
  },
  {
    category: 'Podcasts & Talk Shows',
    filterKey: 'podcasts',
    searchQueries: [
      'The Ranveer Show TRS Hindi Podcast', 'Crime Investigation Stories Hindi Podcast',
      'Hindi Motivation Podcast Talks', 'Raj Shamani Figuring Out Podcast', 'Dostcast Vinamre Podcast',
    ],
    items: [
      {
        id: 'pod1',
        title: 'The Ranveer Show (TRS)',
        subtitle: 'Spiritual, Aliens, History & Unfiltered Guests',
        query: 'The Ranveer Show TRS Hindi Podcast',
        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500',
        isSerial: true,
        partitions: [
          { id: 'pc_trs', name: 'The Ranveer Show (TRS)', query: 'The Ranveer Show TRS Hindi Podcast' },
          { id: 'pc_crime', name: 'Crime Investigation', query: 'Crime Investigation Stories Hindi Podcast' },
          { id: 'pc_mystery', name: 'Supernatural Mysteries', query: 'Supernatural Mystery Hindi Audio Stories' },
          { id: 'pc_talks', name: 'Motivation Talks', query: 'Hindi Motivation Podcast Talks' },
        ]
      },
      {
        id: 'pc_figuring_card',
        title: 'Figuring Out (Raj Shamani)',
        subtitle: 'Unicorn Founders, Money & Success Blueprint',
        query: 'Raj Shamani Figuring Out Podcast',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500',
        isSerial: true,
      },
      {
        id: 'pc_crime_card',
        title: 'Crime Investigation Files',
        subtitle: 'Delhi Crime, Police Encounters & Murder Mysteries',
        query: 'Crime Investigation Stories Hindi Podcast',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
        isSerial: true,
      },
      {
        id: 'pc_motivation_card',
        title: 'Motivation & Mindset',
        subtitle: 'Discipline, High Performance & Inner Peace',
        query: 'Hindi Motivation Podcast Talks',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500',
        isSerial: true,
      },
      {
        id: 'pc_dostcast_card',
        title: 'Dostcast (Vinamre)',
        subtitle: 'Raw Conversations, Culture & Subversive Thoughts',
        query: 'Dostcast Vinamre Podcast',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
        isSerial: true,
      },
    ]
  },
  {
    category: 'Audio Stories & Kahaniyaan',
    filterKey: 'stories',
    searchQueries: [
      'Premchand Kahani Hindi', 'Panchatantra Hindi Story', 'Akbar Birbal Kahani Hindi',
      'Vikram Betal Kahani', 'Crime Thriller Audio Story',
    ],
    items: [
      {
        id: 'pod5',
        title: 'Munshi Premchand',
        subtitle: 'Godaan, Kafan, Idgah & Classic Hindi Sahitya',
        query: 'Premchand Kahani Hindi',
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500',
        isSerial: true,
        partitions: [
          { id: 'as_premchand', name: 'Munshi Premchand', query: 'Premchand Kahani Hindi' },
          { id: 'as_panch', name: 'Panchatantra Stories', query: 'Panchatantra Hindi Story' },
          { id: 'as_akbar', name: 'Akbar Birbal Kisse', query: 'Akbar Birbal Kahani Hindi' },
          { id: 'as_vikram', name: 'Vikram Betal', query: 'Vikram Betal Kahani' },
          { id: 'as_crime', name: 'Crime & Suspense', query: 'Crime Thriller Audio Story' },
        ]
      },
      {
        id: 'as_panch_card',
        title: 'Panchatantra Stories',
        subtitle: 'Ancient Morals, Animals & Timeless Fables',
        query: 'Panchatantra Hindi Story',
        image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500',
        isSerial: true,
      },
      {
        id: 'as_akbar_card',
        title: 'Akbar Birbal Kisse',
        subtitle: 'Witty Riddles & Royal Mughal Court Wisdom',
        query: 'Akbar Birbal Kahani Hindi',
        image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500',
        isSerial: true,
      },
      {
        id: 'as_vikram_card',
        title: 'Vikram Betal',
        subtitle: 'Raja Vikramaditya & Betal 25 Riddles',
        query: 'Vikram Betal Kahani',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500',
        isSerial: true,
      },
      {
        id: 'as_thriller_card',
        title: 'Suspense & Detective Tales',
        subtitle: 'Sherlock Hindi, Byomkesh & Dark Murders',
        query: 'Crime Thriller Audio Story',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500',
        isSerial: true,
      },
    ]
  },
  {
    category: 'Best of Bollywood',
    filterKey: 'bollywood',
    searchQueries: [
      'Arijit Singh', 'Atif Aslam', 'Shreya Ghoshal', 'Jubin Nautiyal',
      'Darshan Raval', 'Pritam', 'Sonu Nigam', 'Kumar Sanu', 'Neha Kakkar',
      'Badshah', 'Vishal Shekhar', 'AR Rahman Bollywood', 'Shankar Ehsaan Loy',
    ],
    items: [
      { id: 'ah1', title: 'Arijit Singh Hits', subtitle: 'Soulful Masterpieces', query: 'Arijit Singh', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'ah2', title: 'Atif Aslam Magic', subtitle: 'Romantic Nostalgia', query: 'Atif Aslam', image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=500' },
      { id: 'ah3', title: 'Shreya Ghoshal', subtitle: 'Melody Queen Classics', query: 'Shreya Ghoshal', image: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=500' },
      { id: 'ah4', title: 'Jubin Nautiyal', subtitle: 'Acoustic Heartwarmers', query: 'Jubin Nautiyal', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'ah5', title: 'Darshan Raval', subtitle: 'Indie Pop & Monsoon Beats', query: 'Darshan Raval', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' },
      { id: 'ah6', title: 'Pritam Classics', subtitle: 'Timeless Movie Soundtracks', query: 'Pritam', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500' },
      { id: 'ah7', title: 'Sonu Nigam', subtitle: 'Golden Era Melodies', query: 'Sonu Nigam', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500' },
      { id: 'ah8', title: 'Kumar Sanu', subtitle: 'Pure 90s Romance', query: 'Kumar Sanu', image: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=500' },
    ]
  },
  {
    category: 'Punjabi Blockbusters',
    filterKey: 'punjabi',
    searchQueries: [
      'Diljit Dosanjh', 'Sidhu Moose Wala', 'AP Dhillon', 'Karan Aujla',
      'Hardy Sandhu', 'B Praak', 'Amrit Maan', 'Shubh Punjabi', 'Gurnam Bhullar',
      'Jass Manak', 'Parmish Verma', 'Ninja Punjabi',
    ],
    items: [
      { id: 'p1', title: 'Diljit Dosanjh', subtitle: 'G.O.A.T. Anthems', query: 'Diljit Dosanjh', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500' },
      { id: 'p2', title: 'Sidhu Moose Wala', subtitle: 'Legendary Raw Anthems', query: 'Sidhu Moose Wala', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500' },
      { id: 'p3', title: 'AP Dhillon', subtitle: 'Brown Munde Vibes', query: 'AP Dhillon', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
      { id: 'p4', title: 'Karan Aujla', subtitle: 'Geetan Di Machine', query: 'Karan Aujla', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500' },
      { id: 'p5', title: 'Hardy Sandhu', subtitle: 'Dance & Heartfelt Beats', query: 'Hardy Sandhu', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'p6', title: 'B Praak', subtitle: 'Soul-Stirring Vocals', query: 'B Praak', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500' },
    ]
  },
  {
    category: 'Devotional & Spiritual',
    filterKey: 'devotional',
    searchQueries: [
      'Krishna Bhajan', 'Shiv Bhajan', 'Ram Bhajan Aarti',
      'Hanuman Chalisa', 'Gurbani Shabad', 'Aarti Kunj Bihari',
      'Bhakti Songs Hindi', 'Ganesh Aarti', 'Durga Mata Bhajan',
    ],
    items: [
      { id: 'd1', title: 'Krishna Bhajans', subtitle: 'Govind Bolo Hari Gopal Bolo', query: 'Krishna Bhajan', image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500' },
      { id: 'd2', title: 'Shiv Aradhana', subtitle: 'Har Har Mahadev Stutis', query: 'Shiv Bhajan', image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=500' },
      {
        id: 'd3',
        title: 'Ram Aarti & Katha',
        subtitle: 'Sundarkand & Shri Ram Charit Manas',
        query: 'Ram Bhajan Aarti',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
        isSerial: true,
        partitions: [
          { id: 'ram_sundar', name: 'Sundarkand Path', query: 'Sundarkand Path Hindi' },
          { id: 'ram_aarti', name: 'Ram Aarti & Stuti', query: 'Shri Ram Aarti' },
          { id: 'ram_chaupai', name: 'Ramcharitmanas Chaupai', query: 'Ramcharitmanas Chaupai' },
        ]
      },
      { id: 'd4', title: 'Hanuman Chalisa', subtitle: 'Sankat Mochan Mahabali', query: 'Hanuman Chalisa', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500' },
      { id: 'd5', title: 'Gurbani & Shabad', subtitle: 'Golden Temple Kirtan', query: 'Gurbani Shabad', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500' },
    ]
  },
  {
    category: 'Moods & Moments',
    filterKey: 'moods',
    searchQueries: [
      'Romantic Hindi Hits', 'Sad Hindi Songs', 'Lo-Fi Chill India',
      'Workout Motivation Music', 'Party Dance Mix', 'Late Night Drive Songs',
      'Happy Upbeat Hindi', 'Heartbreak Songs Hindi', 'Relaxing Hindi',
    ],
    items: [
      { id: 'm1', title: 'Romantic Hindi', subtitle: 'Love & Heartstrings', query: 'Romantic Hindi Hits', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500' },
      { id: 'm2', title: 'Sad Songs', subtitle: 'Heartbreak & Tears', query: 'Sad Hindi Songs', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500' },
      { id: 'm3', title: 'Lo-Fi Chill', subtitle: 'Midnight Reveries', query: 'Lo-Fi Chill India', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'm4', title: 'Workout Motivation', subtitle: 'High Voltage Energy', query: 'Workout Motivation', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' },
      { id: 'm5', title: 'Party Mix', subtitle: 'Club & Wedding Anthems', query: 'Party Dance Mix', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500' },
      { id: 'm6', title: 'Late Night Drives', subtitle: 'Cruising Ambient Melodies', query: 'Late Night Drive', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=500' },
    ]
  },
  {
    category: 'Desi Hip Hop',
    filterKey: 'hiphop',
    searchQueries: [
      'Krsna Rap', 'Divine Rap', 'Emiway Bantai', 'Raftaar Rap', 'MC Stan',
      'King Hip Hop', 'Seedhe Maut', 'Gully Gang', 'Desi Hip Hop',
      'Badshah Rap', 'Yo Yo Honey Singh', 'Bohemia', 'Ikka Rapper',
    ],
    items: [
      { id: 'dh1', title: 'Krsna', subtitle: 'Lyrical Genius & Bars', query: 'Krsna Rap', image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=500' },
      { id: 'dh2', title: 'Divine', subtitle: 'Voice of Gully Gang', query: 'Divine Rap', image: 'https://images.unsplash.com/photo-1516057747705-0609711c1b31?w=500' },
      { id: 'dh3', title: 'Emiway Bantai', subtitle: 'Independent Hardcore Rap', query: 'Emiway Bantai', image: 'https://images.unsplash.com/photo-1508973379184-7517410fb0bc?w=500' },
      { id: 'dh4', title: 'Raftaar', subtitle: 'Speed & Kalamkaar Power', query: 'Raftaar Rap', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'dh5', title: 'MC Stan', subtitle: 'P-Town Signature Sound', query: 'MC Stan', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'dh6', title: 'King Hip Hop', subtitle: 'Melodic Rap & Pop Fusion', query: 'King Hip Hop', image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=500' },
    ]
  },
  {
    category: 'International Pop',
    filterKey: 'international',
    searchQueries: [
      'Global Pop Hits', 'Ed Sheeran', 'Justin Bieber', 'Taylor Swift',
      'The Weeknd', 'Billie Eilish', 'Dua Lipa', 'Harry Styles',
      'BTS English', 'Ariana Grande', 'Bruno Mars', 'Post Malone',
    ],
    items: [
      { id: 'i1', title: 'Global Pop', subtitle: 'World Billboard Toppers', query: 'Global Pop Hits', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'i2', title: 'Ed Sheeran', subtitle: 'Acoustic Pop Stories', query: 'Ed Sheeran', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'i3', title: 'Justin Bieber', subtitle: 'Global Pop Superstar', query: 'Justin Bieber', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
      { id: 'i4', title: 'Taylor Swift', subtitle: 'Eras & Poetic Anthems', query: 'Taylor Swift', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500' },
      { id: 'i5', title: 'The Weeknd', subtitle: 'Starboy Synthwave', query: 'The Weeknd', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'i6', title: 'Billie Eilish', subtitle: 'Atmospheric Dark Pop', query: 'Billie Eilish', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500' },
    ]
  },
  {
    category: 'Haryanvi Superhits',
    filterKey: 'haryanvi',
    searchQueries: [
      'Sapna Choudhary', 'Renuka Panwar Haryanvi', 'Gulzaar Chhaniwala',
      'Diler Kharkiya', 'Masoom Sharma', 'Raju Punjabi Haryanvi',
      'Haryanvi Hits', 'Vijay Varma Haryanvi', 'Haryanvi Dance Songs',
    ],
    items: [
      { id: 'hy1', title: 'Sapna Choudhary', subtitle: 'Stage Sensation Anthems', query: 'Sapna Choudhary', image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=500' },
      { id: 'hy2', title: 'Renuka Panwar', subtitle: '52 Gaj Ka Daman Queen', query: 'Renuka Panwar Haryanvi', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'hy3', title: 'Gulzaar Chhaniwala', subtitle: 'Desi Desi Swag Beats', query: 'Gulzaar Chhaniwala', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'hy4', title: 'Diler Kharkiya', subtitle: 'Folk Melody Master', query: 'Diler Kharkiya', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'hy5', title: 'Haryanvi Dance', subtitle: 'DJ Floor Crushers', query: 'Haryanvi Dance Songs', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500' },
    ]
  },
  {
    category: 'Bhojpuri Dhamaka',
    filterKey: 'bhojpuri',
    searchQueries: [
      'Pawan Singh Bhojpuri', 'Khesari Lal Yadav', 'Dinesh Lal Yadav',
      'Neelkamal Singh', 'Arvind Akela Kallu', 'Bhojpuri Hits',
      'Bhojpuri Dance', 'Bhojpuri Holi', 'Bhojpuri Party',
    ],
    items: [
      { id: 'bj1', title: 'Pawan Singh', subtitle: 'Power Star Anthems', query: 'Pawan Singh Bhojpuri', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'bj2', title: 'Khesari Lal', subtitle: 'Hit Machine Chartbusters', query: 'Khesari Lal Yadav', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500' },
      { id: 'bj3', title: 'Bhojpuri Hits', subtitle: 'Desi Party Beats', query: 'Bhojpuri Hits', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'bj4', title: 'Dinesh Lal (Nirahua)', subtitle: 'Jubilee Star Classics', query: 'Dinesh Lal Yadav Nirahua', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
    ]
  },
  {
    category: 'Sufi & Qawwali',
    filterKey: 'sufi',
    searchQueries: [
      'Sufi Qawwali', 'Arijit Singh Sufi', 'Nusrat Fateh Ali Khan',
      'Rahat Fateh Ali Khan', 'Kailash Kher', 'Allah Ke Bande',
      'Sufi Hits Hindi', 'A R Rahman Sufi', 'Mast Qalandar',
    ],
    items: [
      { id: 's1', title: 'Sufi Hits', subtitle: 'Devine Ecstasy & Passion', query: 'Sufi Qawwali', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
      { id: 's2', title: 'Nusrat Fateh Ali', subtitle: 'Shahenshah-e-Qawwali', query: 'Nusrat Fateh Ali Khan', image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500' },
      { id: 's3', title: 'Rahat Fateh Ali', subtitle: 'Soulful Bollywood Sufi', query: 'Rahat Fateh Ali Khan', image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=500' },
      { id: 's4', title: 'Kailash Kher', subtitle: 'Raw Earthy Mysticism', query: 'Kailash Kher', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
    ]
  },
  {
    category: 'South Indian Beats',
    filterKey: 'south',
    searchQueries: [
      'Tamil Hits 2024', 'Telugu Hits 2024', 'AR Rahman Tamil',
      'Anirudh Ravichander', 'Allu Arjun Songs', 'Pushpa Songs',
      'Kannada Hits', 'Malayalam Songs', 'Rajinikanth Songs',
    ],
    items: [
      { id: 'si1', title: 'Tamil Hits', subtitle: 'Kollywood Musical Waves', query: 'Tamil Hits 2024', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'si2', title: 'Telugu Hits', subtitle: 'Tollywood High Beats', query: 'Telugu Hits 2024', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'si3', title: 'Anirudh Beats', subtitle: 'Rockstar Soundtracks', query: 'Anirudh Ravichander', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'si4', title: 'AR Rahman South', subtitle: 'Mozart of Madras', query: 'AR Rahman Tamil', image: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=500' },
      { id: 'si5', title: 'Pushpa Hits', subtitle: 'Allu Arjun Mass Anthems', query: 'Pushpa Songs Telugu', image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=500' },
    ]
  },
  {
    category: 'Nostalgic Decades',
    filterKey: 'decades',
    searchQueries: [
      '90s Bollywood Hits', '2000s Bollywood Hits', '80s Hindi Classics',
      'Lata Mangeshkar', 'Kishore Kumar', 'Mohammed Rafi',
      'Mukesh Singer', '70s Hindi Songs', 'Asha Bhosle',
    ],
    items: [
      { id: 'dec1', title: '90s Bollywood', subtitle: 'Cassette Era Golden Anthems', query: '90s Bollywood Hits', image: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=500' },
      { id: 'dec2', title: '2000s Hits', subtitle: 'Y2K Millennial Romances', query: '2000s Bollywood Hits', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' },
      { id: 'dec3', title: '80s Classics', subtitle: 'Retro Disco & Strings', query: '80s Hindi Classics', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500' },
      { id: 'dec4', title: 'Lata Mangeshkar', subtitle: 'Nightingale of India', query: 'Lata Mangeshkar', image: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=500' },
      { id: 'dec5', title: 'Kishore Kumar', subtitle: 'Evergreen Voice of Joy', query: 'Kishore Kumar', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
    ]
  },
  {
    category: 'Focus & Instrumental',
    filterKey: 'instrumental',
    searchQueries: [
      'Study Focus Music', 'Piano Chill', 'Indian Flute Instrumental',
      'Acoustic Guitar Cover', 'Meditation Music', 'Sleep Music Relaxing',
      'Sitar Classical Indian', 'Ambient Focus', 'Background Music Study',
    ],
    items: [
      { id: 'inst1', title: 'Study Music', subtitle: 'Deep Alpha Waves', query: 'Study Focus Music', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' },
      { id: 'inst2', title: 'Piano Chill', subtitle: 'Gentle Ivory Harmonies', query: 'Piano Chill', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500' },
      { id: 'inst3', title: 'Indian Flute', subtitle: 'Bansuri Melodic Serenity', query: 'Indian Flute Instrumental', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
      { id: 'inst4', title: 'Acoustic Guitar', subtitle: 'Fingerstyle Warm Covers', query: 'Acoustic Guitar Cover', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'inst5', title: 'Meditation & Sleep', subtitle: 'Serene Healing Tones', query: 'Meditation Music', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' },
    ]
  },
  {
    category: 'Rajasthani & Folk',
    filterKey: 'folk',
    searchQueries: [
      'Rajasthani Folk Songs', 'Mame Khan', 'Kesariya Balam',
      'Folk Fusion India', 'Rajasthani Hits', 'Marwadi Songs',
      'Padharo Mhare Desh', 'Rajasthani Dance', 'Coke Studio India Folk',
    ],
    items: [
      { id: 'rj1', title: 'Rajasthani Folk', subtitle: 'Desert Sands & Cultural Pride', query: 'Rajasthani Folk Songs', image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500' },
      { id: 'rj2', title: 'Mame Khan', subtitle: 'Coke Studio Folk Legend', query: 'Mame Khan', image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=500' },
      { id: 'rj3', title: 'Folk Fusion', subtitle: 'Modern Beats with Earthy Roots', query: 'Folk Fusion India', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'rj4', title: 'Marwadi Hits', subtitle: 'Traditional Melodies', query: 'Marwadi Songs', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
    ]
  },
  {
    category: 'Classical Ragas',
    filterKey: 'classical',
    searchQueries: [
      'Indian Classical Music', 'Ravi Shankar Sitar', 'Pandit Bhimsen Joshi',
      'MS Subbalakshmi', 'Hindustani Classical', 'Carnatic Music',
      'Tabla Solo', 'Raga Bhairav', 'Classical Raag Hindi',
    ],
    items: [
      { id: 'cl1', title: 'Hindustani Ragas', subtitle: 'Vocal Traditions of North India', query: 'Hindustani Classical', image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500' },
      { id: 'cl2', title: 'Ravi Shankar', subtitle: 'Global Sitar Maestro', query: 'Ravi Shankar Sitar', image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=500' },
      { id: 'cl3', title: 'Carnatic Music', subtitle: 'Southern Heritage & Kriti', query: 'Carnatic Music', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'cl4', title: 'Tabla Maestro', subtitle: 'Zakir Hussain & Rhythmic Art', query: 'Tabla Solo', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
    ]
  },
  {
    category: 'K-Pop & J-Pop',
    filterKey: 'kpop',
    searchQueries: [
      'BTS Korean', 'BLACKPINK', 'Stray Kids', 'Twice K-Pop',
      'Exo K-Pop', 'NewJeans', 'IVE K-Pop', 'Aespa',
      'J-Pop Hits', 'Anime OST', 'Kenshi Yonezu',
    ],
    items: [
      { id: 'kp1', title: 'BTS Universe', subtitle: 'Bangtan Global Army Anthems', query: 'BTS Korean', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'kp2', title: 'BLACKPINK', subtitle: 'In Your Area Girl Power', query: 'BLACKPINK', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'kp3', title: 'Stray Kids', subtitle: 'High-Impact Soundscape', query: 'Stray Kids', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
      { id: 'kp4', title: 'J-Pop & Anime OST', subtitle: 'Tokyo Beats & Iconic Openings', query: 'J-Pop Hits', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500' },
    ]
  },
  {
    category: 'Workout & Gym',
    filterKey: 'workout',
    searchQueries: [
      'Workout Music 2024', 'Gym Motivation Songs', 'Bass Boosted Workout',
      'Running Music', 'EDM Workout', 'Hip Hop Gym',
      'High Energy Workout', 'Power Music Gym', 'Cardio Music',
    ],
    items: [
      { id: 'wo1', title: 'Gym Motivation', subtitle: 'Beast Mode High Voltage', query: 'Gym Motivation Songs', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' },
      { id: 'wo2', title: 'Bass Boosted', subtitle: 'Heavy Drops & Heavy Lifts', query: 'Bass Boosted Workout', image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=500' },
      { id: 'wo3', title: 'Running Beats', subtitle: 'Steady 160 BPM Cadence', query: 'Running Music', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500' },
      { id: 'wo4', title: 'EDM Workout', subtitle: 'Electric Energy Rush', query: 'EDM Workout', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
    ]
  },
  {
    category: 'Coke Studio Specials',
    filterKey: 'cokestudio',
    searchQueries: [
      'Coke Studio Pakistan', 'Coke Studio India', 'Coke Studio Season',
      'Coke Studio Bharat', 'Coke Studio Folk', 'Coke Studio Sufi',
      'Coke Studio Acoustic', 'MTV Unplugged India',
    ],
    items: [
      { id: 'cs1', title: 'Coke Studio Pakistan', subtitle: 'Pasoori & Iconic Jam Sessions', query: 'Coke Studio Pakistan', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
      { id: 'cs2', title: 'Coke Studio India', subtitle: 'Indie & Folk Masterpieces', query: 'Coke Studio India', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
      { id: 'cs3', title: 'Coke Studio Folk', subtitle: 'Authentic Regional Roots', query: 'Coke Studio Folk', image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=500' },
      { id: 'cs4', title: 'MTV Unplugged', subtitle: 'Stripped Back Acoustic Vocals', query: 'MTV Unplugged India', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500' },
    ]
  },
];

export const CATEGORY_FILTER_MAP: Record<string, string[]> = {
  trending: [],
  comedy: ['zakir', 'bassi', 'upmanyu', 'munawar', 'gujral', 'standup', 'comedy', 'hasya', 'gaurav kapoor', 'rahul dua'],
  horror: ['horror', 'bhoot', 'haveli', 'midnight', 'khooni', 'paranormal', 'aatma', 'daravani', 'chudail', 'darr', 'raat', 'ghost'],
  podcasts: ['podcast', 'ranveer', 'trs', 'beerbiceps', 'raj shamani', 'dostcast', 'crime', 'talk', 'interview', 'motivation'],
  stories: ['premchand', 'panchatantra', 'akbar', 'birbal', 'vikram', 'betal', 'kahani', 'story', 'kisse', 'thriller'],
  bollywood: ['arijit', 'atif', 'shreya', 'jubin', 'neha', 'badshah', 'darshan', 'pritam', 'sonu nigam', 'kumar sanu', 'vishal', 'asha', 'lata', 'kishore', 'hindi', 'bollywood', 'film', 'filmi', 'udit', 'mukesh', 'mohit'],
  punjabi: ['punjabi', 'diljit', 'sidhu', 'moose wala', 'ap dhillon', 'karan aujla', 'hardy sandhu', 'b praak', 'amrit maan', 'shubh', 'gurnam', 'jass manak', 'parmish', 'ninja'],
  moods: ['romantic', 'sad', 'lofi', 'chill', 'workout', 'party', 'night', 'love', 'heartbreak', 'happy', 'relax'],
  hiphop: ['divine', 'emiway', 'raftaar', 'krsna', 'mc stan', 'king', 'seedhe maut', 'gully', 'hip hop', 'rap', 'badshah', 'honey singh', 'bohemia', 'ikka'],
  international: ['ed sheeran', 'justin bieber', 'taylor swift', 'weeknd', 'billie', 'dua lipa', 'harry styles', 'ariana', 'post malone', 'bruno mars', 'pop', 'english'],
  haryanvi: ['haryanvi', 'sapna', 'renuka', 'gulzaar', 'diler', 'masoom', 'raju punjabi', 'haryana'],
  bhojpuri: ['bhojpuri', 'pawan singh', 'khesari', 'dinesh lal', 'nirahua', 'neelkamal', 'arvind', 'kallu'],
  sufi: ['sufi', 'qawwali', 'nusrat', 'rahat', 'kailash kher', 'sufiana', 'mast qalandar'],
  south: ['tamil', 'telugu', 'kannada', 'malayalam', 'anirudh', 'ar rahman', 'allu arjun', 'rajini', 'pushpa', 'south'],
  devotional: ['bhajan', 'aarti', 'chalisa', 'gurbani', 'shabad', 'mantra', 'stuti', 'kirtan', 'ram', 'krishna', 'shiv', 'durga', 'ganesh', 'hanuman', 'devotional', 'sundarkand', 'chaupai'],
  decades: ['90s', '80s', '2000s', 'lata', 'kishore', 'rafi', 'mukesh', 'asha', 'udit', 'classic', 'purana', 'old'],
  instrumental: ['instrumental', 'piano', 'flute', 'guitar', 'sitar', 'tabla', 'meditation', 'acoustic', 'study', 'focus', 'ambient'],
  folk: ['rajasthani', 'folk', 'marwadi', 'mame khan', 'kesariya', 'padharo'],
  classical: ['classical', 'raga', 'raag', 'hindustani', 'carnatic', 'sitar', 'tabla', 'santoor', 'ravi shankar'],
  kpop: ['bts', 'blackpink', 'stray kids', 'twice', 'exo', 'newjeans', 'ive', 'aespa', 'k-pop', 'kpop', 'korean', 'jpop', 'j-pop', 'anime'],
  workout: ['workout', 'gym', 'fitness', 'running', 'cardio', 'bass boosted', 'edm', 'motivation', 'power'],
  cokestudio: ['coke studio', 'mtv unplugged', 'acoustic session', 'live session'],
};
