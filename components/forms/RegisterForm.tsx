"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectGroup, SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"



const  RegisterForm = ({ user }: { user: User }) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
        ...PatientFormDefaultValues,
        name: "",
        email: "",
        phone: "",
    },
});

    const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
        setIsLoading(true);

        let formData;

        if(
            values.identificationDocument && 
            values.identificationDocument.length > 0){
                const blobFile = new Blob([values.identificationDocument[0]], {
                    type: values.identificationDocument[0].type,
                })

            formData = new FormData();
            formData.append("blobFile", blobFile);
            formData.append("fileName", values.identificationDocument[0].name)
        }

        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData,
            }

            //@ts-ignore
            const patient = await registerPatient(patientData);

            if(patient){
                router.push(`/patients/${user.$id}/new-appointment`)
            }
        } catch (error) {
            console.log(error);
        }
        
        // setIsLoading(false);
    };

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h3 className="sub-header">Personal Information</h3>
                    </div>
                </section>

                    {/* Name Input Start */}
                    <CustomFormField
                        fieldType = {FormFieldType.INPUT}
                        control = {form.control}
                        name = "name"
                        label= "Full Name"
                        placeholder = "Kawser Ahmed"
                        iconSrc = "/assets/icons/user.svg"
                        iconAlt = "user"
                    />
                    {/* Name Input End */}

                        {/* mail & phone input start */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType = {FormFieldType.INPUT}
                            control = {form.control}
                            name = "email"
                            label = "Email"
                            placeholder = "kawser.ahmed@hotmail.com"
                            iconSrc = "/assets/icons/email.svg"
                            iconAlt = "email"
                        />

                        <CustomFormField
                            fieldType = {FormFieldType.PHONE_INPUT}
                            control = {form.control}
                            name = "phone"
                            label = "Phone number"
                            placeholder = "(555) 123-4567"
                        />
                    </div>
                        {/* mail & phone input end */}
                    
                    {/* DOB & gender select start */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType = {FormFieldType.DATE_PICKER}
                            control = {form.control}
                            name = "birthDate"
                            label = "Date of Birth"
                        />

                        <CustomFormField
                            fieldType = {FormFieldType.SKELETON}
                            control = {form.control}
                            name = "gender"
                            label = "Gender"
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        {GenderOptions.map((Option) => (
                                            <div key={Option} className="radio-group">
                                                <RadioGroupItem value={Option} id={Option} />
                                                <Label htmlFor={Option} className="cursor-pointer">
                                                    {Option}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            )}                
                        />
                    </div>
                    {/* DOB & gender select end */}

                    {/* address & occupation start */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType = {FormFieldType.INPUT}
                        control = {form.control}
                        name = "address"
                        label= "Address"
                        placeholder = "Merul Badda, Dhaka-1212"
                    />

                    <CustomFormField
                        fieldType = {FormFieldType.INPUT}
                        control = {form.control}
                        name = "occupation"
                        label= "Occupation"
                        placeholder = "Software Engineer"
                    />
                    </div>
                    {/* address & occupation end */}

                    {/* Emergency Contact Name & Number start */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType = {FormFieldType.INPUT}
                        control = {form.control}
                        name = "emergencyContactName"
                        label= "Emergency Contact Name"
                        placeholder = "Guardian's Name"
                    />

                    <CustomFormField
                        fieldType = {FormFieldType.PHONE_INPUT}
                        control = {form.control}
                        name = "emergencyContactNumber"
                        label= "Emergency Contact Number"
                        placeholder = "(555) 123-4567"
                    />
                    </div>
                    {/* Emergency Contact Name & Number end */}

                        {/* Medical info start */}
                    <section className="space-y-6">
                        <div className="mb-9 space-y-1">
                            <h3 className="sub-header">Medical Information</h3>
                        </div>
                    </section>
                        {/* Medical info end */}

                        {/* Primary Physician selection start */}
                    <CustomFormField
                        fieldType = {FormFieldType.SELECT}
                        control = {form.control}
                        name = "primaryPhysician"
                        label= "Primary Physician"
                        placeholder = "Select a physician"
                    >
                        {Doctors.map((doctor) => (
                            <SelectItem key={doctor.name} value={doctor.name}>
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Image
                                        src={doctor.image}
                                        width={32}
                                        height={32}
                                        alt={doctor.name}
                                        className="rounded-full border-dark-500" 
                                    />
                                    <p>{doctor.name}</p>
                                </div>
                            </SelectItem>
                        ))}
                    </CustomFormField>
                        {/* Primary Physician selection end */}   

                        {/* insurance Policy Name & Number start */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType = {FormFieldType.INPUT}
                            control = {form.control}
                            name = "insuranceProvider"
                            label = "Insurance Provider"
                            placeholder = "HealthPlus"
                        />

                        <CustomFormField
                            fieldType = {FormFieldType.INPUT}
                            control = {form.control}
                            name = "insurancePolicyNumber"
                            label = "Insurance Policy Number"
                            placeholder = "ABC123456789"
                        />
                    </div>
                        {/*  insurance Policy Name & Number end */}   

                        {/* allergy and curr medication info start */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType = {FormFieldType.TEXTAREA}
                            control = {form.control}
                            name = "allergies"
                            label = "Allergies (if any)"
                            placeholder = "Beef, Prawn, Peanuts"
                        />

                        <CustomFormField
                            fieldType = {FormFieldType.TEXTAREA}
                            control = {form.control}
                            name = "currentMedication"
                            label = "Current Medication (if any)"
                            placeholder = "Ibuprofen 200mg, Paracetamol 500mg"
                        />
                    </div>
                        {/* allergy and curr medication info end */}
                    
                        {/* family medication info start */}
                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomFormField
                            fieldType = {FormFieldType.TEXTAREA}
                            control = {form.control}
                            name = "familyMedicalHistory"
                            label = "Family Medical History"
                            placeholder = "Mother had brain cancer, Father had heart disease"
                        />

                        <CustomFormField
                            fieldType = {FormFieldType.TEXTAREA}
                            control = {form.control}
                            name = "pastMedicalHistory"
                            label = "Past Medical History"
                            placeholder = "Appendectomy, Tonsillectomy"
                        />
                    </div>
                        {/* family medication info end */}
                
                    {/* Identification & Verification start */}
                    <section className="space-y-6">
                        <div className="mb-9 space-y-1">
                            <h3 className="sub-header">Identification & Verification</h3>
                        </div>
                    </section>
                    {/* Identification & Verification end */}

                        {/* Identification Type start */}
                    <CustomFormField
                        fieldType = {FormFieldType.SELECT}
                        control = {form.control}
                        name = "identificationType"
                        label= "Identification Type"
                        placeholder = "Select an identification type"
                    >
                        {IdentificationTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </CustomFormField>
                        {/* Identification Type end */}

                        {/* identification Number Start */}
                    <CustomFormField
                        fieldType = {FormFieldType.INPUT}
                        control = {form.control}
                        name = "identificationNumber"
                        label= "Identification Number"
                        placeholder = "123456789"
                    />
                        {/* identification Number End */}                   

                        {/* identification Document start */}
                    <CustomFormField
                            fieldType = {FormFieldType.SKELETON}
                            control = {form.control}
                            name = "identificationDocument"
                            label = "Scanned copy of identification document"
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <FileUploader files={field.value} onChange={field.onChange} />
                                </FormControl>
                            )}                
                    />
                        {/* identification Document end */}

                        {/* Consent & Privacy start */}
                    <section className="space-y-6">
                        <div className="mb-9 space-y-1">
                            <h3 className="sub-header">Consent & Privacy</h3>
                        </div>
                    </section>
                        {/* Consent & Privacy end */}
                    
                        {/* Consent checkbox start */}
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="treatmentConsent"
                        label="I consent to treatment"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="disclosureConsent"
                        label="I consent to disclosure of information"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="privacyConsent"
                        label="I consent to privacy policy"
                    />
                        {/* Consent checkbox start */}

                {/* Button Input Start */}
                <SubmitButton isLoading = {isLoading}>
                    Get Started
                </SubmitButton>
                {/* Button Input End */}

            </form>
        </Form>
    )
}
export default RegisterForm