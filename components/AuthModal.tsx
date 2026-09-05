"use client";

import Modal from "@/components/Modal";
import AuthForm from "@/components/AuthForm";

export default function AuthModal({
  mode,
  onSwitchMode,
  onClose,
  onSuccess,
}: {
  mode: "signup" | "signin";
  onSwitchMode: (mode: "signup" | "signin") => void;
  onClose: () => void;
  onSuccess: (userId: string) => void;
}) {
  return (
    <Modal onClose={onClose} maxWidth="max-w-md">
      <AuthForm mode={mode} onSuccess={onSuccess} onSwitchMode={onSwitchMode} />
    </Modal>
  );
}
