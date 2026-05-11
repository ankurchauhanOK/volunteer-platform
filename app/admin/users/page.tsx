"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { db } from "@/lib/store"
import { formatDate } from "@/lib/utils"

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const users = db.users.list().filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  return (
    <AuthGuard requiredRole="admin">
      <AppShell>
        <div className="bg-gray-50 min-h-screen py-8">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">{users.length} total users</p>
              </div>
              <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left p-4 font-medium text-gray-500">User</th>
                        <th className="text-left p-4 font-medium text-gray-500">Email</th>
                        <th className="text-left p-4 font-medium text-gray-500">Role</th>
                        <th className="text-left p-4 font-medium text-gray-500">Joined</th>
                        <th className="text-left p-4 font-medium text-gray-500">Onboarding</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">{u.name.charAt(0)}</div>
                              <span className="font-medium text-gray-900">{u.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500">{u.email}</td>
                          <td className="p-4"><Badge variant="destructive">{u.role}</Badge></td>
                          <td className="p-4 text-gray-500">{formatDate(u.createdAt)}</td>
                          <td className="p-4">{u.onboardingComplete ? <Badge variant="success">Complete</Badge> : <Badge variant="warning">Incomplete</Badge>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Container>
        </div>
      </AppShell>
    </AuthGuard>
  )
}
