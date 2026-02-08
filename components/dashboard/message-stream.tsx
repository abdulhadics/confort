"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <Table>
                <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                        <TableHead className="font-semibold text-slate-700">Direction</TableHead>
                        <TableHead className="font-semibold text-slate-700">From</TableHead>
                        <TableHead className="font-semibold text-slate-700">To</TableHead>
                        <TableHead className="font-semibold text-slate-700">Message</TableHead>
                        <TableHead className="font-semibold text-slate-700">Time</TableHead>
                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {messages.map((msg) => (
                        <TableRow key={msg.id} className="hover:bg-slate-50/50">
                            <TableCell>
                                <Badge variant={msg.direction === "inbound" ? "default" : "secondary"}>
                                    {msg.direction === "inbound" ? "↓ Inbound" : "↑ Outbound"}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">
                                {msg.direction === "inbound" ? msg.from_number : "Isabelle"}
                            </TableCell>
                            <TableCell className="text-slate-600">
                                {msg.direction === "outbound" ? msg.to_number : "Isabelle"}
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-slate-500" title={msg.content}>
                                {msg.content || "-"}
                            </TableCell>
                            <TableCell className="text-slate-500 whitespace-nowrap text-sm">
                                {msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : 'Just now'}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={
                                    msg.status === 'sent' ? 'text-green-600 border-green-200 bg-green-50' :
                                        msg.status === 'failed' ? 'text-red-600 border-red-200 bg-red-50' :
                                            'text-slate-600 border-slate-200'
                                }>
                                    {msg.status || 'received'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setSelectedMessage(msg)}
                                    title="View Message"
                                >
                                    <MessageSquare className="h-4 w-4 text-slate-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {messages.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-slate-400">
                                No messages found. Send an SMS to get started!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Message Detail Modal (Simple) */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMessage(null)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4">Message Details</h3>
                        <div className="space-y-3 text-sm">
                            <div><strong>From:</strong> {selectedMessage.from_number}</div>
                            <div><strong>To:</strong> {selectedMessage.to_number}</div>
                            <div><strong>Direction:</strong> {selectedMessage.direction}</div>
                            <div><strong>Status:</strong> {selectedMessage.status}</div>
                            <div><strong>Time:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</div>
                            <div className="pt-2 border-t">
                                <strong>Content:</strong>
                                <p className="mt-1 p-3 bg-slate-100 rounded-lg">{selectedMessage.content}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button variant="outline" onClick={() => setSelectedMessage(null)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
