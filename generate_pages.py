import os
import shutil
import hashlib

# Known PDF background frames, header banners, and tiny icon hashes to exclude from galleries
IGNORE_HASHES = {'86d43a59', '714bf7ca', '0a5fa96b', '86b680cd', '6256b497'}

# Event configurations for 2023-24 (MAGSJAM)
events_2023_24 = [
    {
        "slug": "blood-donation-camp",
        "title": "Annual Blood Donation Camp (2023)",
        "category": "Health & Camps",
        "date": "October 16, 2023",
        "leads": "Kishore, Sriram, Navaneeth, Sanjana, Sabaresh",
        "tenure": "2023-24",
        "description": "YRC-EEC organized a blood donation camp at the campus of EEC on 16th October.\n\nThe event started from 10 am and continued till 3 pm in the evening. Kishore, Sriram, Navaneeth, Sanjana and Sabaresh were the event leads who took care and guided the whole event. Thanks to the donors, volunteers, and office bearers of the tenure for making it a vibrant and successful event.\n\nMany actively participated in the event. The photos were taken simultaneously, and at last, all gathered for celebrating the camp’s success by cheering up each other.",
        "image_source_pattern": "page_21_img_{}.jpeg",
        "image_count": 6
    },
    {
        "slug": "rrr",
        "title": "RRR - Rehab Return Rejoice 3.0",
        "category": "Environment & Sustainability",
        "date": "October 2023",
        "leads": "YRC Volunteer Squad",
        "tenure": "2023-24",
        "description": "The Youth Red Cross team at Easwari Engineering College (Autonomous) has accomplished the impactful initiative RRR - Rehab Return Rejoice 3.0.\n\nWe express profound gratitude for the esteemed presence of speakers who shared their valuable insights on recycling, rehab, and sustainability. The project aimed to raise awareness and ignite change for environmental recovery and waste minimization.",
        "image_source_pattern": "page_22_img_{}.jpeg",
        "image_count": 6
    },
    {
        "slug": "first-aid",
        "title": "The First Aid Event",
        "category": "Health & Camps",
        "date": "January 25, 2024",
        "leads": "YRC Executive Team",
        "tenure": "2023-24",
        "description": "Accidents do happen but first aid always comes in clutch.\n\nThe team Youth Red Cross of Easwari Engineering College (Autonomous) are highly elated to let you all know about the completion of 'THE FIRST AID EVENT' which was held on 25th January, 2024, on the account of 'FIRST AID DAY'. The event engaged volunteers in hands-on training for emergency response, bandaging, and basic life support.",
        "image_source_pattern": "page_23_img_{}.jpeg",
        "image_count": 6
    },
    {
        "slug": "bridge-project",
        "title": "The Bridge Project",
        "category": "Social Welfare",
        "date": "February 2024",
        "leads": "YRC volunteers & Lure of Life",
        "tenure": "2023-24",
        "description": "Education is the kindling of a flame, not the filling of a vessel. 📖\n\nWe, the Youth Red Cross Club of Easwari Engineering College (Autonomous) in collaboration with Lure of Life have initiated a 'Bridge camp' to extend our service to mankind by providing the most sacred tool - education. This initiative works towards bridging the educational gap for children, providing study materials, and teaching basic language and math concepts.",
        "image_source_pattern": "page_24_img_{}.jpeg",
        "image_count": 6
    },
    {
        "slug": "other-events",
        "title": "Special Events Portfolio (2023-24)",
        "category": "Social Welfare",
        "date": "Tenure 2023-24",
        "leads": "YRC Volunteer Squad",
        "tenure": "2023-24",
        "description": "A portfolio of various impactful community and social events conducted during the academic year 2023-24.\n\nThese include the Sanitary Napkin Distribution Event, Teacher's Day sapling presentations, Ganesh Chaturthi, Suicide Prevention webinar, Rose Day hospital visits, beach cleaning events, Badminton tournament coordination, APJ Abdul Kalam birthday, Mental Health Day, and World Food Day drives. These actions show the diverse commitment of our volunteers.",
        "image_source_pattern": "page_25_img_{}.jpeg",
        "image_count": 2
    },
    {
        "slug": "mission-crusader",
        "title": "Mission Crusader 2024",
        "category": "Flagship Event",
        "date": "March 2024",
        "leads": "YRC Cabinet & Volunteers",
        "tenure": "2023-24",
        "description": "The flagship event of the Youth Red Cross Club of EEC(A) is Mission Crusader. The main motto of this event is 'PEDAL TO FIGHT CANCER.'\n\nEvery year, the team of the YRC club of EEC(A) starts working for the MC event 3 months prior. As a first step, we begin raising funds from various companies. This big event was successfully completed for the 8th consecutive year. Like last year, we aimed to get more funds and succeeded in securing a good amount. The togetherness of people from various age groups made this event a grand success. The cycle rally or cyclothon started from the college premises and went towards Sivan Park and back to the campus, a single stretch of about 10 km.\n\nThe way malignant lives are lived is completely miserable and indescribable. Just to make them feel good enough and get sufficient support, we run this event.\n\nThe college chairman donated 1 lakh. In addition to this remarkable contribution, 1.75 lakhs was raised through participant registrations, showcasing the potential for positive change when people unite for a common cause.",
        "images": [
            ("page_26_img_1.jpeg", "page_26_img_1.jpeg"),
            ("page_26_img_2.jpeg", "page_26_img_2.jpeg"),
            ("page_26_img_3.jpeg", "page_26_img_3.jpeg"),
            ("page_27_img_1.jpeg", "page_27_img_1.jpeg"),
            ("page_27_img_2.jpeg", "page_27_img_2.jpeg"),
            ("page_28_img_1.jpeg", "page_28_img_1.jpeg"),
            ("page_28_img_2.jpeg", "page_28_img_2.jpeg"),
            ("page_28_img_3.jpeg", "page_28_img_3.jpeg"),
            ("page_28_img_4.jpeg", "page_28_img_4.jpeg"),
            ("page_28_img_5.jpeg", "page_28_img_5.jpeg"),
            ("page_28_img_6.jpeg", "page_28_img_6.jpeg")
        ],
        "image_count": 11
    }
]

# Event configurations for 2024-25 (YRC Magazine)
events_2024_25 = [
    {
        "slug": "glisten",
        "title": "Glisten Installation Program",
        "category": "Installation / Ceremony",
        "date": "August 3, 2024",
        "leads": "YRC President Sriram K.",
        "tenure": "2024-25",
        "description": "The Youth Red Cross (YRC) installation program titled 'Glisten' was conducted on August 3rd, 2024, at Easwari Engineering College.\n\nThe event commenced with Tamizhthai Vazhthu and lamp lighting, followed by a welcome address from Mrs. C. Manjula and a pledge by YRC President Mr. Sriram K., who also presented the annual report. Principal Dr. P. Deiva Sundari delivered the presidential address, highlighting the values of leadership and service, and unveiled the YRC magazine 'MAGSJAM.'\n\nChief Guest Dr. Aravind S. appreciated YRC’s initiatives and spoke on its collaboration with the Cancer Institute. Badges were distributed to new office bearers, and the event concluded with a vote of thanks by Vice President Mr. Nishok Balajee and the National Anthem, reflecting the spirit of unity and service.",
        "image_source_pattern": "page_20_img_{}.jpeg",
        "image_count": 3
    },
    {
        "slug": "sapling-drive",
        "title": "Teacher's Day Sapling Drive",
        "category": "Environment & Sustainability",
        "date": "August 29, 2024",
        "leads": "Programme Officer & Office Bearers",
        "tenure": "2024-25",
        "description": "Teachers plant the seeds of knowledge that bloom forever.\n\nIn celebration of Teacher’s Day, the Youth Red Cross (YRC) of Easwari Engineering College organized a thoughtful green initiative on August 29th, 2024, within the college premises. As a tribute to the nurturing spirit of educators, a total of 291 saplings were distributed to the faculty members, symbolizing growth, care, and the lasting influence of teachers on young minds. The event highlighted the deep appreciation YRC holds for the teaching community, aligning environmental consciousness with heartfelt gratitude.\n\nA special moment was marked when YRC Programme Officer Mrs. C. Manjula, along with 41 dedicated office bearers, presented a sapling to the Principal as a token of respect and admiration for her constant support. This meaningful celebration not only honored the role of teachers but also reinforced the YRC’s commitment to sustainability and community values.",
        "image_source_pattern": "page_21_img_{}.jpeg",
        "image_count": 3
    },
    {
        "slug": "suicide-prevention",
        "title": "Mental Health & Suicide Prevention Webinar",
        "category": "Awareness & Mental Health",
        "date": "September 16, 2024",
        "leads": "Event Convener Mrs. C. Manjula",
        "tenure": "2024-25",
        "description": "One conversation can save a thousand silent screams.\n\nOn September 16th, 2024, the Youth Red Cross (YRC) of Easwari Engineering College organized an impactful online webinar on Suicide Prevention, aiming to foster awareness, empathy, and proactive mental health support. With over 160 participants, the session featured two expert speakers from NIMHANS—Dr. Anish V Cheriyan, Associate Professor, and Ms. J. Saranya, Psychiatric Social Worker and Junior Research Fellow.\n\nDr. Cheriyan delivered a powerful talk on recognizing the verbal, emotional, and behavioral signs of suicidal thoughts, stressing timely intervention, empathetic communication, and solution-focused coping strategies. Ms. Saranya followed with insights into the available support systems, the role of community and professionals, and the urgency of destigmatizing mental health struggles. The webinar was interactive and deeply engaging, with participants actively involved during the Q&A session. Under the guidance of Event Convener Mrs. C. Manjula, the event concluded with a vote of thanks, reinforcing the YRC’s commitment to continuing mental health initiatives.",
        "image_source_pattern": "page_22_img_{}.jpeg",
        "image_count": 2
    },
    {
        "slug": "coastal-cleanup",
        "title": "Trash the Trash Coastal Cleanup",
        "category": "Environment & Sustainability",
        "date": "September 21, 2024",
        "leads": "YRC Volunteer Squad",
        "tenure": "2024-25",
        "description": "Trash the Trash, Not the Beach! One coastline. One cause. One cleaner tomorrow.\n\nOn September 21, 2024, the Youth Red Cross (YRC) of Easwari Engineering College proudly took part in The Planet’s Largest Coastal Cleanup, covering the coastline stretch from Kasimedu to Kovalam. Guided by Mrs. C. Manjula, the event brought together enthusiastic student volunteers to tackle marine pollution and promote environmental responsibility.\n\nEquipped with gloves, masks, and trash bags provided by Communitree, the team safely and efficiently collected over 70 bags of waste—including plastic wrappers, bottles, and paper waste. The cleanup not only helped beautify the beach but also sparked conversations on sustainability and collective action. This impactful initiative reflected the YRC’s ongoing commitment to social and environmental causes, reminding us all that a cleaner planet begins with conscious individuals and united communities.",
        "image_source_pattern": "page_23_img_{}.jpeg",
        "image_count": 3
    },
    {
        "slug": "rose-day",
        "title": "Rose Day Children's Hospital Visit",
        "category": "Social Welfare",
        "date": "September 22, 2024",
        "leads": "Event Convener Mrs. C. Manjula",
        "tenure": "2024-25",
        "description": "Roses don’t just bloom in gardens—they bloom in hearts touched by kindness.\n\nThe Youth Red Cross (YRC) of Easwari Engineering College organized a compassionate visit titled 'Rose Day' on September 22, 2024, at the Institute of Child Health and Hospital for Children (ICH), Egmore. Led by the event convener Mrs. C. Manjula, the initiative aimed to spread joy and emotional comfort to children undergoing treatment.\n\nYRC volunteers spent quality time interacting with the children through play, conversation, and creative activities. Crayons and coloring sheets were distributed, and volunteers actively joined the children in coloring, creating a lively and cheerful atmosphere. A child’s birthday celebration added a special touch to the day, filling the hospital ward with laughter and happiness. This heartwarming event not only brought smiles to the children but also created a deep sense of fulfillment and connection for the volunteers, reinforcing YRC’s mission of service and empathy.",
        "image_source_pattern": "page_24_img_{}.jpeg",
        "image_count": 5
    },
    {
        "slug": "food-drive",
        "title": "World Food Day Food Drive",
        "category": "Social Welfare",
        "date": "October 20, 2024",
        "leads": "Kishore, Mirjana, Gokul, Malavika",
        "tenure": "2024-25",
        "description": "Feeding the hungry is not charity, it's humanity in action.\n\nOn October 20, 2024, the Youth Red Cross (YRC) of Easwari Engineering College commemorated World Food Day with a powerful act of service—distributing over 85 freshly prepared meals to the homeless and underprivileged across key areas of Chennai, including Guindy, Saidapet, Porur, and St. Thomas Mount.\n\nFrom 11:00 AM to 2:00 PM, under the dedicated leadership of Event Convener Mrs. C. Manjula and event leads Kishore, Mirjana, Gokul, and Malavika, the YRC volunteers set out with warmth in their hearts and food in their hands. More than just offering meals, the team offered presence, compassion, and human connection—reminding recipients they were not forgotten. Each parcel was handed over with dignity and care, often accompanied by kind words and smiles that bridged the gap between strangers. This initiative not only fed the hungry but deeply moved the volunteers themselves, reinforcing the true essence of humanitarianism.",
        "image_source_pattern": "page_25_img_{}.jpeg",
        "image_count": 3
    },
    {
        "slug": "blood-donation-camp",
        "title": "Annual Blood Donation Camp (2024)",
        "category": "Health & Camps",
        "date": "October 24, 2024",
        "leads": "Abinaya K., Rohith S., Sudan M.",
        "tenure": "2024-25",
        "description": "A single drop of blood can create a ripple of hope.\n\nOn October 24, 2024, the Youth Red Cross (YRC) of Easwari Engineering College, in collaboration with the Department of Computer Science and Engineering’s symposium 'Kratos,' hosted its impactful annual Blood Donation Camp at the college campus (Civil Block Drawing Hall).\n\nUnder the guidance of Event Convener Mrs. C. Manjula and coordinated by student leads Abinaya K., Rohith S., and Sudan M., the camp ran from 9:00 AM to 3:45 PM, in partnership with Government Royapettah Hospital and Government Kalaignar Centenary Super Speciality Hospital.\n\nThe event saw overwhelming support, with 312 selfless donors—students and faculty alike—coming forward to contribute to this life-saving cause. Each participant underwent thorough health screenings, including haemoglobin and blood pressure checks, before donating blood under the care of qualified medical professionals. Donors were honored with refreshments and certificates as tokens of gratitude.",
        "image_source_pattern": "page_26_img_{}.jpeg",
        "image_count": 3
    },
    {
        "slug": "mathappu",
        "title": "Mathappu Diwali Outreach",
        "category": "Social Welfare",
        "date": "October 26, 2024",
        "leads": "Mirunalini C., Dhivya Manghai G., Harrison Raj A.",
        "tenure": "2024-25",
        "description": "Celebrate Diwali not with crackers, but with care and compassion.\n\nOn October 26, 2024, the Youth Red Cross (YRC) of Easwari Engineering College celebrated Diwali through a heartfelt outreach event titled 'Mathappu' at Kalaiselvi Karunalaya Social Welfare Society, Mogappair.\n\nFrom 5:00 PM to 8:00 PM, under the guidance of Event Convener Mrs. C. Manjula and led by student coordinators Mirunalini C., Dhivya Manghai G., and Harrison Raj A., the YRC team spent quality time with the children—spreading festive cheer, engaging in meaningful interactions, and delivering Diwali wishes. As part of the initiative, the team donated essential groceries such as rice, dals, oil, sugar, spices, and vermicelli to support the daily needs of the orphanage. Extending their goodwill, the team also visited a nearby old age home, where they shared joyful moments through songs, dances, and storytelling, followed by the distribution of fresh fruits.",
        "image_source_pattern": "page_27_img_{}.jpeg",
        "image_count": 3
    },
    {
        "slug": "mission-crusader",
        "title": "Mission Crusader 2025",
        "category": "Flagship Event",
        "date": "January 2025",
        "leads": "YRC Cabinet & Volunteers",
        "tenure": "2024-25",
        "description": "Mission Crusader 2025 was conducted to support cancer patients under the theme 'Pedal to Fight Cancer'.\n\nReflecting on Mission Crusader 2025, we are reminded of the power of community-driven initiatives and the importance of continuing our mission to support cancer patients. The funds raised, stories shared, and lives touched during this event underline the potential for positive change when people unite for a common cause. As we look forward to future Mission Crusaders, we remain committed to expanding our impact and ensuring that every pedal stroke brings us closer to a world where cancer is met with strength, resilience, and hope.\n\nThe college chairman donated 1 lakh. In addition to this remarkable contribution, 1.75 lakhs was raised through participant registrations, showcasing the overwhelming support from individuals and organizations committed to fighting cancer. The funds raised will be donated to the Cancer Institute at Adyar, providing much-needed support to patients and their families.",
        "images": [
            ("page_28_img_1.jpeg", "page_28_img_1.jpeg"),
            ("page_29_img_1.jpeg", "page_29_img_1.jpeg"),
            ("page_29_img_2.jpeg", "page_29_img_2.jpeg"),
            ("page_29_img_3.jpeg", "page_29_img_3.jpeg"),
            ("page_29_img_4.jpeg", "page_29_img_4.jpeg")
        ],
        "image_count": 5
    }
]

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | YRC Easwari Engineering College</title>
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {{
      theme: {{
        extend: {{
          fontFamily: {{
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            heading: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
          }},
          colors: {{
            red: {{
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
            }},
          }}
        }}
      }}
    }}
  </script>
  <link rel="stylesheet" href="../../styles.css">
  <style>
    .glass-card {{
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.8);
    }}
    .lightbox-overlay {{
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
    }}
  </style>
</head>
<body class="bg-slate-50/50 text-slate-900 font-sans selection:bg-red-500 selection:text-white antialiased min-h-screen flex flex-col">

  <!-- ==========================================
       HEADER & NAVIGATION
       ========================================== -->
  <header class="fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-nav">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <!-- Logo and Brand -->
      <a href="../../index.html" class="flex items-center gap-3.5 group">
        <div class="w-11 h-11 bg-white rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80 shadow-sm group-hover:scale-105 group-hover:border-red-500/30 transition-all duration-300">
          <img src="../../logo.png" alt="YRC Logo" class="w-full h-full object-cover">
        </div>
        <div class="leading-tight">
          <span class="text-[10px] font-black uppercase tracking-widest text-red-600 block">Youth Red Cross</span>
          <h1 class="text-sm font-extrabold text-slate-900 tracking-tight">Easwari Eng. College</h1>
        </div>
      </a>

      <!-- Navigation Links -->
      <nav class="flex items-center gap-6">
        <a href="../../events.html" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Back to Events
        </a>
      </nav>
    </div>
  </header>

  <!-- ==========================================
       HERO SECTION
       ========================================== -->
  <section class="pt-32 pb-12 bg-gradient-to-b from-red-50 via-slate-50 to-slate-50 border-b border-slate-100">
    <div class="max-w-5xl mx-auto px-6">
      <div class="reveal active">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-red-100/80 rounded-full border border-red-200 text-red-700 font-bold text-xs uppercase tracking-wider mb-6">
          {category}
        </div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
          {title}
        </h2>
        <div class="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-t border-slate-200/60 pt-6">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="font-medium text-slate-700">{date}</span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="font-medium text-slate-700">{tenure} Tenure</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==========================================
       CONTENT & GALLERY SECTION
       ========================================== -->
  <main class="flex-grow py-16">
    <div class="max-w-5xl mx-auto px-6">
      
      <!-- Event Details Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <!-- Left: Description -->
        <div class="lg:col-span-2">
          <h3 class="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Event Description</h3>
          <p class="text-slate-600 text-base leading-relaxed font-light">
            {description}
          </p>
        </div>
        
        <!-- Right: Info Panel -->
        <div class="lg:col-span-1">
          <div class="glass-card rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Event Highlights</h4>
            <div class="space-y-4">
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase block">Event Lead(s)</span>
                <span class="text-sm text-slate-800 font-medium">{leads}</span>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase block">Tenure Term</span>
                <span class="text-sm text-slate-800 font-medium">{tenure}</span>
              </div>
              <div>
                <span class="text-xs text-slate-400 font-bold uppercase block">Location</span>
                <span class="text-sm text-slate-800 font-medium font-light">Easwari Engineering College & Community Outreach Sites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gallery Grid -->
      <div>
        <h3 class="text-2xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-2">Event Gallery</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6" id="gallery-grid">
          {image_elements}
        </div>
      </div>

    </div>
  </main>

  <!-- ==========================================
       LIGHTBOX MODAL
       ========================================== -->
  <div id="lightbox" class="fixed inset-0 z-[100] hidden items-center justify-center p-4 lightbox-overlay">
    <button id="close-lightbox" class="absolute top-6 right-6 text-white hover:text-red-500 focus:outline-none transition-colors" aria-label="Close lightbox">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    
    <button id="prev-btn" class="absolute left-6 text-white hover:text-red-500 focus:outline-none transition-colors" aria-label="Previous image">
      <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>
    
    <div class="max-w-5xl max-h-[88vh] flex flex-col items-center">
      <img id="lightbox-img" src="" alt="" class="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl">
      <span id="lightbox-counter" class="text-white text-xs font-semibold uppercase tracking-wider mt-3"></span>
    </div>
    
    <button id="next-btn" class="absolute right-6 text-white hover:text-red-500 focus:outline-none transition-colors" aria-label="Next image">
      <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>

  <!-- ==========================================
       FOOTER
       ========================================== -->
  <footer class="bg-slate-900 text-white py-10 mt-20 border-t border-slate-800">
    <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white rounded-lg overflow-hidden flex items-center justify-center">
          <img src="../../logo.png" alt="YRC Logo" class="w-full h-full object-cover">
        </div>
        <div>
          <h4 class="text-xs font-black tracking-wide">YOUTH RED CROSS</h4>
          <span class="text-[9px] uppercase font-bold text-slate-500 block">Easwari Engineering College</span>
        </div>
      </div>
      <div class="text-xs text-slate-500 text-center md:text-right">
        &copy; 2026 Easwari Engineering College YRC. All rights reserved.
      </div>
    </div>
  </footer>

  <!-- Lightbox Script -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {{
      const galleryItems = document.querySelectorAll('.gallery-item');
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxCounter = document.getElementById('lightbox-counter');
      const closeBtn = document.getElementById('close-lightbox');
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
      
      let currentIndex = 0;
      const imagesList = Array.from(galleryItems).map(item => item.getAttribute('data-full-src'));
      
      const openLightbox = (index) => {{
        currentIndex = index;
        lightboxImg.src = imagesList[currentIndex];
        lightboxCounter.innerText = `${{currentIndex + 1}} of ${{imagesList.length}}`;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      }};
      
      const closeLightbox = () => {{
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        lightboxImg.src = '';
        document.body.classList.remove('overflow-hidden');
      }};
      
      const navigate = (direction) => {{
        currentIndex = (currentIndex + direction + imagesList.length) % imagesList.length;
        lightboxImg.src = imagesList[currentIndex];
        lightboxCounter.innerText = `${{currentIndex + 1}} of ${{imagesList.length}}`;
      }};
      
      galleryItems.forEach((item, index) => {{
        item.addEventListener('click', (e) => {{
          e.preventDefault();
          openLightbox(index);
        }});
      }});
      
      closeBtn.addEventListener('click', closeLightbox);
      prevBtn.addEventListener('click', () => {{
        navigate(-1);
      }});
      nextBtn.addEventListener('click', () => {{
        navigate(1);
      }});
      
      // Close lightbox on click outside the image
      lightbox.addEventListener('click', (e) => {{
        if (e.target === lightbox) closeLightbox();
      }});
      
      // Keyboard Controls
      document.addEventListener('keydown', (e) => {{
        if (lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
      }});
    }});
  </script>
</body>
</html>
"""

def generate_pages_for_tenure(events, tenure_dir, source_dir):
    os.makedirs(tenure_dir, exist_ok=True)
    images_dir = os.path.join(tenure_dir, "images")
    os.makedirs(images_dir, exist_ok=True)

    for event in events:
        slug = event["slug"]
        event_images_dir = os.path.join(images_dir, slug)
        os.makedirs(event_images_dir, exist_ok=True)

        copied_images = []
        seen_hashes = set()
        
        # Determine image files
        if "images" in event:
            image_list = event["images"]
        else:
            image_list = []
            for i in range(1, event["image_count"] + 1):
                img_name = event["image_source_pattern"].format(i)
                image_list.append((img_name, img_name))

        # Copy files to their specific directories, filtering headers & duplicates
        for src_name, dest_name in image_list:
            src_path = os.path.join(source_dir, src_name)
            if os.path.exists(src_path):
                with open(src_path, "rb") as fp:
                    file_hash = hashlib.md5(fp.read()).hexdigest()[:8]
                
                # Exclude PDF border frames, header banners, and duplicate hashes
                if file_hash in IGNORE_HASHES or file_hash in seen_hashes:
                    continue

                seen_hashes.add(file_hash)
                dest_path = os.path.join(event_images_dir, dest_name)
                shutil.copy2(src_path, dest_path)
                copied_images.append(dest_name)
            else:
                print(f"Warning: Source image {src_path} does not exist.")

        # Build image grid elements
        image_elements = []
        if copied_images:
            for img in copied_images:
                relative_img_path = f"images/{slug}/{img}"
                el = f"""
          <a href="#" class="gallery-item group relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-300" data-full-src="{relative_img_path}">
            <div class="h-64 sm:h-72 w-full overflow-hidden flex items-center justify-center bg-slate-100/70 p-3">
              <img src="{relative_img_path}" alt="{event['title']}" class="max-w-full max-h-full object-contain rounded-lg">
            </div>
            <div class="absolute inset-0 bg-slate-950/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="p-3 bg-white/95 rounded-full shadow-lg text-slate-800 scale-90 group-hover:scale-100 transition-transform duration-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
                </svg>
              </span>
            </div>
          </a>
                """
                image_elements.append(el)
        else:
            image_elements.append("""
          <div class="col-span-full py-10 text-center bg-slate-100/60 rounded-2xl border border-slate-200/80 p-8">
            <p class="text-slate-600 text-sm font-medium">Session recorded & documented online. Official report published in YRC Annual Magazine.</p>
          </div>
            """)

        # Build HTML content
        html_content = HTML_TEMPLATE.format(
            title=event["title"],
            category=event["category"],
            date=event["date"],
            tenure=event["tenure"],
            description=event["description"],
            leads=event["leads"],
            image_elements="\n".join(image_elements)
        )

        # Write HTML page
        html_path = os.path.join(tenure_dir, f"{slug}.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Generated page: {html_path} with {len(copied_images)} images.")

if __name__ == "__main__":
    print("Generating pages for tenure 2023-24...")
    generate_pages_for_tenure(events_2023_24, "events/2023-24", "extracted_magsjam")
    
    print("\nGenerating pages for tenure 2024-25...")
    generate_pages_for_tenure(events_2024_25, "events/2024-25", "extracted_yrc_magazine")

    print("\nCleaning temporary source folders...")
    # Optional: we can keep or delete raw extracted folders. Let's keep them in the workspace but exclude from git or delete.
    # We will keep them for safety in case anything else is needed.
    print("Generation complete!")
