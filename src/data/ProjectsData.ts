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
      "As a Frontend Developer, I contributed to the creation of the ENRX WebGL Showroom, a cutting-edge marketing and sales web application developed in collaboration with Solid White for ENRX Group AS. The virtual showroom addresses sustainability goals by improving communication, reducing travel costs, and revolutionizing product showcasing in the digital era. The result is a powerful tool that not only reflects ENRX's commitment to sustainability but also transforms how businesses can effectively market and sell their products.",
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
    title: "LZ micro nano",
    type: "Virtual Showroom",
    description:
      "The High-Performance Center 'Functional Integration for Micro Nanoelectronics' was created as a cross-institute platform for the core competencies of system design, components & manufacturing technologies, system integration and reliability assessment.</br></br>This includes the Fraunhofer Institutes IPMS, ENAS, IIS-EAS and IZM-ASSID as well as the universities and colleges TU Dresden, TU Chemnitz and HTW Dresden.",
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
    myRole: "Yoyo cumpagn mi ca s parè",
    date: "2021/2022",
  },
  {
    id: 3,
    title: "Ambitious",
    type: "Rocket",
    description:
      "AMbitious offers consulting, training and software in the field of additive manufacturing/AM. The portfolio includes training on additive manufacturing and Siemens' NX software including training. AMbitious is Siemens' NX AM Smart Expert Partner and Reseller.</br></br>In order to convey the possibilities of additive manufacturing as vividly and realistically as possible, we virtualized an exhibit - which is also used in real life - as an interactive WebGL experience.",
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
    myRole: "Yoyo cumpagn mi ca s parè",
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
