import { useState, useRef, useCallback } from "react";
import { 
  PROMPTS, 
  SAMPLE_ESSAY, 
  BRAINSTORM_IDEAS, 
  QUICK_PHRASES,
  STRUCTURE_STEPS,
  GOLDEN_PHRASES,
  SUPPORT_TEMPLATES,
  SUPER_CATEGORIES
} from "../data/pteData";

export default function PTECoach() {
  const [tab, setTab] = useState("practice");
  const [activeCatId, setActiveCatId] = useState("education");
  const [promptIdx, setPromptIdx] = useState(0);
  const [essay, setEssay] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brainstormTopic, setBrainstormTopic] = useState("");
  const [brainstormResult, setBrainstormResult] = useState(null);
  const [brainstormLoading, setBrainstormLoading] = useState(false);
  const [selectedIdeas, setSelectedIdeas] = useState([]);
  const [expandedIdea, setExpandedIdea] = useState(null);
  const textareaRef = useRef(null);

  // Safely compute active super category outside JSX to prevent engine parsing errors
  const currentCategory = SUPER_CATEGORIES?.find(c => c.id === activeCatId) || SUPER_CATEGORIES[0];

  const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length;
  const wcStatus = wordCount >= 190 && wordCount <= 230 ? "ok" : wordCount > 230 ? "warn" : "neutral";

  const insertPhrase = (phrase) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const newVal = essay.slice(0, start) + phrase + " " + essay.slice(start);
    setEssay(newVal);
    setTimeout(() => { 
      ta.selectionStart = ta.selectionEnd = start + phrase.length + 1; 
      ta.focus(); 
    }, 0);
  };

  const submitEssay = useCallback(async () => {
    if (wordCount < 50) return;
    
    const prompt = isCustom ? customPrompt.trim() : PROMPTS[promptIdx].text;
    if (isCustom && !prompt) {
      alert("Please type or paste your custom prompt before submitting!");
      return;
    }

    setLoading(true);
    setFeedback(null);
    const system = `You are an expert PTE Academic writing examiner targeting band 90. Evaluate strictly: Content, Form (200-230 words ideal), Grammar, Vocabulary, Spelling, Cohesion. Respond ONLY as raw JSON (no backticks, no markdown):
{"estimated_score":<10-90>,"overall_comment":"<2 sentences>","strengths":["<s1>","<s2>","<s3>"],"issues":[{"type":"<Grammar|Vocabulary|Structure|Cohesion|Content>","original":"<exact phrase>","fix":"<corrected>","explanation":"<max 12 words>"}],"structure_check":{"intro_paraphrase":<bool>,"intro_position":<bool>,"intro_structure_signpost":<bool>,"body_topic_sentence":<bool>,"body_support":<bool>,"body_example":<bool>,"conclusion_present":<bool>},"improved_paragraph":"<rewrite weakest paragraph as model>"}`;
    
    try {
      const res = await fetch("[https://api.anthropic.com/v1/messages](https://api.anthropic.com/v1/messages)", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          model: "claude-sonnet-4-20250514", 
          max_tokens: 1000, 
          system, 
          messages: [{ role: "user", content: `Prompt: "${prompt}"\n\nEssay:\n${essay}` }] 
        }),
      });
      const data = await res.json();
      // Cleaned markdown regex syntax error artifact here
      const raw = data.content.map((i) => i.text || "").join("").replace(/```json|```/g, "").trim();
      setFeedback(JSON.parse(raw));
    } catch {
      setFeedback({ error: true });
    }
    setLoading(false);
  }, [essay, promptIdx, wordCount, isCustom, customPrompt]);

  const runBrainstorm = useCallback(async () => {
    if (!brainstormTopic.trim()) return;
    setBrainstormLoading(true);
    setBrainstormResult(null);
    const system = `You are a PTE essay brainstorming coach. Given a topic, help the student brainstorm using the 90-second method: pick 2 universal idea categories (Efficiency, Information, Mental Health, Economic, Social) and generate specific arguments for each. Respond ONLY as raw JSON (no backticks):
{"topic_paraphrase":"<one sentence rephrase of the topic>","side":"<Agree/Disagree — pick the easier side to write>","idea1":{"category":"<category name>","main_idea":"<one phrase main idea>","topic_sentence":"<full topic sentence using golden phrases>","support":"<1 sentence explanation>","example":"<1 sentence personal experience or real-world example>"},"idea2":{"category":"<category name>","main_idea":"<one phrase main idea>","topic_sentence":"<full topic sentence>","support":"<1 sentence explanation>","example":"<1 sentence example>"},"intro_draft":"<full 3-sentence introduction using the method>","vocab_tip":"<2-3 golden vocabulary words relevant to this topic>"}`;
    try {
      const res = await fetch("[https://api.anthropic.com/v1/messages](https://api.anthropic.com/v1/messages)", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, system, messages: [{ role: "user", content: `PTE essay topic: "${brainstormTopic}"` }] }),
      });
      const data = await res.json();
      const raw = data.content.map((i) => i.text || "").join("").replace(/```json|```/g, "").trim();
      setBrainstormResult(JSON.parse(raw));
    } catch {
      setBrainstormResult({ error: true });
    }
    setBrainstormLoading(false);
  }, [brainstormTopic]);

  const toggleIdeaSelect = (id) => {
    setSelectedIdeas((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]);
  };

  // Fixed ID from "vocab" to "phrases" to match the layout render condition
  const tabs = [
    { id: "brainstorm", label: "Brainstorm" },
    { id: "practice", label: "Essay practice" },
    { id: "guide", label: "Structure guide" },
    { id: "phrases", label: "Golden phrases" },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem", color: "#1a1a1a" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", fontFamily: "'Georgia', serif" }}>PTE Essay Coach</h1>
          <span style={{ fontSize: 12, background: "#1a1a1a", color: "#fff", padding: "2px 8px", borderRadius: 20, fontFamily: "monospace", letterSpacing: "0.05em" }}>TARGET 90</span>
        </div>
        <p style={{ fontSize: 13, color: "#666", marginTop: 4, fontFamily: "system-ui, sans-serif" }}>Brainstorm ideas → write a 200-word essay → get AI feedback</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: "1.5rem", borderBottom: "2px solid #1a1a1a" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "7px 16px", fontSize: 13, fontFamily: "system-ui, sans-serif", background: tab === t.id ? "#1a1a1a" : "transparent", color: tab === t.id ? "#fff" : "#666", border: "none", cursor: "pointer", fontWeight: tab === t.id ? 600 : 400, borderRadius: "6px 6px 0 0", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── BRAINSTORM TAB ─── */}
      {tab === "brainstorm" && (
        <div>
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif", marginBottom: 8, color: "#92400e" }}>⏱ The 90-second brainstorm formula</div>
            <div style={{ fontSize: 13, fontFamily: "system-ui, sans-serif", color: "#78350f", lineHeight: 1.7 }}>
              For any topic, ask 2 questions:<br />
              <strong>Q1:</strong> What does this topic benefit? → money / education / health / society<br />
              <strong>Q2:</strong> What does this topic harm? → money / education / health / society<br />
              <span style={{ marginTop: 6, display: "block" }}>Then pick <strong>2 ideas</strong> and write your entire essay around them.</span>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif", marginBottom: 10, color: "#333" }}>
            5 universal ideas — pick 2 for any essay
            <span style={{ fontWeight: 400, color: "#999", marginLeft: 8 }}>{selectedIdeas.length}/2 selected</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: "1.25rem" }}>
            {BRAINSTORM_IDEAS.map((idea) => {
              const isSelected = selectedIdeas.includes(idea.id);
              const isExpanded = expandedIdea === idea.id;
              return (
                <div key={idea.id} style={{ border: `2px solid ${isSelected ? idea.color : "#e5e7eb"}`, borderRadius: 10, background: isSelected ? idea.bg : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
                  <div onClick={() => toggleIdeaSelect(idea.id)} style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{idea.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "system-ui, sans-serif", color: isSelected ? idea.color : "#333" }}>{idea.title}</div>
                      <div style={{ fontSize: 11, color: "#999", fontFamily: "system-ui, sans-serif", marginTop: 1 }}>{idea.keywords.slice(0, 2).join(" · ")}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setExpandedIdea(isExpanded ? null : idea.id); }} style={{ fontSize: 11, padding: "2px 8px", border: "1px solid #e5e7eb", borderRadius: 20, background: "#f9fafb", color: "#666", cursor: "pointer", fontFamily: "system-ui, sans-serif" }}>
                      {isExpanded ? "less" : "more"}
                    </button>
                  </div>
                  {isExpanded && (
                    <div style={{ borderTop: `1px solid ${idea.color}30`, padding: "10px 12px", fontSize: 12, fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
                      <div style={{ marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, color: idea.color }}>💡 Core Logic: </span>
                        <span style={{ color: "#444" }}>{idea.desc}</span>
                      </div>
                      <div style={{ background: "#f9fafb", borderRadius: 6, padding: "6px 10px", fontStyle: "italic", color: "#555", fontSize: 12, lineHeight: 1.5 }}>
                        "{idea.sentence}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif", marginBottom: 10, color: "#333" }}>🤖 AI brainstorm generator</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input value={brainstormTopic} onChange={(e) => setBrainstormTopic(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runBrainstorm()} placeholder="Type any PTE topic..." style={{ flex: 1, padding: "8px 12px", fontSize: 13, fontFamily: "system-ui, sans-serif", border: "1px solid #d1d5db", borderRadius: 8, background: "#fff", color: "#1a1a1a" }} />
              <button onClick={runBrainstorm} disabled={brainstormLoading || !brainstormTopic.trim()} style={{ padding: "8px 18px", fontSize: 13, fontFamily: "system-ui, sans-serif", fontWeight: 600, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, cursor: brainstormLoading ? "not-allowed" : "pointer", opacity: brainstormLoading ? 0.6 : 1 }}>
                {brainstormLoading ? "..." : "Brainstorm →"}
              </button>
            </div>

            {brainstormResult && !brainstormResult.error && (
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", color: "#666" }}>Recommended side:</span>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "system-ui, sans-serif", background: "#dbeafe", color: "#1d4ed8", padding: "2px 10px", borderRadius: 20 }}>{brainstormResult.side}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  {[brainstormResult.idea1, brainstormResult.idea2].map((idea, i) => (
                    <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Body {i + 1} · {idea.category}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "system-ui, sans-serif", color: "#1a1a1a", marginBottom: 6 }}>{idea.main_idea}</div>
                      <div style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", color: "#555", lineHeight: 1.6, marginBottom: 4, fontStyle: "italic" }}>"{idea.topic_sentence}"</div>
                      <div style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", color: "#666", lineHeight: 1.5, marginBottom: 3 }}><strong>Support:</strong> {idea.support}</div>
                      <div style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", color: "#666", lineHeight: 1.5 }}><strong>Example:</strong> {idea.example}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#065f46", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>✍ Draft introduction</div>
                  <div style={{ fontSize: 13, fontFamily: "'Georgia', serif", color: "#1a1a1a", lineHeight: 1.8, fontStyle: "italic" }}>{brainstormResult.intro_draft}</div>
                </div>
                <div style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", color: "#7c3aed", background: "#f5f3ff", padding: "6px 12px", borderRadius: 6 }}>
                  <strong>Vocab tip:</strong> {brainstormResult.vocab_tip}
                </div>
              </div>
            )}
            {brainstormResult?.error && <div style={{ fontSize: 13, color: "#ef4444", fontFamily: "system-ui, sans-serif" }}>Something went wrong. Please try again.</div>}
          </div>
        </div>
      )}

      {/* ─── PRACTICE TAB ─── */}
      {tab === "practice" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Choose a prompt</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {PROMPTS.map((p, i) => (
                <button key={i} onClick={() => { setPromptIdx(i); setIsCustom(false); setFeedback(null); }} style={{ padding: "5px 14px", fontSize: 12, fontFamily: "system-ui, sans-serif", border: `1.5px solid ${(!isCustom && promptIdx === i) ? "#1a1a1a" : "#e5e7eb"}`, borderRadius: 20, background: (!isCustom && promptIdx === i) ? "#1a1a1a" : "#fff", color: (!isCustom && promptIdx === i) ? "#fff" : "#555", cursor: "pointer", fontWeight: (!isCustom && promptIdx === i) ? 600 : 400 }}>
                  {p.label}
                </button>
              ))}
              <button onClick={() => { setIsCustom(true); setFeedback(null); }} style={{ padding: "5px 14px", fontSize: 12, fontFamily: "system-ui, sans-serif", border: `1.5px solid ${isCustom ? "#1a1a1a" : "#e5e7eb"}`, borderRadius: 20, background: isCustom ? "#1a1a1a" : "#fff", color: isCustom ? "#fff" : "#555", cursor: "pointer", fontWeight: isCustom ? 600 : 400 }}>
                ✍️ Custom / Blank Prompt
              </button>
            </div>
          </div>

          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {isCustom ? "Custom Essay Prompt Input" : "Essay prompt"}
            </div>
            {isCustom ? (
              <textarea 
                value={customPrompt} 
                onChange={(e) => setCustomPrompt(e.target.value)} 
                placeholder="Type or paste your own custom PTE essay question here..." 
                style={{ width: "100%", minHeight: "46px", padding: "10px 12px", fontSize: 13, fontFamily: "system-ui, sans-serif", border: "1px solid #cbd5e1", borderRadius: 8, background: "#fff", color: "#1a1a1a", outline: "none", boxSizing: "border-box", resize: "vertical" }}
              />
            ) : (
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>{PROMPTS[promptIdx]?.text}</div>
            )}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#999", fontFamily: "system-ui, sans-serif" }}>Quick insert:</span>
            {QUICK_PHRASES.map((ph) => (
              <button key={ph} onClick={() => insertPhrase(ph)} style={{ padding: "3px 10px", fontSize: 11, fontFamily: "system-ui, sans-serif", border: "1px solid #dbeafe", borderRadius: 20, background: "#eff6ff", color: "#1d4ed8", cursor: "pointer" }}>
                {ph.length > 25 ? ph.slice(0, 25) + "…" : ph}
              </button>
            ))}
          </div>

          <textarea ref={textareaRef} value={essay} onChange={(e) => setEssay(e.target.value)} placeholder="Write your essay here. Aim for 200–230 words.&#10;&#10;Structure: Introduction (3 sentences) → Body 1 (3–5 sentences) → Body 2 (3–5 sentences) → Conclusion (2–3 sentences)." style={{ width: "100%", minHeight: 240, padding: "14px", fontSize: 14, lineHeight: 1.8, fontFamily: "'Georgia', serif", border: "1.5px solid #d1d5db", borderRadius: 10, background: "#fff", color: "#1a1a1a", resize: "vertical", outline: "none" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <div style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", color: wcStatus === "ok" ? "#059669" : wcStatus === "warn" ? "#d97706" : "#999" }}>
              {wordCount} words {wcStatus === "ok" ? "✓ Good range" : wcStatus === "warn" ? "— slightly long" : "— aim for 200–230"}
            </div>
            <div style={{ fontSize: 11, color: "#bbb", fontFamily: "system-ui, sans-serif" }}>190–230 ideal</div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={submitEssay} disabled={loading || wordCount < 50} style={{ padding: "9px 20px", fontSize: 13, fontFamily: "system-ui, sans-serif", fontWeight: 700, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 8, cursor: loading || wordCount < 50 ? "not-allowed" : "pointer", opacity: loading || wordCount < 50 ? 0.5 : 1 }}>
              {loading ? "Analysing…" : "Get feedback →"}
            </button>
            <button onClick={() => { setEssay(SAMPLE_ESSAY); setFeedback(null); }} style={{ padding: "9px 16px", fontSize: 13, fontFamily: "system-ui, sans-serif", background: "#fff", color: "#333", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer" }}>Load sample</button>
            <button onClick={() => { setEssay(""); setFeedback(null); }} style={{ padding: "9px 16px", fontSize: 13, fontFamily: "system-ui, sans-serif", background: "#fff", color: "#999", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer" }}>Clear</button>
          </div>

          {feedback && !feedback.error && (
            <div style={{ marginTop: "1.5rem", borderTop: "2px solid #1a1a1a", paddingTop: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: "1.25rem" }}>
                <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: feedback.estimated_score >= 79 ? "#059669" : feedback.estimated_score >= 65 ? "#d97706" : "#ef4444", fontFamily: "'Georgia', serif" }}>
                  {feedback.estimated_score}
                </div>
                <div style={{ Richmond: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>Estimated band score</div>
                  <div style={{ fontSize: 13, color: "#666", fontFamily: "system-ui, sans-serif", lineHeight: 1.5, maxWidth: 420 }}>{feedback.overall_comment}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.25rem" }}>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#065f46", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Strengths</div>
                  {(feedback.strengths || []).map((s, i) => (
                    <div key={i} style={{ fontSize: 13, fontFamily: "system-ui, sans-serif", color: "#1a1a1a", marginBottom: 6, display: "flex", gap: 6 }}>
                      <span style={{ color: "#10b981", flexShrink: 0 }}>✓</span>{s}
                    </div>
                  ))}
                </div>

                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#334155", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Structure checklist</div>
                  {[
                    ["intro_paraphrase", "Topic paraphrased"],
                    ["intro_position", "Position stated"],
                    ["intro_structure_signpost", "Structure signposted"],
                    ["body_topic_sentence", "Topic sentences"],
                    ["body_support", "Supporting arguments"],
                    ["body_example", "Example/experience"],
                    ["conclusion_present", "Conclusion present"],
                  ].map(([key, label]) => (
                    <div key={key} style={{ fontSize: 12, fontFamily: "system-ui, sans-serif", display: "flex", gap: 6, alignItems: "center", marginBottom: 4, color: feedback.structure_check?.[key] ? "#059669" : "#ef4444" }}>
                      {feedback.structure_check?.[key] ? "✓" : "✗"} <span style={{ color: "#1a1a1a" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {feedback.issues?.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Corrections ({Math.min(feedback.issues.length, 5)})</div>
                  {feedback.issues.slice(0, 5).map((issue, i) => (
                    <div key={i} style={{ background: "#fff", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 14px", marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#c2410c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{issue.type}</div>
                      <div style={{ fontSize: 13, textDecoration: "line-through", color: "#9ca3af", fontFamily: "'Georgia', serif", marginBottom: 3 }}>{issue.original}</div>
                      <div style={{ fontSize: 13, color: "#059669", fontFamily: "'Georgia', serif", marginBottom: 4 }}>→ {issue.fix}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "system-ui, sans-serif" }}>{issue.explanation}</div>
                    </div>
                  ))}
                </div>
              )}

              {feedback.improved_paragraph && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Model rewrite — weakest section</div>
                  <div style={{ borderLeft: "3px solid #6366f1", paddingLeft: 14, fontSize: 14, fontFamily: "'Georgia', serif", lineHeight: 1.8, color: "#1a1a1a", fontStyle: "italic" }}>{feedback.improved_paragraph}</div>
                </div>
              )}

              <button onClick={() => { setEssay(""); setFeedback(null); }} style={{ padding: "8px 18px", fontSize: 13, fontFamily: "system-ui, sans-serif", background: "#fff", color: "#333", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer" }}>Try again</button>
            </div>
          )}
        </div>
      )}

      {/* ─── STRUCTURE GUIDE TAB ─── */}
      {tab === "guide" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {STRUCTURE_STEPS.map((section, idx) => (
              <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ backgroundColor: section.color, color: "#fff", padding: "10px 14px", fontSize: 13, fontWeight: 700, fontFamily: "system-ui, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {section.part} Section Structure
                </div>
                <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12, background: "#fff" }}>
                  {section.steps.map((step, sIdx) => (
                    <div key={sIdx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "system-ui, sans-serif", color: section.color, background: `${section.color}15`, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap", marginTop: 2 }}>
                        {step.label}
                      </span>
                      <p style={{ fontSize: 13, color: "#333", margin: 0, lineHeight: 1.6, fontFamily: "system-ui, sans-serif" }}>
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: "1.5rem" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, fontFamily: "system-ui, sans-serif" }}>🎯 Target 90 Essay Support Templates</h3>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 14, fontFamily: "system-ui, sans-serif" }}>برای هر ایده در بدنه انشا باید با یکی از این ۳ روش ساختار حمایتی (Support) بنویسید:</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {SUPPORT_TEMPLATES.map((item, index) => (
                <div key={index} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", fontFamily: "system-ui, sans-serif" }}>{index + 1}. {item.type}</span>
                    <span style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic", direction: "rtl", fontFamily: "system-ui, sans-serif" }}>{item.tip}</span>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: 6, fontSize: 12, fontFamily: "monospace", color: "#1e1b4b", borderLeft: "3px solid #6366f1", marginBottom: 8, overflowX: "auto" }}>
                    <strong>Template:</strong> {item.template}
                  </div>
                  <div style={{ fontSize: 13, fontFamily: "'Georgia', serif", color: "#374151", lineHeight: 1.6, paddingLeft: 4 }}>
                    <strong>Example:</strong> "{item.example}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fdf2f8", border: "1px solid #fbcfe8", borderRadius: 10, padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#9d174d", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>⚡ بهترین تمرین روزانه برای نمره 90 (Daily Support Drill)</div>
            <p style={{ fontSize: 13, color: "#831843", lineHeight: 1.7, margin: 0, fontFamily: "system-ui, sans-serif" }}>
              به جای نوشتن دائم کل Essay، روزانه یک موضوع انتخاب کن و برای ایده انتخابی خود، هر ۳ مدل ساپورت بالا را بنویس تا ذهنت سریعاً قالب‌ها را بازیابی کند.
            </p>
            <div style={{ marginTop: 10, background: "#fff", padding: "10px 12px", borderRadius: 8, border: "1px solid #f9a8d4", fontSize: 12, color: "#4c0519" }}>
              <strong>نمونه تمرین ذهنی:</strong> Topic: <u>AI in education</u> → Idea: <u>Information Access</u><br />
              • <strong>Example:</strong> A clear example can be seen in ChatGPT, which provides students with immediate access to educational information...<br />
              • <strong>Research:</strong> Numerous studies conducted by leading universities have shown that digital learning platforms improve students' academic performance...<br />
              • <strong>Personal Exp:</strong> This notion is reflected in my own experience, as AI tools helped me generate ideas for my assignments more efficiently...
            </div>
          </div>
        </div>
      )}

      {/* ─── GOLDEN PHRASES TAB ─── */}
      {tab === "phrases" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#6b21a8", marginBottom: 4, fontFamily: "system-ui, sans-serif" }}>🔑 10 Super Categories Cheat Sheet</div>
            <p style={{ fontSize: 12, color: "#581c87", margin: 0, direction: "rtl", lineHeight: 1.6, fontFamily: "system-ui, sans-serif" }}>
              با حفظ کردن واژگان پیونددهنده این ۱۰ سوپرکتگوری، می‌توانید بدون نیاز به یادگیری کلمات تخصصی فرعی، بیش از ۹۰ درصد موضوعات رایتینگ آزمون PTE را مستقیماً پوشش دهید.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "system-ui, sans-serif" }}>
              Select Super Category:
            </label>
            <select 
              value={activeCatId} 
              onChange={(e) => setActiveCatId(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, fontFamily: "system-ui, sans-serif", border: "1.5px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#1a1a1a", outline: "none", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
            >
              {SUPER_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          {currentCategory && (
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ background: "#1a1a1a", color: "#fff", padding: "12px 16px", fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif" }}>
                {currentCategory.title} Elements
              </div>

              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>
                    🎯 Suitable for Prompts Covering (کاربرد در موضوعات):
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {currentCategory.topics?.map((t, idx) => (
                      <span key={idx} style={{ background: "#f1f5f9", color: "#334155", fontSize: 12, padding: "4px 10px", borderRadius: 6, fontWeight: 500, fontFamily: "system-ui, sans-serif" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {currentCategory.isUniversal ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#db2777", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #fbcfe8", paddingBottom: 4, fontFamily: "system-ui, sans-serif" }}>
                      💎 High-Scoring Academic Structures (ساختارهای عمومی نمره‌آور):
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {currentCategory.subGroups?.map((group, gIdx) => (
                        <div key={gIdx} style={{ background: "#fff5f7", border: "1px solid #fce7f3", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#be185d", marginBottom: 6, fontFamily: "system-ui, sans-serif", borderBottom: "1px dashed #fbcfe8", paddingBottom: 2 }}>
                            📂 {group.name} Variations
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {group.items?.map((phrase, pIdx) => (
                              <span 
                                key={pIdx} 
                                onClick={() => { navigator.clipboard.writeText(phrase); alert(`Copied: "${phrase}"`); }}
                                style={{ background: "#fff", border: "1px solid #fbcfe8", color: "#2e1065", fontSize: 13, padding: "4px 8px", borderRadius: 4, fontFamily: "monospace", cursor: "pointer", display: "inline-block" }}
                              >
                                {phrase}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>
                      💡 Must-Know Collocations (ترکیب‌های ضروری نمره ۹۰):
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                      {currentCategory.phrases?.map((phrase, pIdx) => (
                        <div 
                          key={pIdx} 
                          onClick={() => { navigator.clipboard.writeText(phrase); alert(`Copied: "${phrase}"`); }}
                          style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "monospace", color: "#0f172a", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                          <span>{phrase}</span>
                          <span style={{ fontSize: 10, color: "#94a3b8", fontFamily: "system-ui, sans-serif" }}>📋 copy</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}