import { useState } from "react";

// ─── All template data ────────────────────────────────────────────────────────

const ESSAY_TYPES = [
  { id: "agree", label: "Agree / Disagree", icon: "✅", color: "#0ea5e9", desc: "Do you agree? / Do you support?" },
  { id: "extent", label: "To what extent", icon: "↔️", color: "#8b5cf6", desc: "To what extent do you agree?" },
  { id: "problem", label: "Problem / Cause / Effect", icon: "⚠️", color: "#f59e0b", desc: "How widespread? What problems?" },
  { id: "discuss", label: "Discuss both views", icon: "⚖️", color: "#10b981", desc: "Discuss both views and give opinion" },
];

const INTRO_TEMPLATES = {
  agree: {
    formula: ["Paraphrase the topic (never copy words)", "State your position clearly", "Signal essay structure with number of reasons"],
    sentences: [
      { role: "S1 — Paraphrase", template: "The debate over whether [PARAPHRASED TOPIC] has sparked considerable discussion.", warning: "Never copy words from the prompt. Use synonyms.", example: "Prompt says 'getting married before finishing studying is foolish' → Write: 'The debate over whether young adults should prioritise marriage over academic and professional development has sparked considerable discussion.'" },
      { role: "S2 — Position", template: "I firmly believe that [YOUR POSITION], as it carries [REASON HINT 1] and [REASON HINT 2] implications.", warning: "Never say 'I agree with this statement' — too weak. Name WHY in one phrase.", example: "I firmly believe that postponing marriage until after graduation is advisable, as it carries significant financial and psychological implications." },
      { role: "S3 — Signpost", template: "This essay will examine TWO key reasons behind this viewpoint.", warning: "Always write the word TWO. It locks your structure and signals organisation to the examiner.", example: "This essay will examine two key reasons behind this viewpoint." },
    ],
    antipatterns: [
      { wrong: "I will explore the reasons behind my statement.", fix: "This essay will examine two key reasons behind this viewpoint.", why: "'My statement' is weak. 'Two key reasons' signals structure." },
      { wrong: "This essay will explain the reasons deeply.", fix: "This essay will examine two key reasons behind this viewpoint.", why: "'Deeply' is informal. 'Examine' is the correct academic verb." },
      { wrong: "I agree with this idea.", fix: "I firmly believe that [position], as it carries [implication].", why: "Never just say 'I agree' — state WHY in the same sentence." },
    ]
  },
  extent: {
    formula: ["Paraphrase the topic", "State partial or full agreement with nuance", "Acknowledge counterargument + signal structure"],
    sentences: [
      { role: "S1 — Paraphrase", template: "The question of whether [PARAPHRASED TOPIC] has become a subject of considerable debate.", warning: "Same paraphrase rule — zero copied words from prompt.", example: "The question of whether individuals should prioritise career development over early marriage has become a subject of considerable debate." },
      { role: "S2 — Nuanced position", template: "While I acknowledge that [CONCEDE ONE POINT], I largely believe that [YOUR MAIN POSITION].", warning: "This sentence is what separates 72 from 82. Show you see both sides.", example: "While I acknowledge that emotional readiness can exist independent of financial stability, I largely believe that professional and academic completion should precede marriage." },
      { role: "S3 — Signpost", template: "This essay will examine two primary reasons that support this position.", warning: "Use 'primary' instead of 'key' to vary vocabulary across essays.", example: "This essay will examine two primary reasons that support this position." },
    ],
    antipatterns: [
      { wrong: "I strongly agree/disagree with this.", fix: "While I acknowledge that [X], I largely believe that [Y].", why: "'To what extent' demands nuance — strong agree/disagree loses content marks." },
      { wrong: "There are advantages and disadvantages.", fix: "While I acknowledge that [X], I largely believe that [Y].", why: "Never use 'advantages and disadvantages' framing for an extent question." },
    ]
  },
  problem: {
    formula: ["Introduce the issue as a trend, not as a debate", "State that the essay will address BOTH questions", "No personal position needed"],
    sentences: [
      { role: "S1 — Trend", template: "The issue of [PARAPHRASED PROBLEM] has become increasingly prevalent in modern society.", warning: "Do NOT use 'I agree/disagree' — this prompt type asks you to describe, not argue.", example: "The issue of individuals sacrificing personal time for career advancement has become increasingly prevalent in modern society." },
      { role: "S2 — Scope statement", template: "This phenomenon is now widespread across various sectors, particularly among [WHO IS AFFECTED].", warning: "Answer 'how widespread' in the introduction itself — one sentence is enough.", example: "This phenomenon is now widespread across various sectors, particularly among professionals in corporate and technology-driven industries." },
      { role: "S3 — Signpost", template: "This essay will examine the extent of this problem and explore its most significant consequences.", warning: "Name BOTH questions from the prompt. The examiner checks that you addressed both.", example: "This essay will examine the extent of this problem and explore its most significant consequences." },
    ],
    antipatterns: [
      { wrong: "I believe this phenomenon has become too serious.", fix: "This phenomenon is now widespread across various sectors.", why: "Problem essays don't need personal belief — describe scale objectively." },
      { wrong: "The debate over whether people work too much has sparked discussion.", fix: "The issue of [problem] has become increasingly prevalent.", why: "'Debate' framing implies two sides. Problem essays have one direction." },
      { wrong: "This essay will explore this issue deeply.", fix: "This essay will examine the extent of this problem and its most significant consequences.", why: "Must name BOTH questions — extent AND consequences — or you lose content marks." },
    ]
  },
  discuss: {
    formula: ["Paraphrase presenting two perspectives", "Acknowledge both views exist", "State YOUR view and signal structure"],
    sentences: [
      { role: "S1 — Two views", template: "There are contrasting perspectives on whether [TOPIC], with some arguing [VIEW A] while others maintain [VIEW B].", warning: "Set up both sides explicitly in sentence 1.", example: "There are contrasting perspectives on early marriage, with some arguing it strengthens emotional bonds while others maintain it undermines personal development." },
      { role: "S2 — Your position", template: "While both viewpoints carry merit, I personally believe that [YOUR POSITION].", warning: "You must give YOUR opinion in discuss essays — examiner expects it.", example: "While both viewpoints carry merit, I personally believe that delaying marriage until achieving stability is the more prudent course of action." },
      { role: "S3 — Signpost", template: "This essay will first examine both perspectives before explaining my own stance.", warning: "Signal that you will cover both sides, not just argue one.", example: "This essay will first examine both perspectives before explaining my own stance." },
    ],
    antipatterns: [
      { wrong: "I firmly agree/disagree.", fix: "While both viewpoints carry merit, I personally believe that [X].", why: "Discuss essays require balance first, then opinion." },
    ]
  }
};

const BODY_TEMPLATES = {
  topic_sentence: {
    title: "Topic sentence — 3 formulas",
    formulas: [
      { label: "Formula A — Regarding", template: "Regarding [YOUR IDEA], one [GOLDEN WORD] is that [CLAIM].", example: "Regarding the financial consequences of early marriage, one major drawback is that young couples without stable income face significant economic burdens." },
      { label: "Formula B — There are reasons", template: "There are several reasons why [YOUR IDEA], with [MOST IMPORTANT REASON] being the most significant.", example: "There are several reasons why automation will reduce working hours, with the replacement of repetitive tasks by AI systems being the most significant." },
      { label: "Formula C — Furthermore", template: "Furthermore, [YOUR SECOND IDEA] represents another [GOLDEN WORD] worth examining.", example: "Furthermore, the psychological consequences of long working hours represent another serious concern worth examining." },
    ],
    warning: "Never open a body paragraph with your example or evidence. The topic sentence is the CLAIM. Evidence comes after."
  },
  support: {
    title: "Support sentence — 2 formulas",
    formulas: [
      { label: "Cause → Effect chain", template: "When [CAUSE], this leads to [IMMEDIATE EFFECT], which in turn results in [DEEPER CONSEQUENCE].", example: "When young couples lack financial stability, this leads to chronic stress, which in turn results in deteriorating relationship quality and long-term psychological harm." },
      { label: "Contrast + consequence", template: "Unlike [ALTERNATIVE], [YOUR SUBJECT] tends to [NEGATIVE/POSITIVE OUTCOME], thereby [CONSEQUENCE].", example: "Unlike professionals who maintain clear work-life boundaries, those who sacrifice personal time tend to experience burnout, thereby diminishing their long-term productivity." },
    ],
    warning: "Your support sentence must EXPLAIN the topic sentence — not repeat it and not jump to the example yet."
  },
  experience: {
    title: "Personal experience — 3 formulas",
    formulas: [
      { label: "University experience (safest)", template: "This notion is supported by my own experience. When I was studying at university, I found that [SPECIFIC DETAIL], which [RESULT].", example: "This notion is supported by my own experience. When I was studying at university, I found that peers who worked excessive part-time hours consistently underperformed academically, which reinforced the importance of balanced commitments." },
      { label: "Work experience", template: "This has been reflected in my professional experience. While working at [TYPE OF COMPANY], I observed that [SPECIFIC OBSERVATION], demonstrating that [YOUR POINT].", example: "This has been reflected in my professional experience. While working at a technology firm, I observed that colleagues who regularly worked overtime showed measurable declines in creative output, demonstrating that extended hours reduce rather than improve performance." },
      { label: "Research support (when no personal angle)", template: "Numerous studies conducted by leading universities have reinforced this notion. The findings indicate that [SPECIFIC FINDING], which suggests that [IMPLICATION].", example: "Numerous studies conducted by leading universities have reinforced this notion. The findings indicate that employees who work more than fifty hours per week report significantly higher rates of anxiety, which suggests a direct link between overwork and psychological decline." },
    ],
    warning: "Use ONLY ONE support type per paragraph. Don't stack personal experience + research + example in the same paragraph — it reads as padding."
  },
  connector: {
    title: "Paragraph connectors — never use 'Also' or 'Besides'",
    formulas: [
      { label: "Adding a second body paragraph", template: "Furthermore, / In addition to this, / Building on this argument,", example: "Furthermore, the psychological consequences of overwork represent an equally significant concern." },
      { label: "Contrast within a paragraph", template: "However, / Conversely, / In contrast, / Nevertheless,", example: "However, not all companies have embraced this shift, as short-term profit motives continue to drive long working hours in many sectors." },
      { label: "Cause-effect within paragraph", template: "Consequently, / As a result, / Therefore, / This inevitably leads to", example: "Consequently, employees in such environments are significantly more prone to burnout and psychological distress." },
      { label: "Example introduction (never 'for example')", template: "A clear example can be seen in [X]. / This can be illustrated by [X]. / Introducing a specific case can illuminate this:", example: "A clear example can be seen in major technology firms such as Google, which introduced four-day work weeks and reported increased employee productivity." },
    ],
    warning: "Never start a sentence with 'So' in a formal essay. Replace with 'Consequently' or 'As a result'. Never use 'for example' — use the formulas above."
  }
};

const CONCLUSION_TEMPLATE = {
  formula: ["Restate position — different words from intro", "Name BOTH arguments specifically — not vaguely", "Forward-looking final sentence"],
  sentences: [
    { role: "S1 — Restate", template: "In conclusion, I firmly maintain that [RESTATE POSITION IN NEW WORDS].", warning: "Use 'maintain' or 'hold the view that' — not 'believe' again.", example: "In conclusion, I firmly maintain that prioritising financial and academic stability before marriage is the most prudent course for young adults." },
    { role: "S2 — Name both arguments", template: "The [ARGUMENT 1] and [ARGUMENT 2] outlined above demonstrate that [LINK BACK TO POSITION].", warning: "Name your actual arguments — not vague words like 'these reasons' or 'the above points'.", example: "The significant economic burden and the psychological strain outlined above demonstrate that premature marital commitment undermines long-term personal development." },
    { role: "S3 — Forward look", template: "As [TREND CONTINUES], it is foreseeable that [IMPLICATION FOR FUTURE].", warning: "This sentence elevates your essay from descriptive to analytical — examiners notice it.", example: "As societal expectations continue to evolve, it is foreseeable that more individuals will recognise the value of personal preparation before making lifelong commitments." },
  ],
  antipatterns: [
    { wrong: "In conclusion, I believe [repeat of intro].", fix: "In conclusion, I firmly maintain that [reworded position].", why: "Never repeat the exact intro phrasing. 'Maintain' scores higher than 'believe'." },
    { wrong: "...and technology as well as economy are the main player.", fix: "The automation of tasks and the economic pressure on corporations outlined above...", why: "Name the arguments precisely. 'Main player' is informal and vague." },
    { wrong: "In conclusion, these are the reasons I agree.", fix: "Full three-sentence conclusion with restate + both arguments + forward look.", why: "One-sentence conclusions always score 3–5 points lower than three-sentence ones." },
    { wrong: "...psychologically and culturally.", fix: "...psychological well-being and cross-cultural relationship building...", why: "Adverbs in conclusions are vague. Restate with the actual noun phrases you used in the body." },
  ]
};

const YOUR_PERSONAL_ERRORS = [
  { pattern: "Subject-verb with quantity nouns", frequency: "4 of your 5 essays", examples: [{ wrong: "a group of people are", right: "a group of people is" }, { wrong: "a number of people has", right: "a number of people have" }, { wrong: "the majority of students is", right: "the majority of students are" }], rule: "'A group of / a team of / a committee of' → singular verb. 'A number of / a majority of' → plural verb." },
  { pattern: "Wrong preposition after common verbs", frequency: "5 times total", examples: [{ wrong: "prevent myself of misjudgment", right: "prevent myself from misjudging" }, { wrong: "provide customers social cohesion", right: "provide users with social cohesion" }, { wrong: "spend time in workplaces", right: "spend time at workplaces" }], rule: "Prevent FROM. Provide WITH. Spend time AT. Prevent OF does not exist." },
  { pattern: "Wrong word form under pressure", frequency: "3 essays", examples: [{ wrong: "working hours will be deducted", right: "working hours will be reduced" }, { wrong: "an unprecedent increase", right: "an unprecedented increase" }, { wrong: "manipulate AI", right: "utilise / leverage AI" }], rule: "Before submitting: read each content word and ask 'does this word mean exactly what I intend?'" },
  { pattern: "Opening body paragraph with evidence not claim", frequency: "Essay 4", examples: [{ wrong: "A clear example can be seen in Microsoft which its staff work overnight...", right: "This issue has become alarmingly widespread across corporate sectors globally. A clear example can be seen in..." }], rule: "Every body paragraph: CLAIM first, EVIDENCE second. Never evidence first." },
  { pattern: "Wrong essay type template", frequency: "Essay 4 (cost 8 points)", examples: [{ wrong: "I believe this phenomenon has become too serious (on a problem essay)", right: "This phenomenon is now widespread across various sectors." }], rule: "Read the prompt. Underline the question word. Problem/cause/effect essays NEVER start with 'I agree/believe'." },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function MasterTemplates() {
  const [activeEssayType, setActiveEssayType] = useState("agree");
  const [activeSection, setActiveSection] = useState("intro");
  const [activeBodyPart, setActiveBodyPart] = useState("topic_sentence");
  const [copiedText, setCopiedText] = useState("");

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const currentIntro = INTRO_TEMPLATES[activeEssayType];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem", color: "#1a1a1a" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}>Master Templates</h1>
          <span style={{ fontSize: 11, background: "#1a1a1a", color: "#fff", padding: "2px 8px", borderRadius: 20, fontFamily: "monospace" }}>USE EVERY ESSAY</span>
        </div>
        <p style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Universal sentence structures for introduction, body, and conclusion — regardless of topic</p>
      </div>

      {/* Section selector */}
      <div style={{ display: "flex", gap: 2, borderBottom: "2px solid #1a1a1a", marginBottom: "1.5rem" }}>
        {[
          { id: "intro", label: "Introduction" },
          { id: "body", label: "Body paragraphs" },
          { id: "conclusion", label: "Conclusion" },
          { id: "errors", label: "Your error log" },
        ].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ padding: "7px 16px", fontSize: 13, background: activeSection === s.id ? "#1a1a1a" : "transparent", color: activeSection === s.id ? "#fff" : "#666", border: "none", cursor: "pointer", fontWeight: activeSection === s.id ? 600 : 400, borderRadius: "6px 6px 0 0" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ─── INTRODUCTION ─── */}
      {activeSection === "intro" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Step 0 — Identify your essay type first</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
              {ESSAY_TYPES.map(et => (
                <button key={et.id} onClick={() => setActiveEssayType(et.id)} style={{ padding: "10px 12px", border: `2px solid ${activeEssayType === et.id ? et.color : "#e5e7eb"}`, borderRadius: 10, background: activeEssayType === et.id ? et.color + "15" : "#fff", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{et.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: activeEssayType === et.id ? et.color : "#333" }}>{et.label}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{et.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Formula for this type</div>
            {currentIntro.formula.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13 }}>
                <span style={{ fontWeight: 700, color: ESSAY_TYPES.find(e => e.id === activeEssayType)?.color, minWidth: 20 }}>S{i + 1}</span>
                <span style={{ color: "#334155" }}>{f}</span>
              </div>
            ))}
          </div>

          {currentIntro.sentences.map((s, i) => (
            <div key={i} style={{ border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", marginBottom: 10, background: "#fff" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ESSAY_TYPES.find(e => e.id === activeEssayType)?.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.role}</div>

              <div style={{ background: "#f0f9ff", borderLeft: "3px solid #0ea5e9", padding: "8px 12px", borderRadius: "0 6px 6px 0", marginBottom: 8, cursor: "pointer" }} onClick={() => copy(s.template)}>
                <div style={{ fontSize: 11, color: "#0284c7", fontWeight: 600, marginBottom: 3 }}>TEMPLATE {copiedText === s.template ? "✓ copied" : "— click to copy"}</div>
                <div style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#0c4a6e", fontStyle: "italic", lineHeight: 1.6 }}>{s.template}</div>
              </div>

              <div style={{ background: "#f0fdf4", borderLeft: "3px solid #10b981", padding: "8px 12px", borderRadius: "0 6px 6px 0", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "#065f46", fontWeight: 600, marginBottom: 3 }}>EXAMPLE</div>
                <div style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#064e3b", lineHeight: 1.6 }}>{s.example}</div>
              </div>

              <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <div style={{ fontSize: 12, color: "#b45309", lineHeight: 1.5 }}>{s.warning}</div>
              </div>
            </div>
          ))}

          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px", marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", marginBottom: 10 }}>❌ Anti-patterns from YOUR essays — never write these</div>
            {currentIntro.antipatterns.map((ap, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < currentIntro.antipatterns.length - 1 ? "0.5px solid #fed7aa" : "none" }}>
                <div style={{ fontSize: 12, textDecoration: "line-through", color: "#9ca3af", fontFamily: "Georgia, serif", marginBottom: 3 }}>✗ {ap.wrong}</div>
                <div style={{ fontSize: 12, color: "#059669", fontFamily: "Georgia, serif", marginBottom: 3 }}>✓ {ap.fix}</div>
                <div style={{ fontSize: 11, color: "#78350f" }}>Why: {ap.why}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── BODY PARAGRAPHS ─── */}
      {activeSection === "body" && (
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {Object.entries(BODY_TEMPLATES).map(([key, val]) => (
              <button key={key} onClick={() => setActiveBodyPart(key)} style={{ padding: "6px 14px", fontSize: 12, border: `1.5px solid ${activeBodyPart === key ? "#1a1a1a" : "#e5e7eb"}`, borderRadius: 20, background: activeBodyPart === key ? "#1a1a1a" : "#fff", color: activeBodyPart === key ? "#fff" : "#555", cursor: "pointer", fontWeight: activeBodyPart === key ? 600 : 400 }}>
                {val.title.split("—")[0].trim()}
              </button>
            ))}
          </div>

          {(() => {
            const section = BODY_TEMPLATES[activeBodyPart];
            return (
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "Georgia, serif", marginBottom: 12, color: "#1a1a1a" }}>{section.title}</div>
                {section.formulas.map((f, i) => (
                  <div key={i} style={{ border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", marginBottom: 10, background: "#fff" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{f.label}</div>
                    <div style={{ background: "#f0f9ff", borderLeft: "3px solid #0ea5e9", padding: "8px 12px", borderRadius: "0 6px 6px 0", marginBottom: 8, cursor: "pointer" }} onClick={() => copy(f.template)}>
                      <div style={{ fontSize: 11, color: "#0284c7", fontWeight: 600, marginBottom: 3 }}>TEMPLATE {copiedText === f.template ? "✓ copied" : "— click to copy"}</div>
                      <div style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#0c4a6e", fontStyle: "italic", lineHeight: 1.6 }}>{f.template}</div>
                    </div>
                    <div style={{ background: "#f0fdf4", borderLeft: "3px solid #10b981", padding: "8px 12px", borderRadius: "0 6px 6px 0" }}>
                      <div style={{ fontSize: 11, color: "#065f46", fontWeight: 600, marginBottom: 3 }}>EXAMPLE</div>
                      <div style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#064e3b", lineHeight: 1.6 }}>{f.example}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 8 }}>
                  <span>⚠️</span>
                  <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>{section.warning}</div>
                </div>
              </div>
            );
          })()}

          {/* Body paragraph order reminder */}
          <div style={{ marginTop: 20, background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6d28d9", marginBottom: 10 }}>📋 Body paragraph order — fixed, every essay</div>
            {[
              { n: 1, label: "Topic sentence", note: "CLAIM only — no evidence here", color: "#6366f1" },
              { n: 2, label: "Support sentence", note: "Cause → effect chain or contrast", color: "#8b5cf6" },
              { n: 3, label: "Personal experience OR research", note: "One only — not both", color: "#a855f7" },
              { n: 4, label: "Mini-conclusion (optional)", note: "One sentence linking back to position", color: "#c084fc" },
            ].map(step => (
              <div key={step.n} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: step.color, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{step.n}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{step.label}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{step.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── CONCLUSION ─── */}
      {activeSection === "conclusion" && (
        <div>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Formula — 3 sentences, always</div>
            {CONCLUSION_TEMPLATE.formula.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13 }}>
                <span style={{ fontWeight: 700, color: "#10b981", minWidth: 20 }}>S{i + 1}</span>
                <span style={{ color: "#334155" }}>{f}</span>
              </div>
            ))}
          </div>

          {CONCLUSION_TEMPLATE.sentences.map((s, i) => (
            <div key={i} style={{ border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", marginBottom: 10, background: "#fff" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.role}</div>
              <div style={{ background: "#f0f9ff", borderLeft: "3px solid #0ea5e9", padding: "8px 12px", borderRadius: "0 6px 6px 0", marginBottom: 8, cursor: "pointer" }} onClick={() => copy(s.template)}>
                <div style={{ fontSize: 11, color: "#0284c7", fontWeight: 600, marginBottom: 3 }}>TEMPLATE {copiedText === s.template ? "✓ copied" : "— click to copy"}</div>
                <div style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#0c4a6e", fontStyle: "italic", lineHeight: 1.6 }}>{s.template}</div>
              </div>
              <div style={{ background: "#f0fdf4", borderLeft: "3px solid #10b981", padding: "8px 12px", borderRadius: "0 6px 6px 0", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "#065f46", fontWeight: 600, marginBottom: 3 }}>EXAMPLE</div>
                <div style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#064e3b", lineHeight: 1.6 }}>{s.example}</div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <div style={{ fontSize: 12, color: "#b45309", lineHeight: 1.5 }}>{s.warning}</div>
              </div>
            </div>
          ))}

          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", marginBottom: 10 }}>❌ Anti-patterns from YOUR conclusions</div>
            {CONCLUSION_TEMPLATE.antipatterns.map((ap, i) => (
              <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < CONCLUSION_TEMPLATE.antipatterns.length - 1 ? "0.5px solid #fed7aa" : "none" }}>
                <div style={{ fontSize: 12, textDecoration: "line-through", color: "#9ca3af", fontFamily: "Georgia, serif", marginBottom: 3 }}>✗ {ap.wrong}</div>
                <div style={{ fontSize: 12, color: "#059669", fontFamily: "Georgia, serif", marginBottom: 3 }}>✓ {ap.fix}</div>
                <div style={{ fontSize: 11, color: "#78350f" }}>Why: {ap.why}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── YOUR ERROR LOG ─── */}
      {activeSection === "errors" && (
        <div>
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>Your personal error fingerprint — 5 essays, 28 total errors</div>
            <div style={{ fontSize: 12, color: "#7f1d1d" }}>These are the exact patterns that keep appearing. Fix these first — nothing else matters more right now.</div>
          </div>

          {YOUR_PERSONAL_ERRORS.map((err, i) => (
            <div key={i} style={{ border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", marginBottom: 12, background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{err.pattern}</div>
                <span style={{ fontSize: 11, background: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{err.frequency}</span>
              </div>

              {err.examples.map((ex, j) => (
                <div key={j} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 12, textDecoration: "line-through", color: "#9ca3af", fontFamily: "Georgia, serif" }}>✗ {ex.wrong}</div>
                  <div style={{ fontSize: 12, color: "#059669", fontFamily: "Georgia, serif" }}>✓ {ex.right}</div>
                </div>
              ))}

              <div style={{ background: "#f8fafc", borderLeft: "3px solid #6366f1", padding: "8px 12px", borderRadius: "0 6px 6px 0", marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4338ca", marginBottom: 2 }}>THE RULE</div>
                <div style={{ fontSize: 12, color: "#312e81", lineHeight: 1.6 }}>{err.rule}</div>
              </div>
            </div>
          ))}

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#065f46", marginBottom: 6 }}>✓ What you do well — keep doing these</div>
            {["Spelling — perfect across all 5 essays", "Cohesion connectors — Furthermore, Consequently, Therefore all used correctly", "Personal experience — specific details that feel real (CTO story, university peers)", "Cause-effect logic — your body paragraph chains are getting stronger each essay", "Vocabulary range — unprecedented, psychological well-being, competitive advantage all correct"].map((s, i) => (
              <div key={i} style={{ fontSize: 12, color: "#047857", marginBottom: 4, display: "flex", gap: 6 }}>
                <span style={{ flexShrink: 0 }}>✓</span>{s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}