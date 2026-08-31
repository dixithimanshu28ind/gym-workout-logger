declare module "@n8n/chat" {
  export function createChat(options: { webhookUrl: string; [key: string]: unknown }): void;
}

declare module "@n8n/chat/style.css";
