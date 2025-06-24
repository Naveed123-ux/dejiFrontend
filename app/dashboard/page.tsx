"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import Filter from "@/components/svgs/Filter";
import DownArrow from "@/components/svgs/DownArrow";
import { Patient } from "@/hooks/types/types";
import { selectPatient } from "@/store/slices/CurrentPatient";
import { useSelector, useDispatch } from "react-redux";
import { fetchPatients } from "@/store/slices/PatientSlice";
import { AppDispatch } from "@/store/store";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inpatients");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [pageSize, setPageSize] = useState(2);
  const dispatch = useDispatch<AppDispatch>();
  const dispactPatient = useDispatch();

  const didFetch = useRef(false);
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const { data, loading, error } = useSelector((state: any) => state.patients);

  useEffect(() => {
    if (!didFetch.current) {
      dispatch(fetchPatients());
      didFetch.current = true;
    }
    console.log(data);
    if (activeTab === "inpatients") {
      setPatientsData(
        data.filter((patient: Patient) => {
          return patient.status === "accepted";
        })
      );
    } else {
      setPatientsData(
        data.filter((patient: Patient) => {
          return patient.status === "pending";
        })
      );
    }
  }, [dispatch, activeTab, data]);

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
  function addNote(patientId: number, caseId: string, patientName: string) {
    dispactPatient(selectPatient({ patientId, caseId, patientName }));
    router.push("/dashboard/notes");
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="px-2 sm:px-0">
        <h1 className="text-lg sm:text-xl font-normal text-gray-900">
          Good Morning!{" "}
          <span className="text-[#3299FF] font-extrabold text-xl sm:text-2xl">
            Aahsham Iqbal
          </span>
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm pb-3 sm:pb-5">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex space-x-4 sm:space-x-8 py-1 px-2 rounded-lg bg-secondary1 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("inpatients")}
                className={`text-[10px] sm:text-[12px] font-medium border-b-2 ${
                  activeTab === "inpatients"
                    ? "text-primary200 bg-fullwhite py-1 px-2 sm:px-4 rounded-2xl font-light"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Inpatients
              </button>
              <button
                onClick={() => setActiveTab("outpatients")}
                className={`text-[10px] sm:text-[12px] font-medium border-b-2 ${
                  activeTab === "outpatients"
                    ? "text-primary200 bg-fullwhite py-1 px-2 sm:px-4 rounded-2xl font-light"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Outpatients
              </button>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter />
              <span className="text-grey100 ml-2">Filter</span>
            </Button>
          </div>
        </div>

        <div className="m-2 sm:m-4 py-3 sm:py-5 border border-secondary1 rounded-lg">
          <div className="flex items-center gap-2 mb-4 px-2 sm:px-4">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">
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
          ) : patientsData.length == 0 ? (
            <div className="text-gray-500 text-center p-4">
              <p>No patients found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-grey200">
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">ADMITTED</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">CASE</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">STATUS</TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">DOCUMENTS</TableHead>
                    {activeTab === "outpatients" && (
                      <TableHead className="text-xs sm:text-sm whitespace-nowrap">AddNote</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientsData.map((patient: Patient, index: number) => (
                    <TableRow key={index} className="border-b-0">
                      <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap">
                        {patient.admitted === null ? "N/A" : patient.admitted}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap">{patient.case}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge className={`${getStatusColor(patient.status || "")} text-xs`}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          className={`${getDocumentColor(patient.documents || "")} text-xs`}
                        >
                          {patient.documents}
                        </Badge>
                      </TableCell>
                      {activeTab === "outpatients" && (
                        <TableCell className="whitespace-nowrap">
                          <Button
                            onClick={() =>
                              addNote(
                                patient.patient_id,
                                patient.caseId,
                                patient.name
                              )
                            }
                            size="sm"
                            className="text-xs"
                          >
                            Add Note
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}