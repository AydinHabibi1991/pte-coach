export const PROMPTS = [
  {
    label: "Maximum wage",
    text: "Some people say there should be a maximum wage for high-paying jobs. Do you support that? Please support your idea with your own experience.",
  },
  {
    label: "AI & assignments",
    text: "Some people argue that students should be permitted to use artificial intelligence to complete their academic assignments. Do you support this view? Please support your idea with your own experience.",
  },
  {
    label: "Social media",
    text: "Many experts believe that social media platforms are deteriorating people's communication skills. Do you agree? Please support your idea with your own experience.",
  },
  {
    label: "Space vs poverty",
    text: "Some people believe that governments should spend more money on space exploration rather than addressing poverty on Earth. Do you agree? Please support your idea with your own experience.",
  },
];

export const SAMPLE_ESSAY = `The debate over whether a salary ceiling should be applied to high-paying positions has intensified in recent years. I firmly believe that imposing a maximum wage is a beneficial policy, and this essay will examine the key reasons behind this viewpoint.

Regarding the reasons why implementing a salary cap is advantageous, one major factor is that it can significantly reduce income inequality. When top earners accumulate disproportionate wealth, it can destabilise social cohesion and limit economic mobility for the majority of citizens. In fact, unchecked compensation packages often redirect resources away from broader investment in education and healthcare. This has been supported by my own experience working in the corporate sector, where I observed that senior executives received substantial bonuses while entry-level employees struggled with stagnant wages, creating noticeable tensions within teams.

Furthermore, a salary cap can encourage organisations to redistribute funds toward employee development and public contribution. By placing limits on executive compensation, companies may be incentivised to invest in training programmes and community initiatives, fostering a more equitable workplace culture.

In conclusion, I maintain that a maximum wage policy represents a practical and necessary measure to address systemic economic disparities. While critics may argue it restricts personal freedom, the collective benefits of greater social equity far outweigh such concerns.`;

export const BRAINSTORM_IDEAS = [
  { id: "efficiency", emoji: "⚡", title: "Efficiency & Productivity", keywords: ["AI", "Technology", "Robots", "Remote Work"], color: "#10b981", bg: "#f0fdf4", desc: "It helps people complete tasks faster and more accurately.", sentence: "For example, AI-powered tools can automate repetitive tasks." },
  { id: "info", emoji: "📚", title: "Information Access", keywords: ["Education", "Internet", "Libraries", "Smartphones"], color: "#3b82f6", bg: "#eff6ff", desc: "It democratizes knowledge and allows instant learning globally.", sentence: "For example, online databases provide immediate access to educational materials." },
  { id: "mental", emoji: "🧠", title: "Mental Well-being", keywords: ["Social Media", "Work", "City Life"], color: "#8b5cf6", bg: "#f5f3ff", desc: "It directly impacts stress levels, cognitive load, and happiness.", sentence: "For example, constant connectivity on social platforms can escalate anxiety levels." },
  { id: "economic", emoji: "💰", title: "Economic Benefits", keywords: ["Tourism", "AI", "Transport", "Education"], color: "#f59e0b", bg: "#fffbeb", desc: "It drives revenue generation, job creation, and financial stability.", sentence: "For example, a thriving tourism industry significantly boosts local commercial revenues." },
  { id: "comm", emoji: "💬", title: "Communication", keywords: ["Internet", "Phones", "Social Media"], color: "#ec4899", bg: "#fdf2f8", desc: "It bridges geographical divides and fosters seamless global interactions.", sentence: "For example, video conferencing applications allow real-time cross-border collaboration." },
  { id: "health", emoji: "🏥", title: "Physical Health", keywords: ["Technology", "Sports", "Transport"], color: "#ef4444", bg: "#fef2f2", desc: "It influences life expectancy, disease prevention, and overall vitality.", sentence: "For example, wearable health devices enable individuals to track their cardiovascular fitness daily." },
  { id: "equality", emoji: "⚖️", title: "Equality & Accessibility", keywords: ["Education", "Technology"], color: "#06b6d4", bg: "#ecfeff", desc: "It levels the playing field for disadvantaged or marginalized groups.", sentence: "For example, digital classrooms provide remote students with equivalent learning opportunities." },
  { id: "env", emoji: "🌱", title: "Environmental Impact", keywords: ["Transport", "Industry", "Tourism"], color: "#22c55e", bg: "#f0fdf4", desc: "It shapes ecological sustainability and controls carbon footprint parameters.", sentence: "For example, electric mass transit systems substantially reduce urban air pollution." },
  { id: "skills", emoji: "🛠️", title: "Skill Development", keywords: ["AI", "Education", "Technology"], color: "#64748b", bg: "#f8fafc", desc: "It updates human capital to match competitive, modern job markets.", sentence: "For example, specialized coding bootcamps equip workers with highly lucrative software proficiencies." },
  { id: "balance", emoji: "⏳", title: "Work-Life Balance", keywords: ["Work", "Technology", "Remote Work"], color: "#f97316", bg: "#fff7ed", desc: "It prevents professional burnout and preserves domestic harmony.", sentence: "For example, flexible telecommuting schedules give parents more time to manage household priorities." }
];

export const GOLDEN_PHRASES = {
  Advantages: ["significant advantage", "substantial benefit", "notable merit", "considerable benefit", "positive outcome"],
  Disadvantages: ["major drawback", "potential disadvantage", "serious concern", "notable challenge", "negative consequence"],
  Reasons: ["key reason", "primary factor", "major contributor", "fundamental cause", "leading driver"],
  Effects: ["likely ramifications", "foreseeable implications", "positive consequences", "probable outcomes"],
  Solutions: ["viable solution", "practical approach", "effective strategy", "long-term remedy"],
};

export const QUICK_PHRASES = [
  "The debate over whether",
  "I firmly believe that",
  "There are several compelling reasons why",
  "This has been supported by my own experience",
  "In conclusion,",
  "Furthermore,",
  "One major advantage is that",
  "From an economic perspective,",
];

export const STRUCTURE_STEPS = [
  {
    part: "Intro",
    color: "#0ea5e9",
    steps: [
      { label: "Sentence 1", desc: 'Paraphrase the topic. Use: "The debate over whether ... has intensified" or "The question of whether ... has sparked considerable discussion".' },
      { label: "Sentence 2", desc: 'State your position. Use: "I firmly believe that" / "I am of the view that" / "This essay aligns with the increasing consensus that".' },
      { label: "Sentence 3", desc: 'Clarify structure. Use: "This essay will examine..." / "I will explore the reasons behind this viewpoint".' },
    ],
  },
  {
    part: "Body",
    color: "#8b5cf6",
    steps: [
      { label: "Topic sentence", desc: 'One clear main idea. Use: "Regarding..." / "There are several reasons why..., with X being the most significant".' },
      { label: "Support 1", desc: "Explanation or reasoning. Expand with cause/effect or consequences." },
      { label: "Support 2", desc: 'Personal experience or example. Use: "This has been supported by my own experience..." or "Introducing a specific, real-world example can illuminate...".' },
      { label: "Optional", desc: "Mini-conclusion for the paragraph — give a final thought." },
    ],
  },
  {
    part: "Conclusion",
    color: "#10b981",
    steps: [
      { label: "Restate", desc: "Restate your position in different words from the intro. No new ideas." },
      { label: "Summary", desc: "Summarise main reasons and end with a forward-looking statement." },
    ],
  },
];

export const SUPPORT_TEMPLATES = [
  {
    type: "Personal Experience",
    tip: "قوی‌ترین و راحت‌ترین روش برای ساخت سریع ساپورت",
    template: "This notion is supported by my own experience. When I was studying at university, I found that ...",
    example: "This notion is supported by my own experience. When I was studying at university, I used AI tools to generate ideas for my assignments and achieved better academic results."
  },
  {
    type: "Research / Statistics",
    tip: "در PTE کسی واقعی بودن تحقیق را چک نمی‌کند؛ فقط باید منطقی بنویسید.",
    template: "Numerous studies conducted by leading universities have reinforced this notion. The findings indicate that ...",
    example: "Numerous studies conducted by leading universities have reinforced this notion. The findings indicate that students who use digital learning tools often achieve higher academic performance."
  },
  {
    type: "Concrete Example",
    tip: "استفاده از نمونه‌های عینی و واقعی مثل نام نرم‌افزارها یا روندها",
    template: "A clear example can be seen in ...",
    example: "A clear example can be seen in ChatGPT, which assists students in brainstorming and improving their writing skills."
  }
];

export const SUPER_CATEGORIES = [
  {
    id: "education",
    title: "1. Education",
    topics: ["Schools", "Universities", "Exams", "AI in learning", "Libraries", "Language learning"],
    phrases: ["quality education", "academic performance", "critical thinking", "digital literacy", "knowledge retention", "experiential learning", "cognitive development", "academic discipline", "access to information", "lifelong learning"]
  },
  {
    id: "tech_ai",
    title: "2. Technology & AI",
    topics: ["AI", "Internet", "Smartphones", "Robots", "Future jobs"],
    phrases: ["artificial intelligence", "technological advancements", "automation", "streamline tasks", "workforce productivity", "digital convenience", "emerging technologies", "innovation", "information overload", "machine translation"]
  },
  {
    id: "economy_work",
    title: "3. Economy & Work",
    topics: ["Jobs", "Salary", "Tourism", "Business", "Retirement"],
    phrases: ["financial stability", "economic growth", "productivity", "operational costs", "corporate profitability", "job opportunities", "income inequality", "wealth redistribution", "job security", "economic burden"]
  },
  {
    id: "health",
    title: "4. Health",
    topics: ["Healthcare", "Sports", "Food", "Social media", "Technology"],
    phrases: ["physical health", "psychological well-being", "mental health", "healthcare system", "medical advancements", "sedentary lifestyle", "obesity", "stress levels", "burnout", "life expectancy"]
  },
  {
    id: "environment",
    title: "5. Environment",
    topics: ["Climate change", "Pollution", "Tourism", "Transport"],
    phrases: ["climate change", "carbon emissions", "greenhouse gases", "environmental degradation", "biodiversity", "sustainable development", "natural resources", "carbon footprint", "environmental impact", "renewable energy"]
  },
  {
    id: "society_comm",
    title: "6. Society & Communication",
    topics: ["Social Media", "Family", "Media", "Celebrities"],
    phrases: ["interpersonal skills", "social interaction", "face-to-face communication", "virtual interactions", "public opinion", "media influence", "cultural exchange", "community identity", "social cohesion", "communication skills"]
  },
  {
    id: "gov_law",
    title: "7. Government & Law",
    topics: ["Crime", "Punishment", "Age limits", "Regulations"],
    phrases: ["legal compliance", "public safety", "regulations", "criminal activities", "law enforcement", "social responsibility", "public welfare", "civil liberties", "accountability", "ethical concerns"]
  },
  {
    id: "global_issues",
    title: "8. Global Issues",
    topics: ["Poverty", "International organizations", "Immigration"],
    phrases: ["global cooperation", "poverty reduction", "international organizations", "sustainable development", "diplomatic solutions", "global challenges", "cultural diversity", "globalization", "economic disparity", "humanitarian support"]
  },
  {
    id: "lifestyle",
    title: "9. Lifestyle",
    topics: ["City vs countryside", "Work-life balance", "Leisure"],
    phrases: ["work-life balance", "quality of life", "leisure activities", "family obligations", "urban lifestyle", "rural tranquility", "psychological well-being", "personal development", "life satisfaction", "convenience"]
  },
  {
    id: "universal",
    title: "10. Universal Words (Golden Essential)",
    topics: ["All Types of Essays", "Agree/Disagree", "Problem/Solution", "Advantages/Disadvantages"],
    isUniversal: true,
    subGroups: [
      { name: "Advantages", items: ["significant advantage", "major benefit", "notable merit", "positive outcome", "substantial benefit"] },
      { name: "Disadvantages", items: ["major drawback", "serious concern", "negative consequence", "potential risk", "significant challenge"] },
      { name: "Reasons", items: ["key reason", "major factor", "primary cause", "leading contributor", "fundamental driver"] },
      { name: "Effects", items: ["long-term implications", "foreseeable consequences", "positive impact", "adverse effects", "likely outcomes"] },
      { name: "Solutions", items: ["viable solution", "practical approach", "effective strategy", "long-term remedy", "sustainable solution"] }
    ]
  }
];