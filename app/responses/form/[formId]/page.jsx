"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { JsonForms, userResponses } from "@/config/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import EmptyStatePlaceholder from "@/app/_components/EmptyStatePlaceholder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as XLSX from "xlsx";
import { ProtectedPage } from "@/app/_components/Protected";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const formatHeaderName = (key) => {
  // Convert camelCase or snake_case to Title Case with spaces
  return (
    key
      // Split by uppercase letters, underscores, or hyphens
      .split(/(?=[A-Z])|_|-/)
      // Capitalize first letter of each word and join with spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
};

const FormAnalysisPage = () => {
  const params = useParams();
  const router = useRouter();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [columnOrder, setColumnOrder] = useState([]);
  let jsonData = [];

  useEffect(() => {
    const fetchForm = async (formId) => {
      setLoading(true);
      try {
        const result = await db
          .select()
          .from(JsonForms)
          .where(eq(JsonForms.id, formId));
        
        if (result && result.length > 0) {
          const parsedForm = JSON.parse(result[0].jsonform);
          setJsonForm(parsedForm);
          
          // Extract field names from the form definition
          if (parsedForm?.fields && Array.isArray(parsedForm.fields)) {
            const formFieldNames = parsedForm.fields.map(field => field.fieldName);
            setColumnOrder(formFieldNames);
          }
          
          return parsedForm;
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      }
      return null;
    };

    const fetchResponses = async (formId, form) => {
      setLoading(true);
      try {
        const result = await db
          .select()
          .from(userResponses)
          .where(eq(userResponses.formRef, formId))
          .orderBy(userResponses.createdAt);

        setResponses(result);

        // If form definition didn't provide column order, extract from responses
        if ((!form || !form.fields) && result.length > 0) {
          // Get all unique keys from all responses
          const allKeys = new Set();
          result.forEach(response => {
            try {
              const parsedResponse = JSON.parse(response.jsonResponse);
              Object.keys(parsedResponse).forEach(key => allKeys.add(key));
            } catch (error) {
              console.error("Error parsing response:", error);
            }
          });
          
          // Convert to array and set as column order
          setColumnOrder(Array.from(allKeys));
        }

        // Group responses by date for chart
        const groupedData = result.reduce((acc, response) => {
          const date = new Date(response.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Convert to array format for chart
        const formattedChartData = Object.keys(groupedData).map((date) => ({
          date,
          submissions: groupedData[date],
        }));

        // Sort by date
        formattedChartData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    const loadData = async () => {
      if (params?.formId) {
        const form = await fetchForm(params.formId);
        await fetchResponses(params.formId, form);
      }
    };

    loadData();
  }, [params?.formId]);

  const getFieldLabel = (fieldName) => {
    if (jsonForm?.fields) {
      const field = jsonForm.fields.find(f => f.fieldName === fieldName);
      return field?.fieldTitle || field?.label || formatHeaderName(fieldName);
    }
    return formatHeaderName(fieldName);
  };

  const renderCell = (value) => {
    if (value === null || value === undefined) return "";
    
    if (Array.isArray(value)) {
      return value
        .map((item) =>
          typeof item === "object" && item.label ? item.label : item
        )
        .join(", ");
    }
    
    // Handle checkbox option responses
    if (typeof value === "object" && value !== null) {
      if (value.label) return value.label;
      if (Object.keys(value).some(key => key === "value" || key === "label")) {
        return Object.entries(value)
          .filter(([k, v]) => v === true || (k === "label" && v))
          .map(([k, v]) => k === "label" ? v : k)
          .join(", ");
      }
      return JSON.stringify(value, null, 2);
    }
    
    return value?.toString() || "";
  };

  const ExportData = async () => {
    setLoading(true);
    jsonData = responses.map((item) => {
      try {
        return JSON.parse(item.jsonResponse);
      } catch (error) {
        return {};
      }
    });
    exportToExcel(jsonData);
    setLoading(false);
  };

  // Convert JSON into EXCEL File to download it
  const exportToExcel = (jsonData) => {
    if (jsonData.length === 0) return;

    // Function to flatten a JSON object
    const flattenObject = (obj, prefix = "") => {
      let flattened = {};

      Object.keys(obj).forEach((key) => {
        const newKey = prefix ? `${prefix} - ${key}` : key;

        if (Array.isArray(obj[key])) {
          // If the value is an array of objects (e.g., checkbox fields)
          if (obj[key].every((item) => typeof item === "object")) {
            flattened[newKey] = obj[key]
              .filter((item) => item.value) // Only keep selected values
              .map((item) => item.label)
              .join(", ");
          } else {
            flattened[newKey] = obj[key].join(", "); // Convert arrays to strings
          }
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          // Recursively flatten nested objects
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key]; // Keep other values as they are
        }
      });

      return flattened;
    };

    // Transform responses & flatten data
    const transformedData = jsonData.map((item) => flattenObject(item));

    // Use column order from form definition
    const excelHeaders = columnOrder.length > 0 
      ? columnOrder 
      : Object.keys(transformedData[0] || {});

    // Create worksheet with ordered headers
    const worksheet = XLSX.utils.json_to_sheet([], { header: excelHeaders });

    // Add data rows
    transformedData.forEach((row, idx) => {
      const rowData = {};
      excelHeaders.forEach(header => {
        rowData[header] = row[header] || '';
      });
      XLSX.utils.sheet_add_json(worksheet, [rowData], { skipHeader: true, origin: -1 });
    });

    // Format header names
    excelHeaders.forEach((key, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      worksheet[cellAddress].v = getFieldLabel(key);
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    // Save file
    XLSX.writeFile(workbook, jsonForm?.formTitle || "Form Responses.xlsx");
  };

  return (
    <ProtectedPage>
      <div className="p-4 md:p-8 flex flex-col gap-8 min-h-screen">
        <div className="inline-flex flex-col justify-start items-start gap-3">
          <div
            className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-muted-foreground/200"
            onClick={() => router.push("/responses")}
          >
            <ArrowLeft />
            <span className="text-sm font-medium break-words">
              Back to Responses
            </span>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-6 w-full">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {jsonForm?.formTitle || "Untitled Form"}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                {jsonForm?.formHeading || "No description available."}
              </p>
            </div>
            <Button
              className="w-full md:w-auto flex items-center gap-2"
              onClick={() => ExportData()}
              disabled={loading || responses.length === 0}
            >
              <Download />
              Export Response
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">
            Loading responses...
          </p>
        ) : responses.length === 0 ? (
          <EmptyStatePlaceholder
            title={"No Responses Found"}
            description={
              "Please share this form to users to get their responses."
            }
          />
        ) : (
          <>
            {/* Table with form-defined column ordering */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    {/* Use the column order derived from form definition */}
                    {columnOrder.map((fieldName) => (
                      <TableHead
                        key={fieldName}
                        className="border-r last:border-r-0 font-semibold"
                      >
                        {getFieldLabel(fieldName)}
                      </TableHead>
                    ))}
                    <TableHead className="border-r font-semibold">
                      Created By
                    </TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((response, index) => {
                    let parsedResponse;
                    try {
                      parsedResponse = JSON.parse(response.jsonResponse);
                    } catch (error) {
                      parsedResponse = {};
                    }

                    return (
                      <TableRow key={index} className="border-b">
                        {/* Map each column in the consistent order from form definition */}
                        {columnOrder.map((fieldName) => {
                          const value = parsedResponse[fieldName];
                          return (
                            <TableCell
                              key={fieldName}
                              className="max-w-[200px] truncate border-r"
                              onClick={() => value && setModalData(value)}
                            >
                              {renderCell(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="border-r">
                          {response.createdBy}
                        </TableCell>
                        <TableCell>
                          {response.createdAt}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Area Chart using shadcn styling */}
            <Card>
              <CardHeader>
                <CardTitle>Submissions Over Time</CardTitle>
                <CardDescription>
                  {responses.length} total submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                        labelStyle={{
                          color: "hsl(var(--foreground))"
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="submissions" 
                        stroke="#14b8a6" 
                        fillOpacity={1} 
                        fill="url(#colorSubmissions)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Modal for detailed data view */}
            {modalData && (
              <div
                className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                onClick={() => setModalData(null)}
              >
                <div
                  className="bg-background p-6 rounded-lg shadow-lg max-w-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-lg font-semibold mb-4">Full Data</h2>
                  <pre className="text-sm text-foreground/70 whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto max-h-96">
                    {typeof modalData === "object"
                      ? JSON.stringify(modalData, null, 2)
                      : modalData}
                  </pre>
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={() => setModalData(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedPage>
  );
};

export default FormAnalysisPage;