"use client";

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Sparkles, User } from 'lucide-react'

interface Message {
    role: 'user' | 'ai'
    content: string
}

export default function AIGuidePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: '안녕하세요! 카메라나 사진 촬영에 대해 궁금한 점이 있으신가요? 어떤 것이든 물어보세요.' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMsg = input.trim()
        const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]

        setInput('')
        setMessages(newMessages)
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setMessages(prev => [...prev, { role: 'ai', content: data.content }])
        } catch (error) {
            console.error('AI Error:', error)
            setMessages(prev => [...prev, {
                role: 'ai',
                content: '죄송합니다. 서비스 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주시거나, 관리자에게 문의해주세요.'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="container mx-auto py-12 px-4 h-[calc(100vh-8rem)] max-w-4xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                        AI Guide <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground mt-1">전문가급 카메라 지식으로 무장한 AI 어시스턴트</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 font-bold">Google Gemini</Badge>
            </div>

            <Card className="flex-1 overflow-hidden flex flex-col border-muted shadow-2xl rounded-3xl relative">
                {/* flex-1과 overflow-y-auto를 추가하여 스크롤을 활성화합니다. */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-6 h-[600px]"
                >
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <Avatar className={`w-10 h-10 border shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {msg.role === 'user' ? (
                                    <div className="flex items-center justify-center w-full h-full"><User size={20} /></div>
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full"><Sparkles size={20} className="text-primary" /></div>
                                )}
                            </Avatar>
                            <div className={`flex flex-col max-w-[75%] gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl shadow-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-muted/50 border rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium px-1 uppercase tracking-widest">
                                    {msg.role === 'user' ? 'You' : 'Camera Expert'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <Avatar className="w-10 h-10 bg-muted border animate-spin-slow">
                                <div className="flex items-center justify-center w-full h-full"><Sparkles size={20} className="text-primary" /></div>
                            </Avatar>
                            <div className="bg-muted/30 border p-4 rounded-2xl rounded-tl-none animate-pulse text-muted-foreground italic w-32 flex items-center justify-center">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-muted/20">
                    <form onSubmit={handleSend} className="relative flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="카메라에 대해 무엇이든 물어보세요... (예: 영상 촬영용 풀프레임 추천)"
                            className="h-14 rounded-2xl border-muted bg-background pl-4 pr-12 focus-visible:ring-primary shadow-inner"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="h-14 w-14 rounded-2xl shrink-0 shadow-lg shadow-primary/20"
                        >
                            <Send className="w-6 h-6" />
                        </Button>
                    </form>
                </div>
            </Card>
        </main>
    )
}
