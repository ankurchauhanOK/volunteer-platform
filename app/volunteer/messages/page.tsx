"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Textarea } from "@/components/ui/Textarea"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { timeAgo } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export default function VolunteerMessagesPage() {
  const { user } = useAuth()
  if (!user) return null

  const threads = db.threads.findByUser(user.id)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  const selectedThread = selectedThreadId ? db.threads.find(selectedThreadId) : null
  const messages = selectedThreadId ? db.messages.findByThread(selectedThreadId) : []

  if (selectedThreadId) {
    db.messages.markRead(selectedThreadId, user.id)
  }

  const getOtherParticipant = (thread: typeof threads[0]) => {
    const otherId = thread.participants.find(p => p !== user.id)
    if (!otherId) return { name: "Unknown", initial: "?" }
    const otherUser = db.users.find(otherId)
    return {
      name: otherUser?.name || "Unknown",
      initial: otherUser?.name?.charAt(0)?.toUpperCase() || "?",
    }
  }

  const handleSend = () => {
    if (!selectedThreadId || !newMessage.trim()) return
    db.messages.create({
      threadId: selectedThreadId,
      senderId: user.id,
      content: newMessage,
      read: false,
      isSystem: false,
    })
    db.threads.update(selectedThreadId, { lastMessageAt: new Date().toISOString() })
    setNewMessage("")
  }

  return (
    <AuthGuard requiredRole="volunteer">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h1 className="font-tanker text-2xl text-text mb-6">Messages</h1>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="md:col-span-1 md:max-h-[70vh] md:overflow-y-auto">
                  <CardContent className="p-3">
                    {threads.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No messages yet</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {threads.map(thread => {
                          const other = getOtherParticipant(thread)
                          const unread = db.messages.unreadCount(thread.id, user.id)
                          const lastMsg = db.messages.findByThread(thread.id).pop()
                          return (
                            <button
                              key={thread.id}
                              onClick={() => setSelectedThreadId(thread.id)}
                              className={`w-full text-left p-3 rounded-xl transition-colors ${selectedThreadId === thread.id ? "bg-brand-50" : "hover:bg-gray-50"}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-semibold text-brand-700 shrink-0">
                                  {other.initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate">{other.name}</p>
                                    {unread > 0 && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                                  </div>
                                  <p className="text-xs text-gray-500 truncate">{lastMsg?.content || thread.subject}</p>
                                  <p className="text-xs text-gray-400">{timeAgo(thread.lastMessageAt)}</p>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 md:max-h-[70vh] md:flex md:flex-col">
                  <CardContent className="p-4 flex-1 flex flex-col">
                    {selectedThread ? (
                      <>
                        <div className="border-b border-gray-100 pb-3 mb-4">
                          <p className="font-semibold text-gray-900">{getOtherParticipant(selectedThread).name}</p>
                          <p className="text-xs text-gray-500">{selectedThread.subject}</p>
                        </div>
                        <div className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-[50vh]">
                          {messages.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">No messages in this conversation yet.</p>
                          ) : (
                            messages.map(msg => {
                              const isMine = msg.senderId === user.id
                              const sender = db.users.find(msg.senderId)
                              return (
                                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                  <div className={`max-w-[80%] p-3 rounded-2xl ${isMine ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                                    {msg.isSystem ? (
                                      <p className="text-xs italic">{msg.content}</p>
                                    ) : (
                                      <>
                                        <p className="text-sm">{msg.content}</p>
                                        <p className={`text-xs mt-1 ${isMine ? "text-brand-200" : "text-gray-400"}`}>{timeAgo(msg.createdAt)}</p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Textarea
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="min-h-[40px] resize-none"
                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                          />
                          <Button onClick={handleSend} disabled={!newMessage.trim()} className="self-end">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500">Select a conversation to start messaging</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
