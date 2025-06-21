"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
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
import { Loader } from "@/components/ui/Loader";
import Filter from "@/components/svgs/Filter";
import DownArrow from "@/components/svgs/DownArrow";
import { Patient } from "@/hooks/types/types";

import { useSelector, useDispatch } from "react-redux";
import { fetchPatients } from "@/store/slices/PatientSlice";
import { AppDispatch } from "@/store/store";
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inpatients");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const dispatch = useDispatch<AppDispatch>();

  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      dispatch(fetchPatients());
      didFetch.current = true;
    }
  }, [dispatch]);
  const {
    data: patientData,
    loading,
    error,
  } = useSelector((state: any) => state.patients);

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
      <div>
        <h1 className="text-xl font-normal text-gray-900">
          Good Morning!{" "}
          <span className="text-[#3299FF] font-extrabold text-2xl">
            Aahsham Iqbal
          </span>
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm pb-lg-5 pb-3">
        <div className="">
          <div className="flex items-center justify-between p-4">
            <div className="flex space-x-8  py-1 px-2 rounded-lg bg-secondary1">
              <button
                onClick={() => setActiveTab("inpatients")}
                className={` text-[12px] font-medium border-b-2 ${
                  activeTab === "inpatients"
                    ? "text-primary200  bg-fullwhite py-1 px-4 rounded-2xl text-[10px] font-light"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Inpatients
              </button>
              <button
                onClick={() => setActiveTab("outpatients")}
                className={`text-[12px] font-medium border-b-2 ${
                  activeTab === "outpatients"
                    ? "text-primary200  bg-fullwhite py-1 px-4 rounded-2xl text-[10px] font-light"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Outpatients
              </button>
            </div>
            <Button variant="outline" size="sm">
              <Filter />
              <span className="text-grey100">Filter</span>
            </Button>
          </div>
        </div>

        <div className="m-4 py-5 border border-secondary1 rounded-lg">
          <div className="flex items-center gap-2 mb-4 px-4">
            <h2 className="text-lg font-medium text-gray-900">
              Patients List{" "}
            </h2>
            <span>
              <DownArrow />
            </span>
          </div>
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              <p>Error: {error}</p>{" "}
            </div>
          ) : patientData.length == 0 ? (
            <div className="text-gray-500 text-center p-4">
              <p>No patients found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-grey200">
                  <TableHead>ADMITTED</TableHead>
                  <TableHead>CASE</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>DOCUMENTS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientData.map((patient: Patient, index: number) => (
                  <TableRow key={index} className="border-b-0">
                    <TableCell className="font-medium">
                      {patient.admitted === null ? "N/A" : patient.admitted}
                    </TableCell>
                    <TableCell>{patient.case}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status || "")}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getDocumentColor(patient.documents || "")}
                      >
                        {patient.documents}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {/* <div className="flex items-center justify-between mt-4 px-4">
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
        </div> */}
      </div>
    </div>
  );
}
