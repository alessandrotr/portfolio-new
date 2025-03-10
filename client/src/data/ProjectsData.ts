import ENRXGif from "/projects-images/enrx_hardline.gif";
import FraunhoferGif from "/projects-images/fraunhofer.gif";
import AmbitiousGif from "/projects-images/ambitious.gif";
import FreeveeGif from "/projects-images/freevee.gif";
import PlanseeGif from "/projects-images/plansee.gif";
import KunischGif from "/projects-images/kunisch.gif";
import BuerkertGif from "/projects-images/buerkert.gif";
import AwsretailGif from "/projects-images/awsretail.gif";

import PlanseeVideo from "/projects-videos/Plansee_video.mp4";
import AmbitiousVideo from "/projects-videos/Ambitious_video.mp4";
import FraunhoferVideo from "/projects-videos/Fraunhofer_video.mp4";
import ENRXVideo from "/projects-videos/ENRX_video.mp4";
import AmazonFreeveeVideo from "/projects-videos/AmazonFreevee_video.mp4";
import KunischVideo from "/projects-videos/Kunisch_video.mp4";
import BuerkertVideo from "/projects-videos/buerkert_video.mp4";
import AWSRetail_1_Video from "/projects-videos/AWSRetail_1_video.mp4";
import AWSRetail_2_Video from "/projects-videos/AWSRetail_2_video.mp4";

export const ProjectsData = [
  {
    id: 1,
    title: "ENRX",
    type: "Virtual Experience",
    description:
      "I contributed to the creation of the ENRX WebGL Showroom, a cutting-edge marketing and sales web application developed in collaboration with Solid White for ENRX Group AS. The virtual showroom addresses sustainability goals by improving communication, reducing travel costs, and revolutionizing product showcasing in the digital era. The result is a powerful tool that not only reflects ENRX's commitment to sustainability but also transforms how businesses can effectively market and sell their products.",
    keyFeatures: [
      {
        title: "WebGL 3D Virtualization",
        text: "Immersive 3D visualization of machines and products, creating an interactive and engaging user experience.",
      },
      {
        title: "CMS Integration",
        text: "Empowering ENRX with the ability to manage users, texts, and media effortlessly.",
      },
      {
        title: "Public Area",
        text: "A publicly accessible space for widespread engagement.",
      },
      {
        title: "Secured Sales Area",
        text: "Exclusive access for authorized personnel, facilitating a tailored experience for sales representatives and clients.",
      },
    ],
    myRole:
      "As a Frontend Developer, I played a pivotal role in bringing the virtual showroom to life. Collaborating closely with the design and backend teams, I took charge of building all UI components, implementing robust authentication mechanisms, establishing connections with the backend infrastructure, and introducing engaging animations to enhance the user experience.</br></br>I contributed to implementing WebGL 3D virtualization for the showroom, enabling interactive exploration of intricate machines and products through 3D models and animations.",
    href: "https://www.virtualexperience.enrx.com",
    gifImage: ENRXGif,
    videoSrc: ENRXVideo,
    technologies: [
      "react",
      "@react-three/fiber",
      "three.js",
      "@react-spring/three",
      "@react-three/drei",
      "@theatre/studio",
      "aws-amplify",
      "@use-gesture/react",
      "i18next",
      "shader-composer",
      "valtio",
      "wouter",
      "vite",
    ],
    date: "2022/2023",
  },
  {
    id: 2,
    title: "Leistungszentrum",
    type: "Virtual Showroom",
    description:
      "The Leistungszentrum, dedicated to functional integration for micro/nanoelectronics, serves as an interdisciplinary platform for core competencies in system design, components and manufacturing technologies, system integration, and reliability assessment.</br></br>Fraunhofer IPMS, ENAS, IIS-EAS, IZM-ASSID, along with TU Dresden, TU Chemnitz, and HTW Dresden, collectively contribute to this powerhouse of research and development.</br></br>Solid White took on the challenge of translating this complex network of competencies into an engaging, accessible, and vivid experience. The solution? A WebGL Exhibition seamlessly blended with 3D animations and motion graphic videos. This multimedia platform goes beyond the limitations of conventional media, offering an immersive journey through the Leistungszentrum's vast knowledge base.",
    keyFeatures: [
      {
        title: "WebGL 3D Virtualization",
        text: "Immersive 3D visualization of the institutes and their work, creating an interactive and engaging user experience.",
      },
      {
        title: "CMS Integration",
        text: "Empowering Leistungszentrum with the ability to manage users, texts, and media effortlessly.",
      },
      {
        title: "Autopilot for Presentations",
        text: "Streamlining the showcase of competencies.",
      },
      {
        title: "Snapshot Function",
        text: "Allowing users to capture high-resolution images (png, up to 7680x4320).",
      },
    ],
    myRole:
      "I created the UI components and ensured a seamless backend connection. My responsibilities included interactive 3D models and animations, integrating media files, enabling localization, and implementing snapshot and autopilot functionalities. ",
    href: "https://www.showroom.leistungszentrum-mikronano.de",
    gifImage: FraunhoferGif,
    videoSrc: FraunhoferVideo,
    technologies: [
      "react",
      "@react-three/fiber",
      "three.js",
      "@react-spring/three",
      "@react-three/drei",
      "@theatre/studio",
      "aws-amplify",
      "@use-gesture/react",
      "i18next",
      "shader-composer",
      "valtio",
      "wouter",
      "vite",
    ],
    date: "2021/2022",
  },
  {
    id: 3,
    title: "Ambitious",
    type: "Rocket",
    description:
      "The Siemens NX AM Smart Expert Partner and Reseller, AMbitious focuses on providing training in additive manufacturing and Siemens' NX Software.</br></br>The challenge in this project was to vividly convey the astonishing possibilities and unprecedented shapes of components and products in the realm of additive manufacturing. To achieve this, Solid White took a real-world exhibit and transformed it into an interactive WebGL experience that mirrored its physical counterpart, creating an immersive and realistic virtualization.",
    keyFeatures: [
      {
        title: "WebGL 3D Virtualization",
        text: "Immersive 3D visualization, creating an interactive and engaging user experience.",
      },
      {
        title: "Interactive Product Presentation",
        text: "Experience the real-world exhibit in a virtual space, allowing users to interact with the product, exploring its features and functionalities.",
      },
      {
        title: "Localization",
        text: "The application is tailored to be accessible to a wider audience by providing content in multiple languages",
      },
    ],
    myRole:
      "As the Frontend Developer for this project, I created the user interface and overall user experience. From crafting responsive layouts to implementing captivating animations, my contribution extended to ensuring the seamless functionality of the interactive product presentation.",
    href: "https://www.am-bitious.de/fileadmin/3d-animation-additive-fertigung/#de",
    gifImage: AmbitiousGif,
    videoSrc: AmbitiousVideo,
    technologies: [
      "react",
      "@react-three/fiber",
      "three.js",
      "@react-spring/three",
      "@react-three/drei",
      "i18next",
      "valtio",
      "wouter",
    ],
    date: "2021",
  },
  {
    id: 4,
    title: "Matthias Kunisch",
    type: "Virtual NFT Gallery",
    description:
      "Matthias Kunisch, a contemporary artist and sculptor based in Esslingen, sought to bring his unique blend of philosophy, Greek mythology, and contemporary phenomena into the digital realm. Collaborating with the Solid White agency, we embarked on the creation of a captivating web presence and a virtual gallery for Matthias Kunisch's artworks, showcasing the digital sculpture 'Sisyphos' and the drawing series 'Medea.'",
    keyFeatures: [
      {
        title: "Virtual Gallery",
        text: "Immersive digital space that replicates the experience of a physical art gallery, allowing users to explore artworks in a 3D environment",
      },
      {
        title: "NFT Integration",
        text: "Incorporation of blockchain technology for creating, managing, and trading NFT, allowing users to acquire digital representations of Matthias Kunisch's artworks.",
      },
      {
        title: "Mobile-First Design",
        text: "The Virtual Gallery was optimized for a seamless and engaging experience on mobile devices.",
      },
    ],
    myRole:
      "As a Frontend Developer for this project, I used Wordpress as headless CMS and incorporated WebGL technology. I developed the user interface components and ensured responsiveness across various devices, crafted engaging animations, implemented localization, and more.",
    href: "https://matthiaskunisch.de/virtualgallery/",
    gifImage: KunischGif,
    videoSrc: KunischVideo,
    technologies: [
      "react",
      "@react-three/fiber",
      "three.js",
      "@react-spring/three",
      "@react-three/drei",
      "leva",
      "react-i18next",
      "google-spreadsheet",
      "valtio",
      "@emotion/react",
      "vite",
    ],
    date: "2023/2024",
  },
  {
    id: 5,
    title: "Amazon Freevee",
    type: "Advertisement",
    description:
      "I had the privilege to contribute my expertise as a Frontend Developer for the Amazon Freevee Ads Demo showcased at the unBoxed 2023 conference in New York City. The event aimed to educate businesses and marketers on how Amazon empowers brands to expand their reach through creativity and innovation. The interactive application featured cutting-edge advertising products from Freevee, providing an immersive experience for attendees.",
    keyFeatures: [
      {
        title: "Real-time 3D Environment",
        text: "Creating a dynamic and visually stunning environment using WebGL technology.",
      },
      {
        title: "Videos",
        text: "Integrating multimedia content to enhance the overall experience.",
      },
    ],
    myRole:
      "As the Frontend Developer for this project, I took charge of building the entire application, ensuring seamless functionality and an engaging user interface. While I didn't handle the design aspects, my focus was on translating the creative vision into a responsive and interactive application that aligned with the goals of the Amazon Freevee Ads Demo. Through collaboration and technical prowess, we successfully brought the project to life, contributing to a memorable and impactful experience at the unBoxed 2023 conference.",
    gifImage: FreeveeGif,
    videoSrc: AmazonFreeveeVideo,
    technologies: [
      "react",
      "@react-three/fiber",
      "three.js",
      "@react-spring/three",
      "@react-three/drei",
      "@use-gesture/react",
      "i18next",
      "shader-composer",
      "valtio",
      "wouter",
      "vite",
    ],
    date: "2023",
  },
  {
    id: 6,
    title: "Plansee",
    type: "Virtual Showroom",
    description:
      " As the lead Frontend Developer I worked on a project for Plansee SE, a leading global metal component manufacturer. The metals they produce are ideal for numerous high-tech applications: the semiconductor industry, next-gen. microchip tech, or components for generating X-rays. Our challenge was to showcase Plansee's hot zones technology in a cutting-edge virtual experience developed in collaboration with Solid White.",
    keyFeatures: [
      {
        title: "WebGL 3D Virtualization",
        text: "Immersive 3D visualization of the high-temperature furnace, creating an interactive and engaging user experience.",
      },
      {
        title: "Localization",
        text: "The application is tailored to be accessible to a wider audience by providing content in seven different languages.",
      },
    ],
    myRole:
      "I played a pivotal role in bringing the virtual showroom to life. I took charge of building all UI components, implemented WebGL 3D virtualization for the showroom, enabled interactive exploration of each of the products through 3D models and animations.",
    gifImage: PlanseeGif,
    videoSrc: PlanseeVideo,
    technologies: [
      "react",
      "@react-three/fiber",
      "three.js",
      "@react-spring/three",
      "@react-three/drei",
      "@use-gesture/react",
      "i18next",
      "shader-composer",
      "valtio",
      "wouter",
      "vite",
    ],
    date: "2023",
  },
  {
    id: 7,
    title: "Bürkert",
    type: "Virtual Showroom",
    description:
      "Bürkert GmbH & Co. KG is a global leader in fluid control systems. They needed a virtual showroom to showcase a medical anaesthesia device they had developed. I helped build this showroom with Solid White.",
    keyFeatures: [
      {
        title: "WebGL 3D Virtualization",
        text: "Immersive 3D visualization of the operating room, creating an interactive and engaging user experience.",
      },
      {
        title: "CMS Integration",
        text: "Empowering Bürkert with the ability to manage texts and media effortlessly.",
      },
    ],
    myRole:
      "As the lead Frontend Developer for this project, I took charge of building all UI components, implemented WebGL 3D virtualization for the showroom, enabled interactive exploration of the 3 products through 3D models and animations.",
    gifImage: BuerkertGif,
    videoSrc: BuerkertVideo,
    technologies: [
      "react",
      "@react-three/fiber",
      "three.js",
      "@react-spring/three",
      "@react-three/drei",
      "@use-gesture/react",
      "i18next",
      "shader-composer",
      "valtio",
      "wouter",
      "vite",
    ],
    date: "2023/2024",
  },
  {
    id: 8,
    title: "AWS for Retail",
    type: "Advertisement",
    description:
      "I am proud to have been the Frontend Developer for two dynamic projects showcased at AWS re:Invent in Las Vegas – AWS for Retail and AWS for Consumer Packaged Goods (CPG). These interactive exhibits were designed to provide attendees with a deep dive into the cutting-edge solutions AWS offers for both the retail and CPG industries.",
    keyFeatures: [
      {
        title: "Custom GLSL Shader",
        text: "GLSL shader for a visually stunning and immersive experience",
      },
      {
        title: "QR Codes",
        text: "Quick access to additional resources and information.",
      },
    ],
    myRole:
      "In my role as the Frontend Developer, I took the lead in building both applications. I focused on creating user-friendly interfaces, ensuring smooth navigation, and responsive interaction. I implemented texts, QR codes, images, and videos. Additionally, I developed a custom GLSL shader for the two backgrounds, enhancing the overall visual appeal and contributing to a more immersive environment for users.",
    gifImage: AwsretailGif,
    videoSrc: AWSRetail_1_Video,
    videoSrc2: AWSRetail_2_Video,
    technologies: [
      "react",
      "@react-three/fiber",
      "three.js",
      "@react-spring/three",
      "@react-three/drei",
      "i18next",
      "shader-composer",
      "vite",
    ],
    date: "2023/2024",
  },
];
