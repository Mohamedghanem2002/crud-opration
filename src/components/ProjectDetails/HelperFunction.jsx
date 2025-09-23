import { Crown, Eye, Edit } from "lucide-react";

export const getRoleIcon = (role) => {
  switch (role?.toLowerCase()) {
    case "owner":
      return <Crown size={16} className="text-yellow-600" />;
    case "admin":
      return <Edit size={16} className="text-red-600" />;
    case "editor":
      return <Edit size={16} className="text-blue-600" />;
    case "viewer":
      return <Eye size={16} className="text-gray-600" />;
    default:
      return <Eye size={16} className="text-gray-600" />;
  }
};

export const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case "owner":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "admin":
      return "bg-red-100 text-red-700 border-red-200";
    case "editor":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "viewer":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-red-100 text-red-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-yellow-500";
  if (progress >= 20) return "bg-orange-500";
  return "bg-red-500";
};