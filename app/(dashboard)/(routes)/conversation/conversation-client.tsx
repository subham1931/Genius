"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { MAX_FREE_COUNTS } from "@/lib/constants";

import { formSchema } from "./constants";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// SAFELY extract text from ANY object Bytez may send
const extractText = (content: any): string => {
  if (!content) return "No response received.";

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (parsed?.content) return parsed.content;
      return content;
    } catch {
      return content;
    }
  }

  if (Array.isArray(content)) {
    return content.map((c) => extractText(c)).join("\n");
  }

  if (typeof content === "object") {
    return (
      content.content ||
      content.text ||
      content.message ||
      content.output ||
      JSON.stringify(content)
    );
  }

  return String(content);
};

interface ConversationClientProps {
  apiLimitCount: number;
  isPro: boolean;
}

export const ConversationClient = ({
  apiLimitCount = 0,
  isPro = false
}: ConversationClientProps) => {
  const router = useRouter();
  const proModal = useProModal();

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!isPro && apiLimitCount >= MAX_FREE_COUNTS) {
        proModal.onOpen();
        return;
      }

      const userMessage: ChatMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      const botMessage: ChatMessage = {
        role: "assistant",
        content: extractText(response.data?.content),
      };

      setMessages((current) => [...current, userMessage, botMessage]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Powered by Google Gemini 2.5 Flash"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />

      <div className="px-4 lg:px-8">
        {/* Input Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Ask anything..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              className="col-span-12 lg:col-span-2 w-full"
              type="submit"
              disabled={isLoading}
            >
              Generate
            </Button>
          </form>
        </Form>

        {/* Output Messages */}
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}

          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}

          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  msg.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {msg.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    )
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {msg.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

