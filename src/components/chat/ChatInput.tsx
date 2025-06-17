
import { useState, FormEvent, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping?: () => void;
  isLoading?: boolean;
  initialMessage?: string;
}

export function ChatInput({ onSend, onTyping, isLoading, initialMessage }: ChatInputProps) {
  const [message, setMessage] = useState(initialMessage || "");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSend(message);
    setMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Notify about typing
    if (onTyping) {
      onTyping();
    }
    
    // Debounce typing notifications
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Textarea
        value={message}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="min-h-[50px]"
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
