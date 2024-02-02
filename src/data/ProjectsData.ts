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
      "As a Frontend Developer, I played a pivotal role in bringing the virtual showroom to life. Collaborating closely with the design and backend teams, I took charge of building all UI components, implementing robust authentication mechanisms, establishing connections with the backend infrastructure, and introducing engaging animations to enhance the user experience.</br></br>I contributed to implementing WebGL 3D virtualization for the showroom, enabling interactive exploration of intricate machines and products through 3D models and animations.</br></br>Localization was another vital component I addressed, ensuring that the virtual showroom catered to a diverse audience by offering content in multiple languages.",
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
      "The Leistungszentrum, dedicated to Functional Integration for Micro/Nanoelectronics, serves as an interdisciplinary platform for core competencies in System Design, Components & Manufacturing Technologies, System Integration, and Reliability Assessment.</br></br>Fraunhofer IPMS, ENAS, IIS-EAS, IZM-ASSID, along with TU Dresden, TU Chemnitz, and HTW Dresden, collectively contribute to this powerhouse of research and development.</br></br>Solid White took on the challenge of translating this complex network of competencies into an engaging, accessible, and vivid experience. The solution? A WebGL Exhibition seamlessly blended with 3D animations and motion graphic videos. This multimedia platform goes beyond the limitations of conventional media, offering an immersive journey through the Leistungszentrum's vast knowledge base.",
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
      "I created the UI components and ensured a seamless backend connection. My responsibilities extended to implementing interactive 3D models and animations, integrating media files, enabling localization, and implementing snapshot and autopilot functionalities. ",
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
      "As the frontend developer for this project, I created the user interface and overall user experience. From crafting responsive layouts to implementing captivating animations, my contribution extended to ensuring the seamless functionality of the interactive product presentation.",
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
    type: "Virtual Art Gallery",
    description:
      "Matthias Kunisch is a contemporary artist and sculptor who lives and works in Esslingen. The digitized sculpture Sisyphos and the drawing cycle Medea can be explored in the virtual gallery, a 3d-WebGL environment. Users can select individual fragments of the artworks and then purchase them as NFTs.",
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
    myRole: "Yoyo cumpagn mi ca s parè",
    date: "2023/2024",
  },
  {
    id: 5,
    title: "Amazon Freevee",
    type: "Advertisement",
    description:
      "Amazon unBoxed 2023 in New York City was a conference open to companies of all sizes and marketers of all disciplines who wanted to learn how Amazon is helping brands grow their business through creativity and innovation. The experience created an interactive showroom for Freevee's innovative advertising products.",
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
    myRole: "Yoyo cumpagn mi ca s parè",
    date: "2023",
  },
  {
    id: 6,
    title: "Plansee",
    type: "Virtual Showroom",
    description: "Plansee | Virtual Showroom",
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
    myRole: "Yoyo cumpagn mi ca s parè",
    date: "2023",
  },
  {
    id: 7,
    title: "Bürkert",
    type: "Virtual Showroom",
    description: "Bürkert | Virtual Showroom",
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
    myRole: "Yoyo cumpagn mi ca s parè",
    date: "2023/2024",
  },
  {
    id: 8,
    title: "AWS for Retail",
    type: "Advertisement",
    description: "AWS for Retail",
    gifImage: AwsretailGif,
    videoSrc: AWSRetail_1_Video,
    videoSrc2: AWSRetail_2_Video,
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
    myRole: "Yoyo cumpagn mi ca s parè",
    date: "2023/2024",
  },
];
