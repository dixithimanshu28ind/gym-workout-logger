import type { ProgramDetail } from "@/lib/types";

const GENERAL_WARMUP_BULLETS = [
  "Arm Circles — 10 forward + 10 backward",
  "Shoulder Rotations — 10 each direction",
  "Bodyweight Squats — 10–15",
  "1–2 light warm-up sets of the first exercise",
];

const STANDARD_COOLDOWN = {
  title: "Cool-Down",
  intro: "After every workout:",
  note: "5–10 minutes of easy treadmill walking or stationary cycling. This should feel comfortable. It isn't another cardio workout.",
};

const STANDARD_SAFETY_NOTE = {
  title: "Final Progression & Safety Note",
  bullets: [
    "Listen to your body. You don't need to increase weight every workout.",
    "If your current weight is still challenging, stay with it and work on better repetitions, control and technique first. Increase the weight slightly when you can comfortably reach the top of the recommended rep range with good form.",
    "Some days you'll feel stronger than others. Push yourself when you feel ready, but don't force progression simply because the program says you should.",
    "Normal muscular effort and fatigue are expected. Pain is different — don't push through pain.",
  ],
};

const PROGRAM_DETAILS: Record<string, ProgramDetail> = {
  "bro-split": {
    id: "bro-split",
    whatIsIt: [
      "A Bro Split is a workout routine where each training day focuses mainly on one body part. This gives you plenty of time to train that area before moving to another muscle group the following day.",
    ],
    warmUp: {
      title: "General Warm-Up",
      intro: "Start with 5 minutes easy treadmill walking or cycling, followed by:",
      bullets: GENERAL_WARMUP_BULLETS,
      note: "For Leg Day: Replace the arm/shoulder movements with Bodyweight Squats × 10–15, Walking Lunges × 8–10/leg, Leg Swings × 10/leg and Hip Circles × 10/direction. Then perform 1–2 light warm-up sets of Barbell Squats.",
    },
    weekBlocks: [
      {
        kind: "training",
        id: "weeks-1-5",
        title: "Weeks 1–5 — Foundation",
        days: [
          {
            day: 1,
            title: "Day 1 — Chest + Core",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Bench Press", target: "Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell Bench Press" },
                  { exercise: "Incline Dumbbell Press", target: "Upper Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Incline Barbell Press" },
                  { exercise: "Chest Press Machine", target: "Chest", setsReps: "3 × 10–12", rest: "90 sec", alternative: "Dumbbell Bench Press" },
                  { exercise: "Pec Deck Fly", target: "Chest", setsReps: "3 × 12–15", rest: "60–90 sec", alternative: "Dumbbell Fly" },
                  { exercise: "Cable Fly", target: "Chest", setsReps: "2 × 12–15", rest: "60 sec", alternative: "Dumbbell Fly" },
                  { exercise: "Cable Crunch", target: "Abs", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Crunch" },
                  { exercise: "Plank", target: "Core", setsReps: "3 × 30–60 sec", rest: "60 sec", alternative: "—" },
                ],
              },
            ],
            progressionNote: "When you can reach the top of the rep range on every set with good form, increase the weight slightly next time.",
          },
          {
            day: 2,
            title: "Day 2 — Back",
            groups: [
              {
                exercises: [
                  { exercise: "Lat Pulldown", target: "Lats", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Assisted Pull-Up" },
                  { exercise: "Barbell Bent-Over Row", target: "Mid Back + Lats", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell Row" },
                  { exercise: "Seated Cable Row", target: "Mid Back", setsReps: "3 × 10–12", rest: "90 sec", alternative: "Chest-Supported DB Row" },
                  { exercise: "One-Arm Dumbbell Row", target: "Lats + Mid Back", setsReps: "3 × 10–12/side", rest: "90 sec", alternative: "Barbell Row" },
                  { exercise: "Straight-Arm Pulldown", target: "Lats", setsReps: "2 × 12–15", rest: "60 sec", alternative: "Dumbbell Pullover" },
                  { exercise: "Dumbbell Shrug", target: "Upper Traps", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Barbell Shrug" },
                ],
              },
            ],
            progressionNote: "Improve your reps first. Once you're consistently reaching the top of the range with good form, increase the weight slightly.",
          },
          {
            day: 3,
            title: "Day 3 — Shoulders + Core",
            groups: [
              {
                exercises: [
                  { exercise: "Dumbbell Shoulder Press", target: "Shoulders", setsReps: "3 × 8–12", rest: "2 min", alternative: "Barbell Overhead Press" },
                  { exercise: "Dumbbell Lateral Raise", target: "Side Shoulders", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Cable Lateral Raise" },
                  { exercise: "Machine Shoulder Press", target: "Shoulders", setsReps: "3 × 10–12", rest: "90 sec", alternative: "Dumbbell Shoulder Press" },
                  { exercise: "Reverse Pec Deck", target: "Rear Shoulders", setsReps: "3 × 12–15", rest: "60–90 sec", alternative: "Rear-Delt DB Fly" },
                  { exercise: "Dumbbell Front Raise", target: "Front Shoulders", setsReps: "2 × 12–15", rest: "60 sec", alternative: "Plate Front Raise" },
                  { exercise: "Face Pull", target: "Rear Shoulders + Upper Back", setsReps: "2 × 12–15", rest: "60 sec", alternative: "Rear-Delt DB Fly" },
                  { exercise: "Hanging Knee Raise", target: "Abs", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Lying Leg Raise" },
                  { exercise: "Side Plank", target: "Obliques + Core", setsReps: "3 × 30–45 sec/side", rest: "45 sec", alternative: "—" },
                ],
              },
            ],
            progressionNote: "Don't chase heavy weights on raises. Add controlled reps first and increase weight when those reps become comfortable.",
          },
          {
            day: 4,
            title: "Day 4 — Legs",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Back Squat", target: "Quads + Glutes", setsReps: "3 × 8–12", rest: "2–3 min", alternative: "Goblet Squat" },
                  { exercise: "Leg Press", target: "Quads + Glutes", setsReps: "3 × 10–12", rest: "2 min", alternative: "Bulgarian Split Squat" },
                  { exercise: "Romanian Deadlift", target: "Hamstrings + Glutes", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell RDL" },
                  { exercise: "Leg Extension", target: "Quads", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell Step-Up" },
                  { exercise: "Seated/Lying Leg Curl", target: "Hamstrings", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell RDL" },
                  { exercise: "Standing Calf Raise", target: "Calves", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Dumbbell Calf Raise" },
                ],
              },
            ],
            progressionNote: "Prioritize good depth, control and technique. Add weight only when you can complete your current sets confidently.",
          },
          {
            day: 5,
            title: "Day 5 — Arms",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Curl", target: "Biceps", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Dumbbell Curl" },
                  { exercise: "Incline Dumbbell Curl", target: "Biceps", setsReps: "3 × 10–12", rest: "60–90 sec", alternative: "Alternating DB Curl" },
                  { exercise: "Hammer Curl", target: "Biceps + Forearms", setsReps: "3 × 10–12", rest: "60–90 sec", alternative: "Cross-Body Hammer Curl" },
                  { exercise: "Rope Triceps Pushdown", target: "Triceps", setsReps: "3 × 10–12", rest: "60–90 sec", alternative: "Dumbbell Kickback" },
                  { exercise: "Overhead Cable Extension", target: "Triceps", setsReps: "3 × 10–12", rest: "60–90 sec", alternative: "Overhead DB Extension" },
                  { exercise: "Skull Crushers", target: "Triceps", setsReps: "3 × 10–12", rest: "90 sec", alternative: "Close-Grip Bench Press" },
                ],
              },
            ],
            progressionNote: "Avoid swinging or momentum. Increase weight when you can complete the rep range with controlled movement.",
          },
        ],
      },
      {
        kind: "deload",
        id: "week-6",
        title: "Week 6 — Deload",
        body: [
          "Use the same exercises as Weeks 1–5, but:",
          "Do about half the normal number of sets.",
          "Use lighter weights.",
          "Keep every repetition comfortable.",
          "Don't train until you can barely complete another rep.",
          "Finish feeling like you could have done more.",
        ],
      },
      {
        kind: "training",
        id: "weeks-7-11",
        title: "Weeks 7–11 — Progression",
        days: [
          {
            day: 1,
            title: "Day 1 — Chest + Core",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Bench Press", target: "Chest", setsReps: "4 × 6–10", rest: "2–3 min", alternative: "Dumbbell Bench Press" },
                  { exercise: "Incline Dumbbell Press", target: "Upper Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Incline Barbell Press" },
                  { exercise: "Dumbbell Bench Press", target: "Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Chest Press Machine" },
                  { exercise: "Cable Fly", target: "Chest", setsReps: "3 × 12–15", rest: "60–90 sec", alternative: "Dumbbell Fly" },
                  { exercise: "Push-Ups", target: "Chest", setsReps: "2 × 10–20", rest: "60 sec", alternative: "Knee Push-Ups" },
                  { exercise: "Cable Crunch", target: "Abs", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Weighted Crunch" },
                  { exercise: "Hanging Knee Raise", target: "Abs", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Reverse Crunch" },
                ],
              },
            ],
            progressionNote: "Add reps before weight. Once you reach the top of the range with good form, increase the weight slightly.",
          },
          {
            day: 2,
            title: "Day 2 — Back",
            groups: [
              {
                exercises: [
                  { exercise: "Lat Pulldown", target: "Lats", setsReps: "4 × 8–12", rest: "2 min", alternative: "Pull-Up" },
                  { exercise: "Barbell Row", target: "Mid Back + Lats", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell Row" },
                  { exercise: "Chest-Supported DB Row", target: "Mid Back", setsReps: "3 × 10–12", rest: "90 sec", alternative: "Seated Cable Row" },
                  { exercise: "Close-Grip Lat Pulldown", target: "Lats", setsReps: "3 × 10–12", rest: "90 sec", alternative: "Chin-Up" },
                  { exercise: "Dumbbell Pullover", target: "Lats", setsReps: "2 × 12–15", rest: "60–90 sec", alternative: "Straight-Arm Pulldown" },
                  { exercise: "Barbell Shrug", target: "Upper Traps", setsReps: "3 × 10–15", rest: "90 sec", alternative: "Dumbbell Shrug" },
                ],
              },
            ],
            progressionNote: "Keep movements controlled. Increase resistance when your current weight becomes manageable throughout the rep range.",
          },
          {
            day: 3,
            title: "Day 3 — Shoulders + Core",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Overhead Press", target: "Shoulders", setsReps: "4 × 6–10", rest: "2–3 min", alternative: "Dumbbell Shoulder Press" },
                  { exercise: "Dumbbell Lateral Raise", target: "Side Shoulders", setsReps: "4 × 10–15", rest: "60 sec", alternative: "Cable Lateral Raise" },
                  { exercise: "Arnold Press", target: "Shoulders", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Dumbbell Shoulder Press" },
                  { exercise: "Rear-Delt DB Fly", target: "Rear Shoulders", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Reverse Pec Deck" },
                  { exercise: "Face Pull", target: "Rear Shoulders + Upper Back", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Rear-Delt DB Fly" },
                  { exercise: "Dumbbell Front Raise", target: "Front Shoulders", setsReps: "2 × 12–15", rest: "60 sec", alternative: "Plate Front Raise" },
                  { exercise: "Hanging Leg Raise", target: "Abs", setsReps: "3 × 8–12", rest: "60 sec", alternative: "Lying Leg Raise" },
                  { exercise: "Cable Wood Chop", target: "Obliques", setsReps: "3 × 10–15/side", rest: "60 sec", alternative: "Russian Twist" },
                ],
              },
            ],
            progressionNote: "Progress presses gradually. For raises and rear-shoulder exercises, prioritize controlled reps before increasing weight.",
          },
          {
            day: 4,
            title: "Day 4 — Legs",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Back Squat", target: "Quads + Glutes", setsReps: "4 × 6–10", rest: "2–3 min", alternative: "Goblet Squat" },
                  { exercise: "Leg Press", target: "Quads + Glutes", setsReps: "3 × 10–12", rest: "2 min", alternative: "Bulgarian Split Squat" },
                  { exercise: "Romanian Deadlift", target: "Hamstrings + Glutes", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell RDL" },
                  { exercise: "Walking Lunges", target: "Quads + Glutes", setsReps: "3 × 10–12/leg", rest: "90 sec", alternative: "Stationary Lunges" },
                  { exercise: "Leg Curl", target: "Hamstrings", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell RDL" },
                  { exercise: "Standing Calf Raise", target: "Calves", setsReps: "4 × 10–15", rest: "60 sec", alternative: "Dumbbell Calf Raise" },
                ],
              },
            ],
            progressionNote: "Add reps or small amounts of weight while maintaining your range of motion and technique.",
          },
          {
            day: 5,
            title: "Day 5 — Arms",
            groups: [
              {
                exercises: [
                  { exercise: "EZ-Bar Curl", target: "Biceps", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Barbell Curl" },
                  { exercise: "Preacher Curl", target: "Biceps", setsReps: "3 × 10–12", rest: "60–90 sec", alternative: "Concentration Curl" },
                  { exercise: "Hammer Curl", target: "Biceps + Forearms", setsReps: "3 × 10–12", rest: "60–90 sec", alternative: "Cross-Body Hammer Curl" },
                  { exercise: "Straight-Bar Pushdown", target: "Triceps", setsReps: "3 × 8–12", rest: "60–90 sec", alternative: "Close-Grip Bench Press" },
                  { exercise: "Overhead DB Extension", target: "Triceps", setsReps: "3 × 10–12", rest: "60–90 sec", alternative: "Cable Extension" },
                  { exercise: "Close-Grip Bench Press", target: "Triceps + Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Skull Crushers" },
                ],
              },
            ],
            progressionNote: "Increase reps first. Add a little weight when you can complete all your sets cleanly at the upper end of the range.",
          },
        ],
      },
      {
        kind: "deload",
        id: "week-12",
        title: "Week 12 — Deload & Finish",
        body: [
          "Repeat Weeks 7–11 with about half the normal sets and lighter weights. Keep everything comfortable and controlled. Don't chase personal records.",
        ],
      },
    ],
    coolDown: STANDARD_COOLDOWN,
    safetyNote: STANDARD_SAFETY_NOTE,
  },

  pplul: {
    id: "pplul",
    whatIsIt: [
      "PPLUL stands for Push, Pull, Legs, Upper, Lower.",
      "Unlike a traditional Bro Split, where a muscle is usually given one main training day per week, PPLUL allows most major muscles to be trained around twice per week.",
      "For many people, this can be a better choice than a Bro Split because the weekly work is spread across multiple sessions, giving you more frequent practice and muscle stimulation without having to do a large amount for one body part in a single workout.",
      "Neither is automatically better for everyone. A Bro Split remains a good option for people who enjoy concentrating on one muscle group at a time.",
    ],
    warmUp: {
      title: "General Warm-Up",
      intro: "Start with 5 minutes easy treadmill walking or cycling, followed by:",
      bullets: GENERAL_WARMUP_BULLETS,
      note: "For Leg/Lower Days: Replace the arm/shoulder movements with Bodyweight Squats × 10–15, Walking Lunges × 8–10/leg, Leg Swings × 10/leg and Hip Circles × 10/direction. Then perform 1–2 light warm-up sets of Barbell Squats.",
    },
    weekBlocks: [
      {
        kind: "training",
        id: "weeks-1-5",
        title: "Weeks 1–5 — Foundation",
        days: [
          {
            day: 1,
            title: "Day 1 — Push + Core",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Bench Press", target: "Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell Bench Press" },
                  { exercise: "Incline Dumbbell Press", target: "Upper Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Incline Barbell Press" },
                  { exercise: "Dumbbell Shoulder Press", target: "Shoulders", setsReps: "3 × 8–12", rest: "2 min", alternative: "Barbell Overhead Press" },
                  { exercise: "Dumbbell Lateral Raise", target: "Side Shoulders", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Cable Lateral Raise" },
                  { exercise: "Rope Triceps Pushdown", target: "Triceps", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell Kickback" },
                  { exercise: "Overhead Cable Extension", target: "Triceps", setsReps: "2 × 10–15", rest: "60–90 sec", alternative: "Overhead DB Extension" },
                  { exercise: "Cable Crunch", target: "Abs", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Crunch" },
                  { exercise: "Plank", target: "Core", setsReps: "3 × 30–60 sec", rest: "60 sec", alternative: "—" },
                ],
              },
            ],
            progressionNote: "Add reps gradually. Once you reach the top of the range with good form, increase the weight slightly.",
          },
          {
            day: 2,
            title: "Day 2 — Pull",
            groups: [
              {
                exercises: [
                  { exercise: "Lat Pulldown", target: "Lats", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Assisted Pull-Up" },
                  { exercise: "Barbell Bent-Over Row", target: "Mid Back + Lats", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell Row" },
                  { exercise: "Seated Cable Row", target: "Mid Back", setsReps: "3 × 10–12", rest: "90 sec", alternative: "Chest-Supported DB Row" },
                  { exercise: "Face Pull", target: "Rear Shoulders + Upper Back", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Rear-Delt DB Fly" },
                  { exercise: "Barbell Curl", target: "Biceps", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Dumbbell Curl" },
                  { exercise: "Hammer Curl", target: "Biceps + Forearms", setsReps: "2 × 10–15", rest: "60–90 sec", alternative: "Cross-Body Hammer Curl" },
                ],
              },
            ],
            progressionNote: "Improve your reps and control before increasing weight. Avoid using momentum just to lift heavier.",
          },
          {
            day: 3,
            title: "Day 3 — Legs",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Back Squat", target: "Quads + Glutes", setsReps: "3 × 8–12", rest: "2–3 min", alternative: "Goblet Squat" },
                  { exercise: "Leg Press", target: "Quads + Glutes", setsReps: "3 × 10–12", rest: "2 min", alternative: "Bulgarian Split Squat" },
                  { exercise: "Romanian Deadlift", target: "Hamstrings + Glutes", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell RDL" },
                  { exercise: "Leg Extension", target: "Quads", setsReps: "2 × 12–15", rest: "60–90 sec", alternative: "Dumbbell Step-Up" },
                  { exercise: "Leg Curl", target: "Hamstrings", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell RDL" },
                  { exercise: "Standing Calf Raise", target: "Calves", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Dumbbell Calf Raise" },
                ],
              },
            ],
            progressionNote: "Build reps and weight gradually while keeping your movements controlled.",
          },
          {
            day: 4,
            title: "Day 4 — Upper",
            groups: [
              {
                exercises: [
                  { exercise: "Incline Barbell Press", target: "Upper Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Incline DB Press" },
                  { exercise: "One-Arm Dumbbell Row", target: "Lats + Mid Back", setsReps: "3 × 8–12/side", rest: "90 sec", alternative: "Barbell Row" },
                  { exercise: "Lat Pulldown", target: "Lats", setsReps: "3 × 10–12", rest: "90 sec", alternative: "Pull-Up" },
                  { exercise: "Dumbbell Lateral Raise", target: "Side Shoulders", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Cable Lateral Raise" },
                  { exercise: "Dumbbell Curl", target: "Biceps", setsReps: "2 × 10–12", rest: "60–90 sec", alternative: "EZ-Bar Curl" },
                  { exercise: "Skull Crushers", target: "Triceps", setsReps: "2 × 10–12", rest: "60–90 sec", alternative: "Overhead DB Extension" },
                ],
              },
            ],
            progressionNote: "These muscles have already worked earlier in the week. Focus on quality reps rather than trying to beat every previous workout.",
          },
          {
            day: 5,
            title: "Day 5 — Lower + Core",
            groups: [
              {
                exercises: [
                  { exercise: "Goblet Squat", target: "Quads + Glutes", setsReps: "3 × 10–12", rest: "2 min", alternative: "Barbell Front Squat" },
                  { exercise: "Dumbbell RDL", target: "Hamstrings + Glutes", setsReps: "3 × 10–12", rest: "2 min", alternative: "Barbell RDL" },
                  { exercise: "Walking Lunges", target: "Quads + Glutes", setsReps: "3 × 10/leg", rest: "90 sec", alternative: "Stationary Lunges" },
                  { exercise: "Hip Thrust Machine", target: "Glutes", setsReps: "3 × 10–15", rest: "90 sec", alternative: "Barbell Hip Thrust" },
                  { exercise: "Seated Calf Raise", target: "Calves", setsReps: "3 × 12–15", rest: "60 sec", alternative: "DB Calf Raise" },
                  { exercise: "Hanging Knee Raise", target: "Abs", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Lying Leg Raise" },
                  { exercise: "Side Plank", target: "Obliques + Core", setsReps: "3 × 30–45 sec/side", rest: "45–60 sec", alternative: "—" },
                ],
              },
            ],
            progressionNote: "Increase reps first. Add weight gradually when you can complete your current workload confidently.",
          },
        ],
      },
      {
        kind: "deload",
        id: "week-6",
        title: "Week 6 — Deload",
        body: [
          "Follow the same exercises but:",
          "Do about half your normal sets.",
          "Use lighter weights.",
          "Keep every repetition comfortable.",
          "Don't train until you can barely perform another rep.",
          "Finish feeling like you could have done more.",
        ],
      },
      {
        kind: "training",
        id: "weeks-7-11",
        title: "Weeks 7–11 — Progression",
        days: [
          {
            day: 1,
            title: "Day 1 — Push + Core",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Bench Press", target: "Chest", setsReps: "4 × 6–10", rest: "2–3 min", alternative: "Dumbbell Bench Press" },
                  { exercise: "Incline Dumbbell Press", target: "Upper Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Incline Barbell Press" },
                  { exercise: "Barbell Overhead Press", target: "Shoulders", setsReps: "3 × 6–10", rest: "2 min", alternative: "Dumbbell Shoulder Press" },
                  { exercise: "Dumbbell Lateral Raise", target: "Side Shoulders", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Cable Lateral Raise" },
                  { exercise: "Rope Triceps Pushdown", target: "Triceps", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell Kickback" },
                  { exercise: "Overhead DB Extension", target: "Triceps", setsReps: "2 × 10–15", rest: "60–90 sec", alternative: "Cable Extension" },
                  { exercise: "Cable Crunch", target: "Abs", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Weighted Crunch" },
                  { exercise: "Plank", target: "Core", setsReps: "3 × 45–60 sec", rest: "60 sec", alternative: "—" },
                ],
              },
            ],
            progressionNote: "Try to add reps before weight. Once you reach the top of the range with good form, increase weight slightly.",
          },
          {
            day: 2,
            title: "Day 2 — Pull",
            groups: [
              {
                exercises: [
                  { exercise: "Pull-Up / Lat Pulldown", target: "Lats", setsReps: "4 × 6–10", rest: "2 min", alternative: "Lat Pulldown" },
                  { exercise: "Barbell Row", target: "Mid Back + Lats", setsReps: "4 × 6–10", rest: "2 min", alternative: "Dumbbell Row" },
                  { exercise: "Chest-Supported DB Row", target: "Mid Back", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Seated Cable Row" },
                  { exercise: "Reverse Pec Deck", target: "Rear Shoulders", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Rear-Delt DB Fly" },
                  { exercise: "EZ-Bar Curl", target: "Biceps", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Barbell Curl" },
                  { exercise: "Incline Dumbbell Curl", target: "Biceps", setsReps: "2 × 10–15", rest: "60–90 sec", alternative: "Dumbbell Curl" },
                ],
              },
            ],
            progressionNote: "Increase resistance when you're consistently completing the target reps without losing form.",
          },
          {
            day: 3,
            title: "Day 3 — Legs",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Back Squat", target: "Quads + Glutes", setsReps: "4 × 6–10", rest: "2–3 min", alternative: "Goblet Squat" },
                  { exercise: "Leg Press", target: "Quads + Glutes", setsReps: "3 × 8–12", rest: "2 min", alternative: "Bulgarian Split Squat" },
                  { exercise: "Romanian Deadlift", target: "Hamstrings + Glutes", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell RDL" },
                  { exercise: "Walking Lunges", target: "Quads + Glutes", setsReps: "2 × 10–12/leg", rest: "90 sec", alternative: "Stationary Lunges" },
                  { exercise: "Leg Curl", target: "Hamstrings", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell RDL" },
                  { exercise: "Standing Calf Raise", target: "Calves", setsReps: "4 × 10–15", rest: "60 sec", alternative: "Dumbbell Calf Raise" },
                ],
              },
            ],
            progressionNote: "Add reps or small amounts of weight while maintaining good range of motion and technique.",
          },
          {
            day: 4,
            title: "Day 4 — Upper",
            groups: [
              {
                exercises: [
                  { exercise: "Incline Barbell Press", target: "Upper Chest", setsReps: "3 × 6–10", rest: "2 min", alternative: "Incline DB Press" },
                  { exercise: "One-Arm Dumbbell Row", target: "Lats + Mid Back", setsReps: "3 × 8–12/side", rest: "90 sec", alternative: "Barbell Row" },
                  { exercise: "Neutral-Grip Lat Pulldown", target: "Lats", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Chin-Up" },
                  { exercise: "Dumbbell Shoulder Press", target: "Shoulders", setsReps: "2 × 8–12", rest: "90 sec", alternative: "Barbell OHP" },
                  { exercise: "Dumbbell Lateral Raise", target: "Side Shoulders", setsReps: "2 × 12–15", rest: "60 sec", alternative: "Cable Lateral Raise" },
                  { exercise: "Hammer Curl", target: "Biceps + Forearms", setsReps: "2 × 10–15", rest: "60 sec", alternative: "Cross-Body Hammer Curl" },
                  { exercise: "Skull Crushers", target: "Triceps", setsReps: "2 × 10–15", rest: "60–90 sec", alternative: "Overhead DB Extension" },
                ],
              },
            ],
            progressionNote: "Aim for small improvements. An extra controlled rep is progress—you don't always need more weight.",
          },
          {
            day: 5,
            title: "Day 5 — Lower + Core",
            groups: [
              {
                exercises: [
                  { exercise: "Bulgarian Split Squat", target: "Quads + Glutes", setsReps: "3 × 8–12/leg", rest: "2 min", alternative: "Dumbbell Lunges" },
                  { exercise: "Dumbbell RDL", target: "Hamstrings + Glutes", setsReps: "3 × 8–12", rest: "2 min", alternative: "Barbell RDL" },
                  { exercise: "Dumbbell Step-Up", target: "Quads + Glutes", setsReps: "3 × 10/leg", rest: "90 sec", alternative: "Walking Lunges" },
                  { exercise: "Hip Thrust Machine", target: "Glutes", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Barbell Hip Thrust" },
                  { exercise: "Seated Calf Raise", target: "Calves", setsReps: "3 × 12–15", rest: "60 sec", alternative: "DB Calf Raise" },
                  { exercise: "Hanging Leg Raise", target: "Abs", setsReps: "3 × 8–12", rest: "60 sec", alternative: "Lying Leg Raise" },
                  { exercise: "Cable Wood Chop", target: "Obliques", setsReps: "3 × 10–15/side", rest: "60 sec", alternative: "Russian Twist" },
                ],
              },
            ],
            progressionNote: "Increase reps first and then weight. If your legs are still heavily fatigued from earlier sessions, don't force progression.",
          },
        ],
      },
      {
        kind: "deload",
        id: "week-12",
        title: "Week 12 — Deload & Finish",
        body: [
          "Repeat the Weeks 7–11 exercises, but:",
          "Reduce sets by about half.",
          "Use lighter weights.",
          "Keep repetitions comfortable and controlled.",
          "Don't chase personal records.",
          "Finish each session feeling like you could have done more.",
        ],
      },
    ],
    coolDown: STANDARD_COOLDOWN,
    safetyNote: STANDARD_SAFETY_NOTE,
  },

  "full-body": {
    id: "full-body",
    whatIsIt: [
      "This program combines two Full Body workouts, two smaller-muscle-focused workouts and one HIIT session each week.",
      "The two Full Body days train all major muscle groups — chest, back, shoulders, legs and arms — twice per week. Separate sessions give additional attention to areas that can sometimes receive less direct work, particularly core, forearms and calves.",
      "The HIIT day adds cardiovascular fitness and conditioning without turning every gym session into a long workout.",
    ],
    warmUp: {
      title: "Before Full Body Workouts",
      intro: "Start with:",
      bullets: [
        "Easy treadmill walking or cycling — 5 minutes",
        "Arm Circles — 10 forward + 10 backward",
        "Shoulder Rotations — 10 each direction",
        "Bodyweight Squats — 10–15 reps",
        "1–2 light warm-up sets of the first main exercise",
      ],
      note: "The goal is simply to get your body moving and ready for training.",
    },
    weekBlocks: [
      {
        kind: "training",
        id: "weeks-1-5",
        title: "Weeks 1–5 — Foundation",
        intro:
          "The first five weeks are about learning the movements, finding suitable weights and gradually improving your repetitions and technique.",
        days: [
          {
            day: 1,
            title: "Day 1 — Full Body A",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Back Squat", target: "Quads + Glutes", setsReps: "3 × 8–12", rest: "2–3 min", alternative: "Goblet Squat" },
                  { exercise: "Barbell Bench Press", target: "Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell Bench Press" },
                  { exercise: "Lat Pulldown", target: "Lats", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Assisted Pull-Up" },
                  { exercise: "Romanian Deadlift", target: "Hamstrings + Glutes", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell RDL" },
                  { exercise: "Dumbbell Shoulder Press", target: "Shoulders", setsReps: "2 × 8–12", rest: "90 sec", alternative: "Machine Shoulder Press" },
                  { exercise: "Barbell Curl", target: "Biceps", setsReps: "2 × 10–12", rest: "60–90 sec", alternative: "Dumbbell Curl" },
                  { exercise: "Rope Triceps Pushdown", target: "Triceps", setsReps: "2 × 10–12", rest: "60–90 sec", alternative: "Dumbbell Kickback" },
                ],
              },
            ],
            progressionNote: "First try to improve your reps. When you can comfortably reach the top of the recommended range with good form, increase the weight slightly.",
          },
          {
            day: 2,
            title: "Day 2 — Core + Forearms",
            note: "This is deliberately a shorter workout. You don't need to fill an hour simply because you're at the gym.",
            groups: [
              {
                exercises: [
                  { exercise: "Cable Crunch", target: "Abs", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Floor Crunch" },
                  { exercise: "Hanging Knee Raise", target: "Abs", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Lying Leg Raise" },
                  { exercise: "Plank", target: "Core", setsReps: "3 × 30–60 sec", rest: "60 sec", alternative: "—" },
                  { exercise: "Cable Wood Chop", target: "Obliques", setsReps: "3 × 10–15/side", rest: "60 sec", alternative: "Russian Twist" },
                  { exercise: "Dumbbell Wrist Curl", target: "Forearms", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Barbell Wrist Curl" },
                  { exercise: "Reverse Wrist Curl", target: "Forearms", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Reverse Barbell Wrist Curl" },
                  { exercise: "Farmer's Carry", target: "Forearms + Grip", setsReps: "3 × 30–45 sec", rest: "60–90 sec", alternative: "Heavy DB Hold" },
                ],
              },
            ],
            progressionNote: "For core exercises, improve control and repetitions before adding resistance. For forearms, increase weight gradually without shortening the movement.",
          },
          {
            day: 3,
            title: "Day 3 — Full Body B",
            note: "Full Body B trains the same major muscle groups again, but uses different exercises and angles.",
            groups: [
              {
                exercises: [
                  { exercise: "Leg Press", target: "Quads + Glutes", setsReps: "3 × 10–12", rest: "2 min", alternative: "Dumbbell Lunges" },
                  { exercise: "Incline Dumbbell Press", target: "Upper Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Incline Barbell Press" },
                  { exercise: "Seated Cable Row", target: "Mid Back", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Chest-Supported DB Row" },
                  { exercise: "Leg Curl", target: "Hamstrings", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell RDL" },
                  { exercise: "Dumbbell Lateral Raise", target: "Side Shoulders", setsReps: "2 × 12–15", rest: "60 sec", alternative: "Cable Lateral Raise" },
                  { exercise: "Hammer Curl", target: "Biceps + Forearms", setsReps: "2 × 10–12", rest: "60–90 sec", alternative: "Cross-Body Hammer Curl" },
                  { exercise: "Overhead DB Triceps Extension", target: "Triceps", setsReps: "2 × 10–12", rest: "60–90 sec", alternative: "Cable Overhead Extension" },
                ],
              },
            ],
            progressionNote: "Aim for small improvements in reps or weight while maintaining good technique. You don't need to increase everything every week.",
          },
          {
            day: 4,
            title: "Day 4 — Calves + Core + Forearms",
            note: "Another smaller-body-part-focused session.",
            groups: [
              {
                heading: "Calves",
                exercises: [
                  { exercise: "Standing Calf Raise", target: "Calves", setsReps: "4 × 10–15", rest: "60 sec", alternative: "Dumbbell Calf Raise" },
                  { exercise: "Seated Calf Raise", target: "Calves", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Seated DB Calf Raise" },
                  { exercise: "Single-Leg Calf Raise", target: "Calves", setsReps: "2 × 12–15/leg", rest: "60 sec", alternative: "Standing Calf Raise" },
                ],
              },
              {
                heading: "Core",
                exercises: [
                  { exercise: "Reverse Crunch", target: "Abs", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Lying Leg Raise" },
                  { exercise: "Side Plank", target: "Obliques + Core", setsReps: "3 × 30–45 sec/side", rest: "45–60 sec", alternative: "Dead Bug" },
                  { exercise: "Dead Bug", target: "Core", setsReps: "3 × 10–12/side", rest: "45–60 sec", alternative: "Plank" },
                ],
              },
              {
                heading: "Forearms",
                exercises: [
                  { exercise: "Reverse Curl", target: "Forearms + Biceps", setsReps: "3 × 10–12", rest: "60 sec", alternative: "Dumbbell Reverse Curl" },
                  { exercise: "Dumbbell Wrist Curl", target: "Forearms", setsReps: "2 × 12–15", rest: "60 sec", alternative: "Barbell Wrist Curl" },
                  { exercise: "Heavy Dumbbell Hold", target: "Grip + Forearms", setsReps: "3 × 30–45 sec", rest: "60 sec", alternative: "Farmer's Carry" },
                ],
              },
            ],
            progressionNote: "Smaller muscles don't require huge weights. Increase repetitions and control first. Add resistance gradually when the current workload becomes comfortable.",
          },
          {
            day: 5,
            title: "Day 5 — HIIT",
            hiit: {
              intro: [
                "HIIT (High-Intensity Interval Training) alternates short periods of harder effort with easier recovery periods.",
                "You do not need to exercise at maximum effort. The harder intervals should feel challenging but still controlled.",
                "For this program, we'll use a stationary bike because it's simple, widely available and easy to adjust to your fitness level.",
              ],
              rounds: [
                { label: "Weeks 1–2", warmUp: "5–7 minutes easy cycling, gradually increasing pace", hardEffort: "30 sec", easyCycling: "90 sec", repeat: "6 rounds", note: "The hard interval should feel challenging, not completely exhausting." },
                { label: "Weeks 3–5", hardEffort: "30 sec", easyCycling: "90 sec", repeat: "8 rounds" },
              ],
              coolDown: "Finish with 5–10 minutes of easy cycling or walking.",
            },
            progressionNote: "Increase the number of rounds before trying to dramatically increase your speed or resistance.",
          },
        ],
      },
      {
        kind: "deload",
        id: "week-6",
        title: "Week 6 — Deload & Recovery",
        body: [
          "This is a recovery week, not necessarily a week away from exercise.",
          "Full Body A & B — use the same exercises from Weeks 1–5, but: reduce the number of sets by about half, use lighter weights, keep every repetition comfortable, don't train until you can barely complete another rep, and finish feeling like you could have done more.",
          "Core, Forearms & Calves — do roughly half the normal sets and keep the resistance comfortable.",
          "HIIT — don't perform hard intervals this week. Instead: 20–30 minutes of comfortable walking or cycling.",
        ],
      },
      {
        kind: "training",
        id: "weeks-7-11",
        title: "Weeks 7–11 — Progression",
        intro:
          "Some important exercises remain so you can continue measuring your progress. Other exercises change to introduce some variety and slightly different movements.",
        days: [
          {
            day: 1,
            title: "Day 1 — Full Body A",
            groups: [
              {
                exercises: [
                  { exercise: "Barbell Back Squat", target: "Quads + Glutes", setsReps: "4 × 6–10", rest: "2–3 min", alternative: "Goblet Squat" },
                  { exercise: "Barbell Bench Press", target: "Chest", setsReps: "4 × 6–10", rest: "2–3 min", alternative: "Dumbbell Bench Press" },
                  { exercise: "Close-Grip Lat Pulldown", target: "Lats", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Chin-Up" },
                  { exercise: "Romanian Deadlift", target: "Hamstrings + Glutes", setsReps: "3 × 8–12", rest: "2 min", alternative: "Dumbbell RDL" },
                  { exercise: "Arnold Press", target: "Shoulders", setsReps: "2 × 8–12", rest: "90 sec", alternative: "Dumbbell Shoulder Press" },
                  { exercise: "EZ-Bar Curl", target: "Biceps", setsReps: "2 × 8–12", rest: "60–90 sec", alternative: "Dumbbell Curl" },
                  { exercise: "Overhead Cable Extension", target: "Triceps", setsReps: "2 × 10–15", rest: "60–90 sec", alternative: "Overhead DB Extension" },
                ],
              },
            ],
            progressionNote: "Add repetitions before increasing weight. Once you're consistently reaching the top of the range with good technique, increase the weight slightly.",
          },
          {
            day: 2,
            title: "Day 2 — Core + Forearms",
            groups: [
              {
                exercises: [
                  { exercise: "Weighted Crunch", target: "Abs", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Cable Crunch" },
                  { exercise: "Hanging Leg Raise", target: "Abs", setsReps: "3 × 8–12", rest: "60 sec", alternative: "Lying Leg Raise" },
                  { exercise: "Plank", target: "Core", setsReps: "3 × 45–60 sec", rest: "60 sec", alternative: "—" },
                  { exercise: "Russian Twist", target: "Obliques", setsReps: "3 × 10–15/side", rest: "60 sec", alternative: "Cable Wood Chop" },
                  { exercise: "Reverse Curl", target: "Forearms + Biceps", setsReps: "3 × 10–12", rest: "60 sec", alternative: "DB Reverse Curl" },
                  { exercise: "Barbell Wrist Curl", target: "Forearms", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Dumbbell Wrist Curl" },
                  { exercise: "Farmer's Carry", target: "Forearms + Grip", setsReps: "3 × 40–60 sec", rest: "60–90 sec", alternative: "Heavy DB Hold" },
                ],
              },
            ],
            progressionNote: "Add resistance only when you can maintain controlled movement. For carries and holds, you can progress by increasing either the weight or time slightly.",
          },
          {
            day: 3,
            title: "Day 3 — Full Body B",
            groups: [
              {
                exercises: [
                  { exercise: "Bulgarian Split Squat", target: "Quads + Glutes", setsReps: "3 × 8–12/leg", rest: "2 min", alternative: "Leg Press" },
                  { exercise: "Incline Dumbbell Press", target: "Upper Chest", setsReps: "3 × 8–12", rest: "2 min", alternative: "Incline Barbell Press" },
                  { exercise: "Chest-Supported DB Row", target: "Mid Back", setsReps: "3 × 8–12", rest: "90 sec", alternative: "Seated Cable Row" },
                  { exercise: "Seated/Lying Leg Curl", target: "Hamstrings", setsReps: "3 × 10–15", rest: "60–90 sec", alternative: "Dumbbell RDL" },
                  { exercise: "Cable Lateral Raise", target: "Side Shoulders", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Dumbbell Lateral Raise" },
                  { exercise: "Incline Dumbbell Curl", target: "Biceps", setsReps: "2 × 10–12", rest: "60–90 sec", alternative: "Dumbbell Curl" },
                  { exercise: "Skull Crushers", target: "Triceps", setsReps: "2 × 10–12", rest: "60–90 sec", alternative: "Overhead DB Extension" },
                ],
              },
            ],
            progressionNote: "Look for small improvements. Better technique, an extra controlled repetition or a small increase in weight are all forms of progress.",
          },
          {
            day: 4,
            title: "Day 4 — Calves + Core + Forearms",
            groups: [
              {
                heading: "Calves",
                exercises: [
                  { exercise: "Standing Calf Raise", target: "Calves", setsReps: "4 × 10–15", rest: "60 sec", alternative: "Dumbbell Calf Raise" },
                  { exercise: "Seated Calf Raise", target: "Calves", setsReps: "4 × 12–15", rest: "60 sec", alternative: "Seated DB Calf Raise" },
                  { exercise: "Single-Leg Calf Raise", target: "Calves", setsReps: "2 × 12–20/leg", rest: "60 sec", alternative: "Standing Calf Raise" },
                ],
              },
              {
                heading: "Core",
                exercises: [
                  { exercise: "Cable Crunch", target: "Abs", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Weighted Crunch" },
                  { exercise: "Hanging Knee Raise", target: "Abs", setsReps: "3 × 10–15", rest: "60 sec", alternative: "Reverse Crunch" },
                  { exercise: "Cable Wood Chop", target: "Obliques", setsReps: "3 × 10–15/side", rest: "60 sec", alternative: "Russian Twist" },
                ],
              },
              {
                heading: "Forearms",
                exercises: [
                  { exercise: "Hammer Curl", target: "Biceps + Forearms", setsReps: "3 × 10–12", rest: "60 sec", alternative: "Cross-Body Hammer Curl" },
                  { exercise: "Reverse Wrist Curl", target: "Forearms", setsReps: "3 × 12–15", rest: "60 sec", alternative: "Barbell Reverse Wrist Curl" },
                  { exercise: "Plate Hold", target: "Grip + Forearms", setsReps: "3 × 30–45 sec", rest: "60 sec", alternative: "Heavy DB Hold" },
                ],
              },
            ],
            progressionNote: "Keep these movements controlled. For calves especially, use a comfortable range of motion instead of bouncing through repetitions.",
          },
          {
            day: 5,
            title: "Day 5 — HIIT Progression",
            hiit: {
              intro: ["Keep the stationary bike so you can measure improvement rather than changing the entire HIIT workout."],
              rounds: [
                { label: "Weeks 7–8", warmUp: "5–7 minute warm-up", hardEffort: "30 sec", easyCycling: "75 sec", repeat: "8 rounds" },
                {
                  label: "Weeks 9–11",
                  hardEffort: "30 sec",
                  easyCycling: "60 sec",
                  repeat: "8 rounds",
                  note: "Notice that we're not necessarily making the hard effort dramatically harder. Instead, progression comes from gradually reducing the recovery period.",
                },
              ],
              coolDown: "Finish with 5–10 minutes easy cycling or walking.",
            },
            progressionNote: "The goal isn't to completely exhaust yourself. Increase your effort only when you can complete the current intervals with good control.",
          },
        ],
      },
      {
        kind: "deload",
        id: "week-12",
        title: "Week 12 — Deload & Finish",
        body: [
          "Full Body Workouts — repeat the Weeks 7–11 exercises but: reduce sets by approximately half, use lighter weights, keep repetitions comfortable, don't chase personal records, and finish feeling like you could have done more.",
          "Core, Calves & Forearms — reduce the number of sets by approximately half.",
          "HIIT — replace HIIT with: 20–30 minutes of comfortable walking or cycling. This gives your body time to recover before beginning another program.",
        ],
      },
    ],
    coolDown: {
      title: "Cool-Down",
      intro: "After strength workouts, finish with:",
      note: "5–10 minutes of easy treadmill walking or stationary cycling. It should feel comfortable. This isn't another cardio workout.",
    },
    safetyNote: {
      title: "Progression & Safety",
      bullets: [
        "Listen to your body. You don't need to increase weight every workout.",
        "If your current weight is still challenging, stay with it. Work on better repetitions, better control and good technique.",
        "Increase the weight slightly when you can comfortably complete the upper end of the recommended rep range with good form.",
        "Some days you'll feel stronger than others. Push yourself when you feel ready, but don't force progression simply because the program says you should.",
        "Normal muscular effort and fatigue are expected. Pain is different — don't push through pain.",
      ],
    },
  },
};

export function getProgramDetail(id: string | null | undefined): ProgramDetail | undefined {
  if (!id) return undefined;
  return PROGRAM_DETAILS[id];
}
