import { MessageStream } from "@/components/dashboard/message-stream";

export default function MessagesPage() {
    return (
        <main className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">SMS Agent Logs</h1>
                    <p className="text-muted-foreground mt-2">
                        Real-time conversation history between leads and Isabelle.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border p-6 min-h-[500px]">
                    <MessageStream />
                </div>
            </div>
        </main>
    );
}
