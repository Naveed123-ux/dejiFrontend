"use client";
import { changePatientStatus } from "@/app/_apis/patient";
import { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Patient } from "@/hooks/types/types";
import { fetchRefferalPatients } from "@/store/slices/RefferalSlice";
import { Loader } from "@/components/ui/Loader";
import toast from "react-hot-toast";

export default function Referrals() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const dispatch = useDispatch<AppDispatch>();
  const dispactPatient = useDispatch();
  const [accept, setAcceptLoading] = useState(false);

  const didFetch = useRef(false);
  const [patientsData, setPatientsData] = useState<Patient[]>([]);
  const { data: patients } = useSelector((state: any) => state.patients);
  const { data, loading, error } = useSelector(
    (state: any) => state.referralPatient
  );

  useEffect(() => {
    if (!didFetch.current) {
      dispatch(fetchRefferalPatients());
      didFetch.current = true;
    }
    console.log(data);
    if (activeTab === "Accepted") {
      setPatientsData(patients);
    } else {
      setPatientsData(
        data.filter((patient: Patient) => {
          return patient.status === "pending";
        })
      );
    }
  }, [dispatch, activeTab, data]);
  async function acceptFunction(insuranceID: string) {
    setAcceptLoading(true);
    let toastingId;
    try {
      toastingId = toast.loading("Accepting Paitent");
      const response = await changePatientStatus(insuranceID);
      toast.success("accpet patient succesfully");
      return response.data;
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Accept patient failed");
    } finally {
      setAcceptLoading(false);
      toast.dismiss(toastingId);
      dispatch(fetchRefferalPatients());
    }
  }
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
    <div className="space-y-4 sm:space-y-6 min-w-7xl">
      <div className="bg-white rounded-lg shadow-sm pb-3 sm:pb-5">
        <div className="p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-20">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Referrals
            </h1>

            <div className="flex space-x-4 sm:space-x-8 py-1 px-3 sm:px-5 rounded-lg bg-secondary1 ">
              <button
                onClick={() => setActiveTab("Pending")}
                className={`text-[10px] sm:text-[12px] font-medium border-b-2 ${
                  activeTab === "Pending"
                    ? "text-white bg-blue400 py-1 px-2 sm:px-4 rounded-2xl font-light"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab("Accepted")}
                className={`text-[10px] sm:text-[12px] font-medium border-b-2 ${
                  activeTab === "Accepted"
                    ? "text-white bg-blue400 py-1 px-2 sm:px-4 rounded-2xl font-light"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Accepted
              </button>
            </div>
          </div>
        </div>

        <div className="m-2 sm:m-4 py-3 sm:py-5 border border-secondary1 rounded-lg ">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              <p>Error: {error}</p>{" "}
            </div>
          ) : patientsData.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              <p>No patients found.</p>
            </div>
          ) : (
            <Table className="overflow-x-scroll max-md:flex max-md:flex-row">
              <TableHeader className=" min-w-10 ">
                <TableRow className="bg-gray-200  max-md:flex max-md:flex-col">
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                    REGISTRATION
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                    NAME
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                    PHONE NO:
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                    CASE
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                    STATUS
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                    DOCUMENTS
                  </TableHead>
                  {activeTab === "Pending" && (
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                      AcceptPatient
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="max-md:flex max-md:flex-row max-w-[50vw] overflow-x-scroll">
                {patientsData.map((patient: Patient, index: number) => (
                  <TableRow
                    key={index}
                    className="border-b-0 max-md:flex max-md:flex-col"
                  >
                    <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap">
                      {patient.registration === null
                        ? "N/A"
                        : patient.registration}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                      {patient.name}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                      {patient.phonenumber}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                      {patient.case}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge
                        className={`${getStatusColor(
                          patient.status || ""
                        )} text-xs`}
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge
                        className={`${getDocumentColor(
                          patient.documents || ""
                        )} text-xs`}
                      >
                        {patient.documents}
                      </Badge>
                    </TableCell>
                    {activeTab === "Pending" && (
                      <TableCell className="whitespace-nowrap">
                        <Button
                          size="sm"
                          className="text-xs"
                          disabled={accept}
                          onClick={() => acceptFunction(patient.insuranceID)}
                        >
                          Accept Patient
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {/* <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 sm:px-4 gap-4">
          <div className="flex items-center order-2 sm:order-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8 rounded-none text-xs"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-none text-xs"
                >
                  {page}
                </Button>
              ))}
              <span className="px-1 sm:px-2 py-1 text-xs text-gray-500">
                ...
              </span>
              <Button
                variant="outline"
                size="sm"
                className="w-6 h-6 sm:w-8 sm:h-8 p-0 rounded-none text-xs"
              >
                10
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              className="h-8 rounded-none text-xs"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 order-1 sm:order-2">
            <span className="text-xs sm:text-sm text-gray-500">Page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-12 sm:w-16 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs sm:text-sm text-gray-500">of 34</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}
