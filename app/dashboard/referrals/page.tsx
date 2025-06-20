"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Filter from "@/components/svgs/Filter";
import DownArrow from "@/components/svgs/DownArrow";

const patientsData = [
  {
    admitted: "27 Dec, 2025",
    case: "ID: 100000404305",
    status: "Accepted",
    documents: "Completed",
  },
  {
    admitted: "03 Feb, 2025",
    case: "ID: 100000404305",
    status: "Referred",
    documents: "Pending",
  },
  {
    admitted: "02 Mar, 2025",
    case: "ID: 100000404305",
    status: "Registered",
    documents: "Completed",
  },
  {
    admitted: "02 Mar, 2025",
    case: "ID: 100000404305",
    status: "Accepted",
    documents: "Pending",
  },
  {
    admitted: "02 Mar, 2025",
    case: "ID: 100000404305",
    status: "Registered",
    documents: "Completed",
  },
  {
    admitted: "02 Mar, 2025",
    case: "ID: 100000404305",
    status: "Accepted",
    documents: "Pending",
  },
  {
    admitted: "02 Mar, 2025",
    case: "ID: 100000404305",
    status: "Referred",
    documents: "Completed",
  },
  {
    admitted: "02 Mar, 2025",
    case: "ID: 100000404305",
    status: "Accepted",
    documents: "Pending",
  },
];

export default function Referrals() {
  const [activeTab, setActiveTab] = useState("inpatients");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "referred":
        return "bg-blue-100 text-blue-800";
      case "registered":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm pb-lg-5 pb-3">
        <div className="flex items-center lg:gap-20 gap-10 flex-wrap ">
          <h1 className="text-2xl font-semibold text-gray-900 pl-3 pt-3">
            Referrals
          </h1>

          <div className="flex items-center justify-between p-4 flex-wrap">
            <div className="flex space-x-8  py-1 px-5 rounded-lg bg-secondary1">
              <button
                onClick={() => setActiveTab("inpatients")}
                className={` text-[12px] font-medium border-b-2 ${
                  activeTab === "inpatients"
                    ? "text-white  bg-blue400 py-1 px-4 rounded-2xl text-[10px] font-light"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Inpatients
              </button>
              <button
                onClick={() => setActiveTab("outpatients")}
                className={`text-[12px] font-medium border-b-2 ${
                  activeTab === "outpatients"
                    ? "text-white  bg-blue400 py-1 px-4 rounded-2xl text-[10px] font-light"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Outpatients
              </button>
            </div>
          </div>
        </div>

        <div className="m-4 py-5 border border-secondary1 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-grey200">
                <TableHead>CASE</TableHead>
                <TableHead>CHEIF COMPLAINT</TableHead>
                <TableHead>FORM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientsData.map((patient, index) => (
                <TableRow key={index} className="border-b-0">
                  <TableCell>{patient.case}</TableCell>
                  <TableCell>{patient.status}</TableCell>
                  <TableCell>{patient.documents}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8  rounded-none"
            >
              <ChevronLeft className="h-4 w-4 " />
              Previous
            </Button>
            <div className="flex ">
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0 rounded-none"
                >
                  {page}
                </Button>
              ))}
              <span className="px-2 py-1 text-sm text-gray-500">...</span>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 rounded-none"
              >
                10
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="h-8  rounded-none"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">of 34</span>
          </div>
        </div>
      </div>
    </div>
  );
}
