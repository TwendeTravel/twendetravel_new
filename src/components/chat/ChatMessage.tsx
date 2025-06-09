
import { ChatMessage as ChatMessageType } from "@/services/chat";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth();
  const isOwnMessage = message.sender_id === user?.id;

  return (
    <div className={cn(
      "flex w-full mb-4",
      isOwnMessage ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        <p className="text-sm">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">
            {format(new Date(message.created_at || ""), "HH:mm")}
          </span>
          {isOwnMessage && (
            <span className="text-xs">
              {message.status === 'read' ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <Circle className="h-3 w-3 opacity-70" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
