import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import { DeleteCourseButton } from "./delete-button"

export const dynamic = "force-dynamic"

export default async function CoursesAdminPage() {
  const courses = await db.course.findMany({
    include: {
      modules: {
        include: {
          lessons: true
        }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button asChild>
          <Link href="/dashboard/courses/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => {
          const totalLessons = course.modules.reduce(
            (total, module) => total + module.lessons.length,
            0
          )

          return (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{course.title}</CardTitle>
                      {course.published ? (
                        <Badge>Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                      {course.isPremium && <Badge variant="outline">Premium</Badge>}
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Slug: {course.slug}</p>
                    <p className="text-sm text-muted-foreground">
                      ${course.price} • {course.modules.length} modules • {totalLessons} lessons • {course._count.enrollments} students
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/courses/${course.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/courses/${course.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteCourseButton id={course.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{course.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
