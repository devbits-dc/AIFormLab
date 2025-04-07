"use client";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import moment from "moment";
import { Checkbox } from "@/components/ui/checkbox";
import FieldEdit from "./FieldEdit";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { db } from "../../../../config";
import { userResponses } from "../../../../config/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const FormUi = ({
  jsonForm,
  selectedTheme,
  selectedStyle,
  onFieldUpdate,
  deleteField,
  editable = true,
  formId = 0,
  enabledSignIn = false,
  setJsonForm,
  isTemplateCard = false,
}) => {
  const { user, isSignedIn } = useUser();
  const [formData, setFormData] = useState({});
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [errors, setErrors] = useState({});
  let formRef = useRef();
  const router = useRouter();

  const validateField = (name, value) => {
    let error = "";
    if (name.includes("email")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Invalid email format";
    }
    if (name.includes("phone")) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value))
        error = "Invalid phone number (10 digits required)";
    }
    return error;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (fieldName, itemName, value) => {
    console.log(formData)
    const list = formData?.[fieldName] ? formData?.[fieldName] : [];
    console.log("list", list)
    if (value) {
      list.push({ label: itemName, value: value });
      setFormData({ ...formData, [fieldName]: list });
    } else {
      const result = list.filter((item) => item.label !== itemName);
      console.log
      setFormData({ ...formData, [fieldName]: result });
    }
  };

  const handleFileUpload = (result, fieldName) => {
    console.log("result", result);
    if (result?.info?.secure_url) {
      setFormData((prev) => ({ ...prev, [fieldName]: result.info.secure_url }));
      toast.success("File uploaded successfully!");
    } else {
      toast.error("File upload failed!");
    }
  };

  const onDragEnd = (result) => {
    if (isTemplateCard || !result.destination) return;

    const updatedFields = [...jsonForm.fields];
    const [movedField] = updatedFields.splice(result.source.index, 1);
    updatedFields.splice(result.destination.index, 0, movedField);

    setJsonForm({ ...jsonForm, fields: updatedFields });
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    let missingRequiredFields = [];

    jsonForm?.fields?.forEach((field) => {
      console.log("field", field.fieldName);
      if (
        field?.required &&
        (formData?.[field.fieldName] === undefined ||
          (Array.isArray(formData?.[field.fieldName]) && formData?.[field.fieldName].length === 0) ||
          formData?.[field.fieldName] === "")
      ) {
        console.log(
          "missingRequiredFields",
          field,
          formData?.[field.fieldName]
        );
        missingRequiredFields.push(field.label);
      }
    });

    if (missingRequiredFields.length > 0) {
      toast.error(
        `Please fill out required fields: ${missingRequiredFields.join(", ")}`
      );
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    try {
      const result = await db.insert(userResponses).values({
        jsonResponse: formData,
        createdAt: moment().format("DD/MM/YYYY"),
        formRef: formId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });

      if (result) {
        formRef.reset();
        setUploadedImageUrl("");
        toast.success("Response Submitted Successfully!");
        router.push("/success");
      } else {
        toast.error("Failed to submit the response. Please try again.");
      }
    } catch (error) {
      console.error("Error while submitting form:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      ref={(e) => (formRef = e)}
      onSubmit={onFormSubmit}
      className="border rounded-xl p-5 w-full"
      data-theme={selectedTheme}
      style={{
        boxShadow: selectedStyle?.key === "boxshadow" && "5px 5px 0px black",
        border: selectedStyle?.key === "border" && selectedStyle.value,
      }}
    >
      <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
      <h3 className="text-sm text-gray-500 mb-4 text-center">
        {jsonForm?.formHeading}
      </h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {jsonForm?.fields?.map((field, index) => (
                <Draggable
                  key={index}
                  draggableId={index.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center gap-2"
                    >
                      {field?.fieldType === "select" ? (
                        <div className="my-3 w-full">
                          <label className="text-xs text-gray-500">
                            {field.label}
                          </label>
                          <Select
                            required={field?.required}
                            onValueChange={(v) =>
                              handleSelectChange(field.fieldName, v)
                            }
                          >
                            <SelectTrigger className="w-full bg-transparent">
                              <SelectValue placeholder={field?.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                              {field?.options?.map((item, idx) => (
                                <SelectItem
                                  key={idx}
                                  value={
                                    typeof item === "object" ? item.value : item
                                  }
                                >
                                  {typeof item === "object" ? item.label : item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : field.fieldType === "radio" ? (
                        <div className="my-3 w-full">
                          <label className="text-xs text-gray-500">
                            {field.label}
                          </label>
                          <RadioGroup required={field?.required}>
                            {field?.options?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-4"
                              >
                                <RadioGroupItem
                                  value={item.label}
                                  id={item.label}
                                  onClick={() =>
                                    handleSelectChange(
                                      field.fieldName,
                                      item.label
                                    )
                                  }
                                />
                                <Label htmlFor={item.label}>{item.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ) : field.fieldType === "checkbox" ? (
                        <div className="my-3 w-full">
                          <label className="text-xs text-gray-500">
                            {field?.label}
                          </label>
                          {field?.options?.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <Checkbox
                                onCheckedChange={(v) =>
                                  handleCheckboxChange(
                                    field?.fieldName,
                                    item.label ? item.label : item,
                                    v
                                  )
                                }
                              />
                              <h2>{item.label ? item.label : item}</h2>
                            </div>
                          ))}
                        </div>
                      ) : field.fieldType === "file" ? (
                        <div className="my-3 w-full">
                          <label className="text-xs text-gray-500">
                            {field.label}
                          </label>

                          <CldUploadWidget
                            uploadPreset={
                              process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                            }
                            onSuccess={(result) =>
                              handleFileUpload(result, field.fieldName)
                            }
                          >
                            {({ open }) => (
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    open();
                                  }}
                                >
                                  Upload File
                                </Button>

                                {/* Directly Display the Uploaded File Name */}
                                {formData[field.fieldName] && (
                                  <span className="text-sm text-gray-600">
                                    {new URL(formData[field.fieldName]).pathname
                                      .split("/")
                                      .pop()}
                                  </span>
                                )}
                              </div>
                            )}
                          </CldUploadWidget>

                          {field?.required && !formData?.[field.fieldName] && (
                            <p className="text-red-500 text-xs mt-1">
                              This file is required.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="my-3 w-full">
                          <label className="text-xs text-gray-500">
                            {field?.label}
                          </label>
                          <Input
                            className="bg-transparent"
                            type={field?.fieldType}
                            placeholder={field?.placeholder}
                            name={field?.fieldName}
                            required={field?.required}
                            onChange={(e) => handleInputChange(e)}
                          />
                        </div>
                      )}

                      {editable && (
                        <FieldEdit
                          defaultValue={field}
                          onUpdate={(value) => onFieldUpdate(value, index)}
                          deleteField={() => deleteField(index)}
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {!enabledSignIn ? (
        <button
          type="submit"
          disabled={isTemplateCard}
          className="btn btn-primary"
        >
          Submit
        </button>
      ) : isSignedIn && enabledSignIn ? (
        <button
          type="submit"
          disabled={isTemplateCard}
          className="btn btn-primary"
        >
          Submit
        </button>
      ) : (
        <Button disabled={isTemplateCard}>
          <SignInButton mode="modal">Sign in before Submit</SignInButton>
        </Button>
      )}
    </form>
  );
};

export default FormUi;
