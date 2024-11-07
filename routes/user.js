const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const authenticateUser = require("./verifyToken.js");
const { updateProfileImage } = require("../controllers/userController");

// POST /register and POST /login routes remain unchanged

// GET /skills to get a list of skills for BTech graduates in India
router.get("/skillspopup", authenticateUser, async (req, res) => {
  const skills = [
    // Computer Science and IT
    "Java", "Python", "C++", "JavaScript", "HTML/CSS", "SQL", "Data Structures",
    "Algorithms", "Object-Oriented Programming", "Web Development", "React",
    "Angular", "Node.js", "Machine Learning", "Artificial Intelligence",
    "Cloud Computing", "DevOps", "Cybersecurity", "Big Data", "IoT",
    "Mobile App Development", "Blockchain", "Data Mining", "Natural Language Processing",
    "Computer Networks", "Operating Systems", "Database Management", "Software Engineering",
    "Agile Methodologies", "Version Control (Git)", "RESTful APIs", "GraphQL",
    "Microservices", "Containerization (Docker)", "Kubernetes", "Serverless Computing",
    "Progressive Web Apps", "WebAssembly", "Quantum Computing", "Augmented Reality",
    "Virtual Reality", "Computer Vision", "Parallel Computing", "Distributed Systems",
    "Information Retrieval", "Compiler Design", "Computer Graphics", "Game Development",
    "Cryptography", "Ethical Hacking", "Network Security", "Biometrics",
    "Data Visualization", "Business Intelligence", "NoSQL Databases", "Graph Databases",
    "Time Series Databases", "Data Warehousing", "ETL Processes", "Data Modeling",
    "Statistical Analysis", "Predictive Modeling", "Deep Learning", "Reinforcement Learning",
    "Genetic Algorithms", "Fuzzy Logic", "Expert Systems", "Speech Recognition",
    "Image Processing", "Pattern Recognition", "Robotic Process Automation", "Edge Computing",
    "Fog Computing", "5G Technology", "Wireless Sensor Networks", "RFID Technology",
    "Bioinformatics", "Computational Biology", "Neuroinformatics", "Cheminformatics",
    "Geoinformatics", "Social Network Analysis", "Recommender Systems", "Sentiment Analysis",
    "Text Mining", "Web Scraping", "API Development", "Microcontrollers", "Embedded Systems",
    "FPGA Programming", "Low-Level Programming", "Assembly Language", "Reverse Engineering",
    "Malware Analysis", "Penetration Testing", "Vulnerability Assessment", "Incident Response",
    "Digital Forensics", "Threat Intelligence", "SIEM", "Identity and Access Management",
    "Public Key Infrastructure", "Blockchain Development", "Smart Contracts", "DApp Development",
    "Cryptocurrency", "Quantum Cryptography", "Post-Quantum Cryptography",

    // Mechanical Engineering
    "AutoCAD", "SolidWorks", "CATIA", "Finite Element Analysis (FEA)",
    "Computational Fluid Dynamics (CFD)", "3D Printing", "CNC Programming",
    "Robotics", "PLC Programming", "Mechatronics", "Thermodynamics",
    "Heat Transfer", "Fluid Mechanics", "Strength of Materials", "Machine Design",
    "Control Systems", "MATLAB", "Simulink", "Six Sigma", "Lean Manufacturing",
    "Project Management", "HVAC Systems", "Automotive Engineering", "Aerospace Engineering",
    "Tribology", "Vibration Analysis", "Acoustics", "Composite Materials",
    "Non-Destructive Testing", "Welding Technology", "Metallurgy", "Nanotechnology",
    "Biomechanics", "Ergonomics", "Pneumatics", "Hydraulics", "Gear Design",
    "Bearing Design", "Cam Design", "Linkage Mechanisms", "Kinematics and Dynamics",
    "Mechanical Vibrations", "Structural Analysis", "Fatigue Analysis", "Fracture Mechanics",
    "Reliability Engineering", "Quality Control", "Metrology", "Rapid Prototyping",
    "Reverse Engineering", "Value Engineering", "Design for Manufacturing",
    "Design for Assembly", "Tolerance Analysis", "GD&T", "Failure Mode and Effects Analysis",
    "Root Cause Analysis", "Predictive Maintenance", "Condition Monitoring",
    "Energy Management", "Renewable Energy Systems", "Power Plant Engineering",
    "Internal Combustion Engines", "Turbomachinery", "Cryogenics", "Combustion Engineering",
    "Aerodynamics", "Propulsion Systems", "Avionics", "Aircraft Structures",
    "Spacecraft Design", "Orbital Mechanics", "Guidance and Control Systems",
    "Robotics Process Automation", "Industrial Automation", "Machine Vision",
    "Sensor Technology", "Actuator Technology", "Microelectromechanical Systems (MEMS)",
    "Computer-Aided Manufacturing (CAM)", "Computer-Integrated Manufacturing (CIM)",
    "Flexible Manufacturing Systems", "Additive Manufacturing", "Subtractive Manufacturing",
    "Hybrid Manufacturing", "Smart Manufacturing", "Industry 4.0", "Digital Twin Technology",
    "Augmented Reality in Manufacturing", "Virtual Reality in Design", "Simulation Modeling",
    "Optimization Techniques", "Operations Research", "Supply Chain Management",
    "Logistics and Transportation", "Inventory Management", "Production Planning and Control",
    "Facility Layout and Design", "Ergonomics and Human Factors", "Occupational Safety",
    "Environmental Engineering", "Sustainable Design", "Life Cycle Assessment",
    "Circular Economy", "Green Manufacturing", "Waste Management",

    // Electrical Engineering
    "Circuit Analysis", "Digital Electronics", "Analog Electronics", "Microprocessors",
    "Microcontrollers", "Power Electronics", "Electric Machines", "Power Systems",
    "Renewable Energy Systems", "Smart Grid Technology", "Embedded Systems",
    "Signal Processing", "Communication Systems", "Antenna Design", "VLSI Design",
    "Control Systems", "Instrumentation", "Sensors and Transducers", "PLC Programming",
    "SCADA Systems", "Industrial Automation", "Robotics", "Electric Drives",
    "Power Quality", "High Voltage Engineering", "Insulation Technology",
    "Electromagnetic Compatibility", "Electromagnetic Interference", "RF Engineering",
    "Microwave Engineering", "Optical Fiber Communication", "Satellite Communication",
    "Mobile Communication", "Wireless Networks", "5G Technology", "Internet of Things (IoT)",
    "Machine Learning for Signal Processing", "Artificial Intelligence in Power Systems",
    "Computer Vision", "Image Processing", "Speech Processing", "Audio Engineering",
    "Biomedical Instrumentation", "Medical Imaging", "Telemedicine", "Biometrics",
    "Cryptography", "Network Security", "Cyber-Physical Systems", "Smart Sensors",
    "Energy Harvesting", "Battery Technology", "Fuel Cells", "Solar Photovoltaics",
    "Wind Energy Systems", "Hydroelectric Systems", "Geothermal Energy", "Biomass Energy",
    "Energy Storage Systems", "Smart Metering", "Demand Response", "Microgrid Systems",
    "Electric Vehicles", "Charging Infrastructure", "Power System Protection",
    "Substation Automation", "FACTS Devices", "HVDC Transmission", "Power System Stability",
    "Load Flow Analysis", "Fault Analysis", "Harmonic Analysis", "Power System Optimization",
    "Energy Management Systems", "Building Automation", "Home Automation", "Lighting Control",
    "HVAC Control", "Fire Alarm Systems", "Access Control Systems", "Video Surveillance",
    "Robotics Vision", "Autonomous Systems", "Drone Technology", "Underwater Robotics",
    "Space Electronics", "Avionics", "Radar Systems", "Sonar Systems", "Lidar Technology",
    "GPS Technology", "Inertial Navigation Systems", "Electronic Warfare",
    "Quantum Electronics", "Photonics", "Optoelectronics", "Nanoelectronics",
    "Spintronics", "Memristors", "Neuromorphic Engineering", "Quantum Computing",
    "Superconductivity", "Metamaterials", "Plasmonics",

    // Civil Engineering
    "Structural Engineering", "Geotechnical Engineering", "Transportation Engineering",
    "Environmental Engineering", "Water Resources Engineering", "Surveying",
    "Construction Management", "Building Information Modeling (BIM)",
    "Green Building Design", "Urban Planning", "Earthquake Engineering",
    "Bridge Engineering", "Highway Engineering", "Traffic Engineering",
    "Railway Engineering", "Airport Engineering", "Harbor Engineering",
    "Coastal Engineering", "Ocean Engineering", "Tunnel Engineering",
    "Foundation Engineering", "Soil Mechanics", "Rock Mechanics", "Hydraulics",
    "Hydrology", "Fluid Mechanics", "Structural Mechanics", "Structural Dynamics",
    "Finite Element Analysis", "Structural Health Monitoring", "Non-Destructive Testing",
    "Construction Materials", "Concrete Technology", "Steel Structures",
    "Timber Structures", "Masonry Structures", "Composite Structures",
    "Prestressed Concrete", "Reinforced Concrete Design", "Steel Design",
    "Timber Design", "Seismic Design", "Wind Engineering", "Fire Safety Engineering",
    "Construction Planning", "Project Scheduling", "Cost Estimation",
    "Contract Management", "Quality Control in Construction", "Safety Management",
    "Risk Management", "Value Engineering", "Sustainable Construction",
    "Green Infrastructure", "Low Impact Development", "Urban Drainage Systems",
    "Water Supply Systems", "Wastewater Treatment", "Solid Waste Management",
    "Air Pollution Control", "Noise Pollution Control", "Environmental Impact Assessment",
    "Remediation Technologies", "Geospatial Technologies", "Remote Sensing",
    "Geographic Information Systems (GIS)", "Global Positioning System (GPS)",
    "Photogrammetry", "LiDAR Technology", "Drone Surveying", "3D Laser Scanning",
    "Building Energy Modeling", "HVAC Design", "Lighting Design", "Acoustic Design",
    "Facade Engineering", "Interior Design", "Landscape Architecture",
    "Urban Design", "Smart Cities", "Sustainable Urban Mobility",
    "Transit-Oriented Development", "Pedestrian and Bicycle Planning",
    "Intelligent Transportation Systems", "Traffic Simulation", "Pavement Design",
    "Pavement Management Systems", "Asset Management", "Infrastructure Maintenance",
    "Bridge Inspection", "Structural Rehabilitation", "Retrofitting Techniques",
    "Disaster Resilient Design", "Emergency Management", "Post-Disaster Reconstruction",
    "Climate Change Adaptation", "Flood Management", "Drought Management",
    "Coastal Zone Management", "River Engineering", "Dam Engineering",
    "Irrigation Engineering", "Groundwater Engineering", "Watershed Management",

    // Chemical Engineering
    "Process Engineering", "Chemical Reaction Engineering", "Separation Processes",
    "Process Control", "Plant Design", "Petroleum Refining", "Polymer Engineering",
    "Biochemical Engineering", "Nanotechnology", "Materials Science",
    "Corrosion Engineering", "Electrochemistry", "Catalysis", "Green Chemistry",
    "Process Simulation", "Statistical Analysis", "Quality Control",
    "Industrial Safety", "Environmental Impact Assessment", "Waste Management",
    "Energy Efficiency", "Sustainable Engineering", "Thermodynamics",
    "Fluid Mechanics", "Heat Transfer", "Mass Transfer", "Transport Phenomena",
    "Unit Operations", "Reactor Design", "Process Optimization",
    "Process Intensification", "Membrane Technology", "Adsorption Technology",
    "Crystallization", "Drying Technology", "Evaporation", "Distillation",
    "Extraction", "Absorption", "Filtration", "Centrifugation",
    "Fluidization", "Gas-Liquid Operations", "Solid-Liquid Operations",
    "Particle Technology", "Rheology", "Colloid Science", "Interfacial Science",
    "Surface Chemistry", "Polymer Processing", "Polymer Characterization",
    "Biopolymers", "Composite Materials", "Nanomaterials", "Smart Materials",
    "Biomaterials", "Pharmaceutical Engineering", "Drug Delivery Systems",
    "Bioprocess Engineering", "Fermentation Technology", "Downstream Processing",
    "Bioreactor Design", "Bioseparations", "Tissue Engineering",
    "Regenerative Medicine", "Biofuels", "Biorefinery", "Food Processing",
    "Nutraceuticals", "Cosmetic Formulation", "Paint Technology",
    "Coating Technology", "Adhesive Technology", "Ceramic Processing",
    "Glass Technology", "Cement Technology", "Paper and Pulp Technology",
    "Textile Processing", "Leather Processing", "Rubber Technology",
    "Plastics Engineering", "Fuel Cell Technology", "Hydrogen Production",
    "Carbon Capture and Storage", "Air Pollution Control", "Water Treatment",
    "Desalination", "Soil Remediation", "Hazardous Waste Treatment",
    "Nuclear Fuel Processing", "Radiochemistry", "Electrochemical Engineering",
    "Photochemical Engineering", "Sonochemistry", "Microwave Processing",
    "Plasma Processing", "Supercritical Fluid Technology", "Microfluidics",
    "Lab-on-a-Chip", "Process Analytical Technology", "Chemometrics",
    "Molecular Modeling", "Computational Fluid Dynamics", "Artificial Intelligence in Chemical Engineering",
    "Machine Learning for Process Optimization", "Digital Twin in Chemical Plants",
    "Industry 4.0 in Chemical Manufacturing", "Internet of Things (IoT) in Process Control"
  ];

  // Return random 10 skills
  const randomSkills = skills.sort(() => 0.5 - Math.random()).slice(0, 10);

  res.status(200).json(randomSkills);
});

// PUT /me/skills to update user skills
router.put("/skills", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const { skill_name, score } = req.body;
    if (!skill_name || score === undefined) {
      return res.status(400).send("Skill name and score are required");
    }

    const existingSkillIndex = user.skills.findIndex(
      (skill) => skill.skill_name === skill_name
    );
    if (existingSkillIndex !== -1) {
      return res.status(400).send("Skill already exists");
    } else {
      // Add the new skill
      user.skills.push({ skill_name, score });
      await user.save();
      return res.status(200).send("Skill added successfully");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// PUT /:id/profile-image to update profile image
router.put("/:id/profile-image", authenticateUser, updateProfileImage);

// POST /projects to add a new project
router.post("/projects", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const newProject = req.body?.project; // Assuming req.body contains the project object
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    user.projects.push(newProject);
    await user.save();

    res.status(200).send("Project added successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// PUT /projects/:projectId to update an existing project
router.put("/projects/:projectId", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.projectId;
    const updatedProject = req.body; // Assuming req.body contains the updated project details

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const projectIndex = user.projects.findIndex(
      (project) => project._id.toString() === projectId
    );
    if (projectIndex === -1) return res.status(404).send("Project not found");

    user.projects[projectIndex] = {
      ...user.projects[projectIndex]._doc,
      ...updatedProject,
    };
    await user.save();

    res.status(200).send({
      message: "Project updated successfully",
      updatedProject: user.projects[projectIndex],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET /me to get user details
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET /getAll to get all users
router.get("/getAll", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) return res.status(404).send("Users not found");
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// PUT /me/socialMediaLinks to update social media links
router.put("/me/socialMediaLinks", authenticateUser, async (req, res) => {
  try {
    const userId = req.user._id;
    const { socialMediaLinks } = req.body;

    if (!Array.isArray(socialMediaLinks) || socialMediaLinks.length === 0) {
      return res.status(400).send("Social media links are required");
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    // Create a map for quick lookup of existing platforms
    const existingLinksMap = new Map();
    user.socialMediaLinks.forEach((link) => {
      existingLinksMap.set(link.platform, link);
    });

    // Iterate through the provided social media links and update/add them
    socialMediaLinks.forEach((newLink) => {
      if (existingLinksMap.has(newLink.platform)) {
        // Update the existing link
        existingLinksMap.get(newLink.platform).link = newLink.link;
      } else {
        // Add new link
        user.socialMediaLinks.push(newLink);
      }
    });

    await user.save();

    res.status(200).json(user.socialMediaLinks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
