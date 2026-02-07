"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

type Message = {
    id: number;
    created_at: string;
    from_number: string;
    to_number: string;
    content: string;
    direction: "inbound" | "outbound";
    status: string;
};

export function MessageStream() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();

        // Real-time subscription
        const channel = supabase
            .channel("messages-realtime")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    setMessages((prev) => [payload.new as Message, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchMessages() {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

        if (data) setMessages(data as Message[]);
        setLoading(false);
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Live SMS Feed</h2>
            {loading ? (
                <div className="text-gray-500 animate-pulse">Loading messages...</div>
            ) : messages.length === 0 ? (
                <div className="text-gray-500">No messages yet. Send a text to start!</div>
            ) : (
                <div className="space-y-4 max-w-2xl">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex w-full ${msg.direction === "outbound" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg shadow-sm ${msg.direction === "outbound"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-100 text-gray-800 rounded-bl-none dark:bg-zinc-800 dark:text-gray-200"
                                    }`}
                            >
                                <div className="text-xs opacity-70 mb-1 flex justify-between gap-4">
                                    <span>{msg.direction === "outbound" ? "Isabelle" : msg.from_number}</span>
                                    <span>{formatDistanceToNow(new Date(msg.created_at))} ago</span>
                                </div>
                                <div className="text-sm">{msg.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
