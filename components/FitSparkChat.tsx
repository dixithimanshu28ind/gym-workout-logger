"use client";

import { useEffect, useRef } from "react";
import "@n8n/chat/style.css";

const N8N_WEBHOOK_URL =
  "https://dixithimanshu28.app.n8n.cloud/webhook/e6e85eb0-6427-4c68-ba02-80ac9c8e069f/chat";

export default function FitSparkChat() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    import("@n8n/chat").then(({ createChat }) => {
      createChat({
        webhookUrl: N8N_WEBHOOK_URL,
        initialMessages: ["Hi there! 👋", "My name is FitSpark. How can I assist you today?"],
        i18n: {
          en: {
            title: "FitSpark",
            subtitle: "Your fitness coach — workouts, form, and motivation, on demand.",
            footer: "",
            getStarted: "New Conversation",
            inputPlaceholder: "Type your question..",
            closeButtonTooltip: "Close chat",
          },
        },
      });
    });
  }, []);

  return null;
}
