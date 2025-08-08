import { supabase } from "@/integrations/supabase/client";

/**
 * Seeds the database with demo practice problems.
 * Run this function once to populate your database for the demo.
 */
export async function seedDemoData() {
  try {
    // 1. Create the first practice content with no passage
    const { data: practiceContent1, error: pcError1 } = await supabase
      .from("practice_content")
      .insert([
        {
          title: "Reading Comprehension Practice",
          description: "Practice your reading comprehension skills with this set of questions.",
          difficulty: "medium",
          time_estimate: "20",
          question_type: "multiple-choice",
          document_id: null,
        },
      ])
      .select()
      .single();

    if (pcError1) throw pcError1;

    // Add questions for the first practice content
    const { error: qError1 } = await supabase.from("questions").insert([
      {
        practice_content_id: practiceContent1.id,
        question_text: "What was unusual about the night sky Maria saw?",
        question_type: "multiple-choice",
        options: [
          "She could see stars despite city lights",
          "It was stormy",
          "It was midday",
          "Stars were red",
        ],
        correct_answer: "She could see stars despite city lights",
      },
      {
        practice_content_id: practiceContent1.id,
        question_text: "Why did Maria turn on her battery-powered radio?",
        question_type: "short-answer",
        options: null,
        correct_answer: "To check for news about the power outage",
      },
      {
        practice_content_id: practiceContent1.id,
        question_text:
          "Explain how the author builds suspense in the passage. Provide at least two examples from the text.",
        question_type: "paragraph",
        options: null,
        correct_answer: null,
      },
      {
        practice_content_id: practiceContent1.id,
        question_text:
          "Match each detail with its corresponding element from the story:",
        question_type: "matching",
        options: [
          { left: "Pulsating glow", right: "The craft's exterior light" },
          { left: "Soft humming sound", right: "The musical note–like tone" },
          { left: "Warm golden light", right: "Interior of the craft" },
          { left: "Sequential colored lights", right: "Perimeter indicators" },
        ],
        correct_answer: null,
      },
    ]);

    if (qError1) throw qError1;

    // 2. Create a second practice content 
    const { data: practiceContent2, error: pcError2 } = await supabase
      .from("practice_content")
      .insert([
        {
          title: "Critical Thinking Practice",
          description: "Enhance your critical thinking abilities with these challenging questions.",
          difficulty: "hard",
          time_estimate: "30",
          question_type: "multiple-choice",
          document_id: null,
        },
      ])
      .select()
      .single();

    if (pcError2) throw pcError2;

    // Add questions for the second practice content
    const { error: qError2 } = await supabase.from("questions").insert([
      {
        practice_content_id: practiceContent2.id,
        question_text: "What is the main theme of the passage?",
        question_type: "multiple-choice",
        options: [
          "Exploration of the unknown",
          "Fear of the supernatural",
          "Impact of technology on society",
          "Environmental awareness"
        ],
        correct_answer: "Exploration of the unknown",
      },
      {
        practice_content_id: practiceContent2.id,
        question_text: "How does the protagonist's perspective change throughout the story?",
        question_type: "paragraph",
        options: null,
        correct_answer: null,
      },
    ]);

    if (qError2) throw qError2;

    // 3. Create a third practice content
    const { data: practiceContent3, error: pcError3 } = await supabase
      .from("practice_content")
      .insert([
        {
          title: "Writing Skills Assessment",
          description: "Practice your writing skills by responding to various prompts.",
          difficulty: "easy",
          time_estimate: "25",
          question_type: "paragraph",
          document_id: null,
        },
      ])
      .select()
      .single();

    if (pcError3) throw pcError3;

    // Add questions for the third practice content
    const { error: qError3 } = await supabase.from("questions").insert([
      {
        practice_content_id: practiceContent3.id,
        question_text: "Write a short paragraph describing your ideal learning environment.",
        question_type: "paragraph",
        options: null,
        correct_answer: null,
      },
      {
        practice_content_id: practiceContent3.id,
        question_text: "What makes effective communication important?",
        question_type: "short-answer",
        options: null,
        correct_answer: "Effective communication ensures clarity, understanding, and proper exchange of ideas.",
      },
    ]);

    if (qError3) throw qError3;

    console.log("Demo data seeded successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error seeding demo data:", error);
    return { success: false, error };
  }
} 