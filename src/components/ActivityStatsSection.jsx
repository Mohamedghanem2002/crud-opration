import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { CheckCircle, Clock, FolderOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ActivityStatsSection({ projectsCount, completedTasks, pendingTasks }) {
  const { t } = useTranslation();
  
  // Calculate completion percentage (avoid division by zero)
  const totalTasks = completedTasks + pendingTasks;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  const stats = [
    {
      title: t("profile.projects"),
      value: projectsCount,
      icon: <FolderOpen className="h-5 w-5 text-blue-500" />,
      description: t("profile.totalProjects"),
      trend: "+5% from last month",
      trendPositive: true,
    },
    {
      title: t("profile.completedTasks"),
      value: completedTasks,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      description: t("profile.tasksCompleted"),
      trend: "+12% from last month",
      trendPositive: true,
    },
    {
      title: t("profile.pendingTasks"),
      value: pendingTasks,
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      description: t("profile.tasksPending"),
      trend: "-3% from last month",
      trendPositive: false,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.activityOverview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </h3>
                  <div className="rounded-lg bg-muted p-1">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{stat.trend}</span>
                    <span className={stat.trendPositive ? "text-green-500" : "text-amber-500"}>
                      {stat.trendPositive ? "↑" : "↓"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("profile.taskCompletion")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {t("profile.overallCompletion")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {completedTasks} {t("profile.of")} {totalTasks} {t("profile.tasksCompleted").toLowerCase()}
                </p>
              </div>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">
                  {t("profile.completed")} ({completedTasks})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-xs text-muted-foreground">
                  {t("profile.pending")} ({pendingTasks})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
