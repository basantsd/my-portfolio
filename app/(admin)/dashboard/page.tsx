import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase, GraduationCap, Users, DollarSign, Eye } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Projects",
      value: "12",
      icon: Briefcase,
      description: "+2 this month",
    },
    {
      title: "Blog Posts",
      value: "24",
      icon: FileText,
      description: "+4 this month",
    },
    {
      title: "Courses",
      value: "6",
      icon: GraduationCap,
      description: "2 in progress",
    },
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      description: "+48 this week",
    },
    {
      title: "Revenue",
      value: "$12,345",
      icon: DollarSign,
      description: "+12% from last month",
    },
    {
      title: "Page Views",
      value: "45,678",
      icon: Eye,
      description: "+18% from last month",
    },
  ]

  const recentActivity = [
    { action: "New blog post published", time: "2 hours ago" },
    { action: "Project 'DeFi Protocol' updated", time: "5 hours ago" },
    { action: "New course enrollment", time: "1 day ago" },
    { action: "Contact form submission", time: "2 days ago" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm">{activity.action}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full rounded-md border p-3 text-left text-sm transition-colors hover:bg-muted">
                Create New Blog Post
              </button>
              <button className="w-full rounded-md border p-3 text-left text-sm transition-colors hover:bg-muted">
                Add New Project
              </button>
              <button className="w-full rounded-md border p-3 text-left text-sm transition-colors hover:bg-muted">
                View Messages
              </button>
              <button className="w-full rounded-md border p-3 text-left text-sm transition-colors hover:bg-muted">
                Manage Courses
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
